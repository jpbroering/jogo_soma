import * as Estado from "../model/estado.mjs";
import * as View from "../view/view.mjs";

// Informa se o usuário acertou e passa para a próxima rodada ou nível
function onClickSend() {
    let resultado = Estado.validaResposta();
    let mensagem = Estado.getMensagem(resultado);

    if (resultado == "sucesso") {
        if (!Estado.avancarPartida()) {
            return View.toggleTelaFim();
        }
        View.carregarRodada(Estado.getInfo())
    }

    View.mostrarResultado(mensagem, resultado);
}

// Quando uma bola é clicada
function onClickBola(li) {
    const selec = li.firstElementChild;
    if (li.matches(".vazio")) {
        View.tirarResposta(li, selec);
        return;
    }
    else if (selec.matches(".selected")) {
        View.tirarBolaFocada();
        return;
    }

    View.mudarBolaFocada(selec);
}

// Quando um espaço vazio é clicado
function onClickVazio(li, selec) {
    if (selec) {
        View.colocarResposta(li, selec);
    }
}

// Adiciona os eventos utilizados
export function criarListeners() {
    // Adiciona eventos de click na equação
    let listaEquacao = document.getElementById('lista_equacao');
    listaEquacao.addEventListener('click', (event)=>{
        const opt = event.target.closest('.espaco.vazio');
        if (!opt) {
            return;
        }
        let selec = View.getBolaFocada(true);

        let index = parseInt(opt.getAttribute('data-index'));
        if (!opt.firstChild && selec !== null) {
            if (Estado.atualizarEquacao(index, selec)) {
                onClickVazio(opt, selec);
            }
        }
        else if (opt.firstChild && opt.firstChild.matches(".bola")) {
            if (Estado.atualizarEquacao(index, false)) {
                onClickBola(opt);
            }
        }
    });

    // Adiciona eventos de click nas opções de bola
    let listaOpcoes = document.getElementById('lista_opcoes');
    listaOpcoes.addEventListener('click', (event) => {
        const opt = event.target.closest('li');
        if (!opt) {
            return;
        }

        if (opt.firstChild.matches(".bola")) {
            onClickBola(opt);
        }
    });

    // Adiciona o evento de iniciar o jogo
    let form = document.getElementById('formConfig');
    form.addEventListener('submit', (event)=>{
        event.preventDefault();

        let nivel = parseInt(document.getElementById("nvlConfig").value);
        let rodadas = parseInt(document.getElementById("rddConfig").value);

        Estado.iniciarPartida(nivel, rodadas);
        View.carregarRodada(Estado.getInfo());
    });

    // Adiciona o evento de click no botão de enviar resposta
    let enviar = document.getElementById("botaoEnviar");
    enviar.addEventListener("click", () => {
        onClickSend();
    })

    let voltar = document.getElementById("botaoVoltar");
    voltar.addEventListener("click", () => {
        View.ligarConfig();
        View.ligarPartida(false);
    })

    let reiniciar = document.getElementById("botaoReiniciar");
    reiniciar.addEventListener("click", () => {
        View.toggleTelaFim()
        View.ligarConfig();
    });
}