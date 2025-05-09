import { ReactNode } from "react";
import { forbidden, unauthorized } from "next/navigation";

import { auth } from "@/auth";
import Footer from "@/components/footer";
import Header from "@/components/header";

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

  return (
    <div className="relative flex min-h-screen flex-col">
      <header>
        <Header />
      </header>
      <main className="flex-1">{children}</main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default DashboardLayout;
