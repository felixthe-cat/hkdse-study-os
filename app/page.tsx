"use client";

import { useState } from "react";
import Link from "next/link";
import DayList from "@/components/DayList";
import Village from "@/components/Village";
import papersData from "@/lib/papers-data.json";
import { useLocalStorageState } from "@/lib/storage";
import { computeSubjectStats } from "@/lib/compute";
import {
  Attempt,
  Paper,
  SUBJECT_ICONS,
  SUBJECTS,
  SUBJECT_LABELS,
  SYLLABUS_TOPICS,
  Subject,
  TopicStatus,
} from "@/lib/types";

const papers = papersData as Paper[];

const TREND_ARROW = { up: "↑", down: "↓", flat: "→" } as const;

export default function Dashboard() {
  const [attempts] = useLocalStorageState<Record<string, Attempt>>("attempts", {});
  const [topicStatus] = useLocalStorageState<Record<string, TopicStatus>>("topicStatus", {});
  const [selected, setSelected] = useState<Subject | null>(null);

  const statsBySubject = Object.fromEntries(
    SUBJECTS.map((subject) => {
      const paperIds = papers.filter((p) => p.subject === subject).map((p) => p.id);
      return [
        subject,
        computeSubjectStats(subject, attempts, paperIds, topicStatus, SYLLABUS_TOPICS[subject]),
      ];
    })
  ) as Record<Subject, ReturnType<typeof computeSubjectStats>>;

  const weakSubjects = SUBJECTS.filter((subject) => statsBySubject[subject].weak);
  const coveragePctBySubject = Object.fromEntries(
    SUBJECTS.map((s) => [s, statsBySubject[s].coveragePct])
  ) as Record<Subject, number>;

  const selectedStats = selected ? statsBySubject[selected] : null;

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

      <div>
        <h2 className="sv-panel-header !border-0">🏘️ Your Study Village</h2>
        <p className="text-sv-text-muted text-sm mb-3">
          Walk up to a building to see what&apos;s inside.
        </p>
        <Village
          coveragePctBySubject={coveragePctBySubject}
          selected={selected}
          onSelect={setSelected}
        />
      </div>

      {selected && selectedStats && (
        <div className="sv-panel space-y-2">
          <h3 className="sv-panel-header !mb-2 !pb-1 flex items-center gap-2">
            <span>{SUBJECT_ICONS[selected]}</span>
            {SUBJECT_LABELS[selected]}
          </h3>
          <div>
            <div className="flex justify-between text-sm text-sv-text-muted mb-1">
              <span>Coverage</span>
              <span>{selectedStats.coveragePct}%</span>
            </div>
            <div className="sv-progress-track">
              <div
                className="sv-progress-fill"
                style={{ width: `${selectedStats.coveragePct}%` }}
              />
            </div>
          </div>
          <div className="text-sm text-sv-text-muted">
            Last score:{" "}
            <span className="text-sv-text font-bold">
              {selectedStats.lastScorePct != null
                ? `${Math.round(selectedStats.lastScorePct)}%`
                : "—"}
            </span>{" "}
            {selectedStats.trend && (
              <span
                className={
                  selectedStats.trend === "up"
                    ? "text-sv-green-dark"
                    : selectedStats.trend === "down"
                    ? "text-sv-red"
                    : "text-sv-text-muted"
                }
              >
                {TREND_ARROW[selectedStats.trend]}
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
      )}
    </div>
  );
}
