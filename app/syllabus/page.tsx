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
      <h1 className="text-2xl">🌱 Crop Fields — Syllabus Checklist</h1>
      <p className="sv-panel !bg-[var(--sv-gold)] text-sv-text">
        🚧 Topics below are placeholders — swap in the real HKDSE syllabus topics per subject in{" "}
        <code>lib/types.ts</code> (<code>SYLLABUS_TOPICS</code>).
      </p>
      {SUBJECTS.map((subject) => {
        const topics = SYLLABUS_TOPICS[subject];
        const confident = topics.filter(
          (t) => topicStatus[`${subject}::${t}`] === "confident"
        ).length;
        const coverage = topics.length === 0 ? 0 : Math.round((confident / topics.length) * 100);

        return (
          <div key={subject} className="sv-panel">
            <div className="flex justify-between items-center sv-panel-header">
              <span>{SUBJECT_LABELS[subject]}</span>
              <span className="sv-badge">🌾 {coverage}% grown</span>
            </div>
            <ul className="space-y-2">
              {topics.map((topic) => {
                const key = `${subject}::${topic}`;
                const status = topicStatus[key] ?? "not_started";
                return (
                  <li
                    key={key}
                    className="flex items-center justify-between gap-2 bg-sv-panel-alt border-2 border-sv-border-mid px-3 py-1.5"
                  >
                    <span className="flex items-center gap-2">
                      <span>
                        {status === "confident" ? "🌻" : status === "studying" ? "🌿" : "🌱"}
                      </span>
                      {topic}
                    </span>
                    <select
                      className="sv-select"
                      value={status}
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
