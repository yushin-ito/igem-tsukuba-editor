import { Html } from "@react-email/html";
import { Head } from "@react-email/head";
import { Body } from "@react-email/body";
import { Preview } from "@react-email/preview";
import { Tailwind } from "@react-email/tailwind";
import { Container } from "@react-email/container";
import { Section } from "@react-email/section";
import { Heading } from "@react-email/heading";
import { Text } from "@react-email/text";
import { Button } from "@react-email/button";
import { Img } from "@react-email/img";
import { Link } from "@react-email/link";
import { getTranslations } from "next-intl/server";

import { siteConfig } from "@/config/site";

interface VerifyEmailProps {
  url: string;
}

const VerifyEmail = async ({ url }: VerifyEmailProps) => {
  const t = await getTranslations("email");

  return (
    <Html>
      <Head />
      <Tailwind>
        <Body>
          <Preview>{t("preview")}</Preview>
          <Container className="mx-auto my-8 max-w-md rounded-xl border border-solid border-zinc-200 bg-white px-12 pb-2 pt-8 text-center shadow">
            <Section>
              <Img
                src={`${siteConfig.url}/images/logo.png`}
                width="84"
                height="84"
                alt="icon"
                className="mx-auto rounded-full"
              />
            </Section>
            <Section>
              <Heading className="mb-6 mt-4 text-xl font-bold">
                {t("title")}
              </Heading>
              <Text className="whitespace-pre-line text-left">
                {t("description")}
              </Text>
              <Text className="whitespace-pre-line text-left">
                {t.rich("instruction", {
                  strong: (chunks) => <strong>{chunks}</strong>,
                })}
              </Text>
              <Button
                href={url}
                className="mb-4 mt-8 w-4/5 rounded-md bg-zinc-900 py-3 text-sm font-medium text-zinc-50 shadow"
              >
                {t("verify")}
              </Button>
              <Text className="whitespace-pre-line text-left text-xs text-zinc-500">
                {t("warning")}
              </Text>
              <Text className="mt-2 text-left text-xs text-zinc-500">
                {t.rich("support", {
                  link: (chunks) => (
                    <Link
                      href={`mailto:support@${siteConfig.domain}`}
                      className="underline underline-offset-2"
                    >
                      {chunks}
                    </Link>
                  ),
                  domain: siteConfig.domain,
                })}
              </Text>
            </Section>
            <Section className="mt-4">
              <Text className="text-center text-xs text-zinc-500">
                {t.rich("footer", {
                  year: new Date().getFullYear(),
                  link: (chunks) => (
                    <Link
                      href={siteConfig.url}
                      target="_blank"
                      rel="noreferrer"
                      className="underline underline-offset-2"
                    >
                      {chunks}
                    </Link>
                  ),
                  name: siteConfig.name,
                })}
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default VerifyEmail;
