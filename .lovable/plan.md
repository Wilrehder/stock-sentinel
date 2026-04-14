

## Plano: Remover "Hub" do nome na sidebar

### Mudança
No arquivo `src/components/DashboardLayout.tsx`, linha 40, alterar de:
```
Smart <span className="gradient-text">Kapital Hub</span>
```
Para:
```
Smart <span className="gradient-text">Kapital</span>
```

Isso remove apenas a palavra "Hub" do nome exibido na barra lateral, mantendo fonte, tamanho e estilo inalterados.

**Nota:** Esta mudança será combinada com as demais pendentes do plano anterior (substituição de logos, renomeação do agente, fundo gradiente, remoção da logo SGS duplicada no header).

