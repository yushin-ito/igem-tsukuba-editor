import { Skeleton } from "@/components/ui/skeleton";

const PorfileLoading = () => {
  return (
    <div className="max-w-4xl space-y-8">
      <div className="space-y-4">
        <Skeleton className="h-5 w-20" />
        <div className="flex flex-col space-y-4">
          <div className="flex items-end space-x-6">
            <Skeleton className="size-20" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>
      </div>
      <hr className="w-full" />
      <div className="space-y-4">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-7 max-w-sm" />
      </div>
      <hr className="w-full" />
      <div className="space-y-4">
        <Skeleton className="h-5 w-20" />
        <div className="max-w-sm space-y-2">
          <div className="w-full overflow-x-hidden">
            <div className="flex space-x-4">
              {Array.from({ length: 7 }).map((_, index) => (
                <Skeleton key={index} className="size-10" />
              ))}
            </div>
          </div>
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <hr className="w-full" />
      <div className="flex flex-col space-y-6">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-7 w-40" />
      </div>
    </div>
  );
};

export default PorfileLoading;
