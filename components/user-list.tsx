"use client";

import { User } from "@prisma/client";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useCallback } from "react";
import { useRouter } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UserListProps {
  users: Pick<User, "id" | "name" | "email" | "image" | "color" | "role">[];
}

const UserList = ({ users }: UserListProps) => {
  const t = useTranslations("settings.security");
  const router = useRouter();

  const onSelect = useCallback(
    async (userId: string, value: string) => {
      const response = await fetch(`/api/user/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: value,
        }),
      });

      if (!response.ok) {
        toast.error(t("error.title"), {
          description: t("error.description"),
        });

        return;
      }

      toast.success(t("success.title"), {
        description: t("success.description"),
      });

      router.refresh();
    },
    [router, t]
  );

  return (
    <ScrollArea className="h-[420px] max-w-4xl">
      {users.map((user) => (
        <div key={user.id} className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="size-12">
                <AvatarImage
                  src={user.image ?? undefined}
                  alt={user.name ?? t("unknown_user")}
                />
                {user.image ? (
                  <Skeleton className="rouned-full size-8" />
                ) : (
                  <AvatarFallback
                    className={cn(
                      "text-primary-foreground",
                      `bg-${user.color}-600`
                    )}
                  >
                    {(user.name ?? t("unknown_user")).charAt(0).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-muted-foreground">
                  {user.email}
                </div>
              </div>
            </div>
            <Select
              defaultValue={user.role}
              onValueChange={(value) => onSelect(user.id, value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">{t("admin")}</SelectItem>
                <SelectItem value="USER">{t("user")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <hr className="w-full pb-6" />
        </div>
      ))}
    </ScrollArea>
  );
};

export default UserList;
