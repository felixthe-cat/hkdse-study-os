export type Paper = {
  id: string;
  subject: string;
  subjectLabel: string;
  year: number;
  paperType: string;
};

export type AttemptStatus = "not_started" | "attempted" | "reviewed";

export type Attempt = {
  status: AttemptStatus;
  score?: number;
  totalMarks?: number;
  timeTakenMin?: number;
  dateAttempted?: string; // YYYY-MM-DD
};

export type TopicStatus = "not_started" | "studying" | "confident";

export type DayListCategory = "Homework" | "Revision" | "Other";

export type DayListItem = {
  id: string;
  text: string;
  category: DayListCategory;
  date: string; // YYYY-MM-DD, item belongs to this day
  done: boolean;
};

export const SUBJECTS = [
  "Chemistry",
  "Chinese_Language",
  "English_Language",
  "Geography",
  "Mathematics",
  "Physics",
] as const;

export type Subject = (typeof SUBJECTS)[number];

export const SUBJECT_LABELS: Record<Subject, string> = {
  Chemistry: "Chemistry",
  Chinese_Language: "Chinese Language",
  English_Language: "English Language",
  Geography: "Geography",
  Mathematics: "Mathematics",
  Physics: "Physics",
};

// ponytail: placeholder topics, no official syllabus source was provided yet.
// Swap these arrays for the real HKDSE syllabus breakdown per subject.
export const SYLLABUS_TOPICS: Record<Subject, string[]> = {
  Chemistry: ["Placeholder topic 1", "Placeholder topic 2", "Placeholder topic 3"],
  Chinese_Language: ["Placeholder topic 1", "Placeholder topic 2", "Placeholder topic 3"],
  English_Language: ["Placeholder topic 1", "Placeholder topic 2", "Placeholder topic 3"],
  Geography: ["Placeholder topic 1", "Placeholder topic 2", "Placeholder topic 3"],
  Mathematics: ["Placeholder topic 1", "Placeholder topic 2", "Placeholder topic 3"],
  Physics: ["Placeholder topic 1", "Placeholder topic 2", "Placeholder topic 3"],
};
