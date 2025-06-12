import { NextResponse } from "next/server";
import { z } from "zod";
import OpenAI from "openai";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import { visit } from "unist-util-visit";
import type { Text } from "mdast";

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
  _req: Request,
  context: z.infer<typeof contextSchema>
) => {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { params } = contextSchema.parse(context);
    const { postId } = await params;

    const post = await db.post.findUnique({
      where: { id: postId },
      select: { content: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    const tree = unified()
      .use(remarkParse)
      .parse(post.content || "");

    const inputs: string[] = [];

    visit(tree, "text", (node: Text) => {
      if (node.value.trim()) {
        inputs.push(node.value);
      }
    });

    if (inputs.length === 0) {
      return NextResponse.json(
        { message: "No text to translate" },
        { status: 200 }
      );
    }

    const outputs = await Promise.all(
      inputs.map(async (text) => {
        const response = await client.chat.completions.create({
          model: "gpt-3.5-turbo",
          temperature: 0,
          messages: [
            {
              role: "system",
              content: [
                "You are a professional translator specializing in academic publications.",
                "Translate the input text into high-precision English.",
                "Do not change the meaning of the text.",
                "Do not add or remove any content.",
                "Use an objective, formal scholarly tone with passive voice and hedging.",
              ].join(" "),
            },
            {
              role: "user",
              content: text,
            },
          ],
        });
        return response.choices[0].message.content || text;
      })
    );

    let position = 0;
    visit(tree, "text", (node: Text) => {
      if (node.value.trim()) {
        if (position < outputs.length) {
          node.value = outputs[position];
          position++;
        }
      }
    });

    position = 0;
    visit(tree, "text", (node, index = 0, parent) => {
      if (parent && node.value.trim()) {
        if (index > 0 && parent.children[index - 1]?.type === "strong") {
          node.value = " " + outputs[position++];
        } else {
          node.value = outputs[position++];
        }
      }
    });

    const translation = unified()
      .use(remarkStringify, {
        bullet: "-",
        fence: "`",
        fences: true,
        incrementListMarker: true,
      })
      .stringify(tree);

    await db.post.update({
      where: { id: postId },
      data: { translation },
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
