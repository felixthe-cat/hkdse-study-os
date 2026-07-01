"use client";

import papersData from "@/lib/papers-data.json";
import { useLocalStorageState, todayStr } from "@/lib/storage";
import { Attempt, AttemptStatus, Paper, SUBJECTS, SUBJECT_LABELS } from "@/lib/types";

const papers = papersData as Paper[];

const STATUS_OPTIONS: AttemptStatus[] = ["not_started", "attempted", "reviewed"];

export default function PapersPage() {
  const [attempts, setAttempts] = useLocalStorageState<Record<string, Attempt>>("attempts", {});

  function updateAttempt(id: string, patch: Partial<Attempt>) {
    const current: Attempt = attempts[id] ?? { status: "not_started" };
    setAttempts({ ...attempts, [id]: { ...current, ...patch } });
  }

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-semibold">Past Paper Tracker</h1>
      {SUBJECTS.map((subject) => {
        const subjectPapers = papers.filter((p) => p.subject === subject);
        if (subjectPapers.length === 0) return null;
        return (
          <div key={subject}>
            <h2 className="font-semibold mb-2">{SUBJECT_LABELS[subject]}</h2>
            <table className="w-full text-sm bg-white border rounded-lg overflow-hidden">
              <thead className="bg-slate-100 text-left">
                <tr>
                  <th className="p-2">Year</th>
                  <th className="p-2">Paper</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Score</th>
                  <th className="p-2">/ Total</th>
                  <th className="p-2">Time (min)</th>
                </tr>
              </thead>
              <tbody>
                {subjectPapers.map((paper) => {
                  const attempt = attempts[paper.id] ?? { status: "not_started" as AttemptStatus };
                  return (
                    <tr key={paper.id} className="border-t">
                      <td className="p-2">{paper.year}</td>
                      <td className="p-2">{paper.paperType}</td>
                      <td className="p-2">
                        <select
                          className="border rounded px-1 py-0.5"
                          value={attempt.status}
                          onChange={(e) => {
                            const status = e.target.value as AttemptStatus;
                            updateAttempt(paper.id, {
                              status,
                              dateAttempted:
                                status !== "not_started"
                                  ? attempt.dateAttempted ?? todayStr()
                                  : undefined,
                            });
                          }}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {s.replace("_", " ")}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-2">
                        <input
                          type="date"
                          className="border rounded px-1 py-0.5"
                          value={attempt.dateAttempted ?? ""}
                          onChange={(e) =>
                            updateAttempt(paper.id, { dateAttempted: e.target.value })
                          }
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          className="border rounded px-1 py-0.5 w-16"
                          value={attempt.score ?? ""}
                          onChange={(e) =>
                            updateAttempt(paper.id, {
                              score: e.target.value === "" ? undefined : Number(e.target.value),
                            })
                          }
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          className="border rounded px-1 py-0.5 w-16"
                          value={attempt.totalMarks ?? ""}
                          onChange={(e) =>
                            updateAttempt(paper.id, {
                              totalMarks:
                                e.target.value === "" ? undefined : Number(e.target.value),
                            })
                          }
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          className="border rounded px-1 py-0.5 w-16"
                          value={attempt.timeTakenMin ?? ""}
                          onChange={(e) =>
                            updateAttempt(paper.id, {
                              timeTakenMin:
                                e.target.value === "" ? undefined : Number(e.target.value),
                            })
                          }
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
