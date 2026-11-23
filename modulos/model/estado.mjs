import { NIVEIS } from "./config.mjs";
import { Rodada } from "./rodada.mjs";

let estado = {};

const CONFIG = {
    nivel_inicial: 0,
    rodadas_nivel: 5,
};

function Estado(nivel_atual = 0) {
    this.nivel_atual = nivel_atual;
    this.num_rodada = 1;
    this.rodada = new Rodada(NIVEIS[nivel_atual]);
}

// Inicia o jogo com base nas configurações selecionadas
export function iniciarPartida(nivel, rodadas) {
    CONFIG.nivel_inicial = nivel;
    CONFIG.rodadas_nivel = rodadas;
    estado = new Estado(nivel);
}

export function getInfo() {
    let rodada = estado.rodada;
    return {
        equacao: rodada.equacao,
        resultado: rodada.resultado,
        sequencia: rodada.sequencia,
        num_rodada: estado.num_rodada,
        rodadas_nivel: CONFIG.rodadas_nivel,
        nivel: estado.nivel_atual,
    };
}

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

// Valida a equação da rodada e retorna um String dependendo da resposta
export function validaResposta() {
    let rodada = estado.rodada;
    let equacao = rodada.equacao;
    let completo = equacao.every(num => num.valor !== false);
    if (!completo) {
        return "incompleto";
    }

    let resultado = equacao.reduce((soma, num) => soma + num.sinal * num.valor, 0);
    if (resultado == rodada.resultado) {
        return "sucesso";
    }
    return "erro";
}

export function getMensagem(resultado="incompleto") {
    return MENSAGEM_RESULTADO[resultado]
}

// Avança para a próxima rodada/nível retornando true se for possível e false se o jogo acabou
export function avancarPartida() {
    const concluiuNivel = estado.num_rodada == CONFIG.rodadas_nivel;
    const concluiuJogo = concluiuNivel && estado.nivel_atual == NIVEIS.length - 1;

    if (concluiuJogo) {
        return false;
    }

    if (concluiuNivel) {
        estado.num_rodada = 1;
        estado.nivel_atual++;
    }
    else {
        estado.num_rodada++;
    }
    estado.rodada = new Rodada(NIVEIS[estado.nivel_atual])
    return true;
}
