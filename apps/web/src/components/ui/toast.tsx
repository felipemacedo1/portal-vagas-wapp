import * as React from "react"
import { cn } from "@/lib/utils"

const Toast = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "destructive"
  }
>(({ className, variant = "default", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "fixed top-4 right-4 z-50 rounded-md border p-4 shadow-lg",
      variant === "default" && "bg-background text-foreground",
      variant === "destructive" && "bg-destructive text-destructive-foreground",
      className
    )}
    {...props}
  />
))
Toast.displayName = "Toast"

export { Toast }