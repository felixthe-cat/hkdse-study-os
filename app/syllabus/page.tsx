"use client";

import { useLocalStorageState } from "@/lib/storage";
import { SUBJECTS, SUBJECT_LABELS, SYLLABUS_TOPICS, TopicStatus } from "@/lib/types";

const STATUS_OPTIONS: TopicStatus[] = ["not_started", "studying", "confident"];

export default function SyllabusPage() {
  const [topicStatus, setTopicStatus] = useLocalStorageState<Record<string, TopicStatus>>(
    "topicStatus",
    {}
  );

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-semibold">Syllabus Checklist</h1>
      <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">
        Topics below are placeholders — swap in the real HKDSE syllabus topics per subject in{" "}
        <code>lib/types.ts</code> (<code>SYLLABUS_TOPICS</code>).
      </p>
      {SUBJECTS.map((subject) => {
        const topics = SYLLABUS_TOPICS[subject];
        const confident = topics.filter(
          (t) => topicStatus[`${subject}::${t}`] === "confident"
        ).length;
        const coverage = topics.length === 0 ? 0 : Math.round((confident / topics.length) * 100);

        return (
          <div key={subject} className="bg-white rounded-lg border p-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold">{SUBJECT_LABELS[subject]}</h2>
              <span className="text-sm text-slate-500">Coverage: {coverage}%</span>
            </div>
            <ul className="space-y-1">
              {topics.map((topic) => {
                const key = `${subject}::${topic}`;
                return (
                  <li key={key} className="flex items-center justify-between text-sm">
                    <span>{topic}</span>
                    <select
                      className="border rounded px-1 py-0.5"
                      value={topicStatus[key] ?? "not_started"}
                      onChange={(e) =>
                        setTopicStatus({
                          ...topicStatus,
                          [key]: e.target.value as TopicStatus,
                        })
                      }
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s.replace("_", " ")}
                        </option>
                      ))}
                    </select>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
