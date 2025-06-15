import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { unauthorized } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { Role } from "@prisma/client";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { sendNotification } from "@/actions/notification";

const bodySchema = z.object({
  title: z.string(),
  content: z.string().optional(),
});

export const POST = async (req: NextRequest) => {
  try {
    const locale = await getLocale();
    const t = await getTranslations("root.notification");
    const session = await auth();

    if (!session?.user) {
      unauthorized();
    }

    if (session.user.role === Role.user) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const json = await req.json();
    const body = bodySchema.parse(json);

    const post = await db.post.create({
      data: {
        title: body.title,
        content: body.content,
        authors: {
          create: {
            userId: session.user.id,
          },
        },
      },
      select: { id: true },
    });

    const payload = JSON.stringify({
      title: t("created.title"),
      body: t("created.description", {
        name: session.user.name ?? t("unknown_user"),
      }),
      icon: "/images/logo.png",
      lang: locale === "ja" ? "ja-JP" : "en-US",
    });
    await sendNotification(payload);

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 422 });
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
