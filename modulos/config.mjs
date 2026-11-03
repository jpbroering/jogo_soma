// Conjunto das bolas de bilhar
const CONJ = {
    menores: [1, 2, 3, 4, 5],
    meio: [6, 7, 8, 9, 10],
    maiores: [11, 12, 13, 14, 15]
};

const CONJ_INFERIOR = [...CONJ.menores, ...CONJ.meio];

export const CONJ_TOTAL = [...CONJ.menores, ...CONJ.meio, ...CONJ.maiores];

export const NIVEIS = [
    {
        equacao: [[CONJ.menores, "+", CONJ.meio]],
        resultado_positivo: true
    },
    {
        equacao: [[CONJ.meio, "-", CONJ.menores]],
        resultado_positivo: true
    },
    {
        equacao: [[CONJ_INFERIOR, "+", CONJ_INFERIOR], [CONJ.meio, "-", CONJ.menores], 
                    [CONJ.maiores, "-", CONJ.meio]],
        resultado_positivo: true
    },
    {
        equacao: [[CONJ_TOTAL, "+", CONJ_TOTAL], [CONJ_TOTAL, "-", CONJ_TOTAL]],
        resultado_positivo: true
    },
    {
        equacao: [[CONJ_INFERIOR, "+", CONJ_INFERIOR], [CONJ_TOTAL, "-", CONJ_TOTAL]],
        resultado_positivo: false
    },
    {
        equacao: [[CONJ_TOTAL, "+", CONJ_TOTAL, "+", CONJ_TOTAL], [CONJ_TOTAL, "-", CONJ_TOTAL, "-", CONJ_TOTAL]],
        resultado_positivo: true
    },
    {
        equacao: [[CONJ_TOTAL, "+", CONJ_TOTAL, "+", CONJ_TOTAL], [CONJ_TOTAL, "-", CONJ_TOTAL, "-", CONJ_TOTAL]],
        resultado_positivo: false
    },
];