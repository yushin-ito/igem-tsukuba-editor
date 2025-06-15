import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { unauthorized } from "next/navigation";
import { Role } from "@prisma/client";

import { db } from "@/lib/db";
import { auth } from "@/auth";

const bodySchema = z.object({
  created: z.boolean().optional(),
  updated: z.boolean().optional(),
  deleted: z.boolean().optional(),
});

export const POST = async (req: NextRequest) => {
  try {
    const session = await auth();

    if (!session?.user) {
      unauthorized();
    }

    if (session.user.role === Role.user) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const json = await req.json();
    const body = bodySchema.parse(json);

    const notification = await db.notification.upsert({
      where: {
        userId: session.user.id,
      },
      create: {
        userId: session.user.id,
        created: body.created,
        updated: body.updated,
        deleted: body.deleted,
      },
      update: {
        created: body.created,
        updated: body.updated,
        deleted: body.deleted,
      },
    });

    return NextResponse.json(notification, { status: 201 });
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
