# ⚠️ SEMPRE FAZER ao Adicionar Novas Imagens/Vídeos

## 🎯 Processo Rápido (2 minutos)

### 1️⃣ Adicione os Arquivos Normalmente
```bash
# Exemplo: nova foto de evento
cp ~/Downloads/nova-foto.jpg images/
```

### 2️⃣ Execute o Script de Auto-Otimização
```bash
./auto-optimize.sh
```

**Pronto!** O script vai:
- ✅ Converter automaticamente para WebP/WebM
- ✅ Manter os originais como fallback
- ✅ Deixar tudo pronto para commit

### 3️⃣ Atualize o HTML Manualmente
Se for uma foto nova, adicione no HTML assim:

```html
<picture>
    <source srcset="images/nova-foto.webp" type="image/webp">
    <img src="images/nova-foto.jpg" alt="Descrição">
</picture>
```

### 4️⃣ Commit e Push
```bash
git add .
git commit -m "Add nova foto otimizada"
git push
```

---

## 🚀 Atalho Ultra-Rápido

Para otimizar arquivo específico:

```bash
# Uma foto
./auto-optimize.sh images/nova-foto.jpg

# Múltiplos arquivos
./auto-optimize.sh images/foto1.jpg images/foto2.jpg videos/novo-video.mp4
```

---

## ❌ O que NÃO fazer

- ❌ **Não** adicione JPG/PNG sem converter para WebP
- ❌ **Não** adicione vídeos MP4 sem criar WebM
- ❌ **Não** use `<img>` direto - sempre use `<picture>` com fallback

---

## ✅ O que VAI pro GitHub

O `.gitignore` está configurado para subir:
- ✅ Imagens originais (JPG, PNG, MP4) - fallback
- ✅ Imagens otimizadas (WebP, WebM)
- ✅ Todos os HTMLs atualizados
- ❌ Backups temporários
- ❌ node_modules

---

## 🔄 Workflow Completo

```bash
# 1. Adicionar arquivos
cp ~/Downloads/*.jpg images/

# 2. Otimizar
./auto-optimize.sh

# 3. Verificar
ls -lh images/*.webp

# 4. Commit
git add images/
git commit -m "Add novas fotos otimizadas"
git push
```

---

## 🎯 Checklist Pré-Commit

Antes de fazer `git push`, sempre verifique:

- [ ] Novas imagens têm versão WebP?
- [ ] Novos vídeos têm versão WebM?
- [ ] HTMLs usam `<picture>` com fallback?
- [ ] Testou localmente? (http://localhost:8080)
- [ ] Verificou no DevTools que WebP está carregando?

---

## 📱 Para Eventos (Uso Frequente)

Se você atualiza eventos com frequência:

```bash
# Adicionar foto do evento
cp ~/Downloads/evento-sabado.jpg eventos/

# Otimizar apenas essa pasta
./auto-optimize.sh eventos/evento-sabado.jpg

# Commit rápido
git add eventos/
git commit -m "Add evento sábado"
git push
```

---

## 💡 Dica Pro

**Crie um alias no terminal:**

```bash
# Adicione isso no seu ~/.zshrc ou ~/.bashrc
alias opt='cd /Users/matheusmello/Documents/sites\ 2026/vitrinnilounge.com/www.vitrinnilounge.com && ./auto-optimize.sh'
```

Depois é só:
```bash
opt images/nova-foto.jpg
```

---

## 🆘 Se Esquecer de Otimizar

Se você já fez commit de arquivos não-otimizados:

```bash
# 1. Otimize tudo que falta
./auto-optimize.sh

# 2. Atualize HTMLs se necessário
python3 update-html-webp.py

# 3. Commit das otimizações
git add .
git commit -m "Optimize images to WebP"
git push
```

---

**Resumo:** Sempre rode `./auto-optimize.sh` antes de fazer commit! 🚀
