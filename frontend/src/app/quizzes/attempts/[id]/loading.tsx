import { Loader2 } from "lucide-react"
import DashboardLayout from "@/components/layouts/dashboard-layout"

export default function Loading() {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h2 className="text-xl font-semibold">Loading quiz results...</h2>
      </div>
    </DashboardLayout>
  )
}
