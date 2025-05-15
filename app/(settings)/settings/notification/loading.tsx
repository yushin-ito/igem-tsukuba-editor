import { Skeleton } from "@/components/ui/skeleton";

const NotificationLoading = () => {
  return (
    <div className="max-w-4xl space-y-16">
      <div className="space-y-6">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center space-x-3">
            <Skeleton className="size-8" />
            <Skeleton className="h-5 w-16" />
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
        <hr className="w-full" />
        <div className="space-y-8">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Skeleton className="size-8" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default NotificationLoading;
