const modalExcluirEl = document.getElementById('modalExcluir');
const senhaInput = document.getElementById('senhaExclusao');
const respEl = document.getElementById('resp');

function resetModalExcluir() {
    senhaInput.value = '';
    respEl.innerText = ' ';
    respEl.style.color = '';
}

if (modalExcluirEl) {
    modalExcluirEl.addEventListener('hidden.bs.modal', resetModalExcluir);
}

function exclusao(){
    const senhaExcluir = senhaInput.value;
    const senhaProgramada = 'senha123';
    const modalInstance = bootstrap.Modal.getInstance(modalExcluirEl) || new bootstrap.Modal(modalExcluirEl);

    if (senhaExcluir === senhaProgramada) {
        modalInstance.hide();  
        alert('Exclusão realizada com sucesso!');     
    } else {
        respEl.innerText = 'Senha incorreta!';
        respEl.style.color = 'red';
    }
}