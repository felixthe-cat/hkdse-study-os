"use client";

import { useState } from "react";
import { useLocalStorageState, todayStr } from "@/lib/storage";
import { DayListCategory, DayListItem } from "@/lib/types";

const CATEGORIES: DayListCategory[] = ["Homework", "Revision", "Other"];

export default function DayList() {
  const [items, setItems] = useLocalStorageState<DayListItem[]>("dayList", []);
  const [text, setText] = useState("");
  const [category, setCategory] = useState<DayListCategory>("Homework");
  const today = todayStr();
  const todaysItems = items.filter((i) => i.date === today);

  function addItem() {
    if (!text.trim()) return;
    setItems([
      ...items,
      { id: crypto.randomUUID(), text: text.trim(), category, date: today, done: false },
    ]);
    setText("");
  }

  function toggleDone(id: string) {
    setItems(items.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));
  }

  function removeItem(id: string) {
    setItems(items.filter((i) => i.id !== id));
  }

  return (
    <div className="bg-white rounded-lg border p-4">
      <h2 className="font-semibold mb-3">Today&apos;s List</h2>
      <div className="flex gap-2 mb-3">
        <input
          className="flex-1 border rounded px-2 py-1 text-sm"
          placeholder="Add something to do today..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addItem()}
        />
        <select
          className="border rounded px-2 py-1 text-sm"
          value={category}
          onChange={(e) => setCategory(e.target.value as DayListCategory)}
        >
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <button
          onClick={addItem}
          className="bg-slate-900 text-white text-sm rounded px-3 py-1"
        >
          Add
        </button>
      </div>
      {todaysItems.length === 0 ? (
        <p className="text-sm text-slate-400">Nothing on today&apos;s list yet.</p>
      ) : (
        <ul className="space-y-1">
          {todaysItems.map((item) => (
            <li key={item.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={item.done}
                onChange={() => toggleDone(item.id)}
              />
              <span className={item.done ? "line-through text-slate-400 flex-1" : "flex-1"}>
                {item.text}
              </span>
              <span className="text-xs text-slate-400">{item.category}</span>
              <button
                onClick={() => removeItem(item.id)}
                className="text-slate-400 hover:text-red-500 text-xs"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
