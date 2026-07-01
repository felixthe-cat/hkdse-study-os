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
      <h1 className="text-2xl">📜 Quest Log — Past Papers</h1>
      {SUBJECTS.map((subject) => {
        const subjectPapers = papers.filter((p) => p.subject === subject);
        if (subjectPapers.length === 0) return null;
        return (
          <div key={subject} className="sv-panel !p-0 overflow-hidden">
            <h2 className="sv-panel-header !m-0 !border-0 px-4 pt-3">
              {SUBJECT_LABELS[subject]}
            </h2>
            <table className="sv-table">
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Paper</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Score</th>
                  <th>/ Total</th>
                  <th>Time (min)</th>
                </tr>
              </thead>
              <tbody>
                {subjectPapers.map((paper) => {
                  const attempt = attempts[paper.id] ?? { status: "not_started" as AttemptStatus };
                  return (
                    <tr key={paper.id}>
                      <td>{paper.year}</td>
                      <td>{paper.paperType}</td>
                      <td>
                        <select
                          className="sv-select"
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
                      <td>
                        <input
                          type="date"
                          className="sv-input"
                          value={attempt.dateAttempted ?? ""}
                          onChange={(e) =>
                            updateAttempt(paper.id, { dateAttempted: e.target.value })
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="sv-input w-16"
                          value={attempt.score ?? ""}
                          onChange={(e) =>
                            updateAttempt(paper.id, {
                              score: e.target.value === "" ? undefined : Number(e.target.value),
                            })
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="sv-input w-16"
                          value={attempt.totalMarks ?? ""}
                          onChange={(e) =>
                            updateAttempt(paper.id, {
                              totalMarks:
                                e.target.value === "" ? undefined : Number(e.target.value),
                            })
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="sv-input w-16"
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
