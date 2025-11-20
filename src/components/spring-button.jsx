import { cn } from "@/lib/utils";

export function SpringButton({ children, className, scale = 0.95, shaking = true, ...props }) {
  return (
    <button
      className={cn("transition-all active:scale-95", className)}
      style={{
        transform: shaking ? "translateX(0px)" : undefined,
        animation: shaking ? "shake 4s cubic-bezier(0.36, 0.07, 0.19, 0.97) 2s infinite" : undefined,
      }}
      {...props}
    >
      {children}
    </button>
  );
}

