// ============================================================================
// FAIL: components/ScheduleCalendarView.js
// KONSEP: Dei Theme Schedule Timeline
// ============================================================================

"use client";

import { Calendar as CalendarIcon } from "lucide-react";
import UserAvatar from "@/components/UserAvatar";

export default function ScheduleCalendarView({ chores, users }) {
  const choresByDate = {};
  chores.forEach((c) => {
    if (!choresByDate[c.dueDate]) choresByDate[c.dueDate] = [];
    choresByDate[c.dueDate].push(c);
  });

  const days = [];
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() - 1);

  for (let i = 0; i < 7; i++) {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + i);
    const dateString = d.toISOString().split("T")[0];
    const isToday = new Date().toISOString().split("T")[0] === dateString;

    days.push({
      dateStr: dateString,
      dayName: d.toLocaleDateString("ms-MY", { weekday: "short" }),
      dayNumber: d.getDate(),
      monthName: d.toLocaleDateString("ms-MY", { month: "short" }),
      isToday,
      items: choresByDate[dateString] || [],
    });
  }

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-[32px] bg-[#f8fafc] border border-zinc-200/80">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-white text-zinc-900 border border-zinc-200 shadow-xs">
              <CalendarIcon className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <h2 className="text-lg font-black text-zinc-900 tracking-tight">
                Jadual Tugasan Mingguan 📅
              </h2>
              <p className="text-xs text-zinc-500">
                Susunan tugas mengikut tarikh akhir
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {days.map((day) => (
            <div
              key={day.dateStr}
              className={`rounded-3xl p-3.5 border transition-all ${
                day.isToday
                  ? "bg-white border-purple-300 shadow-md ring-2 ring-purple-100"
                  : "bg-white/80 border-zinc-200"
              }`}
            >
              <div className="text-center pb-2 mb-2 border-b border-zinc-100">
                <span className="text-[11px] uppercase tracking-wider font-black text-zinc-400">
                  {day.dayName}
                </span>
                <div
                  className={`text-xl font-black mt-0.5 ${
                    day.isToday ? "text-purple-900" : "text-zinc-900"
                  }`}
                >
                  {day.dayNumber}
                </div>
                <span className="text-[10px] text-zinc-400 font-bold">
                  {day.monthName}
                </span>
                {day.isToday && (
                  <span className="block mt-1 text-[9px] uppercase font-black text-purple-700 bg-purple-100 rounded-full px-1.5 py-0.5">
                    Hari Ini
                  </span>
                )}
              </div>

              <div className="space-y-2 mt-2 min-h-[140px]">
                {day.items.length === 0 ? (
                  <div className="text-center py-6 text-[11px] text-zinc-400">
                    Goyang kaki
                  </div>
                ) : (
                  day.items.map((item) => {
                    const assignee = users.find(
                      (u) => u.id === item.assignedToId
                    );
                    const isOverdue =
                      item.status !== "completed" &&
                      new Date(item.dueDate).getTime() <
                        new Date().setHours(0, 0, 0, 0);

                    return (
                      <div
                        key={item.id}
                        className={`p-2.5 rounded-2xl text-xs border ${
                          item.status === "completed"
                            ? "bg-emerald-50 border-emerald-200 text-zinc-400 line-through"
                            : isOverdue
                            ? "bg-rose-50 border-rose-200 text-zinc-900"
                            : "bg-[#f8fafc] border-zinc-200 text-zinc-900"
                        }`}
                      >
                        <div className="font-bold truncate">
                          {item.title}
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-zinc-500 mt-1.5">
                          <span className="flex items-center gap-1 font-semibold">
                            {assignee && (
                              <UserAvatar
                                name={assignee.name}
                                colorTheme={assignee.colorTheme || "#3b82f6"}
                                size={14}
                              />
                            )}
                            {assignee ? assignee.name.split(" ")[0] : "Semua"}
                          </span>
                          <span className="text-purple-700 font-black">
                            +{item.pointValue}pt
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
