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
    <div className="sv-panel">
      <h2 className="sv-panel-header">📋 Today&apos;s To-Do List</h2>
      <div className="flex gap-2 mb-3 flex-wrap">
        <input
          className="sv-input flex-1 min-w-[160px]"
          placeholder="Add something to do today..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addItem()}
        />
        <select
          className="sv-select"
          value={category}
          onChange={(e) => setCategory(e.target.value as DayListCategory)}
        >
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <button onClick={addItem} className="sv-btn sv-btn-primary">
          + Add
        </button>
      </div>
      {todaysItems.length === 0 ? (
        <p className="text-sv-text-muted italic">Nothing on today&apos;s list yet.</p>
      ) : (
        <ul className="space-y-2">
          {todaysItems.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-2 bg-sv-panel-alt border-2 border-sv-border-mid px-2 py-1"
            >
              <input
                type="checkbox"
                checked={item.done}
                onChange={() => toggleDone(item.id)}
                className="w-4 h-4 accent-[var(--sv-green)]"
              />
              <span className={item.done ? "line-through text-sv-text-muted flex-1" : "flex-1"}>
                {item.text}
              </span>
              <span className="sv-badge">{item.category}</span>
              <button
                onClick={() => removeItem(item.id)}
                className="text-sv-text-muted hover:text-sv-red text-lg leading-none px-1"
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
