import { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: ReactNode;
}

const variantStyles: Record<string, string> = {
  primary: "bg-accent text-white hover:bg-accent-hover",
  secondary: "bg-ink-raised text-paper hairline hover:border-paper-muted",
  ghost: "bg-transparent text-paper-muted hover:text-paper",
  danger: "bg-transparent text-bad hairline border-bad/30 hover:bg-bad/10",
};

const sizeStyles: Record<string, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

export const Button = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  children,
  className = "",
  ...rest
}: ButtonProps) => {
  return (
    <button
      disabled={disabled || isLoading}
      className={`
        inline-flex items-center justify-center gap-2 rounded-lg font-medium
        transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]} ${sizeStyles[size]} ${className}
      `}
      {...rest}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
};
