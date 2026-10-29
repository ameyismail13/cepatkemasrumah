// ============================================================================
// FAIL: components/CommandSearchDialog.js
// KONSEP: Greenish Theme Command Search Dialog
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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-xl bg-white rounded-3xl border border-[#cfe2d4] shadow-2xl overflow-hidden">
        {/* Bar Input Carian */}
        <div className="flex items-center px-4 border-b border-[#e5efe7] bg-[#f7faf8]">
          <Search className="w-5 h-5 text-[#2e6945] mr-3" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari apa-apa kerja rumah, barang dapur... (Cmd+K)"
            className="w-full bg-transparent py-4 text-sm text-[#183123] placeholder-[#8ea897] focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[#6b8575] hover:text-[#183123] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Senarai Hasil Carian */}
        <div className="max-h-[350px] overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-xs text-[#718d7b]">
              Tak jumpa langsung kerja &quot;{query}&quot; ni.
            </div>
          ) : (
            filtered.map((item) => {
              const assignee = users.find((u) => u.id === item.assignedToId);
              return (
                <div
                  key={item.id}
                  onClick={onClose}
                  className="p-3 rounded-2xl hover:bg-[#f0f5f1] border border-transparent hover:border-[#d5e2d8] flex items-center justify-between gap-3 cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-[#eaf4ec] border border-[#cfe2d3] flex items-center justify-center text-[#2e6945] shrink-0">
                      <CheckSquare className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-[#183123] truncate">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-[#557560] flex items-center gap-2">
                        <span className="capitalize">{item.category}</span>
                        <span>•</span>
                        <span>Due: {item.dueDate}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {assignee && (
                      <span className="text-[10px] bg-[#eef5f0] border border-[#d2ddd4] px-2 py-0.5 rounded-full text-[#355240] font-semibold flex items-center gap-1">
                        <UserAvatar
                          name={assignee.name}
                          colorTheme={assignee.colorTheme || "#2e6945"}
                          size={12}
                        />
                        {assignee.name.split(" ")[0]}
                      </span>
                    )}
                    <span className="text-xs font-bold text-[#2e6945]">
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
