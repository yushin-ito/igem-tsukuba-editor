import { ReactNode } from "react";

interface TranslatorProps {
  children: ReactNode;
}

const TranslatorLayout = ({ children }: TranslatorProps) => {
  return <div className="container py-4 md:py-6 lg:py-8">{children}</div>;
};

export default TranslatorLayout;
