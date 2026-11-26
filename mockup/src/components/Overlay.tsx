import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

/* A fixed overlay drawn at the phone-frame level. Rendering it outside the
   screen content keeps it out of the text-size zoom, so a sheet always fits
   the frame instead of being scaled past its bottom edge. */
export default function Overlay({ children }: { children: ReactNode }) {
  const [host, setHost] = useState<Element | null>(null);

  useEffect(() => {
    setHost(document.querySelector(".screen"));
  }, []);

  if (!host) return null;
  return createPortal(children, host);
}
