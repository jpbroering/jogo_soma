// Conjunto das bolas de bilhar
const CONJ = {
    menores: [1, 2, 3, 4, 5],
    meio: [6, 7, 8, 9, 10],
    maiores: [11, 12, 13, 14, 15]
};

const CONJ_TOTAL = [...CONJ.menores, ...CONJ.meio, ...CONJ.maiores];
const CONJ_INFERIOR = [...CONJ.menores, ...CONJ.meio];

const NIVEIS = [
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

const CONFIG = {
    nivel_inicial: 0,
    rodadas_nivel: 5,

};

let temporizadorResultado;
const modeloSvgBola = new DOMParser().parseFromString(`
    <svg width="70" height="70" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <clipPath id="formato-bola">
                <circle cx="50" cy="50" r="48" />
            </clipPath>
            <radialGradient id="efeito-3d" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stop-color="white" stop-opacity="0.8" />
                <stop offset="40%" stop-color="white" stop-opacity="0" />
                <stop offset="100%" stop-color="black" stop-opacity="0.5" />
            </radialGradient>
        </defs>

        <circle cx="50" cy="50" r="48" fill="#F4F4F4" />
        <rect x="0" y="0" width="100" height="0" fill="#000000" clip-path="url(#formato-bola)" />
        <circle cx="50" cy="50" r="22" fill="#FFFFFF" />
        <text x="50" y="59" font-family="Arial, sans-serif" font-size="26" font-weight="bold" text-anchor="middle" fill="#000000">n</text>
        <circle cx="50" cy="50" r="48" fill="url(#efeito-3d)" stroke="#333" stroke-width="1.5" />
    </svg>
`, "image/svg+xml").documentElement;

function mostrarResultado(mensagem, tipo) {
    const dialogo = document.getElementById("dialogoResultado");

    dialogo.textContent = mensagem;
    dialogo.classList.remove("sucesso", "incompleto", "erro");
    dialogo.classList.add(tipo);
    dialogo.classList.add("visivel");

    clearTimeout(temporizadorResultado);
    temporizadorResultado = setTimeout(() => {
        dialogo.classList.remove("visivel");
    }, 1200);
}

function mostrarTelaFim() {
    document.getElementById("tela").style.display = "none";
    document.getElementById("dialogoResultado").classList.remove("visivel");
    clearTimeout(temporizadorResultado);

    const telaFim = document.getElementById("telaFim");
    telaFim.classList.add("aberta");
    telaFim.setAttribute("aria-hidden", "false");
    document.getElementById("botaoReiniciar").focus();
}

// TODO: Validar entrada
function defineConfig() {
    let telaConfig = document.getElementById("telaConfig");
    let tela = document.getElementById("tela");

    let nivel = parseInt(document.getElementById("nvlConfig").value);
    let rodadas = parseInt(document.getElementById("rddConfig").value);

    CONFIG.nivel_inicial = nivel;
    CONFIG.rodadas_nivel = rodadas;

    telaConfig.style.display = "none";
    tela.style.display = "flex";
    init();
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

function calculaOp(num, op) {
    switch (op) {
        case "+":
            return num;
        case "-":
            return -num;
        default:
            console.log("Operador inválido");
            return 0;
    }
}

// Dicionário com as cores base de 1 a 8, o conjunto de 9 a 15 reutiliza as cores do 1 a 7
const coresBilhar = {
    1: '#FFCC00', 2: '#0055CC', 3: '#CC0000', 4: '#4B0082',
    5: '#FF6600', 6: '#008033', 7: '#800000', 8: '#222222'
};

// TODO: Autoajustar tamanho do svg com base na tela
function gerarSvgBola(numero) {
    // Descobre a cor base (se for maior que 8, subtrai 8 para pegar a mesma cor)
    let cor = coresBilhar[numero > 8 ? numero - 8 : numero]; 
    
    // Se for maior que 8, é listrada (altura 56, Y 22). Se for menor ou igual, é lisa (altura 100, Y 0)
    let isListrada = numero > 8;
    let rectY = isListrada ? "22" : "0";
    let rectHeight = isListrada ? "56" : "100";

    let svg = modeloSvgBola.cloneNode(true);
    let rect = svg.getElementsByTagName("rect")[0];
    rect.setAttribute("y", rectY);
    rect.setAttribute("height", rectHeight);
    rect.setAttribute("fill", cor);

    let text = svg.getElementsByTagName("text")[0];
    text.innerHTML = numero;

    return svg;
}

/* Funções relacionadas ao botão de enviar */
// Retorna a lista de espaços vazios se todos tiverem preenchidos
function validaVazios() {
    let espacos = document.getElementsByClassName('espaco vazio');
    let lista = []
    for (const espaco of espacos) {
        if (!espaco.hasChildNodes()) {
            return null;
        }
        let num = parseInt(espaco.firstChild.getAttribute('data-value'));
        lista.push(num);
    }

    return lista;
}

// Atualiza o texto do nível e rodada atual
function atualizaInfo(estado) {
    nivel = document.getElementById("infoNivel");
    rodada = document.getElementById("infoRodada");

    nivel.innerHTML = `Nível ${estado.nivel_atual+1}`;
    if (estado.rodadas_nivel !== 1) {
        rodada.innerHTML = `Rodada ${estado.num_rodada}/${estado.rodadas_nivel}`;
    }
}

// Informa se o usuário acertou e passa para a próxima rodada ou nível
function onClickSend(espacos, estado) {
    let eq = estado.rodada.equacao;

    let result = eq.reduce((r, numero) => r + numero.sinal * numero.valor, 0);

    if (result == estado.rodada.resultado) {
        const concluiuNivel = estado.num_rodada == estado.rodadas_nivel;
        const concluiuJogo = concluiuNivel && estado.nivel_atual == NIVEIS.length - 1;

        if (concluiuJogo) {
            mostrarTelaFim();
            return;
        }

        if (concluiuNivel) {
            estado.num_rodada = 1;
            estado.nivel_atual++;
        }
        else {
            estado.num_rodada++;
        }
        mostrarResultado("Correto!", "sucesso");
        estado.rodada = iniciarRodada(estado.nivel_atual);
    }
    else {
        mostrarResultado("Incorreto, tente novamente!", "erro");
    }
}

/* Funções relacionadas a interação com as bolas de bilhar */
// Destaca os espaços vazios
function destacaEspacos(inverter=true) {
    espacos = document.getElementsByClassName("espaco vazio")
    for (let i = 0, l = espacos.length; i < l; i++){
        if (inverter) {
            espacos[i].classList.add("livre");
        }
        else {
            espacos[i].classList.remove("livre");
        }
    }
}

// Retorna a bola selecionada e deseleciona ela se não for nula
function tirarBolaFocada(estado) {
    let bola = estado.bola_selecionada;
    if (bola) {
        bola.classList.remove("selected");
        estado.bola_selecionada = null;
        destacaEspacos(false);
        return bola;
    }
    
    return null;
}

// Quando uma bola é clicada
function onClickBola(li, estado) {
    const selec = li.firstElementChild;
    if (li.matches(".vazio")) {
        let val = selec.getAttribute('data-value');
        li.removeChild(selec);
        document.getElementById(val).appendChild(selec);
        document.getElementById(val).classList.add("espaco");
        return;
    }

    selec.classList.add("selected");

    tirarBolaFocada(estado);
    
    if (selec.matches(".selected")) {
        estado.bola_selecionada = selec;
        destacaEspacos();
    }
}

function atualizarEquacao(index, valor, rodada) {
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

// Quando um espaço vazio é clicado
function onClickVazio(li, selec) {
    if (selec) {
        selec.parentElement.classList.remove("espaco");
        selec.parentElement.removeChild(selec);
        li.appendChild(selec);
    }
}

// Adiciona os eventos utilizados
function criarListeners(estado) {
    // Adiciona eventos de click na equação
    let listaEquacao = document.getElementById('lista_equacao');
    listaEquacao.addEventListener('click', (event)=>{
        const opt = event.target.closest('.espaco.vazio');
        if (!opt) {
            return;
        }
        let selec = estado.bola_selecionada;

        let index = parseInt(opt.getAttribute('data-index'));
        if (!opt.firstChild && selec !== null) {
            let val = parseInt(selec.getAttribute('data-value'));
            if (atualizarEquacao(index, val, estado.rodada)) {
                onClickVazio(opt, selec);
                tirarBolaFocada(estado);
            }
        }
        else if (opt.firstChild && opt.firstChild.matches(".bola")) {
            if (atualizarEquacao(index, null, estado.rodada)) {
                onClickBola(opt, estado);
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
            onClickBola(opt, estado);
        }
    });

    // Adiciona o evento de click no botão de enviar resposta
    let enviar = document.getElementById("botaoEnviar");
    enviar.addEventListener("click", (event) => {
        let espacos = validaVazios();
        if (espacos == null) {
            mostrarResultado("Complete a equação antes de enviar!", "incompleto");
            return;
        }

        onClickSend(espacos, estado);
        atualizaInfo(estado);
    })

    let voltar = document.getElementById("botaoVoltar");
    voltar.addEventListener("click", (event) => {
        window.location.reload()
    })

    let reiniciar = document.getElementById("botaoReiniciar");
    reiniciar.addEventListener("click", () => {
        window.location.reload();
    });
}

function preencherOpcoes(opcoes) {
    // Limpa elementos existentes na area de opções
    let listaOpcoes = document.getElementById('lista_opcoes');
    if (listaOpcoes.hasChildNodes()) {
        listaOpcoes.innerHTML = '';
    }
    let dictSequencia = {};
    // TODO: tratar exceções como número inexistente
    opcoes.forEach(bola => {
        let li = document.createElement('li');
        let svg = gerarSvgBola(bola);
        svg.classList.add('bola');
        svg.setAttribute('data-value', bola);
        dictSequencia[bola] = svg;
        
        li.id = bola;
        li.classList.add('espaco');
        li.appendChild(svg);

        listaOpcoes.appendChild(li);
    });

    return dictSequencia;
}

function preencherEquacao(equacao, result) {
    let listaEquacao = document.getElementById('lista_equacao');
    if (listaEquacao.hasChildNodes()) {
        listaEquacao.innerHTML = '';
    }

    let li;
    
    equacao.forEach((elemento, index) => {
        li = document.createElement('li');
        if (index != 0) {
            let sinal = elemento.sinal == 1 ? "+" : "-";
            li.classList.add('espaco_texto');
            li.innerHTML = `<span class='texto_equacao'>${sinal}</span>`;
            listaEquacao.appendChild(li);
        }
        
        li = document.createElement('li');
        if (typeof(elemento.valor) === 'number') {
            li.classList.add('espaco');
            li.appendChild(gerarSvgBola(elemento.valor));
        }

        else if (elemento.valor == null) {
            li.classList.add('espaco', 'vazio');
            li.setAttribute('data-index', index);
        }
        listaEquacao.appendChild(li);
    });

    li = document.createElement('li');
    li.classList.add('espaco_texto');
    li.innerHTML = `<span class='texto_equacao'>= ${result}</span>`;
    listaEquacao.appendChild(li);
}

function ocultarOperandos(equacao, nums) {
    let faltando = Math.floor(Math.random() * (nums.length - 1)) + 1;

    let arrFaltando = [];
    while (arrFaltando.length < faltando) {
        let n = nums.splice(randomIndex(nums), 1)[0];
        let indexEquacao = equacao.findIndex(num => num.valor == n);
        equacao[indexEquacao].valor = null
        arrFaltando.push(n);
    }
    return arrFaltando;
}

function gerarSequencia(sequencia, arrFaltando) {
    let seq = [...sequencia];

    while (seq.length > 7 - arrFaltando.length) {
        let index = randomIndex(seq);
        seq.splice(index, 1);
    }
    seq = seq.concat(arrFaltando);
    seq.sort((a, b)=>a - b);
    return seq;
}

function gerarEquacao(nivel) {
    let padrao = [...randomItem(nivel.equacao)];
    let result, nums, equacao, seq;
    do {
        seq = [...CONJ_TOTAL];
        nums = [];
        equacao = [];
        result = 0;
        op = 1; // Primeiro número sempre será positivo
        for (elem of padrao) {
            if (typeof(elem) == "string") {
                op = elem == "+" ? 1 : -1;
                continue;
            }
            
            let num = randomItem(elem, nums);
            result += num * op;
            nums.push(num);
            seq.splice(seq.indexOf(num),1);
            equacao.push({sinal: op, valor: num});
        }
    } while (nivel.resultado_positivo && result < 0);
    
    // Para ter pelo menos 1 número preenchido na equação
    let arrFaltando = ocultarOperandos(equacao, nums);
    let posicoesFixas = equacao.map(
        (n, index) => n.valor !== null ? index : false
    ).filter(num => num !== false);

    seq = gerarSequencia(seq, arrFaltando);

    return {
        equacao: equacao,               // Equação incompleta
        posicoesFixas: posicoesFixas,   // Posições fixas da equação
        resultado: result,              // Resultado da equação
        sequencia: seq                  // Opções de resposta
    };
}

function iniciarRodada(nivel) {
    let rodada = gerarEquacao(NIVEIS[nivel]);
    preencherEquacao(rodada.equacao, rodada.resultado);
    rodada.sequencia = preencherOpcoes(rodada.sequencia);

    return rodada;
}

function init() {
    const estado = {
        bola_selecionada: null,
        nivel_atual: CONFIG.nivel_inicial,
        rodadas_nivel: CONFIG.rodadas_nivel,
        num_rodada: 1,
        rodada: null
    }
    criarListeners(estado);

    estado.rodada = iniciarRodada(estado.nivel_atual);
    atualizaInfo(estado);
}
