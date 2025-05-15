import { getTranslations } from "next-intl/server";
import { unauthorized, forbidden } from "next/navigation";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import {
  EmptyPlaceholder,
  EmptyPlaceholderDescription,
  EmptyPlaceholderIcon,
  EmptyPlaceholderTitle,
} from "@/components/empty-placeholder";
import CreatePostButton from "@/components/create-post-button";
import DataTable from "@/components/data-table";
import { columns } from "@/components/columns";

export const generateMetadata = async () => {
  const t = await getTranslations("dashboard.metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
};

const DashboardPage = async () => {
  const t = await getTranslations("dashboard");
  const session = await auth();

  if (!session?.user) {
    unauthorized();
  }

  if (session.user.role !== "ADMIN") {
    forbidden();
  }

  const posts = await db.post.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      published: true,
      createdAt: true,
      updatedAt: true,
      authors: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              color: true,
            },
          },
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <>
      {posts.length ? (
        <DataTable data={posts} columns={columns} />
      ) : (
        <EmptyPlaceholder>
          <EmptyPlaceholderIcon name="post" />
          <EmptyPlaceholderTitle>
            {t("empty_placeholder.title")}
          </EmptyPlaceholderTitle>
          <EmptyPlaceholderDescription>
            {t("empty_placeholder.description")}
          </EmptyPlaceholderDescription>
          <CreatePostButton className="rounded-full px-10 py-5">
            {t("new_post")}
          </CreatePostButton>
        </EmptyPlaceholder>
      )}
    </>
  );
};

export default DashboardPage;
