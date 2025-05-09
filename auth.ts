import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { getTranslations } from "next-intl/server";
import { render } from "@react-email/render";

import { db } from "@/lib/db";
import authConfig from "@/auth.config";
import env from "@/env";
import VerifyEmail from "@/components/verify-email";

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    ...authConfig.providers,
    Resend({
      apiKey: env.AUTH_RESEND_KEY,
      from: env.EMAIL_FROM,
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        const t = await getTranslations("email.verify");
        const element = await VerifyEmail({ url });

        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${provider.apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: provider.from,
            to: identifier,
            subject: t("subject"),
            html: await render(element),
          }),
        });

        if (!response.ok) {
          throw new Error("Error: " + JSON.stringify(await response.json()));
        }
      },
    }),
  ],
});
