import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import { woodAndSeedlings, formatCurrency, formatNumber } from "@/data/mockData";

export default function WoodPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Wood Section */}
      <h2 className="text-xl font-bold text-foreground">Madeira em Campo</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat-card"><p className="text-sm text-muted-foreground">Saldo Geral</p><p className="text-2xl font-bold text-foreground">{formatCurrency(woodAndSeedlings.wood.totalBalance)}</p></div>
        <div className="stat-card"><p className="text-sm text-muted-foreground">Sem Movimentação</p><p className="text-2xl font-bold text-warning">{formatCurrency(woodAndSeedlings.wood.noMovement)}</p></div>
        <div className="stat-card"><p className="text-sm text-muted-foreground">Sem Posição</p><p className="text-2xl font-bold text-destructive">{formatNumber(woodAndSeedlings.wood.noPosition)}</p></div>
        <div className="stat-card"><p className="text-sm text-muted-foreground">Tempo Médio Parado</p><p className="text-2xl font-bold text-foreground">{woodAndSeedlings.wood.avgDaysStopped} dias</p></div>
      </div>

      <div className="glass-card p-5">
        <h3 className="font-semibold text-foreground mb-4">Madeira por Unidade</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={woodAndSeedlings.wood.byUnit.map(u => ({ ...u, unit: u.unit.replace("Unidade ", ""), valueMi: u.value / 1_000_000, noMovMi: u.noMovement / 1_000_000 }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
            <XAxis dataKey="unit" tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "hsl(220, 18%, 12%)", border: "1px solid hsl(220, 14%, 18%)", borderRadius: 8, color: "hsl(210, 20%, 95%)" }} formatter={(v: number) => [`R$ ${v.toFixed(0)} mi`]} />
            <Bar dataKey="valueMi" name="Saldo Total" fill="hsl(213, 70%, 50%)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="noMovMi" name="Sem Movimentação" fill="hsl(38, 92%, 50%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Seedlings Section */}
      <h2 className="text-xl font-bold text-foreground mt-8">Saldo de Mudas</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card"><p className="text-sm text-muted-foreground">Saldo Geral</p><p className="text-2xl font-bold text-foreground">{formatCurrency(woodAndSeedlings.seedlings.totalBalance)}</p></div>
        <div className="stat-card"><p className="text-sm text-muted-foreground">Sem Movimentação</p><p className="text-2xl font-bold text-warning">{formatCurrency(woodAndSeedlings.seedlings.noMovement)}</p></div>
        <div className="stat-card"><p className="text-sm text-muted-foreground">Sem Posição</p><p className="text-2xl font-bold text-destructive">{formatNumber(woodAndSeedlings.seedlings.noPosition)}</p></div>
      </div>

      <div className="glass-card p-5">
        <h3 className="font-semibold text-foreground mb-4">Mudas por Viveiro</h3>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-muted-foreground text-xs border-b border-border">
              <th className="text-left py-2">Viveiro</th><th className="text-right py-2">Valor</th><th className="text-right py-2">Itens</th><th className="text-right py-2">Aging Médio</th>
            </tr></thead>
            <tbody>
              {woodAndSeedlings.seedlings.byNursery.map(n => (
                <tr key={n.name} className="border-b border-border/50 hover:bg-secondary/30">
                  <td className="py-2.5 text-foreground">{n.name}</td>
                  <td className="py-2.5 text-right font-medium text-foreground">{formatCurrency(n.value)}</td>
                  <td className="py-2.5 text-right text-foreground">{formatNumber(n.items)}</td>
                  <td className="py-2.5 text-right"><span className={n.aging > 70 ? "text-destructive" : "text-foreground"}>{n.aging} dias</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
