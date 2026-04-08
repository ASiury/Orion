document.addEventListener("DOMContentLoaded", function() {
    const input = document.getElementById("myInput");
    const table = document.getElementById("myTable");
    
    if (!input || !table) return;

    input.addEventListener("keyup", function() {
        const filter = input.value.toUpperCase();
        const tbody = table.getElementsByTagName("tbody")[0];
        
        if (!tbody) return;
        
        const rows = tbody.getElementsByTagName("tr");

        for (let i = 0; i < rows.length; i++) {
            const rowText = rows[i].textContent || rows[i].innerText;
            
            if (rowText.toUpperCase().indexOf(filter) > -1) {
                rows[i].style.display = ""; 
            } else {
                rows[i].style.display = "none"; 
            }
        }
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const searchInputVeiculos = document.getElementById("myInputVeiculos");
    if (searchInputVeiculos) {
        searchInputVeiculos.addEventListener("keyup", function() {
            const filterValue = this.value.toLowerCase();
            const tableRows = document.querySelectorAll("#tableVeiculos tbody tr");            
            
            tableRows.forEach(row => {
                row.style.display = row.textContent.toLowerCase().includes(filterValue) ? "" : "none";
            });
        });
    }
});

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