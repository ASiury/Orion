const modalExcluirEl = document.getElementById("modalExcluir");
const senhaI = document.getElementById("senhaExclusao");
const respEl = document.getElementById("resp");

function resetModalExcluir() {
    if (senhaI) senhaI.value = "";
    if (respEl) {
        respEl.innerText = "";
        respEl.style.color = "";
    }
}

if (modalExcluirEl) {
    modalExcluirEl.addEventListener("hidden.bs.modal", resetModalExcluir);
}

function exclusao() {
    const senhaExcluir = senhaI?.value;
    const senhaProgramada = "senha123";
    const modalInstance = bootstrap.Modal.getInstance(modalExcluirEl) || new bootstrap.Modal(modalExcluirEl);

    if (senhaExcluir !== senhaProgramada) {
        if (respEl) {
            respEl.innerText = "Senha incorreta!";
            respEl.style.color = "red";
        }
        return;
    }

    const tableName = modalExcluirEl?.dataset.table;
    const itemIndex = Number(modalExcluirEl?.dataset.index);

    if (window.OrionData && tableName && Number.isInteger(itemIndex)) {
        const items = window.OrionData.getStoredItems(tableName);
        items.splice(itemIndex, 1);
        window.OrionData.setStoredItems(tableName, items);
        window.OrionData.renderTables();
    }

    modalInstance.hide();
    alert("Exclusao realizada com sucesso!");
}
