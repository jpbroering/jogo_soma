import * as Estado from "../model/estado.mjs";
import * as Estatisticas from "../model/estatisticas.mjs";
import * as View from "../view/view.mjs";

/** Valida a resposta atual e avança para a próxima rodada ou nível. */
function onClickSend() {
    const resultado = Estado.validaResposta();
    const mensagem = Estado.getMensagem(resultado);

    // TODO(estudo): Registrar esta tentativa nas estatísticas mantendo o modelo responsável pelos dados.
    void Estatisticas;

    if (resultado == "sucesso") {
        if (!Estado.avancarPartida()) {
            return View.toggleTelaFim();
        }
        View.carregarRodada(Estado.getInfo());
    }

    View.mostrarResultado(mensagem, resultado);
}

/** Trata o clique em uma bola (na lista de opções ou já posicionada na equação). */
function onClickBola(li) {
    const selec = li.firstElementChild;
    if (li.matches(".vazio")) {
        View.tirarResposta(li, selec);
        return;
    } else if (selec.matches(".selected")) {
        View.tirarBolaFocada();
        return;
    }

    View.mudarBolaFocada(selec);
}

/** Trata o clique em um espaço vazio da equação quando há uma bola selecionada. */
function onClickVazio(li, selec) {
    if (selec) {
        View.colocarResposta(li, selec);
    }
}

/** Registra todos os event listeners da página de partida. */
function criarListeners() {
    const listaEquacao = document.getElementById("lista-equacao");
    listaEquacao.addEventListener("click", (event) => {
        if (!(event.target instanceof Element)) {
            return;
        }
        const opt = event.target.closest(".espaco.vazio");
        if (!opt) {
            return;
        }
        const selec = View.getBolaFocada(true);

        const index = parseInt(opt.getAttribute("data-index") ?? "");
        if (!opt.firstElementChild && selec !== null) {
            if (Estado.atualizarEquacao(index, selec)) {
                onClickVazio(opt, selec);
            }
        } else if (opt.firstElementChild && opt.firstElementChild.matches(".bola")) {
            if (Estado.atualizarEquacao(index, false)) {
                onClickBola(opt);
            }
        }
    });

    const listaOpcoes = document.getElementById("lista-opcoes");
    listaOpcoes.addEventListener("click", (event) => {
        if (!(event.target instanceof Element)) {
            return;
        }
        const opt = event.target.closest("li");
        if (!opt) {
            return;
        }

        if (opt.firstElementChild && opt.firstElementChild.matches(".bola")) {
            onClickBola(opt);
        }
    });

    const enviar = document.getElementById("botao-enviar");
    enviar.addEventListener("click", () => {
        onClickSend();
    });
}

/** Inicializa a partida ao abrir partida.html. */
function iniciar() {
    criarListeners();

    // TODO(estudo): Recuperar e validar a configuração vinda da tela inicial, usando um padrão seguro se ela não existir, e iniciar a partida.
    View.carregarRodada(Estado.getInfo());
}

iniciar();
