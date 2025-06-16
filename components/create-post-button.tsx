"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTransition } from "react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@/components/ui/button";
import Icons from "@/components/icons";

const CreatePostButton = ({ className, children, ...props }: ButtonProps) => {
  const t = useTranslations("dashboard");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    startTransition(async () => {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: t("untitled"),
        }),
      });

      if (!response.ok) {
        toast.error(t("error.create.title"), {
          description: t("error.create.description"),
        });

        return;
      }

      const post = await response.json();

      router.refresh();

      router.push(`/editor/${post.id}`);
    });
  };

  return (
    <Button
      onClick={onClick}
      className={cn(
        {
          "cursor-not-allowed opacity-60": isPending,
        },
        className
      )}
      disabled={isPending}
      {...props}
    >
      {isPending ? <Icons.spinner className="size-4 animate-spin" /> : children}
    </Button>
  );
};

export default CreatePostButton;
