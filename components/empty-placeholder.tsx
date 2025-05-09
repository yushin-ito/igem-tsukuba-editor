import { HTMLAttributes, SVGProps } from "react";

import { cn } from "@/lib/utils";
import Icons from "@/components/icons";

type EmptyPlaceholderProps = HTMLAttributes<HTMLDivElement>;

const EmptyPlaceholder = ({
  className,
  children,
  ...props
}: EmptyPlaceholderProps) => {
  return (
    <div
      className={cn(
        "flex min-h-[480px] flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center animate-in fade-in-50",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface EmptyPlaceholderIconProps extends Partial<SVGProps<SVGSVGElement>> {
  name: keyof typeof Icons;
}

const EmptyPlaceholderIcon = ({
  name,
  className,
  ...props
}: EmptyPlaceholderIconProps) => {
  const Icon = Icons[name];

  if (!Icon) {
    return null;
  }

  return (
    <div className="flex size-20 items-center justify-center rounded-full bg-muted">
      <Icon className={cn("size-10", className)} {...props} />
    </div>
  );
};

type EmptyPlacholderTitleProps = HTMLAttributes<HTMLHeadingElement>;

const EmptyPlaceholderTitle = ({
  className,
  ...props
}: EmptyPlacholderTitleProps) => {
  return (
    <h2 className={cn("mt-5 text-xl font-semibold", className)} {...props} />
  );
};

type EmptyPlacholderDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

const EmptyPlaceholderDescription = ({
  className,
  ...props
}: EmptyPlacholderDescriptionProps) => {
  return (
    <p
      className={cn(
        "mb-10 mt-2 text-center text-sm text-muted-foreground",
        className
      )}
      {...props}
    />
  );
};

export {
  EmptyPlaceholder,
  EmptyPlaceholderIcon,
  EmptyPlaceholderTitle,
  EmptyPlaceholderDescription,
};
