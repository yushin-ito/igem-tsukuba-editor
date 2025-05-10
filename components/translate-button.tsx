"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
import { Button } from "@/components/ui/button";

interface TranslateButtonProps {
  postId: string;
}

const TranslateButton = ({ postId }: TranslateButtonProps) => {
  const t = useTranslations("translator");
  const router = useRouter();

  const onTranslate = useCallback(async () => {
    const response = await fetch(`/api/translate/${postId}`, {
      method: "PATCH",
    });

    if (!response.ok) {
      toast.error(t("error.translate.title"), {
        description: t("error.translate.description"),
      });

      return;
    }

    router.refresh();
  }, [postId, router, t]);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" className="size-8">
          <Icons.openai className="dark:fill-white" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("dialog.translate.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("dialog.translate.description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={() => onTranslate()}>
            {t("continue")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TranslateButton;
