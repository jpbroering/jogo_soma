---
name: estudo-guiado
description: Ativar SOMENTE quando o usuário pedir explicitamente "estudo guiado", "modo aprendizado" ou "com TODOs". Não ativar em tarefas comuns de implementação direta.
---

# Modo de Estudo Guiado

Ao implementar uma funcionalidade neste modo:

1. **Separe o braçal da fricção produtiva:** gere apenas as partes repetitivas/mecânicas e deixe a lógica central e decisões importantes para o usuário.
2. **Boilerplates e contratos:** inclua tipos, interfaces ou estruturas prontas apenas se já estiverem decididos, forem estritamente necessários para o código compilar ou beneficiarem o aprendizado; caso contrário, deixe-os em aberto para o usuário definir.
3. **Blocos `TODO` sem spoiler:** marque cada ponto de fricção produtiva com `TODO(estudo):` seguido de **uma frase** descrevendo *o objetivo* ou *o problema* a resolver — nunca entregue o algoritmo ou o passo a passo da implementação no comentário.
4. **Respeite o contexto do usuário:** consulte a memória disponível (ex.: `ai-memory`) para evitar criar `TODO`s sobre tópicos que não são foco do usuário ou que ele já domina.
5. **Pare e revise:** após preparar os blocos, aguarde o usuário implementar. Quando ele concluir, atue como revisor de código (apontando bugs, clareza e casos de borda) sem sobrescrever a solução dele sem permissão.
