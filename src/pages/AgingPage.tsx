import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import { agingData, formatCurrency, formatNumber } from "@/data/mockData";

const COLORS = ["hsl(38, 92%, 50%)", "hsl(0, 72%, 51%)", "hsl(320, 60%, 50%)"];

export default function AgingPage() {
  const byLine = agingData.byLine.map(d => ({
    line: d.line.length > 18 ? d.line.slice(0, 18) + "…" : d.line,
    "120-180": d["120-180"] / 1_000_000,
    "181-365": d["181-365"] / 1_000_000,
    "365+": d["365+"] / 1_000_000,
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {agingData.summary.map((s, i) => (
          <div key={i} className="stat-card">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i] }} />
              <span className="text-sm text-muted-foreground">{s.range}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(s.value)}</p>
            <p className="text-sm text-muted-foreground">{formatNumber(s.items)} itens · {s.percent}%</p>
          </div>
        ))}
      </div>

      {/* By line chart */}
      <div className="glass-card p-5">
        <h3 className="font-semibold text-foreground mb-4">Aging por Linha de Estoque (R$ mi)</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={byLine} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" horizontal={false} />
            <XAxis type="number" tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="line" width={160} tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "hsl(220, 18%, 12%)", border: "1px solid hsl(220, 14%, 18%)", borderRadius: 8, color: "hsl(210, 20%, 95%)" }} formatter={(v: number) => [`R$ ${v.toFixed(0)} mi`]} />
            <Bar dataKey="120-180" name="120–180 dias" stackId="a" fill={COLORS[0]} />
            <Bar dataKey="181-365" name="181–365 dias" stackId="a" fill={COLORS[1]} />
            <Bar dataKey="365+" name="365+ dias" stackId="a" fill={COLORS[2]} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* MRO strategic vs reduction */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card p-5">
          <h3 className="font-semibold text-foreground mb-4">MRO — Estratégico vs Redução</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={[
                  { name: "Estratégico", value: agingData.mroStrategic.strategic.percent },
                  { name: "Oportunidade de redução", value: agingData.mroStrategic.reduction.percent },
                ]}
                cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value"
              >
                <Cell fill="hsl(213, 70%, 50%)" />
                <Cell fill="hsl(38, 92%, 50%)" />
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(220, 18%, 12%)", border: "1px solid hsl(220, 14%, 18%)", borderRadius: 8, color: "hsl(210, 20%, 95%)" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-2 text-sm">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-primary" /> Estratégico: {formatCurrency(agingData.mroStrategic.strategic.value)}</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-warning" /> Redução: {formatCurrency(agingData.mroStrategic.reduction.value)}</div>
          </div>
        </div>

        {/* Top materials table */}
        <div className="glass-card p-5">
          <h3 className="font-semibold text-foreground mb-4">Materiais Mais Críticos</h3>
          <div className="overflow-auto max-h-72">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted-foreground text-xs border-b border-border">
                  <th className="text-left py-2 pr-2">Código</th>
                  <th className="text-left py-2 pr-2">Descrição</th>
                  <th className="text-right py-2 pr-2">Dias</th>
                  <th className="text-right py-2">Valor</th>
                </tr>
              </thead>
              <tbody>
                {agingData.topMaterials.map((m) => (
                  <tr key={m.code} className="border-b border-border/50 hover:bg-secondary/30">
                    <td className="py-2 pr-2 font-mono text-xs text-primary">{m.code}</td>
                    <td className="py-2 pr-2 text-foreground/80 text-xs">{m.desc}</td>
                    <td className="py-2 pr-2 text-right">
                      <span className={`text-xs font-medium ${m.days > 500 ? "text-destructive" : m.days > 365 ? "text-warning" : "text-foreground"}`}>{m.days}</span>
                    </td>
                    <td className="py-2 text-right text-foreground text-xs font-medium">{formatCurrency(m.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
