/** Alterna entre o estado vazio e o container principal de estatísticas. */
function alternarEstadoVazio(estaVazio) {
    const avisoVazio = document.getElementById("estatisticas-vazias");
    const conteudo = document.getElementById("conteudo-estatisticas");

    avisoVazio?.classList.toggle("hidden", !estaVazio);
    conteudo?.classList.toggle("hidden", estaVazio);
}

/** Renderiza os dados de estatísticas na página ou exibe o estado vazio. */
export function renderizarEstatisticas(dados) {
    // TODO(estudo): Mostrar o estado vazio quando não houver registros ou preencher o resumo geral e a lista por nível na interface.
    void dados;
    alternarEstadoVazio(true);
}
