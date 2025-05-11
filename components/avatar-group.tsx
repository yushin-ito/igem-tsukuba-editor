"use client";

import React from "react";
import { User } from "@prisma/client";
import { useTranslations } from "next-intl";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export interface GroupAvatarProps {
  users: Pick<User, "id" | "name" | "image" | "color">[];
  threshold?: number;
}

const GroupAvatar = ({ users, threshold = 3 }: GroupAvatarProps) => {
  const t = useTranslations("dashboard");

  const count = users.length;

  return (
    <div className="flex items-center -space-x-2">
      {users.map((user) => (
        <Avatar key={user.id} className="size-7">
          <AvatarImage
            src={user.image ?? undefined}
            alt={user.name ?? t("unknown_user")}
          />
          {user.image ? (
            <Skeleton className="rouned-full size-7" />
          ) : (
            <AvatarFallback
              className={cn("text-primary-foreground", `bg-${user.color}-600`)}
            >
              {(user.name ?? t("unknown_user")).charAt(0).toUpperCase()}
            </AvatarFallback>
          )}
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
