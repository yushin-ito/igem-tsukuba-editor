import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { unauthorized } from "next/navigation";
import { Role } from "@prisma/client";

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
  image: z.string().optional(),
  name: z.string().optional(),
  color: z.string().optional(),
  role: z.nativeEnum(Role).optional(),
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
        image: body.image,
        name: body.name,
        color: body.color,
        role: body.role,
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
