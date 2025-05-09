import { ReactNode } from "react";

interface EditorProps {
  children: ReactNode;
}

const EditorLayout = ({ children }: EditorProps) => {
  return <div className="container py-4 md:py-6 lg:py-8">{children}</div>;
};

export default EditorLayout;
