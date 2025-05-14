"use client";

import { useTranslations } from "next-intl";
import { User } from "@prisma/client";
import Link from "next/link";
import { useCallback, useTransition } from "react";
import Image from "next/image";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { signOut } from "@/actions/auth";
import Icons from "@/components/icons";

interface UserNavProps {
  user: Pick<User, "name" | "email" | "image" | "color">;
}

const UserNav = ({ user }: UserNavProps) => {
  const t = useTranslations("root.navigation");
  const [isPending, startTransition] = useTransition();

  const onSignOut = useCallback(() => {
    startTransition(async () => {
      await signOut();
    });
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Avatar className="size-7">
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
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" align="end" forceMount>
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs font-normal leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={"/dashboard"}>
              <Icons.book className="mr-1" />
              <span>{t("dashboard")}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={"/settings"}>
              <Icons.user className="mr-1" />
              <span>{t("profile")}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={"/settings/notification"}>
              <Icons.bell className="mr-1" />
              <span>{t("notification")}</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onSignOut} disabled={isPending}>
          <Icons.signOut className="mr-1" />
          <span>{t("signout")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserNav;
