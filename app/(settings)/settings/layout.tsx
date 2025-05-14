import { ReactNode } from "react";
import { forbidden, unauthorized } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { auth } from "@/auth";
import Footer from "@/components/footer";
import Header from "@/components/header";
import SidebarNav from "@/components/sidebar-nav";
import { db } from "@/lib/db";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = async ({ children }: DashboardLayoutProps) => {
  const t = await getTranslations("settings");
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
    <div className="relative flex min-h-screen w-full flex-col">
      <header>
        <Header user={user} />
      </header>
      <main className="w-full flex-1">
        <section className="container max-w-7xl pb-12 pt-4 md:pb-12 md:pt-6 lg:pb-16 lg:pt-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-lg font-bold md:text-xl">
                {t("metadata.title")}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t("metadata.description")}
              </p>
            </div>
          </div>
          <hr className="my-4 w-full md:mb-8" />
          <div className="space-y-8 md:grid md:grid-cols-[180px_1fr] md:space-x-16 md:space-y-0">
            <SidebarNav
              items={[
                {
                  title: t("profile.metadata.title"),
                  href: "/settings",
                  icon: "user",
                },
                {
                  title: t("notification.metadata.title"),
                  href: "/settings/notification",
                  icon: "bell",
                },
                {
                  title: t("security.metadata.title"),
                  href: "/settings/security",
                  icon: "shield",
                },
              ]}
            />
            {children}
          </div>
        </section>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default DashboardLayout;
