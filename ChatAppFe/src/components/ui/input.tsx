import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    "flex h-11 w-full rounded-xl border-2 border-zinc-200 bg-zinc-50 px-4 py-2 text-base transition-all duration-200",
                    "placeholder:text-zinc-400",
                    "focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Input.displayName = "Input";

export { Input };
