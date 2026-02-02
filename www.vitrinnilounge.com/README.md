# 🍺 Vitrinni Lounge Beer - Site Oficial

Site institucional da Vitrinni Lounge Beer, a melhor casa noturna da Barra da Tijuca, Rio de Janeiro.

## 🚀 Performance

Site otimizado com **80% de redução** no tamanho dos arquivos:

- ✅ Imagens em **WebP** com fallback para JPG/PNG
- ✅ Vídeos em **WebM** com fallback para MP4
- ✅ Compatibilidade total com todos os navegadores
- ✅ **150 MB** (antes: 769 MB)

## 📁 Estrutura do Projeto

```
www.vitrinnilounge.com/
├── images/              # Imagens (WebP + JPG/PNG fallback)
├── eventos/             # Banners de eventos
├── videos/              # Vídeos (WebM + MP4 fallback)
├── css/                 # Estilos
├── js/                  # Scripts
│   └── events-manager.js # Sistema de eventos dinâmicos
├── data/
│   └── events.json      # Banco de dados de eventos
├── *.html               # Páginas do site
├── auto-optimize.sh     # Script de otimização automática
└── SEMPRE-FAZER.md      # Guia de workflow
```

## 🌐 Páginas Principais

- `index.html` - Home principal
- `home1.html` - Versão alternativa minimalista
- `home2.html` - Versão alternativa moderna
- `vitrinni.html` - Sobre a casa
- `camarotes.html` - Camarotes VIP
- `aniversario.html` - Festas de aniversário
- `corporativos.html` - Eventos corporativos
- `normas.html` - Normas e restrições
- `admin-eventos.html` - Painel de admin (eventos)

## 🛠️ Desenvolvimento Local

### Iniciar servidor local

```bash
python3 -m http.server 8080
```

Acesse: http://localhost:8080

### Adicionar Novas Imagens/Vídeos

**SEMPRE otimize antes de fazer commit:**

```bash
# 1. Adicione os arquivos
cp ~/Downloads/nova-foto.jpg images/

# 2. Otimize automaticamente
./auto-optimize.sh

# 3. Commit
git add .
git commit -m "Add nova foto otimizada"
git push
```

📖 **Leia:** [SEMPRE-FAZER.md](./SEMPRE-FAZER.md) para workflow completo

## 🎨 Sistema de Eventos

O site possui um sistema dinâmico de eventos que carrega automaticamente de `data/events.json`.

### Adicionar Novo Evento

1. Acesse: http://localhost:8080/admin-eventos.html
2. Preencha o formulário
3. Clique em "Adicionar Evento"
4. Faça commit do `events.json` atualizado

### Formato do Evento

```json
{
  "title": "Nome do Evento",
  "date": "2026-02-15",
  "slug": "nome-do-evento",
  "bannerHome": "eventos/banner-home.jpg",
  "bannerEvent": "eventos/banner-evento.jpg",
  "active": true
}
```

## 📦 Scripts Disponíveis

### `auto-optimize.sh`
Otimiza automaticamente imagens e vídeos para WebP/WebM.

```bash
# Otimizar tudo
./auto-optimize.sh

# Otimizar arquivos específicos
./auto-optimize.sh images/foto.jpg videos/video.mp4
```

### `convert-now.sh`
Conversão completa de todos os arquivos (já executado).

### `update-html-webp.py`
Atualiza HTMLs com tags `<picture>` (já executado).

## 🚀 Deploy

### GitHub Pages

```bash
# 1. Criar repositório no GitHub
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/seu-usuario/vitrinnilounge.git
git push -u origin main

# 2. Configurar GitHub Pages
# Settings → Pages → Source: main branch
```

### Vercel / Netlify

Basta conectar o repositório GitHub - deploy automático!

## 🎯 Recursos

- ✅ Design responsivo (mobile-first)
- ✅ Performance otimizada (WebP/WebM)
- ✅ Sistema de eventos dinâmico
- ✅ Múltiplas versões de home page
- ✅ Integração WhatsApp
- ✅ Integração Google Maps / Waze / Uber
- ✅ Galeria de fotos (Slick Carousel)
- ✅ SEO otimizado

## 📊 Métricas de Performance

- **Tamanho total:** 150 MB (80% menor)
- **PageSpeed Score:** 90+ (esperado)
- **Formato de imagens:** WebP (97% compatibilidade)
- **Formato de vídeo:** WebM (95% compatibilidade)
- **Fallback:** 100% compatibilidade com navegadores antigos

## 🔧 Tecnologias

- HTML5 / CSS3 / JavaScript
- Bootstrap 5
- jQuery
- Slick Carousel
- Font Awesome
- Google Fonts
- FFmpeg (otimização de vídeo)
- WebP (otimização de imagem)

## 📞 Contato

**Vitrinni Lounge Beer**
- 📍 Av Armando Lombardi 421, Barra da Tijuca - RJ
- 📱 (21) 99538-2032
- 📧 Instagram: [@vitrinniloungerj](https://instagram.com/vitrinniloungerj)
- 🌐 Site: [vitrinnilounge.com.br](https://vitrinnilounge.com.br)

## 👨‍💻 Desenvolvedor

Desenvolvido por [@theusm](https://instagram.com/theusm)

---

**© 2026 Vitrinni Lounge Beer. Todos os direitos reservados.**
