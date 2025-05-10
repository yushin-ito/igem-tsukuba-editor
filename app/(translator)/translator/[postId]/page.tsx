import { forbidden, notFound, unauthorized } from "next/navigation";

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

  return <Translator post={post} />;
};

export default TranslatorPage;
