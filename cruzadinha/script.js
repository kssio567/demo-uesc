const inputs = Array.from(
    document.querySelectorAll('.celula input')
);


const botaoVerificar =
    document.getElementById('verificar');


const resultado =
    document.getElementById('resultado');


/*
 * ============================================
 * NORMALIZAR TEXTO
 * ============================================
 *
 * Permite considerar equivalentes:
 *
 * ã = a
 * á = a
 * â = a
 * ç = c
 *
 * A normalização é utilizada SOMENTE
 * no momento da conferência.
 */
function normalizarTexto(texto) {

    return texto
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();

}


/*
 * ============================================
 * VERIFICAR SE TUDO ESTÁ PREENCHIDO
 * ============================================
 */
function todosOsInputsPreenchidos() {

    return inputs.every(
        (input) =>
            input.value.trim() !== ''
    );

}


/*
 * ============================================
 * MOSTRAR / ESCONDER BOTÃO
 * ============================================
 */
function atualizarBotaoVerificar() {

    const tudoPreenchido =
        todosOsInputsPreenchidos();


    botaoVerificar.classList.toggle(
        'visivel',
        tudoPreenchido
    );

}


/*
 * ============================================
 * ENTRADA DE LETRAS
 * ============================================
 *
 * Não existe validação aqui.
 */
inputs.forEach((input) => {

    input.addEventListener(
        'input',
        (evento) => {

            let valor =
                evento.target.value;


            /*
             * Campo vazio.
             */
            if (!valor) {

                atualizarBotaoVerificar();

                return;
            }


            /*
             * Mantém somente o primeiro
             * caractere digitado/colado.
             */
            valor =
                Array.from(valor)[0];


            /*
             * Exibe a letra em maiúsculo.
             */
            evento.target.value =
                valor.toUpperCase();


            /*
             * Apenas verifica se
             * todos os campos estão preenchidos.
             *
             * Não verifica resposta.
             */
            atualizarBotaoVerificar();

        }
    );

});


/*
 * ============================================
 * BACKSPACE / DELETE
 * ============================================
 */
inputs.forEach((input) => {

    input.addEventListener(
        'keydown',
        (evento) => {

            if (
                evento.key === 'Backspace' ||
                evento.key === 'Delete'
            ) {

                evento.preventDefault();

                input.value = '';

                atualizarBotaoVerificar();

            }

        }
    );

});


/*
 * ============================================
 * SELECIONAR LETRA AO FOCAR
 * ============================================
 *
 * Permite:
 *
 * A
 * ↓
 * usuário clica no campo
 * ↓
 * digita B
 * ↓
 * fica B
 *
 * sem precisar apagar A manualmente.
 */
inputs.forEach((input) => {

    input.addEventListener(
        'focus',
        () => {

            input.select();

        }
    );

});


/*
 * ============================================
 * CONFERIR RESPOSTAS
 * ============================================
 *
 * A validação só acontece quando
 * o usuário aperta o botão.
 */
function conferirRespostas() {

    let quantidadeErros = 0;


    inputs.forEach((input) => {

        const resposta =
            normalizarTexto(
                input.dataset.resposta
            );


        const tentativa =
            normalizarTexto(
                input.value
            );


        const correta =
            resposta === tentativa;


        /*
         * Só agora mostramos ao usuário
         * se a célula está correta ou não.
         */
        input.classList.toggle(
            'correta',
            correta
        );


        input.classList.toggle(
            'incorreta',
            !correta
        );


        if (!correta) {
            quantidadeErros += 1;
        }

    });


    /*
     * TUDO CORRETO
     */
    if (quantidadeErros === 0) {

        resultado.textContent =
            '🎉 Parabéns! Você completou a cruzadinha!';


        resultado.className =
            'resultado--sucesso';


        return;
    }


    /*
     * EXISTEM ERROS
     */
    resultado.textContent =
        `Ainda existem ${quantidadeErros} resposta(s) incorreta(s).`;


    resultado.className =
        'resultado--erro';

}


/*
 * ============================================
 * BOTÃO
 * ============================================
 */
botaoVerificar.addEventListener(
    'click',
    conferirRespostas
);


/*
 * ============================================
 * ESTADO INICIAL
 * ============================================
 */
atualizarBotaoVerificar();