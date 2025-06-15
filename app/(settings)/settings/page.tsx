import { getTranslations } from "next-intl/server";
import { unauthorized, forbidden } from "next/navigation";
import { Role } from "@prisma/client";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import ProfileForm from "@/components/profile-form";

export const generateMetadata = async () => {
  const t = await getTranslations("settings.profile.metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
};

const ProfilePage = async () => {
  const session = await auth();

  if (!session?.user) {
    unauthorized();
  }

  if (session.user.role === Role.user) {
    forbidden();
  }

  const user = await db.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      image: true,
      name: true,
      color: true,
    },
  });

  if (!user) {
    unauthorized();
  }

  return <ProfileForm user={user} />;
};

export default ProfilePage;
