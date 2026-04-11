import {
  BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import { volumetryData, formatCurrency, formatNumber } from "@/data/mockData";

export default function VolumetryPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Monthly evolution */}
      <div className="glass-card p-5">
        <h3 className="font-semibold text-foreground mb-4">Evolução Mensal do Inventário (%)</h3>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={volumetryData.monthlyEvolution}>
            <defs>
              <linearGradient id="gradInv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(142, 60%, 45%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(142, 60%, 45%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
            <XAxis dataKey="month" tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
            <Tooltip contentStyle={{ background: "hsl(220, 18%, 12%)", border: "1px solid hsl(220, 14%, 18%)", borderRadius: 8, color: "hsl(210, 20%, 95%)" }} formatter={(v: number) => [`${v}%`]} />
            <Area type="monotone" dataKey="covered" stroke="hsl(142, 60%, 45%)" fill="url(#gradInv)" strokeWidth={2} name="Cobertura" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Lines comparison */}
      <div className="glass-card p-5">
        <h3 className="font-semibold text-foreground mb-4">Inventário por Linha — Inventariado vs Não Inventariado</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={volumetryData.lines.map(l => ({
            line: l.line.length > 18 ? l.line.slice(0, 18) + "…" : l.line,
            inventariado: l.inventoried,
            naoInventariado: l.notInventoried,
          }))} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
            <YAxis type="category" dataKey="line" width={160} tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "hsl(220, 18%, 12%)", border: "1px solid hsl(220, 14%, 18%)", borderRadius: 8, color: "hsl(210, 20%, 95%)" }} formatter={(v: number) => [`${v}%`]} />
            <Bar dataKey="inventariado" name="Inventariado" stackId="a" fill="hsl(142, 60%, 45%)" />
            <Bar dataKey="naoInventariado" name="Não Inventariado" stackId="a" fill="hsl(0, 72%, 51%)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div className="glass-card p-5">
        <h3 className="font-semibold text-foreground mb-4">Detalhamento por Linha</h3>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-muted-foreground text-xs border-b border-border">
              <th className="text-left py-2">Linha</th><th className="text-right py-2">Itens</th><th className="text-right py-2">Valor</th><th className="text-right py-2">Invent.</th><th className="text-right py-2">Base Anual</th>
            </tr></thead>
            <tbody>
              {volumetryData.lines.map(l => (
                <tr key={l.line} className="border-b border-border/50 hover:bg-secondary/30">
                  <td className="py-2.5 text-foreground">{l.line}</td>
                  <td className="py-2.5 text-right text-foreground">{formatNumber(l.items)}</td>
                  <td className="py-2.5 text-right font-medium text-foreground">{formatCurrency(l.value)}</td>
                  <td className="py-2.5 text-right"><span className={l.inventoried >= 70 ? "text-success" : "text-warning"}>{l.inventoried}%</span></td>
                  <td className="py-2.5 text-right text-foreground">{l.annualBase}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
