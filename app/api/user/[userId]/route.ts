import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { unauthorized } from "next/navigation";

import { db } from "@/lib/db";
import { auth } from "@/auth";

const contextSchema = z.object({
  params: z
    .object({
      userId: z.string(),
    })
    .promise(),
});

const bodySchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  image: z.string().optional(),
});

export const DELETE = async (
  _req: NextRequest,
  context: z.infer<typeof contextSchema>
) => {
  try {
    const session = await auth();

    if (!session?.user) {
      unauthorized();
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { params } = contextSchema.parse(context);
    const { userId } = await params;

    await db.user.delete({
      where: {
        id: userId,
      },
    });

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
    const session = await auth();

    if (!session?.user) {
      unauthorized();
    }

    const { params } = contextSchema.parse(context);
    const { userId } = await params;

    const json = await req.json();
    const body = bodySchema.parse(json);

    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        name: body.name,
        email: body.email,
        image: body.image,
      },
    });

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
