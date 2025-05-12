import { getTranslations } from "next-intl/server";
import { unauthorized, forbidden } from "next/navigation";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import UserList from "@/components/user-list";

export const generateMetadata = async () => {
  const t = await getTranslations("settings.profile.metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
};

const SecurityPage = async () => {
  const session = await auth();

  if (!session?.user) {
    unauthorized();
  }

  if (session.user.role !== "ADMIN") {
    forbidden();
  }

  const users = await db.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      color: true,
      role: true,
    },
  });

  return <UserList users={users} />;
};

export default SecurityPage;
