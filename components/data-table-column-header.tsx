import { Column } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Icons from "@/components/icons";

interface DataTableColumnHeaderProps<TData, TValue>
  extends HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

const DataTableColumnHeader = <TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) => {
  const t = useTranslations("dashboard.posts");

  if (!column.getCanSort()) {
    return <div className={cn("w-24 text-sm", className)}>{title}</div>;
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-24 data-[state=open]:bg-accent"
          >
            <span>{title}</span>
            {column.getIsSorted() === "desc" ? (
              <Icons.arrowDown />
            ) : column.getIsSorted() === "asc" ? (
              <Icons.arrowUp />
            ) : (
              <Icons.chevronsUpDown />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <Icons.arrowUp className="size-4 text-muted-foreground/70" />
            {t("asc")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <Icons.arrowDown className="size-4 text-muted-foreground/70" />
            {t("desc")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <Icons.eyeOff className="size-4 text-muted-foreground/70" />
            {t("hide")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DataTableColumnHeader;
