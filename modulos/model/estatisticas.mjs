// TODO(estudo): Definir a estrutura das estatísticas e como elas serão persistidas entre páginas e recarregamentos.

/** Registra o resultado de uma tentativa para o nível e a rodada informados. */
export function registrarTentativa(resultado, nivel, rodada) {
    // TODO(estudo): Atualizar e salvar a contagem de tentativas a partir do resultado, nível e rodada informados.
    void resultado;
    void nivel;
    void rodada;
}

/** Retorna os dados de estatísticas prontos para leitura pelas outras camadas. */
export function obterEstatisticas() {
    // TODO(estudo): Carregar e retornar os dados persistidos sem expor detalhes do armazenamento para fora do modelo.
    return null;
}

/** Limpa todas as estatísticas armazenadas. */
export function limparEstatisticas() {
    // TODO(estudo): Remover os dados salvos e restaurar o estado inicial das estatísticas.
}
