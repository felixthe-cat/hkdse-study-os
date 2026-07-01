import { SUBJECT_ICONS, SUBJECT_LABELS, SUBJECT_ROOF_COLORS, SUBJECTS, Subject } from "@/lib/types";

export default function Village({
  coveragePctBySubject,
  selected,
  onSelect,
}: {
  coveragePctBySubject: Record<Subject, number>;
  selected: Subject | null;
  onSelect: (subject: Subject) => void;
}) {
  return (
    <div className="sv-village">
      <div className="sv-village-row">
        {SUBJECTS.map((subject) => (
          <button
            key={subject}
            type="button"
            onClick={() => onSelect(subject)}
            className={`sv-building ${selected === subject ? "selected" : ""}`}
            style={{ ["--roof-color" as string]: SUBJECT_ROOF_COLORS[subject] }}
          >
            <div className="sv-building-roof" />
            <div className="sv-building-wall">
              <div className="sv-building-icon">{SUBJECT_ICONS[subject]}</div>
              <div className="sv-building-door" />
              <div className="sv-building-label">{SUBJECT_LABELS[subject]}</div>
              <div className="sv-building-badge">{coveragePctBySubject[subject]}% grown</div>
            </div>
          </button>
        ))}
      </div>
      <div className="sv-village-path" />
    </div>
  );
}
