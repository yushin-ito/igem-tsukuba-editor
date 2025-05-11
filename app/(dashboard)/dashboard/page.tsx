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
    <section className="container max-w-7xl space-y-10 py-4 md:py-6 lg:py-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-lg font-bold md:text-xl">
            {t("metadata.title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("metadata.description")}
          </p>
        </div>
        <CreatePostButton>{t("new_post")}</CreatePostButton>
      </div>
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
    </section>
  );
};

export default DashboardPage;
