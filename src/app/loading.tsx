import { Skeleton } from "@/components/ui/skeleton"
import Paper from "@/components/ui/paper/paper";

export default function Loading() {
  return (
    <div className="h-screen w-screen flex items-start justify-center">
      <Paper>
        <div className="flex items-center space-x-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-[400px]" />
            <Skeleton className="h-4 w-[400px]" />
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[160px]" />
          </div>
        </div>
      </Paper>
    </div>
  )
}