/** Registra o envio do formulário de configuração na tela inicial. */
function iniciar() {
    const form = document.getElementById("form-config");
    if (!(form instanceof HTMLFormElement)) {
        return;
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const nivel = Number(document.getElementById("nvl-config")?.value);
        const rodadas = Number(document.getElementById("rdd-config")?.value);

        // TODO(estudo): Enviar a configuração escolhida para a página da partida e redirecionar para partida.html.
        void nivel;
        void rodadas;
    });
}

iniciar();
