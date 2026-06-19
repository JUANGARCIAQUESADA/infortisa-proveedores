import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "discount" | "category" | "stock";
  className?: string;
}

export function Badge({ children, variant = "discount", className }: BadgeProps) {
  const variants = {
    discount:
      "bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full",
    category:
      "bg-orange-100 text-orange-700 text-xs font-medium px-2 py-1 rounded-full",
    stock:
      "bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full",
  };

  return (
    <span className={cn(variants[variant], className)}>
      {children}
    </span>
  );
}

export default Badge;
