const inputs = Array.from(
    document.querySelectorAll('.celula input')
);

const botaoVerificar = document.getElementById('verificar');
const resultado = document.getElementById('resultado');


function normalizarLetra(letra) {
    return letra
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
}


function obterCelulasJogaveis() {
    return inputs;
}


function focarProximaCelula(inputAtual) {
    const celulas = obterCelulasJogaveis();

    const indiceAtual = celulas.indexOf(inputAtual);

    if (indiceAtual === -1) {
        return;
    }

    const proxima = celulas[indiceAtual + 1];

    if (proxima) {
        proxima.focus();
    }
}


function focarCelulaAnterior(inputAtual) {
    const celulas = obterCelulasJogaveis();

    const indiceAtual = celulas.indexOf(inputAtual);

    if (indiceAtual <= 0) {
        return;
    }

    celulas[indiceAtual - 1].focus();
}


inputs.forEach((input) => {

    input.addEventListener('input', (evento) => {

        let valor = evento.target.value;

        if (!valor) {
            return;
        }

        /*
         * Caso o usuário cole mais de uma letra,
         * mantemos somente a primeira.
         */
        valor = valor.charAt(0);

        evento.target.value = valor.toUpperCase();

        focarProximaCelula(evento.target);
    });


    input.addEventListener('keydown', (evento) => {

        /*
         * Backspace:
         *
         * Se a célula já estiver preenchida,
         * apaga primeiro.
         *
         * Se estiver vazia, volta para a anterior.
         */
        if (evento.key === 'Backspace') {

            if (evento.target.value) {

                evento.target.value = '';

            } else {

                focarCelulaAnterior(evento.target);

            }

            return;
        }


        /*
         * Permite apagar com Delete.
         */
        if (evento.key === 'Delete') {
            evento.target.value = '';
            return;
        }
    });

});


function verificarRespostas() {

    let acertos = 0;
    let preenchidas = 0;

    inputs.forEach((input) => {

        const resposta = input.dataset.resposta;
        const tentativa = input.value;

        if (!tentativa) {
            return;
        }

        preenchidas++;

        const respostaNormalizada =
            normalizarLetra(resposta);

        const tentativaNormalizada =
            normalizarLetra(tentativa);

        if (respostaNormalizada === tentativaNormalizada) {

            input.classList.add('correta');
            input.classList.remove('incorreta');

            acertos++;

        } else {

            input.classList.add('incorreta');
            input.classList.remove('correta');
        }
    });


    if (preenchidas === 0) {

        resultado.textContent =
            'Preencha algumas letras primeiro.';

        return;
    }


    if (acertos === inputs.length) {

        resultado.textContent =
            '🎉 Parabéns! Cruzadinha concluída!';

        return;
    }


    resultado.textContent =
        `${acertos} de ${inputs.length} letras corretas.`;
}


// Verificar automaticamente a cada input
inputs.forEach((input) => {
    input.addEventListener('input', verificarRespostas);
});