const inputs = Array.from(document.querySelectorAll('.celula input'));
const botaoVerificar = document.getElementById('verificar');
const resultado = document.getElementById('resultado');

// Normalizar texto
function normalizarTexto(texto) {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

// Verifica se tudo esta preenchido
function todosOsInputsPreenchidos() {
    return inputs.every(input => input.value.trim() !== '');
}

function atualizarBotaoVerificar() {

    const tudoPreenchido =
        todosOsInputsPreenchidos();

    botaoVerificar.classList.toggle(
        'visivel',
        tudoPreenchido
    );

}

// Entrada de letras
inputs.forEach(input => {
    input.addEventListener('input', (evento) => {
        let valor = evento.target.value;

        if (!valor) {
            atualizarBotaoVerificar();
            return
        }

        // Mantem somente o primeiro caracter digitado
        valor = Array.from(valor)[0];

        evento.target.value = valor.toUpperCase();

        atualizarBotaoVerificar();
    });
});

// Backspace / delete
inputs.forEach((input) => {
    input.addEventListener('keydown', (evento) => {
        if (evento.key === 'Backspace' || evento.key === 'Delete') {
            evento.preventDefault();
            input.value = '';
            atualizarBotaoVerificar();
        }
    })

});

// Foca automaticamente na letra que esta na celula
inputs.forEach((input) => {
    input.addEventListener(
        'focus',
        () => {
            input.select();
        }
    );
});

// Conferir Respostas
function conferirRespostas() {
    let quantidadeErros = 0;

    inputs.forEach((input) => {
        const resposta = normalizarTexto(input.dataset.resposta);
        const tentativa = normalizarTexto(input.value);
        const correta = resposta === tentativa;

        // Mostrar ao usuario se esta correto ou nao
        input.classList.toggle('correta', correta);
        input.classList.toggle('incorreta', !correta);

        if (!correta) {
            quantidadeErros += 1;
        }
    });

    // Tudo correto
    if (quantidadeErros === 0) {
        resultado.textContent = '🎉 Parabéns! Você completou a cruzadinha!';
        resultado.className = 'resultado--sucesso';
        return;
    }
    // Com erro
    resultado.textContent = `Ainda existem ${quantidadeErros} resposta(s) incorreta(s).`;
    resultado.className = 'resultado--erro';

}

// Botao verificar
botaoVerificar.addEventListener('click', conferirRespostas);

// Estado inicial
atualizarBotaoVerificar();

