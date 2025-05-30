"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Icons from "@/components/icons";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

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
    <ScrollArea className="w-full">
      <nav className="flex items-center space-x-2 md:flex-col md:space-y-4 md:px-1">
        {items.map((item, index) => {
          const Icon = Icons[item.icon];

          return (
            <Link
              key={index}
              href={item.href}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                pathname === item.href
                  ? "bg-primary hover:bg-primary text-primary-foreground hover:text-primary-foreground md:bg-muted md:text-foreground md:hover:bg-muted md:hover:text-foreground"
                  : "hover:bg-transparent hover:underline border md:border-none",
                "relative text-xs rounded-full px-4 h-7 md:w-full md:h-9 md:text-sm md:rounded-md"
              )}
            >
              <Icon className="absolute left-4 hidden size-6 md:block" />
              {item.title}
            </Link>
          );
        })}
      </nav>
      <ScrollBar orientation="horizontal" className="hidden" />
    </ScrollArea>
  );
};

export default SidebarNav;
