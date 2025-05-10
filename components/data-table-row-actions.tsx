"use client";

import { Row } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

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

  const router = useRouter();

  const post = tableSchema.parse(row.original);

  const onPublish = useCallback(async () => {
    const response = await fetch(`/api/posts/${post.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        published: !post.published,
      }),
    });

    if (!response.ok) {
      toast.error(t("error.title"), {
        description: t("error.description"),
      });

      return;
    }

    router.refresh();
  }, [post.id, post.published, router, t]);

  const onDelete = useCallback(async () => {
    const response = await fetch(`/api/posts/${post.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      toast.error(t("error.title"), {
        description: t("error.description"),
      });

      return;
    }

    router.refresh();
  }, [post.id, router, t]);

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
            <span>{post.published ? t("unpublish") : t("publish")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Icons.copy className="ml-1 mr-2" />
            <span>{t("duplicate")}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="text-error focus:text-error">
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
