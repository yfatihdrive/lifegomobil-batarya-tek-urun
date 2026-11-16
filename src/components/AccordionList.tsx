"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface AccordionEntry {
  title: string;
  content: string;
  badge?: string;
}

interface AccordionListProps {
  items: AccordionEntry[];
  theme?: "dark" | "light";
  defaultOpenIndex?: number | null;
}

export default function AccordionList({
  items,
  theme = "dark",
  defaultOpenIndex = 0,
}: AccordionListProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(defaultOpenIndex);

  if (!items || items.length === 0) return null;

  const isDark = theme === "dark";

  return (
    <div className="space-y-2.5">
      {items.map((item, idx) => {
        const isOpen = openIdx === idx;
        return (
          <div
            key={idx}
            className={`rounded-2xl border transition overflow-hidden ${
              isDark
                ? isOpen
                  ? "border-orange-500/60 bg-slate-900/90"
                  : "border-slate-800 bg-slate-900/50 hover:border-slate-700"
                : isOpen
                ? "border-orange-500 bg-orange-50/30"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenIdx(isOpen ? null : idx)}
              className="w-full px-5 py-4 text-left flex items-center justify-between gap-3 cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {item.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase shrink-0 ${
                      isDark
                        ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                        : "bg-orange-100 text-orange-700 border border-orange-200"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                <span
                  className={`text-xs sm:text-sm font-extrabold leading-snug ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  {item.title}
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                  isOpen
                    ? "rotate-180 text-orange-500"
                    : isDark
                    ? "text-slate-400"
                    : "text-slate-500"
                }`}
              />
            </button>

            {isOpen && (
              <div
                className={`px-5 pb-4 pt-2 text-xs sm:text-sm leading-relaxed border-t ${
                  isDark
                    ? "text-slate-300 border-slate-800/80"
                    : "text-slate-600 border-slate-100"
                }`}
              >
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
