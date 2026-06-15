const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'js', 'table.js');
let content = fs.readFileSync(filePath, 'utf8');

// Replace the openEditModal function for motoristas
const oldPattern = `const dataNascimentoEl = document.getElementById('DataNascimento');

        if (nameEl) nameEl.value = item.name || item.nome || '';
        if (cpfEl) cpfEl.value = item.cpf || '';
        if (cnhEl) cnhEl.value = item.cnh || '';
        if (dataNascimentoEl) dataNascimentoEl.value = item.dataNascimento || '';
    } else if (tableName === 'veiculos') {`;

const newPattern = `const dataNascimentoEl = document.getElementById('DataNascimento');
        const telefoneEl = document.getElementById('telefone');
        const emailEl = document.getElementById('email');

        if (nameEl) nameEl.value = item.name || item.nome || '';
        if (cpfEl) cpfEl.value = item.cpf || '';
        if (cnhEl) cnhEl.value = item.cnh || '';
        if (dataNascimentoEl) dataNascimentoEl.value = item.dataNascimento || '';
        if (telefoneEl) telefoneEl.value = item.telefone || '';
        if (emailEl) emailEl.value = item.email || '';
    } else if (tableName === 'veiculos') {`;

if (content.includes(oldPattern)) {
    content = content.replace(oldPattern, newPattern);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('✅ Arquivo atualizado com sucesso!');
} else {
    console.log('⚠️ Padrão não encontrado. Tentando abordagem alternativa...');
}
