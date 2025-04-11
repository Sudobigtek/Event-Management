import { toast as sonnerToast } from "sonner";

interface ToastOptions {
  title: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
  duration?: number;
}

export const useToast = () => {
  const toast = ({
    title,
    description,
    variant = "default",
    duration = 3000,
  }: ToastOptions) => {
    switch (variant) {
      case "destructive":
        sonnerToast.error(title, { description, duration });
        break;
      case "success":
        sonnerToast.success(title, { description, duration });
        break;
      default:
        sonnerToast(title, { description, duration });
    }
  };

  return { toast };
};
