import env from "@/env";

export const siteConfig = {
  name: env.NEXT_PUBLIC_APP_NAME,
  description: "Yushin's Portfolio",
  domain: env.NEXT_PUBLIC_APP_DOMAIN,
  url: env.NEXT_PUBLIC_APP_URL,
  nav: [
    {
      label: "posts",
      href: "/dashboard",
      icon: "post",
    },
    {
      label: "analytics",
      href: "/dashboard/analytics",
      icon: "chart",
    },
    {
      label: "settings",
      href: "/dashboard/settings",
      icon: "settings",
    },
  ],
  links: {
    github: "https://github.com/yushin-ito",
  },
};
