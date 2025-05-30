import env from "@/env";

export const siteConfig = {
  name: env.NEXT_PUBLIC_APP_NAME,
  description: "iGEM TSUKUBA 2025 Team Editor",
  author: "Yushin Ito",
  organization: "iGEM TSUKUBA",
  domain: env.NEXT_PUBLIC_APP_DOMAIN,
  url: env.NEXT_PUBLIC_APP_URL,
  links: {
    github: "https://github.com/yushin-ito/igem-tsukuba-editor",
    organization: "https://igem-tsukuba.pages.dev",
  },
};
