"use client";

import type { ReactNode } from "react";
import { usePack } from "./PackProvider";

type Props = {
  className?: string;
  children: ReactNode;
  /** Show the number of bottles currently in the pack */
  badge?: boolean;
};

/** Opens the "build your pack" drawer. */
export default function PackButton({ className, children, badge }: Props) {
  const { openDrawer, total } = usePack();
  return (
    <button type="button" onClick={openDrawer} className={className}>
      {children}
      {badge && total > 0 && (
        <span className="ml-1 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[11px] font-bold leading-none text-ink">
          {total}
        </span>
      )}
    </button>
  );
}
