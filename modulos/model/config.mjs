// Conjunto das bolas de bilhar
const CONJ = {
    menores: [1, 2, 3, 4, 5],
    meio: [6, 7, 8, 9, 10],
    maiores: [11, 12, 13, 14, 15]
};

const CONJ_INFERIOR = [...CONJ.menores, ...CONJ.meio];

/** Todas as bolas de bilhar disponíveis (1 a 15). */
export const CONJ_TOTAL = [...CONJ.menores, ...CONJ.meio, ...CONJ.maiores];

export const NIVEIS = [
    {
        equacao: [[CONJ.menores, "+", CONJ.meio]],
        resultadoPositivo: true
    },
    {
        equacao: [[CONJ.meio, "-", CONJ.menores]],
        resultadoPositivo: true
    },
    {
        equacao: [[CONJ_INFERIOR, "+", CONJ_INFERIOR], [CONJ.meio, "-", CONJ.menores], 
                    [CONJ.maiores, "-", CONJ.meio]],
        resultadoPositivo: true
    },
    {
        equacao: [[CONJ_TOTAL, "+", CONJ_TOTAL], [CONJ_TOTAL, "-", CONJ_TOTAL]],
        resultadoPositivo: true
    },
    {
        equacao: [[CONJ_INFERIOR, "+", CONJ_INFERIOR], [CONJ_TOTAL, "-", CONJ_TOTAL]],
        resultadoPositivo: false
    },
    {
        equacao: [[CONJ_TOTAL, "+", CONJ_TOTAL, "+", CONJ_TOTAL], [CONJ_TOTAL, "-", CONJ_TOTAL, "-", CONJ_TOTAL]],
        resultadoPositivo: true
    },
    {
        equacao: [[CONJ_TOTAL, "+", CONJ_TOTAL, "+", CONJ_TOTAL], [CONJ_TOTAL, "-", CONJ_TOTAL, "-", CONJ_TOTAL]],
        resultadoPositivo: false
    },
];