import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { unauthorized } from "next/navigation";

import { db } from "@/lib/db";
import { auth } from "@/auth";

const bodySchema = z.object({
  endpoint: z.string().url(),
  keys: z.object({
    p256dh: z.string(),
    auth: z.string(),
  }),
});

export const POST = async (req: NextRequest) => {
  try {
    const session = await auth();

    if (!session?.user) {
      unauthorized();
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const json = await req.json();
    const body = bodySchema.parse(json);

    const subscription = await db.subscription.upsert({
      where: {
        endpoint: body.endpoint,
      },
      create: {
        userId: session.user.id,
        endpoint: body.endpoint,
        keys: body.keys,
      },
      update: {
        userId: session.user.id,
        keys: body.keys,
      },
    });

    return NextResponse.json(subscription, { status: 201 });
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
