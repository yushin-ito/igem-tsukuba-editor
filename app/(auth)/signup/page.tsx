import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import Image from "next/image";

import SignupForm from "@/components/signup-form";
import { siteConfig } from "@/config/site";

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
        className="absolute left-5 top-5 hidden items-center space-x-2 md:flex"
      >
        <Image src="/images/logo.png" alt="Logo" width={32} height={32} />
        <span className="font-bold">{siteConfig.name}</span>
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
