"use client";

import { useContext } from "react";
import { EditContext } from "./AdminEditProvider";

export default function EditableSection({
  children,
  sectionId,
  data,
  label,
  position = "top-right",
}: {
  children: React.ReactNode;
  sectionId: string;
  data: Record<string, unknown>;
  label?: string;
  position?: "top-right" | "bottom-left";
}) {
  const ctx = useContext(EditContext);

  // Not inside AdminEditProvider (non-admin visitor) — render normally
  if (!ctx || !ctx.isEditMode) return <>{children}</>;

  const { openDrawer } = ctx;

  return (
    <div className="relative group/editable">
      {/* Subtle gold ring on hover */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-0 group-hover/editable:opacity-100 transition-opacity duration-200"
        style={{ boxShadow: "inset 0 0 0 2px rgba(201,144,42,0.35)" }}
      />

      {children}

      {/* Edit button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          openDrawer(sectionId, data);
        }}
        className={`absolute z-20 flex items-center gap-2 px-4 py-2 font-condensed text-xs tracking-widest uppercase transition-all duration-200 opacity-0 group-hover/editable:opacity-100 ${position === "bottom-left" ? "bottom-16 left-6" : "top-4 right-4"}`}
        style={{
          background: "var(--gold)",
          color: "var(--black)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
        }}
      >
        ✎ {label ?? "Edit"}
      </button>
    </div>
  );
}
