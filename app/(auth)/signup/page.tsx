import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Icons from "@/components/icons";
import SignupForm from "@/components/signup-form";

export const generateMetadata = async () => {
  const t = await getTranslations("auth.signup.metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
};

const SignupPage = async () => {
  const t = await getTranslations("auth");

  return (
    <div className="container flex h-screen flex-col items-center justify-center">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-4 top-4 md:left-8 md:top-8 pl-2 flex items-center"
        )}
      >
        <Icons.chevronLeft className="size-8" />
        <span className="text-sm">{t("back")}</span>
      </Link>
      <div className="space-y-6 sm:w-[320px]">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">{t("signup.metadata.title")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("signup.metadata.description")}
          </p>
        </div>
        <Suspense>
          <SignupForm />
        </Suspense>
        <p className="text-center text-sm text-muted-foreground">
          {t("signup.already_have_an_account")}{" "}
          <Link href="/login" className="underline underline-offset-4">
            {t("login.metadata.title")}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
