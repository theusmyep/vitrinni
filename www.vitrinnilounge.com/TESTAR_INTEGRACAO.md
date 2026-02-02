# 🧪 Testar Integração com Google Sheets

**Tudo configurado!** Agora vamos testar se está funcionando.

---

## ✅ O que foi configurado

1. ✅ Google Apps Script publicado e rodando
2. ✅ URL configurada no site
3. ✅ Formulário simplificado (apenas Nome)
4. ✅ Horário no fuso do Brasil (agora 18:51)
5. ✅ Trigger automático para ocultar abas às 4h

---

## 🧪 Teste 1: Formulário do Evento

1. Acesse a página do evento:
   ```
   http://localhost:8080/eventos/evento-20260127-vicrime.html
   ```

2. **Digite um nome** no formulário (ex: "João Silva")

3. Clique em **"✓ Adicionar à Lista"**

4. Deve aparecer:
   ```
   ✓ Pronto! Seu nome foi adicionado à lista. Nos vemos no evento! 🎉
   ```

5. **Abra o Google Sheets:**
   https://docs.google.com/spreadsheets/d/1e4SvVMhkJkMRggY8yaaccfRpluOgh_UjWyK9fJ70NKI/edit

6. **Verifique:**
   - ✅ Existe uma aba chamada **"Segunda - 27/01/26"** (ou **"Terça - 27/01/26"** se for terça)
   - ✅ O nome aparece na coluna A
   - ✅ O horário aparece na coluna B (ex: 18:51:23)
   - ✅ O resumo no canto direito mostra "Total: 1"

---

## 🧪 Teste 2: Adicionar Mais Nomes

1. **Na mesma página**, adicione mais 2-3 nomes:
   - Maria Santos
   - Pedro Costa
   - Ana Oliveira

2. **Volte ao Google Sheets**

3. **Verifique:**
   - ✅ Todos os nomes aparecem
   - ✅ Horários diferentes para cada um
   - ✅ Total aumentou (ex: Total: 4)
   - ✅ Linhas zebradas (alternando branco/cinza)

---

## 🧪 Teste 3: Criar Nova Aba (Criar Evento)

Agora vamos testar se criar um evento novo cria uma aba automaticamente.

**Opção A: Via Admin (Recomendado)**

1. Acesse: `http://localhost:8080/admin-eventos.html`
2. Crie um novo evento para amanhã (28/01/2026)
3. Faça upload de um banner
4. Clique em "Criar Evento"
5. Abra a página do evento
6. Adicione um nome na lista
7. **Volte ao Google Sheets** - deve ter uma nova aba!

**Opção B: Via URL (Teste Manual)**

Acesse esta URL no navegador:
```
https://script.google.com/macros/s/AKfycbyftEhNVd9HrSNsYgP2DekXDKY2Y6LUViV0dX4hUVXlAx82O-cG6llIVRbRgwY7o2g/exec?acao=criar_aba&evento=Teste&data=2026-01-28
```

Deve aparecer:
```json
{
  "success": true,
  "message": "Aba \"Terça - 28/01/26\" criada com sucesso!"
}
```

**Volte ao Sheets** - nova aba criada! ✅

---

## 🧪 Teste 4: Ocultar Aba Automaticamente

**Teste Manual (não precisa esperar até 4h):**

1. Acesse esta URL:
   ```
   https://script.google.com/macros/s/AKfycbyftEhNVd9HrSNsYgP2DekXDKY2Y6LUViV0dX4hUVXlAx82O-cG6llIVRbRgwY7o2g/exec?acao=ocultar_aba&data=2026-01-27
   ```

2. Deve aparecer:
   ```json
   {
     "success": true,
     "message": "Aba \"Segunda - 27/01/26\" ocultada com sucesso!"
   }
   ```

3. **Volte ao Sheets** - a aba sumiu! (foi ocultada)

4. Para ver abas ocultadas:
   - No Sheets, clique na **seta ao lado das abas**
   - Escolha a aba ocultada
   - Clique com botão direito → **Reexibir**

---

## ✅ Checklist de Validação

Marque o que funcionou:

- [ ] Formulário envia nome sem erros
- [ ] Nome aparece no Google Sheets
- [ ] Horário está correto (fuso Brasil)
- [ ] Aba tem o nome certo (dia da semana + data)
- [ ] Resumo mostra total correto
- [ ] Criar novo evento cria nova aba
- [ ] Ocultar aba funciona

---

## 🆘 Se algo não funcionar

### ❌ Erro: "Ops! Ocorreu um erro"

**Verifique:**

1. **Apps Script está publicado?**
   - Vá no Apps Script → Implantar → Gerenciar implantações
   - Deve estar "Ativo"

2. **URL está correta?**
   - Confira se é exatamente: `AKfycbyftEhNVd9HrSNsYgP2DekXDKY2Y6LUViV0dX4hUVXlAx82O-cG6llIVRbRgwY7o2g`

3. **Permissão concedida?**
   - Executar como: "Eu"
   - Quem tem acesso: "Qualquer pessoa"

---

### ❌ Nome não aparece no Sheets

**Teste direto na URL:**
```
https://script.google.com/macros/s/AKfycbyftEhNVd9HrSNsYgP2DekXDKY2Y6LUViV0dX4hUVXlAx82O-cG6llIVRbRgwY7o2g/exec?acao=criar_aba&evento=DEBUG&data=2026-01-27
```

Se aparecer JSON com sucesso, o Apps Script está funcionando.

Se der erro, **reimplante:**
1. Apps Script → Implantar → Gerenciar implantações
2. Clique em ⚙️ → Nova versão
3. Implantar

---

### ❌ Horário errado

Verifique no Apps Script se o timezone está correto:
```javascript
const TIMEZONE = 'America/Sao_Paulo';
```

---

### ❌ Aba não é criada automaticamente

Adicione um `console.log` no formulário para ver os dados:

1. Abra a página do evento
2. Aperte F12 (Console)
3. Preencha e envie o formulário
4. Veja no console se mostra: `Dados para enviar: {...}`

---

## 🎉 Tudo Funcionando?

**Parabéns!** Agora você tem:

✅ Sistema de lista online
✅ Google Sheets integrado
✅ Formulário simples (só nome)
✅ Horário automático (fuso Brasil)
✅ Abas automáticas por evento
✅ Resumo em tempo real
✅ Remoção automática às 4h

**Próximo passo:** Criar eventos reais e começar a usar! 🚀

---

**Criado em:** 26/01/2026 às 18:51
**Status:** ✅ Configurado e pronto para uso
