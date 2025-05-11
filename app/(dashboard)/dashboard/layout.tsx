import { ReactNode } from "react";
import { forbidden, unauthorized } from "next/navigation";

import { auth } from "@/auth";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { db } from "@/lib/db";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = async ({ children }: DashboardLayoutProps) => {
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
      <main className="flex-1">{children}</main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default DashboardLayout;
