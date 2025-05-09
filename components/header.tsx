"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useCallback } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import ModeToggle from "@/components/mode-toggle";
import { Button, buttonVariants } from "@/components/ui/button";
import Icons from "@/components/icons";

const Header = () => {
  const locale = useLocale();
  const router = useRouter();

  const onTranslation = useCallback(() => {
    document.cookie = [
      `locale=${locale === "en" ? "ja" : "en"}`,
      "path=/",
      "max-age=31536000",
    ].join("; ");

    router.refresh();
  }, [locale, router]);

  return (
    <div className="flex h-12 items-center justify-between px-4 md:h-16 md:px-10">
      <Link
        href="/"
        className="flex items-center space-x-2"
      >
        <Image src="/images/logo.png" alt="Logo" width={28} height={28} />
        <span className="hidden font-bold md:block">{siteConfig.name}</span>
      </Link>
      <div className="flex space-x-2">
        <Link
          href={siteConfig.links.github}
          target="_blank"
          rel="noreferrer"
          className={cn(buttonVariants({ variant: "ghost" }), "size-8")}
        >
          <Icons.github className="dark:fill-white" />
        </Link>
        <ModeToggle />
        <Button
          variant="ghost"
          className={cn(buttonVariants({ variant: "ghost" }), "size-8")}
          onClick={onTranslation}
        >
          <Icons.translation className="size-6" />
        </Button>
      </div>
    </div>
  );
};

export default Header;
