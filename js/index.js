function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    let soma = 0;
    let resto;
    
    for (let i = 1; i <= 9; i++) soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;

    return true;
}

document.getElementById('cpf').addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    e.target.value = value;
});

(function () {
    'use strict'
    const form = document.querySelector('.needs-validation');
    
    form.addEventListener('submit', function (event) {
        const cpfInput = document.getElementById('cpf');
        const isCpfValid = validarCPF(cpfInput.value);

        if (!isCpfValid) {
            cpfInput.setCustomValidity('CPF inválido');
        } else {
            cpfInput.setCustomValidity(''); 
        }

        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        }

        form.classList.add('was-validated');
    }, false)
})()

(function () {
    'use strict'
    const form = document.querySelector('.needs-validation');
    
    form.addEventListener('submit', function (event) {
        event.preventDefault(); 
        
        const cpfInput = document.getElementById('cpf');
        const isCpfValid = validarCPF(cpfInput.value);

        if (!isCpfValid) {
            cpfInput.setCustomValidity('CPF inválido');
        } else {
            cpfInput.setCustomValidity(''); 
        }

        if (!form.checkValidity()) {
            event.stopPropagation();
            form.classList.add('was-validated');
            return; 
        }

        form.classList.add('was-validated');

        const formData = new FormData(form);
        const dadosDoFormulario = Object.fromEntries(formData.entries());

        const btnSubmit = form.querySelector('button[type="submit"]');
        const textoOriginal = btnSubmit.innerHTML;
        btnSubmit.innerHTML = '<span class="spinner-border spinner-border-sm" aria-hidden="true"></span> Enviando...';
        btnSubmit.disabled = true;

        fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosDoFormulario)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na comunicação com o servidor');
            }
            return response.json();
        })
        .then(data => {
            alert('Cadastro realizado com sucesso! (ID simulado: ' + data.id + ')');
            
            form.reset();
            form.classList.remove('was-validated');
            
            const modalElement = document.getElementById('myModal');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) {
                modalInstance.hide();
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao enviar os dados. Tente novamente.');
        })
        .finally(() => {
            btnSubmit.innerHTML = textoOriginal;
            btnSubmit.disabled = false;
        });

    }, false)
})()