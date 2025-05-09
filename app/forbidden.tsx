"use client";

import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signOut } from "@/actions/auth";

const Forbidden = () => {
  const t = useTranslations("root.forbidden");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center space-y-16">
      <div className="space-y-4 text-center">
        <h1 className="text-[min(5vw,36px)] font-bold">
          {t("metadata.title")}
        </h1>
        <p className="text-xs text-muted-foreground sm:text-sm">
          {t("metadata.description")}
        </p>
      </div>
      <Button
        className={cn(buttonVariants(), "px-8 py-6 rounded-full")}
        onClick={() => {
          startTransition(async () => {
            await signOut();

            router.refresh();
          });
        }}
        disabled={isPending}
      >
        {t("signout")}
      </Button>
    </div>
  );
};

export default Forbidden;
