import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export const Button = React.forwardRef(({
  borderRadius = "1.75rem",
  children,
  as: Component = "button",
  containerClassName,
  borderClassName,
  duration,
  className,
  ...otherProps
}, ref) => {
  return (
    <Component
      ref={ref}
      className={cn(
        "relative text-base h-12 w-full p-[1px] overflow-hidden",
        containerClassName
      )}
      style={{
        borderRadius: borderRadius,
      }}
      {...otherProps}
    >
      <div
        className="absolute inset-0"
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        <motion.div
          className={cn(
            "h-full w-full absolute",
            borderClassName
          )}
          style={{
            background:
              "linear-gradient(90deg, hsl(142 76% 42%), hsl(142 76% 52%), hsl(142 76% 42%))",
            backgroundSize: "200% 100%",
          }}
          animate={{
            backgroundPosition: ["0% 0%", "200% 0%"],
          }}
          transition={{
            duration: duration || 4,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <div
        className={cn(
          "relative bg-background text-foreground flex items-center justify-center w-full h-full text-sm antialiased font-semibold",
          className
        )}
        style={{
          borderRadius: `calc(${borderRadius} * 0.96)`,
        }}
      >
        {children}
      </div>
    </Component>
  );
});

Button.displayName = "MovingBorderButton";

