import { CONJ_TOTAL } from "./config.mjs";

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