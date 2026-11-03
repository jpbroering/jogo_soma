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

// Retorna um svg da bola do número especificado
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

function preencherOpcoes(opcoes) {
    // Limpa elementos existentes na area de opções
    let listaOpcoes = document.getElementById('lista_opcoes');
    listaOpcoes.replaceChildren();

    opcoes.forEach(bola => {
        let li = document.createElement('li');
        let svg = gerarSvgBola(bola);
        svg.classList.add('bola');
        svg.setAttribute('data-value', bola);
        
        li.id = bola;
        li.classList.add('espaco');
        li.appendChild(svg);

        listaOpcoes.appendChild(li);
    });
}

function preencherEquacao(equacao, result) {
    let listaEquacao = document.getElementById('lista_equacao');
    listaEquacao.replaceChildren();

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

        else if (!elemento.valor) {
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

let telaConfig = document.getElementById("telaConfig");
let tela = document.getElementById("tela");

export function ligarConfig(interruptor = true) {
    telaConfig.style.display = interruptor ? "flex" : "none";
}

export function ligarPartida(interruptor = true) {
    tela.style.display = interruptor ? "flex" : "none";
}

// Destaca os espaços vazios
export function destacaEspacos(inverter=true) {
    let espacos = document.getElementsByClassName("espaco vazio")
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
export function tirarBolaFocada(bola) {
    bola.classList.remove('selected');
    destacaEspacos(false);
}

export function focarBola(bola) {
    bola.classList.add('selected');
    destacaEspacos();
}

export function tirarResposta(li, bola) {
    let val = bola.getAttribute('data-value');
    li.removeChild(bola);
    document.getElementById(val).appendChild(bola);
    document.getElementById(val).classList.add("espaco");
}

export function colocarResposta(li, bola) {
    let bolaParent = document.getElementById(bola);
    let bolaSvg = bolaParent.querySelector('.bola');
    
    bolaParent.classList.remove("espaco");
    bolaParent.removeChild(bolaSvg);

    tirarBolaFocada(bolaSvg);
    li.appendChild(bolaSvg);
}

let temporizadorResultado;

// Mostra popup do resultado
export function mostrarResultado(mensagem, tipo) {
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

// Mostra a tela de vitória
export function carregarTelaFim() {
    ligarPartida(false);
    document.getElementById("dialogoResultado").classList.remove("visivel");
    clearTimeout(temporizadorResultado);

    const telaFim = document.getElementById("telaFim");
    telaFim.classList.add("aberta");
    telaFim.setAttribute("aria-hidden", "false");
    document.getElementById("botaoReiniciar").focus();
}

// Atualiza o texto do nível e rodada atual
function atualizaInfo(num_rodada, rodadas_nivel, nivel_atual) {
    let nivel = document.getElementById("infoNivel");
    let rodada = document.getElementById("infoRodada");

    nivel.innerHTML = `Nível ${nivel_atual+1}`;
    if (rodadas_nivel !== 1) {
        rodada.innerHTML = `Rodada ${num_rodada}/${rodadas_nivel}`;
    }
}

export function carregarRodada(rodada) {
    preencherEquacao(rodada.equacao, rodada.resultado);
    preencherOpcoes(rodada.sequencia);
    atualizaInfo(rodada.num_rodada, rodada.rodadas_nivel, rodada.nivel);

    ligarConfig(false);
    ligarPartida();
}