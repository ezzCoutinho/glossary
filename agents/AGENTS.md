## Memória (ai-memory)

Antes de dizer que não sabe algo, quando o pedido citar trabalho anterior (um teste, uma decisão, "aquilo que fizemos"), ou antes de propor arquitetura ou mudar um comportamento existente, procure decisões relevantes com `memory_query` do MCP ai-memory. Sem saber o projeto, use `global=true`.

Trate a memória como histórico: confirme o conteúdo relevante nos arquivos atuais e no pedido do usuário antes de aplicá-lo.

Decisões, regras e descobertas reutilizáveis que outro agente vai precisar viram páginas com `memory_write_page`. Contexto temporário para continuar uma tarefa vai para handoff ao encerrar ou transferir a sessão, seguindo a skill de continuidade.

## Agente principal e revisão crítica

O principal conduz a tarefa até a verificação do resultado. Em tarefas complexas, explicite objetivo, restrições e critério de conclusão.

Após duas tentativas sem nova evidência ou progresso, revise a hipótese e escolha uma checagem diferente.

Quando houver decisão difícil de reverter, hipótese central sem evidência ou duas tentativas sem progresso, use um subagente crítico, se disponível. Envie objetivo, restrições, proposta, evidências e arquivos relevantes.

O crítico atua somente em leitura: procura suposições falsas, cenários que quebram a proposta ou uma solução menor que cumpra o objetivo. Para cada apontamento, indique cenário, impacto e como verificar. Pode concluir que não encontrou problemas.

O principal verifica os apontamentos e decide. Faça uma rodada; repita apenas se surgir evidência nova que mude a solução. Sem subagentes disponíveis, faça essa checagem localmente.

Ao concluir, informe o resultado entregue, como foi verificado e eventuais pendências. Em código, integre isso ao fechamento exigido pelo ponytail.

## Skills novas

Crie em `{{SKILLS_DIR}}/<nome>/SKILL.md`, nunca na pasta de skills do próprio agente. Depois rode `node {{GLOSSARY}}/scripts/link.mjs` para os outros agentes verem.
