"use client";

import React from "react";
import { User } from "@prisma/client";
import { useTranslations } from "next-intl";
import Image from "next/image";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface GroupAvatarProps {
  users: Pick<User, "id" | "name" | "image" | "color">[];
  max?: number;
}

const GroupAvatar = ({ users, max = 2 }: GroupAvatarProps) => {
  const t = useTranslations("dashboard");

  const count = users.length;

  return (
    <div className="flex items-center -space-x-2">
      {users.slice(0, max).map((user) => (
        <Avatar key={user.id} className="size-7">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name ?? t("unknown_user")}
              width={28}
              height={28}
              className="bg-muted"
            />
          ) : (
            <AvatarFallback
              className={cn("text-primary-foreground", `bg-${user.color}-600`)}
            >
              {(user.name ?? t("unknown_user")).charAt(0).toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
      ))}
      {count > max && (
        <Avatar className="size-8">
          <AvatarFallback>+{count - max}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default GroupAvatar;
