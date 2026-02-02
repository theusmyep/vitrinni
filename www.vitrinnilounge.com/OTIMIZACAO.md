# 🚀 Guia de Otimização - Vitrinni Lounge

Sistema completo para otimização de performance do site.

## 📊 Situação Atual

- **Imagens:** 519 MB (62 arquivos)
- **Vídeos:** 110 MB (1 arquivo)
- **Total:** ~629 MB

## 🎯 Meta de Otimização

Reduzir para **200-250 MB** (economia de 60-70%)

---

## 🛠️ Scripts Disponíveis

### 1. `optimize.sh` - Otimização Completa (Primeira Vez)

Converte TODAS as imagens e vídeos do site.

```bash
./optimize.sh
```

**O que faz:**
- ✅ Cria backup dos arquivos originais
- ✅ Converte JPG/PNG → WebP (qualidade 85%)
- ✅ Converte MP4 → WebM (codec VP9)
- ✅ Preserva favicons e ícones
- ✅ Gera relatório de economia

**Tempo estimado:** 5-10 minutos

---

### 2. `update-html-references.sh` - Atualizar HTMLs

Atualiza todas as referências nos arquivos HTML.

```bash
./update-html-references.sh
```

**O que faz:**
- ✅ Cria backup dos HTMLs
- ✅ Substitui `.jpg/.png` por `.webp`
- ✅ Adiciona `<source>` WebM com fallback MP4
- ✅ Mantém compatibilidade total

---

### 3. `auto-optimize.sh` - Otimização Automática

Para otimizar novos arquivos adicionados ao site.

```bash
# Otimizar arquivos específicos
./auto-optimize.sh images/nova-foto.jpg videos/novo-video.mp4

# Otimizar tudo que ainda não foi otimizado
./auto-optimize.sh
```

**Use sempre que:**
- 📸 Adicionar novas fotos
- 🎥 Adicionar novos vídeos
- 🔄 Fazer update de eventos

---

## 📋 Passo a Passo - Primeira Otimização

### 1️⃣ Executar Otimização

```bash
cd "/Users/matheusmello/Documents/sites 2026/vitrinnilounge.com/www.vitrinnilounge.com"
./optimize.sh
```

Aguarde a conversão (5-10 min). Um backup será criado automaticamente.

### 2️⃣ Atualizar Referências

```bash
./update-html-references.sh
```

Todas as páginas HTML serão atualizadas automaticamente.

### 3️⃣ Testar o Site

```bash
# Se o servidor não estiver rodando, inicie:
python3 -m http.server 8080

# Abra no navegador:
# http://localhost:8080
```

**Checklist de Testes:**
- [ ] Todas as imagens carregam corretamente
- [ ] Vídeo de background funciona
- [ ] Galeria de eventos funciona
- [ ] Imagens responsivas no mobile
- [ ] Abrir DevTools → Network → verificar WebP/WebM

### 4️⃣ Verificar Economia

```bash
# Ver tamanho atual
du -sh images eventos videos

# Comparar com backup
du -sh originals_backup_*
```

### 5️⃣ Limpar Backups (após confirmar que tudo funciona)

```bash
# ATENÇÃO: Só execute após testar tudo!
rm -rf originals_backup_*
rm -rf html_backup_*
```

---

## 🔄 Workflow para Futuras Atualizações

Sempre que adicionar novos arquivos:

```bash
# 1. Adicione as imagens/vídeos normalmente
cp ~/Downloads/nova-foto.jpg images/

# 2. Execute auto-otimização
./auto-optimize.sh images/nova-foto.jpg

# 3. Atualize o HTML manualmente ou rode o script
# (para poucos arquivos, é mais rápido fazer manual)

# 4. Commit e deploy
git add .
git commit -m "Add nova foto otimizada"
git push
```

---

## 📦 Compatibilidade

### WebP (Imagens)
- ✅ Chrome, Edge, Firefox, Safari 14+
- ✅ 97% dos navegadores (2024)
- ⚠️ IE11 não suporta (mas pode usar fallback)

### WebM (Vídeos)
- ✅ Chrome, Firefox, Edge, Opera
- ✅ Android nativo
- ⚠️ Safari 14.1+ (partial support)
- 💡 **Solução:** Mantemos MP4 como fallback

**Código usado nos HTMLs:**
```html
<video autoplay muted loop playsinline>
    <source src="videos/video.webm" type="video/webm">
    <source src="videos/video.mp4" type="video/mp4">
</video>
```

---

## 🎨 Qualidade vs Tamanho

### Imagens WebP
- **Qualidade 85:** Ótimo balanço (recomendado)
- **Qualidade 90:** Mais qualidade, menos compressão
- **Qualidade 75:** Máxima compressão

Para ajustar, edite `optimize.sh`:
```bash
cwebp -q 85 ...  # Altere o 85 conforme necessário
```

### Vídeos WebM
- **CRF 30:** Balanceado (recomendado)
- **CRF 25:** Mais qualidade
- **CRF 35:** Mais compressão

Para ajustar, edite `optimize.sh`:
```bash
-crf 30  # Altere conforme necessário (0-51, menor = melhor)
```

---

## 🚨 Troubleshooting

### "cwebp: command not found"
```bash
brew install webp
```

### "ffmpeg: command not found"
```bash
brew install ffmpeg
```

### Imagem ficou com baixa qualidade
Aumente a qualidade no script:
```bash
cwebp -q 90 input.jpg -o output.webp
```

### Vídeo não carrega em Safari
Certifique-se de ter o fallback MP4:
```html
<source src="video.webm" type="video/webm">
<source src="video.mp4" type="video/mp4">  <!-- Fallback -->
```

---

## 📈 Métricas de Performance

Após otimização, use estas ferramentas:

1. **Google PageSpeed Insights**
   - https://pagespeed.web.dev/

2. **GTmetrix**
   - https://gtmetrix.com/

3. **WebPageTest**
   - https://www.webpagetest.org/

**Meta:** Score 90+ no PageSpeed Insights

---

## ✅ Checklist Pré-Deploy

- [ ] Executou `optimize.sh`
- [ ] Executou `update-html-references.sh`
- [ ] Testou todas as páginas localmente
- [ ] Verificou imagens no DevTools (Network)
- [ ] Testou em mobile
- [ ] Removeu backups antigos
- [ ] Adicionou `.gitignore`
- [ ] Fez commit das alterações

---

## 🎯 Próximos Passos (Deploy)

1. **Inicializar Git**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Site otimizado"
   ```

2. **Criar Repositório no GitHub**
   ```bash
   git remote add origin https://github.com/seu-usuario/vitrinnilounge.git
   git push -u origin main
   ```

3. **Deploy** (escolha uma opção)
   - Vercel (recomendado para sites estáticos)
   - Netlify
   - GitHub Pages
   - Servidor próprio

---

## 📝 Notas Importantes

- ⚠️ **Sempre faça backup** antes de otimizar
- 🔄 **Teste localmente** antes de fazer deploy
- 📱 **Teste em mobile** - WebP/WebM funcionam perfeitamente
- 🎯 **Mantenha originais** até confirmar que tudo funciona
- 🚀 **Use auto-optimize.sh** para novos arquivos

---

**Criado para Vitrinni Lounge - 2026**
