import { NextResponse } from "next/server";
import { unauthorized } from "next/navigation";
import { z } from "zod";
import OpenAI from "openai";

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

const client = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

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

    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        content: true,
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    // todo: split content into chunks

    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 0,
      max_tokens: 1000,
      messages: [
        {
          role: "system",
          content: [
            "You are a professional translator specializing in academic publications.",
            "Translate the input Markdown text into high-precision English.",
            "Do not translate or alter any content inside code block, inline code, links, or images.",
            "Do not change the original Markdown structure.",
            "Do not change the meaning of the text.",
            "Do not add or remove any content.",
            "Use an objective, formal scholarly tone with passive voice and hedging.",
          ].join(" "),
        },
        {
          role: "user",
          content: `Translate the following Markdown content to English:\n\n${post.content}`,
        },
      ],
    });

    await db.post.update({
      where: {
        id: postId,
      },
      data: {
        translation: response.choices[0].message.content,
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
