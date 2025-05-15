import { ReactNode } from "react";
import { forbidden, unauthorized } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { auth } from "@/auth";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { db } from "@/lib/db";
import CreatePostButton from "@/components/create-post-button";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = async ({ children }: DashboardLayoutProps) => {
  const t = await getTranslations("dashboard");
  const session = await auth();

  if (!session?.user) {
    unauthorized();
  }

  if (session.user.role !== "ADMIN") {
    forbidden();
  }

  const user = await db.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      image: true,
      name: true,
      email: true,
      color: true,
    },
  });

  if (!user) {
    unauthorized();
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <header>
        <Header user={user} />
      </header>
      <main className="flex-1">
        <section className="container max-w-7xl space-y-10 py-4 md:py-6 lg:py-8">
          <div className="flex items-center justify-between space-x-4">
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
          {children}
        </section>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default DashboardLayout;
