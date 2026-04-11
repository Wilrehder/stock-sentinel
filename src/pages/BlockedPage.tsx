import {
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import { blockedData, formatCurrency, formatNumber } from "@/data/mockData";

const REASON_COLORS = ["hsl(0, 72%, 51%)", "hsl(38, 92%, 50%)", "hsl(213, 70%, 50%)", "hsl(260, 60%, 55%)", "hsl(190, 70%, 50%)"];

export default function BlockedPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl font-bold text-foreground">Materiais Bloqueados</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card"><p className="text-sm text-muted-foreground">Total Bloqueado</p><p className="text-2xl font-bold text-foreground">{formatNumber(blockedData.blocked.total)}</p></div>
        <div className="stat-card"><p className="text-sm text-muted-foreground">Valor Total</p><p className="text-2xl font-bold text-destructive">{formatCurrency(blockedData.blocked.value)}</p></div>
        <div className="stat-card"><p className="text-sm text-muted-foreground">Motivos Distintos</p><p className="text-2xl font-bold text-foreground">{blockedData.blocked.byReason.length}</p></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card p-5">
          <h3 className="font-semibold text-foreground mb-4">Por Motivo de Bloqueio</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={blockedData.blocked.byReason.map(r => ({ name: r.reason, value: r.value / 1_000_000 }))} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {REASON_COLORS.map((c, i) => <Cell key={i} fill={c} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(220, 18%, 12%)", border: "1px solid hsl(220, 14%, 18%)", borderRadius: 8, color: "hsl(210, 20%, 95%)" }} formatter={(v: number) => [`R$ ${v.toFixed(0)} mi`]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {blockedData.blocked.byReason.map((r, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ background: REASON_COLORS[i] }} /><span className="text-muted-foreground">{r.reason}</span></div>
                <span className="text-foreground font-medium">{formatCurrency(r.value)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-5">
          <h3 className="font-semibold text-foreground mb-4">Bloqueados por Unidade</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={blockedData.blocked.byUnit.map(u => ({ unit: u.unit.replace("Unidade ", ""), valorMi: u.value / 1_000_000 }))} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" horizontal={false} />
              <XAxis type="number" tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="unit" width={100} tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "hsl(220, 18%, 12%)", border: "1px solid hsl(220, 14%, 18%)", borderRadius: 8, color: "hsl(210, 20%, 95%)" }} formatter={(v: number) => [`R$ ${v.toFixed(0)} mi`]} />
              <Bar dataKey="valorMi" fill="hsl(0, 72%, 51%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Reversals */}
      <h2 className="text-xl font-bold text-foreground mt-8">Estorno de Movimentações</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card"><p className="text-sm text-muted-foreground">Total Estornos</p><p className="text-2xl font-bold text-foreground">{formatNumber(blockedData.reversals.total)}</p></div>
        <div className="stat-card"><p className="text-sm text-muted-foreground">Impacto Financeiro</p><p className="text-2xl font-bold text-warning">{formatCurrency(blockedData.reversals.value)}</p></div>
        <div className="stat-card"><p className="text-sm text-muted-foreground">Recorrentes (3+)</p><p className="text-2xl font-bold text-destructive">{formatNumber(blockedData.reversals.recurrent)}</p></div>
      </div>

      <div className="glass-card p-5">
        <h3 className="font-semibold text-foreground mb-4">Estornos — Evolução Mensal</h3>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={blockedData.reversals.byPeriod.map(p => ({ ...p, valorMi: p.value / 1_000_000 }))}>
            <defs>
              <linearGradient id="gradRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
            <XAxis dataKey="month" tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "hsl(220, 18%, 12%)", border: "1px solid hsl(220, 14%, 18%)", borderRadius: 8, color: "hsl(210, 20%, 95%)" }} />
            <Area type="monotone" dataKey="valorMi" stroke="hsl(38, 92%, 50%)" fill="url(#gradRev)" strokeWidth={2} name="R$ mi" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
