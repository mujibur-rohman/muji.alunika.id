"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-sm text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-low hover:bg-[var(--primary)]/90",
        secondary:
          "bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:bg-[var(--secondary)]/80",
        destructive:
          "bg-[var(--destructive)] text-[var(--destructive-foreground)] hover:bg-[var(--destructive)]/90",
        ghost:
          "bg-transparent hover:bg-[var(--accent)] text-[var(--accent-foreground)]",
        outline:
          "border border-[var(--input)] bg-[var(--background)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]",
        link: "bg-transparent text-[var(--primary)] hover:underline px-0",
      },
      size: {
        sm: "h-8 px-3",
        md: "h-9 px-4",
        lg: "h-11 px-6",
        icon: "h-9 w-9 px-0",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled || loading}
        {...props}
      >
        {loading && !asChild ? (
          <>
            <Loader2 className="animate-spin" />
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
