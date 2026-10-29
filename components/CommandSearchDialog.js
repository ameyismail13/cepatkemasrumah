// ============================================================================
// FAIL: components/CommandSearchDialog.js
// KONSEP: Dei Theme Command Search Dialog
// ============================================================================

"use client";

import { useEffect, useState } from "react";
import { Search, X, CheckSquare } from "lucide-react";
import UserAvatar from "@/components/UserAvatar";

export default function CommandSearchDialog({ chores, users, isOpen, onClose }) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = chores.filter(
    (c) =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase()) ||
      (c.description &&
        c.description.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-xl bg-white rounded-[32px] border border-zinc-200 shadow-2xl overflow-hidden">
        {/* Bar Input Carian */}
        <div className="flex items-center px-5 border-b border-zinc-100 bg-zinc-50">
          <Search className="w-5 h-5 text-zinc-500 mr-3" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari apa-apa tugasan... (Cmd+K)"
            className="w-full bg-transparent py-4 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none font-medium"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:text-zinc-900 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Senarai Hasil Carian */}
        <div className="max-h-[350px] overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-xs text-zinc-400">
              Tiada tugasan sepadan dengan &quot;{query}&quot;.
            </div>
          ) : (
            filtered.map((item) => {
              const assignee = users.find((u) => u.id === item.assignedToId);
              return (
                <div
                  key={item.id}
                  onClick={onClose}
                  className="p-3.5 rounded-2xl hover:bg-zinc-50 border border-transparent hover:border-zinc-200 flex items-center justify-between gap-3 cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700 shrink-0 font-bold">
                      ✓
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-black text-zinc-900 truncate">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-zinc-400 flex items-center gap-2">
                        <span className="capitalize">{item.category}</span>
                        <span>•</span>
                        <span>Due: {item.dueDate}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {assignee && (
                      <span className="text-[10px] bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-full text-zinc-700 font-semibold flex items-center gap-1">
                        <UserAvatar
                          name={assignee.name}
                          colorTheme={assignee.colorTheme || "#3b82f6"}
                          size={12}
                        />
                        {assignee.name.split(" ")[0]}
                      </span>
                    )}
                    <span className="text-xs font-black text-purple-700">
                      +{item.pointValue}pt
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
