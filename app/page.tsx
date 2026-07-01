"use client";

import Link from "next/link";
import DayList from "@/components/DayList";
import papersData from "@/lib/papers-data.json";
import { useLocalStorageState } from "@/lib/storage";
import { computeSubjectStats } from "@/lib/compute";
import { Attempt, Paper, SUBJECTS, SUBJECT_LABELS, SYLLABUS_TOPICS, TopicStatus } from "@/lib/types";

const papers = papersData as Paper[];

const TREND_ARROW = { up: "↑", down: "↓", flat: "→" } as const;

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
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-900">
          <strong>Weak subjects:</strong> {weakSubjects.map((s) => SUBJECT_LABELS[s]).join(", ")}{" "}
          — recent attempts averaging below 60%.
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
            <div key={subject} className="bg-white rounded-lg border p-4 space-y-2">
              <h3 className="font-semibold">{SUBJECT_LABELS[subject]}</h3>
              <div className="text-sm text-slate-600">
                Coverage: {stats.coveragePct}%
              </div>
              <div className="text-sm text-slate-600">
                Last score:{" "}
                {stats.lastScorePct != null ? `${Math.round(stats.lastScorePct)}%` : "—"}{" "}
                {stats.trend && (
                  <span
                    className={
                      stats.trend === "up"
                        ? "text-green-600"
                        : stats.trend === "down"
                        ? "text-red-600"
                        : "text-slate-400"
                    }
                  >
                    {TREND_ARROW[stats.trend]}
                  </span>
                )}
              </div>
              <div className="flex gap-3 text-xs pt-1">
                <Link href="/papers" className="text-blue-600 hover:underline">
                  Papers
                </Link>
                <Link href="/scores" className="text-blue-600 hover:underline">
                  Scores
                </Link>
                <Link href="/syllabus" className="text-blue-600 hover:underline">
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
