import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const TranslatorLoading = () => {
  return (
    <div className="container mt-20 max-w-7xl space-y-10 md:grid md:grid-cols-2 md:space-x-10 md:space-y-0">
      <div className="flex flex-col space-y-2">
        <div className="space-y-4">
          <Skeleton className="h-6 w-[160px]" />
          <Card className="relative min-h-[480px] overflow-hidden shadow-none">
            <CardContent className="p-0">
              <div className="min-h-[440px] space-y-4 p-6">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-5/6" />
              </div>
              <div className="absolute inset-x-0 bottom-0 flex h-10 items-center justify-between px-4">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-16" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="flex flex-col space-y-2">
        <div className="space-y-4">
          <Skeleton className="h-6 w-[160px]" />
          <Card className="relative min-h-[480px] overflow-hidden shadow-none">
            <CardContent className="p-0">
              <div className="min-h-[440px] space-y-4 p-6">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-4/5" />
              </div>
              <div className="absolute inset-x-0 bottom-0 flex h-10 items-center justify-between px-4">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-16" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default TranslatorLoading;
