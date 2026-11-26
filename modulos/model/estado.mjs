import { NIVEIS } from "./config.mjs";
import { Rodada } from "./rodada.mjs";

const CONFIG = {
    nivelInicial: 0,
    rodadasNivel: 5,
};

function Estado(nivelAtual = 0) {
    this.nivelAtual = nivelAtual;
    this.numRodada = 1;
    this.rodada = new Rodada(NIVEIS[nivelAtual]);
}

let estado = new Estado();

/** Inicia o jogo com base nas configurações selecionadas. */
export function iniciarPartida(nivel, rodadas) {
    CONFIG.nivelInicial = nivel;
    CONFIG.rodadasNivel = rodadas;
    estado = new Estado(nivel);
}

/** Retorna os dados necessários para renderizar a rodada atual. */
export function getInfo() {
    let rodada = estado.rodada;
    return {
        equacao: rodada.equacao,
        resultado: rodada.resultado,
        sequencia: rodada.sequencia,
        numRodada: estado.numRodada,
        rodadasNivel: CONFIG.rodadasNivel,
        nivel: estado.nivelAtual,
    };
}

/** Atualiza o valor de uma posição editável da equação. */
export function atualizarEquacao(index, valor) {
    let rodada = estado.rodada 
    if (rodada.equacao.length == 0) {
        console.log("Equação sem valores");
        return false;
    }
    else if (index < 0 || index >= rodada.equacao.length) {
        console.log("Index fora dos limites");
        return false;
    }
    else if (rodada.posicoesFixas.includes(index)) {
        console.log("Posição não pode ser alterada")
        return false;
    }
    rodada.equacao[index].valor = valor;
    return true;
}

const MENSAGEM_RESULTADO = {
    "incompleto": "Complete a equação antes de enviar!",
    "erro": "Incorreto, tente novamente!",
    "sucesso": "Correto!"
}

/** Valida a equação da rodada atual ("incompleto", "erro" ou "sucesso"). */
export function validaResposta() {
    let rodada = estado.rodada;
    let equacao = rodada.equacao;
    let completo = equacao.every(num => num.valor !== false);
    if (!completo) {
        return "incompleto";
    }

    let resultado = equacao.reduce((soma, num) => soma + num.sinal * Number(num.valor), 0);
    if (resultado == rodada.resultado) {
        return "sucesso";
    }
    return "erro";
}

/** Retorna a mensagem exibida ao jogador para um resultado de validação. */
export function getMensagem(resultado="incompleto") {
    return MENSAGEM_RESULTADO[resultado]
}

/** Avança para a próxima rodada ou nível; retorna false se o jogo terminou. */
export function avancarPartida() {
    const concluiuNivel = estado.numRodada == CONFIG.rodadasNivel;
    const concluiuJogo = concluiuNivel && estado.nivelAtual == NIVEIS.length - 1;

    if (concluiuJogo) {
        return false;
    }

    if (concluiuNivel) {
        estado.numRodada = 1;
        estado.nivelAtual++;
    }
    else {
        estado.numRodada++;
    }
    estado.rodada = new Rodada(NIVEIS[estado.nivelAtual])
    return true;
}
