import { NextResponse } from "next/server";
import { z } from "zod";
import { Role } from "@prisma/client";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import env from "@/env";

const contextSchema = z.object({
  params: z
    .object({
      postId: z.string(),
    })
    .promise(),
});

export const PATCH = async (
  _req: Request,
  context: z.infer<typeof contextSchema>
) => {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role === Role.user) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { params } = contextSchema.parse(context);
    const { postId } = await params;

    await db.post.update({
      where: {
        id: postId,
      },
      data: {
        published: true,
        updatedAt: new Date(),
      },
    });

    await fetch(
      "https://api.github.com/repos/igem-tsukuba/2025wiki/actions/workflows/deploy.yml/dispatches",
      {
        method: "POST",
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${env.GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ref: "release" }),
      }
    );

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
