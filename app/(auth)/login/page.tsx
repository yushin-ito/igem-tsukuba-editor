import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import Image from "next/image";

import LoginForm from "@/components/login-form";
import { siteConfig } from "@/config/site";

export const generateMetadata = async () => {
  const t = await getTranslations("auth.login.metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
};

const LoginPage = async () => {
  const t = await getTranslations("auth");

  return (
    <div className="container flex h-screen flex-col items-center justify-center">
      <Link
        href="/"
        className="absolute left-5 top-5 hidden items-center space-x-2 md:flex"
      >
        <Image src="/images/logo.png" alt="Logo" width={28} height={28} />
        <span className="font-bold">{siteConfig.name}</span>
      </Link>
      <div className="space-y-6 sm:w-[320px]">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">{t("login.metadata.title")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("login.metadata.description")}
          </p>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
        <p className="text-center text-sm text-muted-foreground">
          {t("login.do_not_have_an_account")}{" "}
          <Link href="/signup" className="underline underline-offset-4">
            {t("signup.metadata.title")}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
