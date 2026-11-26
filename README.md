# Jogo de Aritmética

Protótipo de jogo educativo de aritmética desenvolvido para web com HTML, CSS e JavaScript puro.

## Contexto e objetivo

Este projeto surgiu como uma demanda do **iLab**, no contexto de uma plataforma educacional voltada às dificuldades e facilidades de cada aluno, oferecendo trilhas para apoiar o desenvolvimento da aprendizagem.

O jogo foi criado como uma **prova de conceito** para testar a proposta desse tipo de atividade interativa e, ao mesmo tempo, servir como ambiente prático de ambientação e aprendizado de programação, com foco em:

- **ES Modules** (organização do código em módulos nativos do JavaScript);
- **Arquitetura MVC** (separação entre lógica de negócio, interface e controle de eventos);
- **Testes automatizados** (validação unitária com o runner nativo do Node.js).

## Como funciona

O jogador configura o **nível inicial** (1 a 7) e a **quantidade de rodadas por nível** (1 a 15). Em cada rodada:

1. Uma equação de adição e/ou subtração é gerada com valores entre **1 e 15**, representados visualmente como bolas de bilhar em SVG.
2. Parte dos operandos fica oculta na equação.
3. São exibidas **7 opções** ordenadas contendo obrigatoriamente os números necessários para completar a equação.
4. O jogador seleciona uma bola nas opções e clica no espaço vazio desejado (ou clica novamente na bola encaixada para devolvê-la).
5. Ao clicar em **Enviar Resposta**, o jogo valida se a equação está completa e correta, avançando pelas rodadas e níveis até a tela de conclusão.

### Progressão de níveis

Os conjuntos de números utilizados são: `1–5` (menores), `6–10` (meio) e `11–15` (maiores).

| Nível | Operações e intervalos | Permite resultado negativo |
| :---: | :--- | :---: |
| 1 | `(1–5) + (6–10)` | Não |
| 2 | `(6–10) - (1–5)` | Não |
| 3 | `(1–10) + (1–10)`, `(6–10) - (1–5)` ou `(11–15) - (6–10)` | Não |
| 4 | `(1–15) + (1–15)` ou `(1–15) - (1–15)` | Não |
| 5 | `(1–10) + (1–10)` ou `(1–15) - (1–15)` | Sim |
| 6 | 3 operandos de `1–15` (`a + b + c` ou `a - b - c`) | Não |
| 7 | 3 operandos de `1–15` (`a + b + c` ou `a - b - c`) | Sim |

## Arquitetura e estrutura do projeto

O código segue o padrão **MVC (Model-View-Controller)**, sem uso de frameworks ou dependências externas:

```text
.
├── index.html                   # Estrutura das telas (configuração, partida e conclusão)
├── styles.css                   # Estilização e layout das telas e componentes
├── script.js                    # Ponto de entrada que inicializa os listeners
├── imagens/
│   ├── trofeu.svg               # Ícone da tela de conclusão
│   └── voltar.svg               # Ícone do botão de retorno
├── modulos/
│   ├── model/
│   │   ├── config.mjs           # Conjuntos numéricos (1–15) e definição dos 7 níveis
│   │   ├── rodada.mjs           # Geração de equações, ocultação de operandos e sequência de opções
│   │   └── estado.mjs           # Estado da partida, validação de respostas e progressão
│   ├── view/
│   │   └── view.mjs             # Manipulação do DOM, geração dos SVGs das bolas e feedback visual
│   └── controller/
│       └── controller.mjs       # Registro de eventos e intermediação entre Model e View
└── testes/
    └── sequencia.test.mjs       # Testes unitários da geração de sequência de opções
```

- **Model (`modulos/model/`)**: concentra as regras do jogo, a configuração dos níveis, a geração aleatória das rodadas e o controle de estado/validação, sem acoplamento com o DOM.
- **View (`modulos/view/`)**: cuida da renderização da equação, das bolas de bilhar (lisas de 1 a 8 e listradas de 9 a 15 via SVG), das transições de tela e das mensagens de feedback.
- **Controller (`modulos/controller/`)**: escuta interações do usuário (formulário inicial, seleção de bolas, envio e reinício) e coordena as chamadas entre Model e View.

## Como executar localmente

Como o projeto utiliza módulos ES (`<script type="module">`), é necessário servi-lo por meio de um servidor HTTP local (abrir `index.html` diretamente via `file://` é bloqueado por CORS nos navegadores).

Exemplos na raiz do repositório:

```bash
# Com Python 3
python3 -m http.server 8000
```

```bash
# Ou com Node.js
npx serve .
```

Em seguida, acesse o endereço indicado no navegador (por exemplo, `http://localhost:8000`). Também é possível utilizar extensões como o **Live Server** no VS Code.

## Testes automatizados

Os testes utilizam o módulo nativo `node:test` e `node:assert/strict` do Node.js (v18+):

```bash
node --test
```

Os cenários em `testes/sequencia.test.mjs` verificam a função `gerarSequencia`:

- geração exata de 7 opções quando há elementos suficientes;
- ausência de valores duplicados na sequência;
- presença obrigatória dos operandos ocultos da equação;
- preservação (imutabilidade) dos arrays recebidos por parâmetro.
