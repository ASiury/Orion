function setUser(){
    const users = localStorageActivate();
    const email = document.getElementById('email').value.trim();
    
    // Validar se o email já está cadastrado
    if (users.some(user => user.email.toLowerCase() === email.toLowerCase())) {
        alert('Este e-mail já está cadastrado. Use outro e-mail ou faça login.');
        return;
    }

    const user = {
        name: document.getElementById('reg-name').value,
        cpf: document.getElementById('cpf').value,
        email: email,
        password: document.getElementById('reg-key').value
    };

    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    alert('Usuário cadastrado com sucesso!');

    // Salvar credenciais cadastradas para preenchimento automático
    localStorage.setItem('savedLoginEmail', email);
    localStorage.setItem('savedLoginPassword', document.getElementById('reg-key').value);
    
    document.getElementById('registerForm').reset();
    toggleForms();
}

function toggleForms() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const title = document.getElementById('formTitle');
    const subtitle = document.getElementById('formSubtitle');

    if (loginForm && registerForm) {
        loginForm.classList.toggle('d-none');
        registerForm.classList.toggle('d-none');
        
        if (title) title.innerText = loginForm.classList.contains('d-none') ? 'Novo Usuário' : 'Entrar no ORION v1.0';
        if (subtitle) subtitle.innerText = loginForm.classList.contains('d-none') ? 'Crie sua conta no ORION v1.0.' : 'Acesse sua conta para continuar.';
    }
}

function login(){
    const users = localStorageActivate();

    let usuario = users.find(user => user.email === document.getElementById('login-email').value && user.password === document.getElementById('login-key').value.trim());

    if(!usuario){
        alert('Usuário ou senha incorretos');
    } else{
        alert('Login bem sucedido');
        // Salvar usuário logado em sessionStorage
        sessionStorage.setItem('usuarioLogado', JSON.stringify(usuario));
        
        // Salvar dados de login para preenchimento automático na próxima vez
        localStorage.setItem('savedLoginEmail', document.getElementById('login-email').value);
        localStorage.setItem('savedLoginPassword', document.getElementById('login-key').value.trim());

        window.location.href = 'dashboard.html';
    }
}

function setFuncionarios(){
    const funcionarios = localStorage.getItem('funcionarios') ? JSON.parse(localStorage.getItem('funcionarios')) : [];

    const funcionario = {
        name: document.getElementById('func-name').value,
        cpf: document.getElementById('func-cpf').value,
        email: document.getElementById('func-email').value,
        function: document.getElementById('func-function').value,
        password: document.getElementById('func-key').value
    };

    funcionarios.push(funcionario);
    localStorage.setItem('funcionarios', JSON.stringify(funcionarios));

    alert('Funcionário cadastrado com sucesso!');
    document.getElementById('funcionarioForm').reset();
}

function setVeiculos(){
    const veiculos = localStorage.getItem('veiculos') ? JSON.parse(localStorage.getItem('veiculos')) : [];

    const veiculo = {
        name: document.getElementById
        ('veiculo-name').value,
        placa: document.getElementById('veiculo-placa').value,
        modelo: document.getElementById('veiculo-modelo').value,
        ano: document.getElementById('veiculo-ano').value,
        cor: document.getElementById('veiculo-cor').value
    };
    veiculos.push(veiculo);
    localStorage.setItem('veiculos', JSON.stringify(veiculos));
    alert('Veículo cadastrado com sucesso!');
    document.getElementById('veiculoForm').reset();
}


function localStorageActivate(){
    const users = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : [];
    if (!users.length) {
        const defaultUser = {
            name: 'Gerente de Logística',
            cpf: '000.000.000-00',
            email: 'gerente@tekne.com',
            password: 'Tekne123'
        };
        localStorage.setItem('users', JSON.stringify([defaultUser]));
        return [defaultUser];
    }
    return users;
}

// Preencher automaticamente o formulário de login se houver dados salvos
document.addEventListener('DOMContentLoaded', function() {
    const loginEmailInput = document.getElementById('login-email');
    const loginKeyInput = document.getElementById('login-key');

    if (loginEmailInput && loginKeyInput) {
        const savedEmail = localStorage.getItem('savedLoginEmail');
        const savedPassword = localStorage.getItem('savedLoginPassword');

        if (savedEmail) {
            loginEmailInput.value = savedEmail;
        }
        if (savedPassword) {
            loginKeyInput.value = savedPassword;
        }
    }
});