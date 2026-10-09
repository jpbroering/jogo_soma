import test from 'node:test';
import assert from 'node:assert/strict';
import { gerarSequencia } from '../modulos/sequencia.mjs';

test("sequência não contém exatamente sete elementos", () => {
    let seq = gerarSequencia([1,2,3,4,5,6,7,8,9,10,11,12,13], [14,15]);
    assert.equal(seq.length, 7);

    seq = gerarSequencia([1,2,3,4,5], [14,15]);
    assert.equal(seq.length, 7);

    seq = gerarSequencia([1,2,3,4], [14,15]);
    assert.notEqual(seq.length, 7);
});

test("valores repetidos na sequência", () => {
    let seq = gerarSequencia([1,2,3,4,5,6,7,8,9,10,11,12,13], [14,15]);
    assert.equal(new Set(seq).size, seq.length);
});

test("Os valores ocultos da equação não estão na sequência", () => {
    let arrFaltando = [14, 15];
    let seq = gerarSequencia([1,2,3,4,5,6,7,8,9,10,11,12,13], arrFaltando);
    assert.equal(arrFaltando.every(num => seq.includes(num)), true);
});

test("Função modifica Array recebido", () => {
    let arrFaltando = [14, 15];
    let faltOriginal = [...arrFaltando];
    let sequencia = [1,2,3,4,5,6,7,8,9,10,11,12,13];
    let seqOriginal = [...sequencia];
    gerarSequencia(sequencia, arrFaltando);
    assert.deepEqual(
        sequencia,
        seqOriginal,
        "O parâmetro 'sequencia' foi alterado"
    );
    assert.deepEqual(
        arrFaltando,
        faltOriginal,
        "O parâmetro 'sequencia' foi alterado"
    );
});