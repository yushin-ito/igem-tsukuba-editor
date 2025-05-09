/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    label: string;
  }
}
