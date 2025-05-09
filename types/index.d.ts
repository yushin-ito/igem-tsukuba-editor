import Icons from "@/components/icons";

export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
  icon?: keyof typeof Icons;
}
