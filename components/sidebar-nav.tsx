"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Icons from "@/components/icons";

interface SidebarNavProps {
  items: {
    href: string;
    title: string;
    icon: keyof typeof Icons;
  }[];
}

const SidebarNav = ({ items }: SidebarNavProps) => {
  const pathname = usePathname();

  return (
    <nav className="space-y-4">
      {items.map((item, index) => {
        const Icon = Icons[item.icon];

        return (
          <Link
            key={index}
            href={item.href}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              pathname === item.href
                ? "bg-muted hover:bg-muted"
                : "hover:bg-transparent hover:underline",
              "w-full relative"
            )}
          >
            <Icon className="absolute left-4 size-6" />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
};

export default SidebarNav;
