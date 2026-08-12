// Constantes
const LINHAS = 20;
const COLUNAS = 20;
const PALAVRAS = ['CASA', 'CARRO', 'GATO', 'SOL', 'LIVRO'];

// 8 direções possíveis: cima, cima-direita, direita, baixo-direita, baixo, baixo-esquerda, esquerda, cima-esquerda
const DIRECOES = [
    { dx: 0, dy: -1, nome: 'cima' },
    { dx: 1, dy: -1, nome: 'cima-direita' },
    { dx: 1, dy: 0, nome: 'direita' },
    { dx: 1, dy: 1, nome: 'baixo-direita' },
    { dx: 0, dy: 1, nome: 'baixo' },
    { dx: -1, dy: 1, nome: 'baixo-esquerda' },
    { dx: -1, dy: 0, nome: 'esquerda' },
    { dx: -1, dy: -1, nome: 'cima-esquerda' }
];

// Matriz que representa o tabuleiro
let grade = [];

// Matriz para rastrear quais células contêm palavras (para debug visual)
let celulasComPalavras = [];

// Registro das palavras posicionadas (para debug)
let palavrasPosicionadas = [];

// Inicializa a grade como uma matriz vazia
function inicializarGrade() {
    grade = Array(LINHAS).fill(null).map(() => Array(COLUNAS).fill(null));
    celulasComPalavras = Array(LINHAS).fill(null).map(() => Array(COLUNAS).fill(false));
}

// Gera uma letra aleatória do alfabeto (A-Z)
function gerarLetraAleatoria() {
    const alfabeto = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const indiceAleatorio = Math.floor(Math.random() * alfabeto.length);
    return alfabeto[indiceAleatorio];
}

// Obtém uma direção aleatória
function obterDirecaoAleatoria() {
    const indiceAleatorio = Math.floor(Math.random() * DIRECOES.length);
    return DIRECOES[indiceAleatorio];
}

// Valida se uma palavra pode ser posicionada em uma localização específica
function validarPosicao(palavra, linha, coluna, direcao) {
    const dx = direcao.dx;
    const dy = direcao.dy;

    // Verifica se a palavra cabe dentro dos limites do tabuleiro
    for (let i = 0; i < palavra.length; i++) {
        const novaLinha = linha + dy * i;
        const novaColuna = coluna + dx * i;

        // Verifica limites
        if (novaLinha < 0 || novaLinha >= LINHAS || novaColuna < 0 || novaColuna >= COLUNAS) {
            return false;
        }

        // Verifica sobreposição: célula vazia ou mesma letra
        const letraAtual = grade[novaLinha][novaColuna];
        const letraPalavra = palavra[i];

        if (letraAtual !== null && letraAtual !== letraPalavra) {
            return false;
        }
    }

    return true;
}

// Posiciona uma palavra específica no tabuleiro
function posicionarPalavra(palavra) {
    let tentativas = 0;
    const maxTentativas = 100;

    while (tentativas < maxTentativas) {
        const linha = Math.floor(Math.random() * LINHAS);
        const coluna = Math.floor(Math.random() * COLUNAS);
        const direcao = obterDirecaoAleatoria();

        if (validarPosicao(palavra, linha, coluna, direcao)) {
            // Posiciona a palavra e marca as células
            for (let i = 0; i < palavra.length; i++) {
                const novaLinha = linha + direcao.dy * i;
                const novaColuna = coluna + direcao.dx * i;
                grade[novaLinha][novaColuna] = palavra[i];
                celulasComPalavras[novaLinha][novaColuna] = true;
            }

            // Registra para debug
            palavrasPosicionadas.push({
                palavra: palavra,
                linha: linha,
                coluna: coluna,
                direcao: direcao.nome
            });

            return true;
        }

        tentativas++;
    }

    console.warn(`Não foi possível posicionar a palavra "${palavra}" após ${maxTentativas} tentativas.`);
    return false;
}

// Posiciona todas as 5 palavras no tabuleiro
function posicionarPalavras() {
    palavrasPosicionadas = [];

    for (const palavra of PALAVRAS) {
        posicionarPalavra(palavra);
    }
}

// Preenche as células vazias com letras aleatórias
function preencherCelulasVazias() {
    for (let linha = 0; linha < LINHAS; linha++) {
        for (let coluna = 0; coluna < COLUNAS; coluna++) {
            if (grade[linha][coluna] === null) {
                grade[linha][coluna] = gerarLetraAleatoria();
            }
        }
    }
}

// Renderiza o tabuleiro no DOM a partir da grade
function renderizarTabuleiro() {
    const tabuleiroElement = document.getElementById('tabuleiro');
    tabuleiroElement.innerHTML = '';

    for (let linha = 0; linha < LINHAS; linha++) {
        for (let coluna = 0; coluna < COLUNAS; coluna++) {
            const celula = document.createElement('div');
            celula.className = 'celula';

            // Adiciona classe se a célula contém parte de uma palavra
            if (celulasComPalavras[linha][coluna]) {
                celula.classList.add('palavra');
            }

            celula.textContent = grade[linha][coluna];
            tabuleiroElement.appendChild(celula);
        }
    }
}

// Exibe as posições das palavras no console (para debug)
function exibirDebug() {
    console.group('📋 Palavras Posicionadas:');
    palavrasPosicionadas.forEach(info => {
        console.log(`${info.palavra} → linha ${info.linha}, coluna ${info.coluna}, direção ${info.direcao}`);
    });
    console.groupEnd();
}

// Inicializa o jogo completo
function inicializarJogo() {
    inicializarGrade();
    posicionarPalavras();
    preencherCelulasVazias();
    renderizarTabuleiro();
    exibirDebug();
}

// Inicializa o jogo quando o DOM está totalmente carregado
document.addEventListener('DOMContentLoaded', inicializarJogo);
