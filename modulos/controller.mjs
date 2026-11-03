import { iniciarPartida, avancarPartida, atualizarEquacao, validaResposta, getBolaFocada, setBolaFocada, getRodadaInfo } from "./model.mjs";
import { carregarRodada, focarBola, tirarBolaFocada, tirarResposta, colocarResposta, mostrarResultado, carregarTelaFim } from "./view.mjs";

const MENSAGEM_RESULTADO = {
    "incompleto": "Complete a equação antes de enviar!",
    "erro": "Incorreto, tente novamente!",
    "sucesso": "Correto!"
}

// Informa se o usuário acertou e passa para a próxima rodada ou nível
function onClickSend() {
    let resultado = validaResposta();

    if (resultado == "sucesso") {
        if (!avancarPartida()) {
            return carregarTelaFim();
        }
        carregarRodada(getRodadaInfo())
    }

    mostrarResultado(MENSAGEM_RESULTADO[resultado], resultado);
}

// Quando uma bola é clicada
function onClickBola(li) {
    let focada = getBolaFocada();

    const selec = li.firstElementChild;
    if (li.matches(".vazio")) {
        tirarResposta(li, selec);
        return;
    }
    else if (selec.matches(".selected")) {
        tirarBolaFocada(selec);
        setBolaFocada();
        return;
    }
    if (focada !== null) {
        let bolaF = document.getElementById(focada).querySelector('.bola');
        tirarBolaFocada(bolaF);
    }

    setBolaFocada(selec.getAttribute('data-value'));
    focarBola(selec);
}

// Quando um espaço vazio é clicado
function onClickVazio(li, selec) {
    if (selec) {
        colocarResposta(li, selec);
        setBolaFocada();
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
        let selec = getBolaFocada();

        let index = parseInt(opt.getAttribute('data-index'));
        if (!opt.firstChild && selec) {
            let val = parseInt(selec);
            if (atualizarEquacao(index, val)) {
                onClickVazio(opt, selec);
            }
        }
        else if (opt.firstChild && opt.firstChild.matches(".bola")) {
            if (atualizarEquacao(index, false)) {
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

        iniciarPartida(nivel, rodadas);
        carregarRodada(getRodadaInfo());
    });

    // Adiciona o evento de click no botão de enviar resposta
    let enviar = document.getElementById("botaoEnviar");
    enviar.addEventListener("click", () => {
        onClickSend();
    })

    let voltar = document.getElementById("botaoVoltar");
    voltar.addEventListener("click", () => {
        window.location.reload()
    })

    let reiniciar = document.getElementById("botaoReiniciar");
    reiniciar.addEventListener("click", () => {
        window.location.reload();
    });
}