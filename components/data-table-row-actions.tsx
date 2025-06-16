"use client";

import { Row } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useSession } from "next-auth/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Icons from "@/components/icons";
import { tableSchema } from "@/schemas/post";
interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

const DataTableRowActions = <TData,>({
  row,
}: DataTableRowActionsProps<TData>) => {
  const t = useTranslations("dashboard");
  const { data: session } = useSession();

  const router = useRouter();

  const post = tableSchema.parse(row.original);

  const onPublish = useCallback(async () => {
    const response = await fetch(`/api/publish/${post.id}`, {
      method: "PATCH",
    });

    if (!response.ok) {
      toast.error(t("error.update.title"), {
        description: t("error.update.description"),
      });

      return;
    }

    toast.success(t("success.publish.title"), {
      description: t("success.publish.description"),
    });

    router.refresh();
  }, [post.id, router, t]);

  const onDelete = useCallback(async () => {
    if (session?.user.role !== "owner") {
      toast.error(t("error.forbidden.title"), {
        description: t("error.forbidden.description"),
      });
      return;
    }

    const response = await fetch(`/api/posts/${post.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      toast.error(t("error.delete.title"), {
        description: t("error.delete.description"),
      });

      return;
    }

    toast.success(t("success.delete.title"), {
      description: t("success.delete.description"),
    });

    router.refresh();
  }, [post.id, router, session, t]);

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex size-8 p-0 data-[state=open]:bg-muted"
          >
            <Icons.ellipsis />
            <span className="sr-only">{t("open_menu")}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild>
            <Link href={`/editor/${post.id}`}>
              <Icons.pencil className="ml-1 mr-2" />
              <span>{t("edit")}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/translator/${post.id}`}>
              <Icons.translation className="ml-1 mr-2" />
              <span>{t("translate")}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onPublish}>
            <Icons.globe className="ml-1 mr-2" />
            <span>{t("publish")}</span>
          </DropdownMenuItem>
          {/* 
          <DropdownMenuItem>
            <Icons.copy className="ml-1 mr-2" />
            <span>{t("duplicate")}</span>
          </DropdownMenuItem> 
          */}
          <DropdownMenuSeparator />
          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <Icons.trash className="ml-1 mr-2" />
              <span>{t("delete")}</span>
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("dialog.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("dialog.description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>
            {t("continue")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DataTableRowActions;
