import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function CustomToaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast 
            key={id} 
            {...props}
            className="bg-accent text-white border-accent"
          >
            <div className="grid gap-1">
              {title && <ToastTitle className="text-white">{title}</ToastTitle>}
              {description && (
                <ToastDescription className="text-white opacity-100 font-medium">{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose className="text-white opacity-70 hover:opacity-100" />
          </Toast>
        )
      })}
      <ToastViewport className="fixed top-4 right-4 z-[100] flex max-h-screen flex-col-reverse gap-2" />
    </ToastProvider>
  )
} 