document.addEventListener('DOMContentLoaded', function() {
    const modalExcluir = document.getElementById('modalExcluir');
    const itemExcluirNome = document.getElementById('itemExcluirNome');

    if (modalExcluir && itemExcluirNome) {
        modalExcluir.addEventListener('show.bs.modal', function (event) {
            const button = event.relatedTarget; // Botão que acionou o modal
            const row = button.closest('tr');   // Busca a linha (tr) mais próxima do botão
            
            if (row) {
                const itemName = row.querySelector('td').textContent.trim(); // Pega o texto da primeira coluna
                itemExcluirNome.textContent = itemName; // Atualiza o texto no modal
            }
        });
    }
});