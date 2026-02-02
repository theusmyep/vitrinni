# 📊 Configurar Integração com Google Sheets

**Tempo estimado:** 10 minutos

Este guia mostra como conectar o sistema de eventos com Google Sheets para armazenar automaticamente os nomes da lista.

---

## 🎯 O que vai acontecer

✅ **Cada evento cria uma aba automaticamente** (ex: "Segunda - 27/01/26")
✅ **Formulário envia nomes direto para o Sheets**
✅ **Resumo automático** (total pessoas, sexo, confirmados)
✅ **Equipe vê os nomes facilmente** (sem precisar de Supabase)
✅ **Backup automático** em planilha online

---

## 📋 Passo 1: Abrir Google Sheets

1. Acesse: https://sheets.google.com
2. Abra a planilha que você criou (ou crie uma nova)
3. **Copie o ID da planilha** (está na URL):
   ```
   https://docs.google.com/spreadsheets/d/[ESTE_É_O_ID]/edit
   ```

Exemplo de ID: `1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t`

---

## 📝 Passo 2: Abrir Apps Script

1. Na planilha, vá em **Extensões** → **Apps Script**
2. Vai abrir uma nova aba com um editor de código
3. **Delete todo o código** que aparecer (tem um `function myFunction()...`)

---

## 💻 Passo 3: Colar o Código

1. Abra o arquivo **`GOOGLE_SHEETS_SCRIPT.js`** (está na pasta do projeto)
2. **Copie TODO o código** (Ctrl+A, Ctrl+C)
3. **Cole no Apps Script** (Ctrl+V)
4. Clique em **Salvar** (ícone de disquete) ou Ctrl+S

---

## 🚀 Passo 4: Publicar como Web App

1. No Apps Script, clique em **Implantar** (botão azul no canto superior direito)
2. Escolha **Nova implantação**
3. Clique no ícone de **engrenagem** ⚙️ ao lado de "Selecionar tipo"
4. Escolha **Aplicativo da Web**

**Configure assim:**

- **Descrição:** `Vitrinni Lounge - Sistema de Eventos`
- **Executar como:** `Eu (seu-email@gmail.com)`
- **Quem tem acesso:** `Qualquer pessoa`

5. Clique em **Implantar**

---

## 🔐 Passo 5: Autorizar Permissões

1. Vai aparecer um aviso: **"Autorização necessária"**
2. Clique em **Autorizar acesso**
3. Escolha sua conta do Google
4. Vai aparecer: **"Google não verificou este app"**
   - Clique em **Avançado**
   - Clique em **Acessar [nome do projeto] (não seguro)**
5. Clique em **Permitir**

---

## 📎 Passo 6: Copiar a URL

Depois de implantar, vai aparecer:

```
URL do aplicativo da Web:
https://script.google.com/macros/s/AKfycby.../exec
```

✅ **COPIE ESTA URL COMPLETA!**

---

## ⚙️ Passo 7: Configurar no Site

Agora volte aqui e **me passe a URL** que você copiou.

Vou configurar automaticamente:
1. ✅ Atualizar página do evento para enviar dados
2. ✅ Configurar admin para criar abas automaticamente
3. ✅ Testar a integração

---

## 🧪 Passo 8: Testar (depois que eu configurar)

1. Abra a página de um evento
2. Preencha o formulário de lista
3. Envie os dados
4. Volte para o Google Sheets
5. **Deve aparecer uma nova aba** com o nome do dia da semana e data
6. **Os dados devem estar lá!**

---

## 📊 Como vai ficar a Planilha

**Exemplo de aba: "Segunda - 27/01/26"**

| Timestamp | Nome | E-mail | Telefone | Sexo | Status |
|-----------|------|--------|----------|------|--------|
| 26/01/2026 20:30 | João Silva | joao@email.com | (21) 99999-9999 | Masculino | Confirmado |
| 26/01/2026 20:35 | Maria Santos | maria@email.com | (21) 98888-8888 | Feminino | Confirmado |

**Resumo (colunas H e I):**

```
📊 RESUMO DO EVENTO

Evento:           VICRIME
Data:             Segunda - 27/01/26
Total Pessoas:    2
Masculino:        1
Feminino:         1
Confirmados:      2
```

---

## 🔧 Configurações Avançadas (Opcional)

### Alterar ID da Planilha no Código

Se quiser fixar a planilha no código (para não precisar estar sempre na mesma):

1. No Apps Script, encontre a linha:
   ```javascript
   const SPREADSHEET_ID = '';
   ```

2. Cole o ID da planilha:
   ```javascript
   const SPREADSHEET_ID = '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t';
   ```

3. Salve (Ctrl+S)
4. **Reimplante** (Implantar → Gerenciar implantações → Editar → Nova versão → Implantar)

---

## 🆘 Problemas Comuns

### ❌ Erro: "Script function not found"

**Causa:** Código não foi salvo corretamente

**Solução:**
1. Certifique-se de colar TODO o código
2. Salve (Ctrl+S)
3. Reimplante

---

### ❌ Erro: "Unauthorized"

**Causa:** Permissões não foram concedidas

**Solução:**
1. Volte ao Apps Script
2. Clique em "Implantar" → "Gerenciar implantações"
3. Clique em ⚙️ → "Executar como: Eu"
4. Reimplante

---

### ❌ Aba não é criada automaticamente

**Causa:** URL não foi configurada no site

**Solução:**
1. Verifique se você me passou a URL do Apps Script
2. Teste manualmente acessando:
   ```
   https://script.google.com/.../exec?acao=criar_aba&evento=Teste&data=2026-01-27
   ```

---

### ❌ Dados não aparecem na planilha

**Verifique:**
1. ✅ URL está correta no site?
2. ✅ Formulário foi preenchido completamente?
3. ✅ Não tem erro no console (F12)?
4. ✅ Apps Script está implantado como "Qualquer pessoa"?

---

## 📱 Compartilhar Planilha com a Equipe

1. No Google Sheets, clique em **Compartilhar**
2. Adicione os e-mails da equipe
3. Permissão: **Editor** ou **Visualizador**
4. Envie

A equipe vai poder ver os nomes em tempo real! 📊

---

## 🎉 Pronto!

Agora você tem um sistema profissional de gestão de listas:

✅ Formulário bonito no site
✅ Dados salvos automaticamente no Sheets
✅ Equipe consegue ver os nomes facilmente
✅ Resumo automático por evento
✅ Backup em nuvem

**Me passe a URL do Apps Script para eu configurar o site!** 🚀

---

**Criado em:** Janeiro 2026
**Dificuldade:** ⭐⭐☆☆☆ (Fácil)
**Custo:** 🆓 100% Gratuito
