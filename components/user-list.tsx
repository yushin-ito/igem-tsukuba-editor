"use client";

import { User } from "@prisma/client";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
              <Avatar key={user.id} className="size-12">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name ?? t("unknown_user")}
                    width={48}
                    height={48}
                    className="bg-muted"
                  />
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
