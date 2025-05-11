"use client";

import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";
import { useFormatter, useTranslations } from "next-intl";

import DataTableRowActions from "@/components/data-table-row-actions";
import DataTableColumnHeader from "@/components/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { tableSchema } from "@/schemas/post";
import { Badge } from "@/components/ui/badge";
import AvatarGroup from "@/components/avatar-group";

export const columns: ColumnDef<z.infer<typeof tableSchema>>[] = [
  {
    id: "select",
    header: function Header({ table }) {
      const t = useTranslations("dashboard");

      return (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label={t("select_all")}
          className="mx-1 translate-y-[2px] shadow-none"
        />
      );
    },
    cell: function Cell({ row }) {
      const t = useTranslations("dashboard");

      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={t("select_row")}
          className="mx-1 translate-y-[2px] shadow-none"
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    meta: { label: "title" },
    header: function Header({ column }) {
      const t = useTranslations("dashboard");

      return <DataTableColumnHeader column={column} title={t("title")} />;
    },
    cell: function Cell({ row }) {
      const t = useTranslations("dashboard");
      const published = row.original.published;
      const status = published ? t("published") : t("draft");

      return (
        <div className="flex items-center space-x-2">
          <Badge
            variant="outline"
            className="whitespace-nowrap px-1 py-0.5 font-normal"
          >
            {status}
          </Badge>
          <span className="max-w-[200px] truncate">
            {row.getValue("title")}
          </span>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "description",
    meta: { label: "content" },
    header: function Header({ column }) {
      const t = useTranslations("dashboard");

      return <DataTableColumnHeader column={column} title={t("content")} />;
    },
    cell: ({ row }) => {
      return (
        <div className="max-w-[240px] truncate">
          {row.getValue("description")}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "createdAt",
    meta: { label: "created_at" },
    header: function Header({ column }) {
      const t = useTranslations("dashboard");

      return <DataTableColumnHeader column={column} title={t("created_at")} />;
    },
    cell: function Cell({ row }) {
      const format = useFormatter();

      return (
        <div className="w-24 text-center">
          {format.relativeTime(new Date(row.getValue("createdAt")), new Date())}
        </div>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    meta: { label: "updated_at" },
    header: function Header({ column }) {
      const t = useTranslations("dashboard");

      return <DataTableColumnHeader column={column} title={t("updated_at")} />;
    },
    cell: function Cell({ row }) {
      const format = useFormatter();

      return (
        <div className="w-24 text-center">
          {format.relativeTime(new Date(row.getValue("updatedAt")), new Date())}
        </div>
      );
    },
  },
  {
    accessorKey: "authors",
    accessorFn: (row) => row.authors.map((author) => author.user),
    meta: { label: "editor" },
    header: function Header({ column }) {
      const t = useTranslations("dashboard");

      return <DataTableColumnHeader column={column} title={t("editor")} />;
    },
    cell: function Cell({ row }) {
      return <AvatarGroup users={row.getValue("authors")} />;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
