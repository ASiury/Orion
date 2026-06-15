function setUser(){
    const users = localStorageActivate();

    const user = {
        name: document.getElementById('reg-name').value,
        cpf: document.getElementById('cpf').value,
        email: document.getElementById('email').value,
        function: document.getElementById('function').value,
        password: document.getElementById('reg-key').value
    };

    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    alert('Usuário cadastrado com sucesso!');
    
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
        
        if (title) title.innerText = loginForm.classList.contains('d-none') ? 'Novo Usuário' : 'Entrar no ORION';
        if (subtitle) subtitle.innerText = loginForm.classList.contains('d-none') ? 'Crie sua conta no ORION.' : 'Acesse sua conta para continuar.';
    }
}

function login(){
    const users = localStorageActivate();

    let usuario = users.find(user => user.name === document.getElementById('name').value && user.password === document.getElementById('key').value.trim());

    if(!usuario){
        alert('Usuário ou senha incorretos');
    } else{
        alert('Login bem sucedido');
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
    return users;
}