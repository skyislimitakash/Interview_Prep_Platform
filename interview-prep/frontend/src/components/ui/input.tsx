import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...rest }, ref) => {
    const inputId = id || rest.name;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm text-paper-muted">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            bg-ink-raised hairline rounded-lg px-4 py-2.5 text-paper placeholder:text-paper-muted/60
            focus:border-accent transition-colors duration-150
            ${error ? "border-bad" : ""} ${className}
          `}
          {...rest}
        />
        {error && <span className="text-xs text-bad">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
