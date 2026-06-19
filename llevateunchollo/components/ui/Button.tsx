import { cn } from "@/lib/utils";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  className,
  fullWidth = false,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-orange-500 hover:bg-orange-600 text-white focus:ring-orange-500 active:scale-95",
    secondary:
      "bg-gray-900 hover:bg-gray-800 text-white focus:ring-gray-700 active:scale-95",
    outline:
      "border-2 border-orange-500 text-orange-500 hover:bg-orange-50 focus:ring-orange-500",
    ghost:
      "text-gray-700 hover:bg-gray-100 focus:ring-gray-300",
  };

  const sizes = {
    sm: "text-sm px-3 py-1.5 gap-1.5",
    md: "text-base px-4 py-2.5 gap-2",
    lg: "text-lg px-6 py-3 gap-2",
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
