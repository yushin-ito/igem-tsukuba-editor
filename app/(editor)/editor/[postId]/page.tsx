import { forbidden, notFound, unauthorized } from "next/navigation";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import DynamicEditor from "@/components/dynamic-editor";

interface EditorPageProps {
  params: Promise<{ postId: string }>;
}

const EditorPage = async ({ params }: EditorPageProps) => {
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
      blocks: true,
      published: true,
    },
  });

  if (!post) {
    notFound();
  }

  return <DynamicEditor post={post} />;
};

export default EditorPage;
