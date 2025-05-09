"use client";

import { useTranslations } from "next-intl";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Error = ({ reset }: { reset: () => void }) => {
  const t = useTranslations("root.error");

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
        onClick={() => reset()}
        className={cn(buttonVariants(), "px-8 py-6 rounded-full")}
      >
        {t("reload")}
      </Button>
    </div>
  );
};

export default Error;
