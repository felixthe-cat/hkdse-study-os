"use client";

import Link from "next/link";
import DayList from "@/components/DayList";
import papersData from "@/lib/papers-data.json";
import { useLocalStorageState } from "@/lib/storage";
import { computeSubjectStats } from "@/lib/compute";
import {
  Attempt,
  Paper,
  SUBJECTS,
  SUBJECT_LABELS,
  SYLLABUS_TOPICS,
  Subject,
  TopicStatus,
} from "@/lib/types";

const papers = papersData as Paper[];

const TREND_ARROW = { up: "↑", down: "↓", flat: "→" } as const;

const SUBJECT_ICONS: Record<Subject, string> = {
  Chemistry: "🧪",
  Chinese_Language: "🈶",
  English_Language: "🔤",
  Geography: "🌍",
  Mathematics: "📐",
  Physics: "⚛️",
};

export default function Dashboard() {
  const [attempts] = useLocalStorageState<Record<string, Attempt>>("attempts", {});
  const [topicStatus] = useLocalStorageState<Record<string, TopicStatus>>("topicStatus", {});

  const weakSubjects = SUBJECTS.filter((subject) => {
    const paperIds = papers.filter((p) => p.subject === subject).map((p) => p.id);
    return computeSubjectStats(subject, attempts, paperIds, topicStatus, SYLLABUS_TOPICS[subject])
      .weak;
  });

  return (
    <div className="space-y-6">
      <DayList />

      {weakSubjects.length > 0 && (
        <div className="sv-panel !border-sv-red">
          <span className="sv-badge sv-badge-weak mr-2">⚠ Needs attention</span>
          {weakSubjects.map((s) => SUBJECT_LABELS[s]).join(", ")} — recent attempts averaging
          below 60%.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SUBJECTS.map((subject) => {
          const paperIds = papers.filter((p) => p.subject === subject).map((p) => p.id);
          const stats = computeSubjectStats(
            subject,
            attempts,
            paperIds,
            topicStatus,
            SYLLABUS_TOPICS[subject]
          );
          return (
            <div key={subject} className="sv-panel space-y-2">
              <h3 className="sv-panel-header !mb-2 !pb-1 flex items-center gap-2">
                <span>{SUBJECT_ICONS[subject]}</span>
                {SUBJECT_LABELS[subject]}
              </h3>
              <div>
                <div className="flex justify-between text-sm text-sv-text-muted mb-1">
                  <span>Coverage</span>
                  <span>{stats.coveragePct}%</span>
                </div>
                <div className="sv-progress-track">
                  <div
                    className="sv-progress-fill"
                    style={{ width: `${stats.coveragePct}%` }}
                  />
                </div>
              </div>
              <div className="text-sm text-sv-text-muted">
                Last score:{" "}
                <span className="text-sv-text font-bold">
                  {stats.lastScorePct != null ? `${Math.round(stats.lastScorePct)}%` : "—"}
                </span>{" "}
                {stats.trend && (
                  <span
                    className={
                      stats.trend === "up"
                        ? "text-sv-green-dark"
                        : stats.trend === "down"
                        ? "text-sv-red"
                        : "text-sv-text-muted"
                    }
                  >
                    {TREND_ARROW[stats.trend]}
                  </span>
                )}
              </div>
              <div className="flex gap-3 text-sm pt-1 border-t-2 border-dashed border-sv-panel-alt">
                <Link href="/papers" className="text-sv-blue hover:underline pt-1">
                  Papers
                </Link>
                <Link href="/scores" className="text-sv-blue hover:underline pt-1">
                  Scores
                </Link>
                <Link href="/syllabus" className="text-sv-blue hover:underline pt-1">
                  Syllabus
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
