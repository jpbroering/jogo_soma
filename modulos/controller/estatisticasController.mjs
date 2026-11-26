import * as Estatisticas from "../model/estatisticas.mjs";
import * as EstatisticasView from "../view/estatisticasView.mjs";

/** Inicializa a página de estatísticas carregando os dados e registrando eventos. */
function iniciar() {
    // TODO(estudo): Obter as estatísticas do modelo e enviá-las para a view renderizar.
    void Estatisticas;
    void EstatisticasView;

    const botaoLimpar = document.getElementById("botao-limpar-estatisticas");
    if (botaoLimpar) {
        botaoLimpar.addEventListener("click", () => {
            // TODO(estudo): Limpar as estatísticas pelo modelo e atualizar a interface.
        });
    }
}

iniciar();
