import { CONJ_TOTAL, NIVEIS } from "./config.mjs";

let estado = {};

const CONFIG = {
    nivel_inicial: 0,
    rodadas_nivel: 5,
};

export function getBolaFocada() {
    return estado.bola_selecionada;
}

export function setBolaFocada(bola = null) {
    estado.bola_selecionada = bola;
}

function Estado(nivel_atual = 0) {
    this.bola_selecionada = null;
    this.nivel_atual = nivel_atual;
    this.num_rodada = 1;
    this.rodada = new Rodada(NIVEIS[nivel_atual]);
}

export function getRodadaInfo() {
    let rodada = estado.rodada;
    return {
        equacao: rodada.equacao,
        resultado: rodada.resultado,
        sequencia: rodada.sequencia,
        bola_selecionada: getBolaFocada(),
        num_rodada: estado.num_rodada,
        rodadas_nivel: CONFIG.rodadas_nivel,
        nivel: estado.nivel_atual,
    };
}

// Retorna um index aleatorio de um array que não esteja ou não no filtro
function randomIndex(arr, filtro=[], inFiltro=false) {
    if (arr.length == 0 || (filtro.length == 0 && inFiltro)) {
        return -1;
    }
    if (filtro.length == 0) {
        return Math.floor(Math.random() * arr.length);
    }

    let indexes = arr.map((num, index) => {
        let contem = filtro.includes(num);
        return contem === inFiltro ? index : false;
    });

    let filtrado = indexes.filter(num => num !== false);
    if (filtrado.length == 0) {
        return -1;
    }

    let index = filtrado[Math.floor(Math.random() * filtrado.length)];
    return index;
}

// Retorna um item aleatorio de um array que não esteja ou não no filtro
function randomItem(arr, filtro=[], inverterFiltro=false) {
    return arr[randomIndex(arr, filtro, inverterFiltro)];
}

function ocultarOperandos(equacao, nums) {
    let faltando = Math.floor(Math.random() * (nums.length - 1)) + 1;

    let arrFaltando = [];
    while (arrFaltando.length < faltando) {
        let n = nums.splice(randomIndex(nums), 1)[0];
        let indexEquacao = equacao.findIndex(num => num.valor === n);
        equacao[indexEquacao].valor = false
        arrFaltando.push(n);
    }
    return arrFaltando;
}

export function gerarSequencia(sequencia, arrFaltando) {
    let seq = [...sequencia];

    while (seq.length > 7 - arrFaltando.length) {
        let index = randomIndex(seq);
        seq.splice(index, 1);
    }
    seq = seq.concat(arrFaltando);
    seq.sort((a, b)=>a - b);
    return seq;
}

export function Rodada(nivel) {
    let padrao = [...randomItem(nivel.equacao)];
    let result, nums, equacao, seq, op;
    do {
        seq = [...CONJ_TOTAL];
        nums = [];
        equacao = [];
        result = 0;
        op = 1; // Primeiro número sempre será positivo
        for (let elem of padrao) {
            if (typeof(elem) == "string") {
                op = elem == "+" ? 1 : -1;
                continue;
            }
            
            let num = randomItem(elem, nums);
            result += num * op;
            nums.push(num);
            seq.splice(seq.indexOf(num),1);
            equacao.push({sinal: op, valor: num, pos: equacao.length});
        }
    } while (nivel.resultado_positivo && result < 0);
    
    // Para ter pelo menos 1 número preenchido na equação
    let arrFaltando = ocultarOperandos(equacao, nums);
    let posicoesFixas = equacao.filter((num) => num.valor !== false).map(v => v.pos);

    this.equacao = equacao;                             // Equação incompleta
    this.posicoesFixas = posicoesFixas;                 // Posições fixas da equação
    this.resultado = result;                            // Resultado da equação
    this.sequencia = gerarSequencia(seq, arrFaltando);  // Opções de resposta
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

// Inicia o jogo com base nas configurações selecionadas
export function iniciarPartida(nivel, rodadas) {
    CONFIG.nivel_inicial = nivel;
    CONFIG.rodadas_nivel = rodadas;
    estado = new Estado(nivel);
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
    setBolaFocada()
    estado.rodada = new Rodada(NIVEIS[estado.nivel_atual])
    return true;
}