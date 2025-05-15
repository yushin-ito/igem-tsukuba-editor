import { Skeleton } from "@/components/ui/skeleton";

const SecurityLoading = () => {
  return (
    <div className="max-w-4xl">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Skeleton className="size-10 sm:size-12" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
            <Skeleton className="h-6 w-20" />
          </div>
          <hr className="w-full pb-6" />
        </div>
      ))}
    </div>
  );
};

export default SecurityLoading;
