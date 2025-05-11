import { forbidden, notFound, unauthorized } from "next/navigation";
import { serialize } from "next-mdx-remote/serialize";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { rehypePrettyCode } from "rehype-pretty-code";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import Translator from "@/components/translator";

interface TranslatorPageProps {
  params: Promise<{ postId: string }>;
}

const TranslatorPage = async ({ params }: TranslatorPageProps) => {
  const session = await auth();
  const { postId } = await params;

  if (!session?.user) {
    unauthorized();
  }

  if (session.user.role !== "ADMIN") {
    forbidden();
  }

  const post = await db.post.findFirst({
    where: {
      id: postId,
    },
    select: {
      id: true,
      title: true,
      content: true,
      translation: true,
    },
  });

  if (!post) {
    notFound();
  }

  const source = {
    ja: await serialize(post.content || "", {
      mdxOptions: {
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex, rehypePrettyCode],
        format: "mdx",
      },
    }),
    en: await serialize(post.translation || "", {
      mdxOptions: {
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex, rehypePrettyCode],
        format: "mdx",
      },
    }),
  };

  return <Translator post={post} source={source} />;
};

export default TranslatorPage;
