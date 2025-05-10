import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { unauthorized } from "next/navigation";

import { db } from "@/lib/db";
import { auth } from "@/auth";

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
  blocks: z.any().optional(),
  published: z.boolean().optional(),
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
    const { postId } = await params;

    await db.post.delete({
      where: {
        id: postId,
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

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { params } = contextSchema.parse(context);
    const { postId } = await params;

    const json = await req.json();
    const body = bodySchema.parse(json);

    const already = await db.post.findFirst({
      where: { id: postId, authors: { some: { id: session.user.id } } },
    });

    await db.post.update({
      where: {
        id: postId,
      },
      data: {
        title: body.title,
        description: body.description,
        content: body.content,
        blocks: body.blocks,
        published: body.published,
        updatedAt: new Date(),
        authors: already
          ? undefined
          : {
              connect: {
                id: session.user.id,
              },
            },
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
