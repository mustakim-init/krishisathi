import type { HTMLAttributes, ReactNode } from "react";

/* The Material card paints its own inner surface inside a shadow root, which
   fights the per-screen backgrounds and leaves a second box inside every card.
   This wrapper keeps the same `variant` API but renders a plain element we can
   style directly. */

type Variant = "elevated" | "filled" | "outlined";

export default function Card({
  variant = "elevated",
  className = "",
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { variant?: Variant; children?: ReactNode }) {
  return (
    <div className={`card card--${variant}${className ? ` ${className}` : ""}`} {...rest}>
      {children}
    </div>
  );
}
