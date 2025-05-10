"use client";

import React from "react";
import { User } from "@prisma/client";
import { useTranslations } from "next-intl";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface GroupAvatarProps {
  users: Pick<User, "id" | "name" | "image">[];
  threshold?: number;
}

const GroupAvatar = ({ users, threshold = 3 }: GroupAvatarProps) => {
  const t = useTranslations("dashboard");

  const count = users.length;

  return (
    <div className="flex items-center -space-x-2">
      {users.map((user) => (
        <Avatar key={user.id} className="size-8">
          <AvatarImage
            src={user.image ?? undefined}
            alt={user.name ?? t("unknown_user")}
          />
          <AvatarFallback>
            {user.name?.charAt(0) ?? t("unknown_user")}
          </AvatarFallback>
        </Avatar>
      ))}
      {count > threshold && (
        <Avatar className="size-8">
          <AvatarFallback>+{count - threshold}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default GroupAvatar;
