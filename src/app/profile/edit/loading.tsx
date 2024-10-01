import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  // Or a custom loading skeleton component
  
  return (
    
    <div className="h-screen w-screen flex items-start justify-center">
      <section className={`min-w-40 max-w-xl p-10 mt-32 bg-white rounded-lg shadow-lg`}>
          <div className="flex items-center space-x-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[400px]" />
              <Skeleton className="h-4 w-[400px]" />
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[160px]" />
            </div>
          </div>
      </section>
    </div>
  )
}