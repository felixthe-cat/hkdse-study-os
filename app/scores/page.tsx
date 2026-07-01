"use client";

import papersData from "@/lib/papers-data.json";
import { useLocalStorageState } from "@/lib/storage";
import TrendChart from "@/components/TrendChart";
import { Attempt, Paper, SUBJECTS, SUBJECT_LABELS } from "@/lib/types";

const papers = papersData as Paper[];
const paperById = Object.fromEntries(papers.map((p) => [p.id, p]));

export default function ScoresPage() {
  const [attempts] = useLocalStorageState<Record<string, Attempt>>("attempts", {});

  return (
    <div className="space-y-10">
      <h1 className="text-xl font-semibold">Score Log & Trend</h1>
      {SUBJECTS.map((subject) => {
        const entries = Object.entries(attempts)
          .filter(([id, a]) => paperById[id]?.subject === subject && a.score != null && a.totalMarks && a.dateAttempted)
          .sort((a, b) => (a[1].dateAttempted! < b[1].dateAttempted! ? -1 : 1));

        if (entries.length === 0) return null;

        const values = entries.map(([, a]) => (a.score! / a.totalMarks!) * 100);
        const labels = entries.map(([id, a]) => `${paperById[id].paperType} (${a.dateAttempted})`);

        return (
          <div key={subject} className="bg-white rounded-lg border p-4 space-y-3">
            <h2 className="font-semibold">{SUBJECT_LABELS[subject]}</h2>
            <TrendChart values={values} labels={labels} />
            <table className="w-full text-sm">
              <thead className="text-left text-slate-500">
                <tr>
                  <th className="py-1">Date</th>
                  <th className="py-1">Paper</th>
                  <th className="py-1">Score</th>
                  <th className="py-1">%</th>
                  <th className="py-1">Time (min)</th>
                </tr>
              </thead>
              <tbody>
                {entries.map(([id, a]) => (
                  <tr key={id} className="border-t">
                    <td className="py-1">{a.dateAttempted}</td>
                    <td className="py-1">
                      {paperById[id].year} {paperById[id].paperType}
                    </td>
                    <td className="py-1">
                      {a.score} / {a.totalMarks}
                    </td>
                    <td className="py-1">{Math.round((a.score! / a.totalMarks!) * 100)}%</td>
                    <td className="py-1">{a.timeTakenMin ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
      {Object.values(attempts).every((a) => a.score == null) && (
        <p className="text-sm text-slate-400">
          No scored attempts yet — log scores from the Past Papers tracker.
        </p>
      )}
    </div>
  );
}
