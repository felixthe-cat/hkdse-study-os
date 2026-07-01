import { Attempt, Subject, TopicStatus } from "./types";

export type SubjectStats = {
  coveragePct: number; // confident topics / total topics
  lastScorePct: number | null;
  trend: "up" | "down" | "flat" | null;
  weak: boolean; // ponytail: P0 has no per-paper topic tagging (that's F7/P1),
  // so "weak" is approximated at subject level: avg of last 3 attempts < 60%.
};

const WEAK_THRESHOLD_PCT = 60;

function attemptPct(a: Attempt): number | null {
  if (a.score == null || !a.totalMarks) return null;
  return (a.score / a.totalMarks) * 100;
}

export function computeSubjectStats(
  subject: Subject,
  attemptsByPaperId: Record<string, Attempt>,
  paperIdsForSubject: string[],
  topicStatusByKey: Record<string, TopicStatus>,
  topicsForSubject: string[]
): SubjectStats {
  const scored = paperIdsForSubject
    .map((id) => attemptsByPaperId[id])
    .filter((a): a is Attempt => !!a && a.dateAttempted != null && attemptPct(a) != null)
    .sort((a, b) => (a.dateAttempted! < b.dateAttempted! ? -1 : 1));

  const lastScorePct = scored.length > 0 ? attemptPct(scored[scored.length - 1]) : null;

  let trend: SubjectStats["trend"] = null;
  if (scored.length >= 2) {
    const prev = attemptPct(scored[scored.length - 2])!;
    const last = attemptPct(scored[scored.length - 1])!;
    trend = last > prev ? "up" : last < prev ? "down" : "flat";
  }

  const recentPcts = scored.slice(-3).map((a) => attemptPct(a)!);
  const weak =
    recentPcts.length > 0 &&
    recentPcts.reduce((sum, p) => sum + p, 0) / recentPcts.length < WEAK_THRESHOLD_PCT;

  const total = topicsForSubject.length;
  const confident = topicsForSubject.filter(
    (t) => topicStatusByKey[`${subject}::${t}`] === "confident"
  ).length;
  const coveragePct = total === 0 ? 0 : Math.round((confident / total) * 100);

  return { coveragePct, lastScorePct, trend, weak };
}
