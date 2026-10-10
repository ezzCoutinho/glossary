## Memória (ai-memory)

Antes de dizer que não sabe algo, ou quando o pedido citar trabalho anterior (um teste, uma decisão, "aquilo que fizemos"), procure com a ferramenta `memory_query` do MCP ai-memory. Sem saber o projeto, use `global=true`. Resultado que outro agente vai precisar vira página com `memory_write_page`.

## Skills novas

Crie em `{{SKILLS_DIR}}/<nome>/SKILL.md`, nunca na pasta de skills do próprio agente. Depois rode `node {{GLOSSARY}}/scripts/link.mjs` para os outros agentes verem.
