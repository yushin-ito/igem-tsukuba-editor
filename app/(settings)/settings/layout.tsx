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
    <div className="relative flex min-h-screen flex-col">
      <header>
        <Header user={user} />
      </header>
      <main className="flex-1">
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
          <hr className="mb-8 mt-4 w-full" />
          <div className="grid grid-cols-[180px_1fr] gap-24">
            <div className="flex flex-col space-y-2">
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
            </div>
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
