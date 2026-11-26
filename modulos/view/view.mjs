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

// Dicionário com as cores base de 1 a 8, o conjunto de 9 a 15 reutiliza as cores do 1 a 7
const coresBilhar = {
    1: '#FFCC00', 2: '#0055CC', 3: '#CC0000', 4: '#4B0082',
    5: '#FF6600', 6: '#008033', 7: '#800000', 8: '#222222'
};

/** Retorna um elemento SVG da bola do número especificado. */
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
    text.innerHTML = String(numero);

    return svg;
}

/** Retorna um elemento pelo id, garantindo que exista e seja do tipo esperado. */
function pegarElemento(id, Tipo = HTMLElement) {
    const elemento = document.getElementById(id);
    if (!(elemento instanceof Tipo)) {
        throw new Error(`Elemento #${id} não encontrado ou inválido.`);
    }
    return elemento;
}

/** Renderiza a lista de opções de bolas disponíveis na rodada. */
function preencherOpcoes(opcoes) {
    // Limpa elementos existentes na area de opções
    let listaOpcoes = pegarElemento('lista-opcoes', HTMLUListElement);
    listaOpcoes.replaceChildren();

    opcoes.forEach(bola => {
        let li = document.createElement('li');
        let svg = gerarSvgBola(bola);
        svg.classList.add('bola');
        svg.setAttribute('data-value', String(bola));
        
        li.id = String(bola);
        li.classList.add('espaco');
        li.appendChild(svg);

        listaOpcoes.appendChild(li);
    });
}

/** Renderiza os termos e o resultado esperado da equação. */
function preencherEquacao(equacao, result) {
    let listaEquacao = document.getElementById('lista-equacao');
    listaEquacao.replaceChildren();

    let li;
    
    equacao.forEach((elemento, index) => {
        li = document.createElement('li');
        if (index != 0) {
            let sinal = elemento.sinal == 1 ? "+" : "-";
            li.classList.add('espaco-texto');
            li.innerHTML = `<span class='texto-equacao'>${sinal}</span>`;
            listaEquacao.appendChild(li);
        }
        
        li = document.createElement('li');
        if (typeof(elemento.valor) === 'number') {
            li.classList.add('espaco');
            li.appendChild(gerarSvgBola(elemento.valor));
        }

        else if (!elemento.valor) {
            li.classList.add('espaco', 'vazio');
            li.setAttribute('data-index', String(index));
        }
        listaEquacao.appendChild(li);
    });

    li = document.createElement('li');
    li.classList.add('espaco-texto');
    li.innerHTML = `<span class='texto-equacao'>= ${result}</span>`;
    listaEquacao.appendChild(li);
}

let tela = document.getElementById("tela");
let bolaFocada = null;

/** Exibe ou oculta a tela da partida. */
export function ligarPartida(interruptor = true) {
    tela.classList.toggle("hidden", !interruptor);
}

/** Destaca ou remove o destaque dos espaços vazios da equação. */
export function destacaEspacos(inverter=true) {
    let espacos = document.getElementsByClassName("espaco vazio")
    for (let i = 0, l = espacos.length; i < l; i++){
        espacos[i].classList.toggle("livre", inverter);
    }
}

/** Define qual elemento de bola está selecionado no momento. */
export function mudarBolaFocada(bola) {
    if (bolaFocada) {
        tirarBolaFocada();
    }
    bolaFocada = bola;
    bolaFocada.classList.add('selected');
    destacaEspacos();
}

/** Remove a seleção da bola focada atual, se houver. */
export function tirarBolaFocada() {
    if (bolaFocada !== null) {
        bolaFocada.classList.remove('selected');
        destacaEspacos(false);
        bolaFocada = null;
    }
}

/** Retorna a bola focada (elemento ou valor numérico), ou null se não houver. */
export function getBolaFocada(numeric=false) {
    if (bolaFocada === null) {
        return null;
    }
    if (numeric) {
        return parseInt(bolaFocada.getAttribute('data-value') ?? "");
    }
    return bolaFocada;
}

/** Remove uma bola da equação e devolve para a lista de opções. */
export function tirarResposta(li, bola) {
    let val = bola.getAttribute('data-value');
    li.removeChild(bola);
    document.getElementById(val).appendChild(bola);
    document.getElementById(val).classList.add("espaco");
}

/** Move a bola escolhida da lista de opções para um espaço vazio da equação. */
export function colocarResposta(li, bola) {
    let bolaParent = document.getElementById(String(bola));
    let bolaSvg = bolaParent.querySelector('.bola');
    
    bolaParent.classList.remove("espaco");
    bolaParent.removeChild(bolaSvg);

    tirarBolaFocada();
    li.appendChild(bolaSvg);
}

let temporizadorResultado;

/** Mostra o popup temporário de feedback da resposta. */
export function mostrarResultado(mensagem, tipo) {
    const dialogo = pegarElemento("dialogo-resultado", HTMLDivElement);

    dialogo.textContent = mensagem;
    dialogo.classList.remove("sucesso", "incompleto", "erro");
    dialogo.classList.add(tipo);
    dialogo.classList.add("visivel");

    clearTimeout(temporizadorResultado);
    temporizadorResultado = setTimeout(() => {
        dialogo.classList.remove("visivel");
    }, 1200);
}

const telaFim = document.getElementById("tela-fim");

/** Alterna a exibição da tela de vitória. */
export function toggleTelaFim() {
    ligarPartida(false);
    document.getElementById("dialogo-resultado").classList.remove("visivel");
    clearTimeout(temporizadorResultado);

    const estaOculta = telaFim.classList.toggle("hidden");
    if (!estaOculta) {
        document.getElementById("botao-reiniciar").focus();
    }
}

/** Atualiza o texto do nível e da rodada atual no cabeçalho. */
function atualizaInfo(numRodada, rodadasNivel, nivelAtual) {
    let nivel = document.getElementById("info-nivel");
    let rodada = document.getElementById("info-rodada");

    nivel.innerHTML = `Nível ${nivelAtual+1}`;
    if (rodadasNivel !== 1) {
        rodada.innerHTML = `Rodada ${numRodada}/${rodadasNivel}`;
    }
}

/** Carrega e renderiza uma rodada completa na interface. */
export function carregarRodada(rodada) {
    tirarBolaFocada();

    preencherEquacao(rodada.equacao, rodada.resultado);
    preencherOpcoes(rodada.sequencia);
    atualizaInfo(rodada.numRodada, rodada.rodadasNivel, rodada.nivel);

    ligarPartida();
}