"use client";

import type { ReactNode } from "react";
import { scrollToHash } from "@/lib/lenis";

type Props = {
  href: string;
  className?: string;
  children: ReactNode;
  onNavigate?: () => void;
};

/** Anchor that glides to its target through Lenis. */
export default function ScrollLink({ href, className, children, onNavigate }: Props) {
  return (
    <a
      href={href}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        scrollToHash(href);
        onNavigate?.();
      }}
    >
      {children}
    </a>
  );
}
