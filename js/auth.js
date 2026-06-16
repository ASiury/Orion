// Função para verificar se o usuário está autenticado
function verificarAutenticacao() {
    const usuarioLogado = sessionStorage.getItem('usuarioLogado');
    
    if (!usuarioLogado) {
        alert('Você precisa fazer login para acessar esta página.');
        window.location.href = 'login.html';
        return null;
    }
    
    return JSON.parse(usuarioLogado);
}

// Função para fazer logout
function fazerLogout() {
    sessionStorage.removeItem('usuarioLogado');
    window.location.href = 'login.html';
}

// Função para exibir informações do usuário logado
function exibirUsuarioLogado(elementId = null, perfilElementId = null) {
    const usuario = JSON.parse(sessionStorage.getItem('usuarioLogado'));
    
    if (usuario && elementId) {
        const elemento = document.getElementById(elementId);
        if (elemento) {
            elemento.textContent = usuario.name ? usuario.name : usuario.email;
        }
    }

    if (usuario && perfilElementId) {
        const perfilElemento = document.getElementById(perfilElementId);
        if (perfilElemento) {
            perfilElemento.textContent = usuario.role || 'Gerente de Logística';
        }
    }
    
    return usuario;
}

// Executar verificação de autenticação ao carregar a página (se não for login.html)
document.addEventListener('DOMContentLoaded', function() {
    // Não verificar em login.html
    if (!window.location.pathname.includes('login.html')) {
        const usuario = verificarAutenticacao();
        if (usuario) {
            exibirUsuarioLogado('usuarioAtual', 'usuarioPerfil');
        }
    }
});
