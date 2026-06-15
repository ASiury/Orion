document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('form[role="Buscar"]').forEach((form) => {
        form.addEventListener("submit", function (event) {
            event.preventDefault();
        });
    });
});
