// Retorna um index aleatorio de um array que não esteja ou não no filtro
function randomIndex(arr, filtro=[], inverterFiltro=false) {
    if (filtro.length == 0) {
        return Math.floor(Math.random() * arr.length);
    }

    let filtrado = [];
    
    arr.forEach((el, i) => {
        let contem = filtro.includes(el);

        if (inverterFiltro && contem) {
            filtrado.push(i);
        } 
        else if (!inverterFiltro && !contem) {
            filtrado.push(i);
        }
    });

    let index = filtrado[Math.floor(Math.random() * filtrado.length)];
    return index;
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