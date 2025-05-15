import { Skeleton } from "@/components/ui/skeleton";

const EditorLoading = () => {
  return (
    <div className="container mx-auto max-w-3xl space-y-10 pt-24">
      <Skeleton className="h-12 w-3/4" />
      <div className="space-y-5">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
      </div>
    </div>
  );
};

export default EditorLoading;
