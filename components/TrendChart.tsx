// ponytail: hand-rolled SVG line chart instead of pulling in a charting library —
// it's one polyline per series over a handful of points, not worth a dependency.
const WIDTH = 480;
const HEIGHT = 160;
const PAD = 24;

function rollingAverage(values: number[], window: number): number[] {
  return values.map((_, i) => {
    const slice = values.slice(Math.max(0, i - window + 1), i + 1);
    return slice.reduce((sum, v) => sum + v, 0) / slice.length;
  });
}

function toPoints(values: number[]): string {
  if (values.length === 0) return "";
  const stepX = values.length > 1 ? (WIDTH - PAD * 2) / (values.length - 1) : 0;
  return values
    .map((v, i) => {
      const x = PAD + i * stepX;
      const y = HEIGHT - PAD - (v / 100) * (HEIGHT - PAD * 2);
      return `${x},${y}`;
    })
    .join(" ");
}

export default function TrendChart({ values, labels }: { values: number[]; labels: string[] }) {
  if (values.length === 0) {
    return <p className="text-sv-text-muted italic">No scored attempts logged yet.</p>;
  }
  const avg = rollingAverage(values, 3);
  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="w-full max-w-xl bg-sv-panel-alt border-2 border-sv-border-mid"
    >
      <line x1={PAD} y1={HEIGHT - PAD} x2={WIDTH - PAD} y2={HEIGHT - PAD} stroke="#a9713f" />
      <line x1={PAD} y1={PAD} x2={PAD} y2={HEIGHT - PAD} stroke="#a9713f" />
      <polyline points={toPoints(values)} fill="none" stroke="#4c7a28" strokeWidth={3} />
      <polyline
        points={toPoints(avg)}
        fill="none"
        stroke="#c17f24"
        strokeWidth={2}
        strokeDasharray="5 4"
      />
      {values.map((v, i) => {
        const stepX = values.length > 1 ? (WIDTH - PAD * 2) / (values.length - 1) : 0;
        const x = PAD + i * stepX;
        const y = HEIGHT - PAD - (v / 100) * (HEIGHT - PAD * 2);
        return <rect key={i} x={x - 3} y={y - 3} width={6} height={6} fill="#4c7a28" />;
      })}
      <text
        x={PAD}
        y={14}
        fontSize={12}
        fill="#4a2f1c"
        fontFamily="var(--font-pixel-body), monospace"
      >
        {labels[0]}
      </text>
      <text
        x={WIDTH - PAD}
        y={14}
        fontSize={12}
        fill="#4a2f1c"
        textAnchor="end"
        fontFamily="var(--font-pixel-body), monospace"
      >
        {labels[labels.length - 1]}
      </text>
    </svg>
  );
}
