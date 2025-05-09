"use client";

import { Table } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

import { Input } from "@/components/ui/input";
import DataTableViewOptions from "@/components/data-table-view-options";
import Icons from "@/components/icons";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

const DataTableToolbar = <TData,>({ table }: DataTableToolbarProps<TData>) => {
  const t = useTranslations("dashboard.posts");

  return (
    <div className="flex items-center justify-between">
      <div className="relative flex items-center">
        <Icons.search className="absolute left-2  size-4 text-muted-foreground" />
        <Input
          placeholder={t("search")}
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[200px] pl-8 lg:w-[240px]"
        />
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
};

export default DataTableToolbar;
