import { type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "icon";
};

export function Button({ className, variant = "primary", type = "button", ...props }: ButtonProps) {
  const variants = {
    primary: "bg-primary text-primary-foreground shadow-action hover:bg-primary-hover disabled:bg-muted disabled:text-muted-foreground",
    secondary: "border border-border bg-surface text-foreground hover:bg-accent",
    ghost: "text-muted-foreground hover:bg-accent hover:text-foreground",
    icon: "border border-border bg-surface text-muted-foreground shadow-sm hover:border-primary/40 hover:text-primary",
  };

  return (
    <button
      type={type}
      className={cn(
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}