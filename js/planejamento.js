document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('formPlanejamento');

    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault(); 
            
            const btnSubmit = form.querySelector('button[type="submit"]');
            const textoOriginal = btnSubmit.innerHTML;
            
            btnSubmit.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin me-2"></i> Calculando...';
            btnSubmit.disabled = true;

            setTimeout(() => {
                btnSubmit.innerHTML = textoOriginal;
                btnSubmit.disabled = false;
                
                alert("Rota calculada com sucesso!");
            }, 1500);
        });
    }
});

function voltarParaDashboard() {
    window.history.back();
}