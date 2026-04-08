// Sistema de geração de IDs para motoristas
class MotoristaIdGenerator {
    constructor() {
        this.storageKey = 'motoristas_data';
        this.initializarDados();
    }

    initializarDados() {
        const dadosExistentes = localStorage.getItem(this.storageKey);
        if (!dadosExistentes) {
            const dadosPadroes = {
                proximoId: 1,
                motoristas: []
            };
            localStorage.setItem(this.storageKey, JSON.stringify(dadosPadroes));
        }
    }

    gerarIdMotorista() {
        const dados = JSON.parse(localStorage.getItem(this.storageKey));
        const novoId = `M-${String(dados.proximoId).padStart(3, '0')}`;
        dados.proximoId += 1;
        localStorage.setItem(this.storageKey, JSON.stringify(dados));
        return novoId;
    }

    obterIdMotoristaAtual() {
        const dados = JSON.parse(localStorage.getItem(this.storageKey));
        if (dados.motoristas.length === 0) {
            return this.gerarIdMotorista();
        }
        return dados.motoristas[dados.motoristas.length - 1].id;
    }

    adicionarMotorista(nome, cpf, telefone) {
        const dados = JSON.parse(localStorage.getItem(this.storageKey));
        const novoMotorista = {
            id: this.gerarIdMotorista(),
            nome: nome,
            cpf: cpf,
            telefone: telefone,
            dataCriacao: new Date().toISOString()
        };
        dados.motoristas.push(novoMotorista);
        localStorage.setItem(this.storageKey, JSON.stringify(dados));
        return novoMotorista;
    }

    obterTodosMotoristas() {
        const dados = JSON.parse(localStorage.getItem(this.storageKey));
        return dados.motoristas;
    }

    obterMotoristaAtual() {
        const dados = JSON.parse(localStorage.getItem(this.storageKey));
        if (dados.motoristas.length === 0) {
            return this.adicionarMotorista('Motorista Padrão', '', '');
        }
        return dados.motoristas[dados.motoristas.length - 1];
    }
}

// Instanciar o gerador
const idGenerator = new MotoristaIdGenerator();

// Preencher ID do motorista na página de controle de rotas
document.addEventListener('DOMContentLoaded', function() {
    const motoristaPrincipal = idGenerator.obterMotoristaAtual();
    
    // Preencher campo de ID motorista usando o ID do elemento
    const idMotoristaElement = document.getElementById('idMotorista');
    if (idMotoristaElement) {
        idMotoristaElement.textContent = motoristaPrincipal.id;
    }
});
