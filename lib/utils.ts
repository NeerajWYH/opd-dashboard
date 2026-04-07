import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { toast } from "sonner"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function triggerToast(
  severity: "success" | "error" | "warning" | "info",
  message: string
) {
  toast.dismiss()
  const baseOptions = {
    position: "top-center" as const,
    duration: 5000,
    closeButton: true,
  }

  const styleMap: Record<string, { backgroundColor: string; color: string }> = {
    success: { backgroundColor: "#ecfdf5", color: "#065f46" },
    error: { backgroundColor: "#fef2f2", color: "#991b1b" },
    warning: { backgroundColor: "#fffbeb", color: "#92400e" },
    info: { backgroundColor: "#eff6ff", color: "#1e40af" },
  }

  const actionMap: Record<string, () => void> = {
    success: () =>
      toast.success(message, { ...baseOptions, style: styleMap.success }),
    error: () =>
      toast.error(message, { ...baseOptions, style: styleMap.error }),
    warning: () =>
      toast.warning(message, { ...baseOptions, style: styleMap.warning }),
    info: () => toast.info(message, { ...baseOptions, style: styleMap.info }),
  }

  actionMap[severity]?.()
}
