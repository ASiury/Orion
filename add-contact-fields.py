#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import re

# Ler o arquivo
with open('js/table.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Padrão para encontrar a seção de motoristas no openEditModal
pattern = r"if \(tableName === 'motoristas'\) \{\s+modalId = 'modalMoto';\s+const nameEl = document\.getElementById\('name'\);\s+const cpfEl = document\.getElementById\('cpf'\);\s+const cnhEl = document\.getElementById\('CNH'\);\s+const dataNascimentoEl = document\.getElementById\('DataNascimento'\);"

replacement = """if (tableName === 'motoristas') {
        modalId = 'modalMoto';
        const nameEl = document.getElementById('name');
        const cpfEl = document.getElementById('cpf');
        const cnhEl = document.getElementById('CNH');
        const dataNascimentoEl = document.getElementById('DataNascimento');
        const telefoneEl = document.getElementById('telefone');
        const emailEl = document.getElementById('email');"""

# Fazer a substituição
if re.search(pattern, content):
    content = re.sub(pattern, replacement, content)
    print("✅ Pattern 1 encontrado e substituído")
else:
    print("⚠️ Pattern 1 não encontrado")

# Agora substituir os atributos
old_attribs = """if (nameEl) nameEl.value = item.name || item.nome || '';
        if (cpfEl) cpfEl.value = item.cpf || '';
        if (cnhEl) cnhEl.value = item.cnh || '';
        if (dataNascimentoEl) dataNascimentoEl.value = item.dataNascimento || '';
    } else if (tableName === 'veiculos') {"""

new_attribs = """if (nameEl) nameEl.value = item.name || item.nome || '';
        if (cpfEl) cpfEl.value = item.cpf || '';
        if (cnhEl) cnhEl.value = item.cnh || '';
        if (dataNascimentoEl) dataNascimentoEl.value = item.dataNascimento || '';
        if (telefoneEl) telefoneEl.value = item.telefone || '';
        if (emailEl) emailEl.value = item.email || '';
    } else if (tableName === 'veiculos') {"""

if old_attribs in content:
    content = content.replace(old_attribs, new_attribs)
    print("✅ Pattern 2 encontrado e substituído")
else:
    print("⚠️ Pattern 2 não encontrado")

# Escrever o arquivo de volta
with open('js/table.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Arquivo table.js atualizado com sucesso!")
