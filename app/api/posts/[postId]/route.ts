import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { unauthorized } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { Role } from "@prisma/client";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { sendNotification } from "@/actions/notification";

const contextSchema = z.object({
  params: z
    .object({
      postId: z.string(),
    })
    .promise(),
});

const bodySchema = z.object({
  title: z.string().min(3).max(128).optional(),
  description: z.string().optional(),
  content: z.string().optional(),
  translation: z.string().optional(),
  blocks: z.any().optional(),
  published: z.boolean().optional(),
});

export const DELETE = async (
  _req: NextRequest,
  context: z.infer<typeof contextSchema>
) => {
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

    const { params } = contextSchema.parse(context);
    const { postId } = await params;

    await db.post.delete({
      where: {
        id: postId,
      },
    });

    const payload = JSON.stringify({
      title: t("deleted.title"),
      body: t("deleted.description", {
        name: session.user.name ?? t("unknown_user"),
      }),
      icon: "/images/logo.png",
      lang: locale === "ja" ? "ja-JP" : "en-US",
    });
    await sendNotification(payload);

    return new NextResponse(null, { status: 204 });
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

export const PATCH = async (
  req: Request,
  context: z.infer<typeof contextSchema>
) => {
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

    const { params } = contextSchema.parse(context);
    const { postId } = await params;

    const json = await req.json();
    const body = bodySchema.parse(json);

    await db.post.update({
      where: {
        id: postId,
      },
      data: {
        title: body.title,
        description: body.description,
        content: body.content,
        translation: body.translation,
        blocks: body.blocks,
        published: body.published,
        updatedAt: new Date(),
        authors: {
          connectOrCreate: {
            where: {
              userId_postId: {
                userId: session.user.id,
                postId,
              },
            },
            create: {
              userId: session.user.id,
            },
          },
        },
      },
    });

    const payload = JSON.stringify({
      title: t("updated.title"),
      body: t("updated.description", {
        name: session.user.name ?? t("unknown_user"),
      }),
      icon: "/images/logo.png",
      lang: locale === "ja" ? "ja-JP" : "en-US",
    });
    await sendNotification(payload);

    return new NextResponse(null, { status: 204 });
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
