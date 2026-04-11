import { useNavigate } from "react-router-dom";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import {
  DollarSign, Package, Clock, BarChart3, Lock, AlertTriangle,
  MapPin, Bell, TrendingUp, TrendingDown, ArrowRight, Bot
} from "lucide-react";
import {
  kpis, stockDistribution, monthlyTrend, alerts,
  formatCurrency, formatNumber
} from "@/data/mockData";

const COLORS = [
  "hsl(213, 70%, 50%)", "hsl(142, 60%, 45%)", "hsl(38, 92%, 50%)",
  "hsl(190, 70%, 50%)", "hsl(260, 60%, 55%)", "hsl(0, 72%, 51%)",
  "hsl(170, 50%, 45%)", "hsl(320, 60%, 50%)", "hsl(45, 80%, 55%)", "hsl(200, 50%, 40%)"
];

const kpiCards = [
  { label: "Valor Total do Estoque", value: formatCurrency(kpis.totalStockValue), icon: DollarSign, trend: "+2.1%", trendUp: true, path: "/volumetry" },
  { label: "Total de Materiais", value: formatNumber(kpis.totalMaterials), icon: Package, trend: "+1.8%", trendUp: true, path: "/volumetry" },
  { label: "Valor Parado 120+ dias", value: formatCurrency(kpis.aged120PlusValue), icon: Clock, trend: `${kpis.aged120PlusPercent}%`, trendUp: false, path: "/aging" },
  { label: "Inventário Coberto", value: `${kpis.inventoryPercent}%`, icon: BarChart3, trend: "+3.2%", trendUp: true, path: "/volumetry" },
  { label: "Materiais Bloqueados", value: formatNumber(kpis.blockedMaterials), icon: Lock, trend: formatCurrency(kpis.blockedValue), trendUp: false, path: "/blocked" },
  { label: "Total em TPEC", value: formatNumber(kpis.tpecTotal), icon: AlertTriangle, trend: formatCurrency(kpis.tpecValue), trendUp: false, path: "/tpec" },
  { label: "Sem Posição de Estoque", value: formatNumber(kpis.noPositionMaterials), icon: MapPin, trend: "-5.2%", trendUp: true, path: "/wood" },
  { label: "Alertas Críticos", value: String(kpis.criticalAlerts), icon: Bell, trend: "Este mês", trendUp: false, path: "#" },
];

const trendData = monthlyTrend.map(d => ({
  month: d.month,
  total: d.value / 1_000_000_000,
  aged: d.aged / 1_000_000_000,
}));

const pieData = stockDistribution.slice(0, 6).map(d => ({
  name: d.line.length > 20 ? d.line.slice(0, 20) + "…" : d.line,
  value: d.percent,
}));

export default function OverviewPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card) => (
          <button
            key={card.label}
            onClick={() => navigate(card.path)}
            className="stat-card text-left"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <card.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex items-center gap-1 text-xs">
                {card.trendUp ? (
                  <TrendingUp className="w-3 h-3 text-success" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-destructive" />
                )}
                <span className={card.trendUp ? "text-success" : "text-destructive"}>
                  {card.trend}
                </span>
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{card.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{card.label}</p>
          </button>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Trend */}
        <div className="glass-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Evolução do Estoque</h3>
            <span className="text-xs text-muted-foreground">Últimos 9 meses</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(213, 70%, 50%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(213, 70%, 50%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradAged" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
              <XAxis dataKey="month" tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}B`} />
              <Tooltip
                contentStyle={{ background: "hsl(220, 18%, 12%)", border: "1px solid hsl(220, 14%, 18%)", borderRadius: 8, color: "hsl(210, 20%, 95%)" }}
                formatter={(v: number) => [`R$ ${v.toFixed(2)} bi`]}
              />
              <Area type="monotone" dataKey="total" stroke="hsl(213, 70%, 50%)" fill="url(#gradTotal)" strokeWidth={2} name="Total" />
              <Area type="monotone" dataKey="aged" stroke="hsl(0, 72%, 51%)" fill="url(#gradAged)" strokeWidth={2} name="Parado 120+" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie */}
        <div className="glass-card p-5">
          <h3 className="font-semibold text-foreground mb-4">Distribuição por Linha</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip
                contentStyle={{ background: "hsl(220, 18%, 12%)", border: "1px solid hsl(220, 14%, 18%)", borderRadius: 8, color: "hsl(210, 20%, 95%)" }}
                formatter={(v: number) => [`${v}%`]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {pieData.map((d, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
                  <span className="text-muted-foreground">{d.name}</span>
                </div>
                <span className="text-foreground font-medium">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Alerts */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Alertas Recentes</h3>
            <span className="text-xs text-muted-foreground">{alerts.length} alertas</span>
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                  alert.severity === "critical" ? "bg-destructive animate-pulse-glow" :
                  alert.severity === "warning" ? "bg-warning" : "bg-success"
                }`} />
                <p className="text-sm text-foreground/80 leading-relaxed">{alert.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Preview */}
        <div className="glass-card p-5 glow-blue">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Agente de IA</h3>
              <p className="text-xs text-muted-foreground">Copiloto analítico KG WATCH</p>
            </div>
          </div>
          <div className="space-y-3 mb-4">
            <div className="p-3 rounded-lg bg-secondary/50 text-sm text-foreground/80">
              <p>📊 <strong>Insight do dia:</strong> A linha de MRO concentra 39.8% de materiais acima de 120 dias que são oportunidades de redução, totalizando R$ 208 mi em potencial de liberação de capital.</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/50 text-sm text-foreground/80">
              <p>⚠️ <strong>Atenção:</strong> A meta de inventário de 80% para outubro requer aceleração — ritmo atual projeta apenas 76.5% de cobertura.</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/ai-agent")}
            className="flex items-center gap-2 text-sm text-primary font-medium hover:underline"
          >
            Abrir Agente de IA <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Top stock lines bar chart */}
      <div className="glass-card p-5">
        <h3 className="font-semibold text-foreground mb-4">Valor por Linha de Estoque</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stockDistribution.map(d => ({ ...d, valueBi: d.value / 1_000_000_000 }))} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" horizontal={false} />
            <XAxis type="number" tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}B`} />
            <YAxis type="category" dataKey="line" width={180} tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: "hsl(220, 18%, 12%)", border: "1px solid hsl(220, 14%, 18%)", borderRadius: 8, color: "hsl(210, 20%, 95%)" }}
              formatter={(v: number) => [`R$ ${v.toFixed(2)} bi`]}
            />
            <Bar dataKey="valueBi" name="Valor" radius={[0, 4, 4, 0]}>
              {stockDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
