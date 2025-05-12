import { getTranslations } from "next-intl/server";
import { unauthorized, forbidden } from "next/navigation";

import { auth } from "@/auth";
import NotificationForm from "@/components/notification-form";
import { db } from "@/lib/db";

export const generateMetadata = async () => {
  const t = await getTranslations("settings.notification.metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
};

const NotificationPage = async () => {
  const session = await auth();

  if (!session?.user) {
    unauthorized();
  }

  if (session.user.role !== "ADMIN") {
    forbidden();
  }

  const notification = await db.notification.findUnique({
    where: {
      userId: session.user.id,
    },
    select: {
      id: true,
      created: true,
      updated: true,
      deleted: true,
    },
  });

  return <NotificationForm notification={notification} />;
};

export default NotificationPage;
