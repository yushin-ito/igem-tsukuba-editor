"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import ModeToggle from "@/components/mode-toggle";
import { Button, buttonVariants } from "@/components/ui/button";
import Icons from "@/components/icons";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Header = () => {
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

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
      <nav className="hidden space-x-6 md:flex">
        {siteConfig.nav.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={cn(
              "flex items-center text-sm font-medium transition-colors hover:text-foreground/80",
              isActive(item.href) ? "text-foreground" : "text-foreground/60"
            )}
          >
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-expect-error */}
            {t(`${item.label}.metadata.title`)}
          </Link>
        ))}
      </nav>
      <Sheet>
        <SheetTrigger className="flex md:hidden" onClick={() => setOpen(!open)}>
          <Icons.menu className="size-6" />
        </SheetTrigger>
        <SheetContent className="w-3/5" side="left">
          <SheetHeader>
            <VisuallyHidden>
              <SheetTitle>{t("navigation")}</SheetTitle>
              <SheetDescription />
            </VisuallyHidden>
          </SheetHeader>
          <nav className="space-y-4 py-8">
            {siteConfig.nav.map((item, index) => (
              <SheetClose asChild key={index}>
                <Link
                  href={item.href}
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    isActive(item.href)
                      ? "bg-muted hover:bg-muted"
                      : "hover:bg-transparent hover:underline",
                    "w-full"
                  )}
                >
                  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                  {/* @ts-expect-error */}
                  {t(`${item.label}.metadata.title`)}
                </Link>
              </SheetClose>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
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
