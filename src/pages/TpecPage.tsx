import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import { tpecData, formatCurrency, formatNumber } from "@/data/mockData";

export default function TpecPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card"><p className="text-sm text-muted-foreground">Total de Materiais</p><p className="text-2xl font-bold text-foreground">{formatNumber(tpecData.total)}</p></div>
        <div className="stat-card"><p className="text-sm text-muted-foreground">Valor Total</p><p className="text-2xl font-bold text-foreground">{formatCurrency(tpecData.totalValue)}</p></div>
        <div className="stat-card"><p className="text-sm text-muted-foreground">Tempo Médio</p><p className="text-2xl font-bold text-warning">{tpecData.avgDays} dias</p></div>
      </div>

      <div className="glass-card p-5">
        <h3 className="font-semibold text-foreground mb-4">TPEC por Unidade</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={tpecData.byUnit.map(u => ({ unit: u.unit.replace("Unidade ", ""), itens: u.items, valorMi: u.value / 1_000_000 }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
            <XAxis dataKey="unit" tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "hsl(220, 18%, 12%)", border: "1px solid hsl(220, 14%, 18%)", borderRadius: 8, color: "hsl(210, 20%, 95%)" }} />
            <Bar dataKey="valorMi" name="Valor (R$ mi)" fill="hsl(38, 92%, 50%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="glass-card p-5">
        <h3 className="font-semibold text-foreground mb-4">Materiais Mais Antigos em TPEC</h3>
        <table className="w-full text-sm">
          <thead><tr className="text-muted-foreground text-xs border-b border-border">
            <th className="text-left py-2">Código</th><th className="text-left py-2">Descrição</th><th className="text-left py-2">Unidade</th><th className="text-right py-2">Dias</th><th className="text-right py-2">Valor</th>
          </tr></thead>
          <tbody>
            {tpecData.topMaterials.map(m => (
              <tr key={m.code} className="border-b border-border/50 hover:bg-secondary/30">
                <td className="py-2.5 font-mono text-xs text-primary">{m.code}</td>
                <td className="py-2.5 text-foreground/80 text-xs">{m.desc}</td>
                <td className="py-2.5 text-muted-foreground text-xs">{m.unit}</td>
                <td className="py-2.5 text-right"><span className="text-destructive font-medium">{m.days}</span></td>
                <td className="py-2.5 text-right font-medium text-foreground">{formatCurrency(m.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
