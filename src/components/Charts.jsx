import { CAT_COLORS } from "../lib/constants";

function polarToCartesian(cx, cy, r, angle) {
  const rad = (angle - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx, cy, r, start, end) {
  const s = polarToCartesian(cx, cy, r, end);
  const e = polarToCartesian(cx, cy, r, start);
  const large = end - start <= 180 ? 0 : 1;
  return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${large} 0 ${e.x} ${e.y} Z`;
}

/**
 * data: [{ label: string, value: number }]
 * Si todos los valores son 0 muestra placeholder.
 */
export function PieChart({ data, size = 180, formatValue = (n) => n }) {
  const total = data.reduce((s, d) => s + (d.value || 0), 0);
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;

  if (total <= 0) {
    return (
      <svg width={size} height={size} aria-hidden="true">
        <circle cx={cx} cy={cy} r={r} fill="var(--sub)" stroke="var(--border)" />
      </svg>
    );
  }

  let acc = 0;
  return (
    <svg width={size} height={size} role="img">
      {data.map((d, i) => {
        if (!d.value) return null;
        const start = (acc / total) * 360;
        acc += d.value;
        const end = (acc / total) * 360;
        const path =
          end - start >= 359.999
            ? `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.001} ${cy - r} Z`
            : arcPath(cx, cy, r, start, end);
        return (
          <path
            key={d.label}
            d={path}
            fill={CAT_COLORS[i % CAT_COLORS.length]}
            stroke="var(--card)"
            strokeWidth={1.5}
          >
            <title>{`${d.label}: ${formatValue(d.value)}`}</title>
          </path>
        );
      })}
      <circle cx={cx} cy={cy} r={r * 0.55} fill="var(--card)" />
      <text
        x={cx}
        y={cy - 4}
        textAnchor="middle"
        style={{ fontSize: 10, fontWeight: 700, fill: "var(--muted)" }}
      >
        TOTAL
      </text>
      <text
        x={cx}
        y={cy + 14}
        textAnchor="middle"
        style={{ fontSize: 14, fontWeight: 900, fill: "var(--text)" }}
      >
        {formatValue(total)}
      </text>
    </svg>
  );
}

export function PieLegend({ data, formatValue = (n) => n }) {
  const total = data.reduce((s, d) => s + (d.value || 0), 0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {data.map((d, i) => {
        if (!d.value) return null;
        const p = total > 0 ? Math.round((d.value / total) * 100) : 0;
        return (
          <div
            key={d.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 12,
              fontWeight: 700,
              color: "var(--text)",
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 3,
                background: CAT_COLORS[i % CAT_COLORS.length],
                flexShrink: 0,
              }}
            />
            <span style={{ flex: 1 }}>{d.label}</span>
            <span style={{ color: "var(--muted)", fontWeight: 600 }}>{p}%</span>
            <span>{formatValue(d.value)}</span>
          </div>
        );
      })}
    </div>
  );
}

/**
 * data: [{ label: string, value: number }]
 */
export function BarChart({ data, height = 140, color = "#7C3AED", formatValue = (n) => n }) {
  if (!data?.length) return null;
  const max = Math.max(...data.map((d) => d.value || 0), 1);
  const barWidthPct = 100 / data.length;
  return (
    <div>
      <div
        style={{
          position: "relative",
          height,
          display: "flex",
          alignItems: "flex-end",
          gap: 2,
          paddingTop: 4,
        }}
      >
        {data.map((d) => {
          const h = ((d.value || 0) / max) * (height - 24);
          return (
            <div
              key={d.label}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span style={{ fontSize: 9, fontWeight: 700, color: "var(--muted)" }}>
                {d.value ? formatValue(d.value) : ""}
              </span>
              <div
                title={`${d.label}: ${formatValue(d.value)}`}
                style={{
                  width: `calc(${barWidthPct}% - 6px)`,
                  maxWidth: 32,
                  height: Math.max(h, 2),
                  background: `linear-gradient(180deg, ${color}, ${color}AA)`,
                  borderRadius: 6,
                  minHeight: 2,
                }}
              />
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", marginTop: 6, gap: 2 }}>
        {data.map((d) => (
          <span
            key={d.label}
            style={{
              flex: 1,
              fontSize: 10,
              fontWeight: 700,
              color: "var(--muted)",
              textAlign: "center",
            }}
          >
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Barras agrupadas para comparar varias series por periodo.
 * data:   [{ label: string, values: number[] }]   (values alineado con series)
 * series: [{ name: string, color: string }]
 */
export function GroupedBarChart({ data, series = [], height = 150, formatValue = (n) => n }) {
  if (!data?.length || !series.length) return null;
  const max = Math.max(...data.flatMap((d) => d.values || []), 1);
  const barArea = height - 22;
  return (
    <div>
      <div style={{ display: "flex", gap: 16, marginBottom: 12, flexWrap: "wrap" }}>
        {series.map((s) => (
          <span key={s.name} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, color: "var(--muted)" }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: s.color, flexShrink: 0 }} />
            {s.name}
          </span>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height }}>
        {data.map((d) => (
          <div key={d.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, justifyContent: "flex-end" }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: barArea, justifyContent: "center", width: "100%" }}>
              {(d.values || []).map((v, i) => (
                <div
                  key={i}
                  title={`${series[i]?.name ?? ""}: ${formatValue(v)}`}
                  style={{
                    width: 12,
                    maxWidth: 16,
                    flex: "0 1 16px",
                    height: Math.max(((v || 0) / max) * barArea, 2),
                    background: `linear-gradient(180deg, ${series[i]?.color}, ${series[i]?.color}AA)`,
                    borderRadius: 4,
                    minHeight: 2,
                  }}
                />
              ))}
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)" }}>{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
