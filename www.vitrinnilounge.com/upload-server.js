/**
 * SERVIDOR DE UPLOAD - VITRINNI LOUNGE
 *
 * Servidor simples para receber uploads de banners de eventos
 * Salva diretamente na pasta /eventos/
 *
 * USO: node upload-server.js
 */

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// ========================================
// CONFIGURAÇÕES
// ========================================

// Habilitar CORS (permite acesso de qualquer origem)
app.use(cors());

// Parse JSON
app.use(express.json({ limit: '25mb' }));

// Criar pasta eventos se não existir
const EVENTOS_DIR = path.join(__dirname, 'eventos');
if (!fs.existsSync(EVENTOS_DIR)) {
    fs.mkdirSync(EVENTOS_DIR, { recursive: true });
    console.log('✓ Pasta /eventos/ criada');
}

// ========================================
// CONFIGURAÇÃO DO MULTER (UPLOAD)
// ========================================

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, EVENTOS_DIR);
    },
    filename: (req, file, cb) => {
        // Gerar nome único: timestamp-nome-original
        const timestamp = Date.now();
        const originalName = file.originalname.toLowerCase().replace(/\s+/g, '-');
        const fileName = `${timestamp}-${originalName}`;
        cb(null, fileName);
    }
});

// Filtro para aceitar apenas imagens
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de arquivo não permitido. Use JPG, PNG, GIF ou WebP'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

// ========================================
// ROTAS
// ========================================

// Rota de health check
app.get('/', (req, res) => {
    res.json({
        status: 'online',
        message: 'Servidor de upload Vitrinni',
        version: '1.0.0',
        endpoints: {
            upload: 'POST /upload',
            list: 'GET /eventos',
            delete: 'DELETE /eventos/:filename'
        }
    });
});

// Upload de banner
app.post('/upload', upload.single('banner'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'Nenhum arquivo enviado'
            });
        }

        const fileUrl = `/eventos/${req.file.filename}`;
        const fullUrl = `http://localhost:8080${fileUrl}`;

        console.log(`✓ Upload realizado: ${req.file.filename}`);

        res.json({
            success: true,
            message: 'Upload realizado com sucesso!',
            file: {
                filename: req.file.filename,
                originalName: req.file.originalname,
                size: req.file.size,
                path: fileUrl,
                url: fullUrl
            }
        });

    } catch (error) {
        console.error('Erro no upload:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.post('/events-json', (req, res) => {
    try {
        const payload = req.body;

        if (!payload || typeof payload !== 'object') {
            return res.status(400).json({
                success: false,
                error: 'Body inválido'
            });
        }

        if (!Array.isArray(payload.events)) {
            return res.status(400).json({
                success: false,
                error: 'Campo "events" é obrigatório (array)'
            });
        }

        const DATA_DIR = path.join(__dirname, 'data');
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
        }

        const filePath = path.join(DATA_DIR, 'events.json');
        fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), 'utf8');

        res.json({
            success: true,
            message: 'events.json atualizado com sucesso'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.post('/event-page', (req, res) => {
    try {
        const payload = req.body;

        const slug = payload && typeof payload.slug === 'string' ? payload.slug.trim() : '';
        const title = payload && typeof payload.title === 'string' ? payload.title.trim() : '';
        const date = payload && typeof payload.date === 'string' ? payload.date.trim() : '';
        const id = payload && typeof payload.id === 'string' ? payload.id.trim() : '';
        const time = payload && typeof payload.time === 'string' ? payload.time.trim() : '23:00';
        const bannerUrl = payload && typeof payload.bannerUrl === 'string' ? payload.bannerUrl.trim() : '';

        if (!slug) {
            return res.status(400).json({ success: false, error: 'Campo "slug" é obrigatório' });
        }
        if (!title || !date || !id) {
            return res.status(400).json({ success: false, error: 'Campos "title", "date" e "id" são obrigatórios' });
        }

        const safeSlug = slug.replace(/[^a-zA-Z0-9\-]/g, '');
        if (!safeSlug) {
            return res.status(400).json({ success: false, error: 'Slug inválido' });
        }

        // Usar template atualizado
        const templatePath = path.join(__dirname, 'eventos', 'evento-20260129-vicrime-rj.html');
        if (!fs.existsSync(templatePath)) {
            return res.status(500).json({ success: false, error: 'Template de evento não encontrado' });
        }

        const destPath = path.join(__dirname, 'eventos', `${safeSlug}.html`);

        // Ler template
        let html = fs.readFileSync(templatePath, 'utf8');

        // Formatar data para exibição
        const dateObj = new Date(date + 'T00:00:00Z');
        const dayNames = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
        const dayName = dayNames[dateObj.getUTCDay()];
        const day = String(dateObj.getUTCDate()).padStart(2, '0');
        const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
        const year = dateObj.getUTCFullYear();
        const formattedDate = `${day}/${month}/${year}`;

        // Substituir meta tags
        html = html.replace(/<title>.*?<\/title>/i, `<title>${title} - ${formattedDate} - Vitrinni Lounge Beer</title>`);
        html = html.replace(/<meta name="description" content=".*?"/i, `<meta name="description" content="${title} na Vitrinni Lounge Beer - ${formattedDate} às ${time}"`);

        // Substituir banner (todas as ocorrências)
        if (bannerUrl) {
            html = html.replace(/eventos\/[0-9]+-\[site\]vertical-[^"']+\.png/g, bannerUrl);
        }

        // Substituir título do evento (h1)
        html = html.replace(/<h1>.*?<\/h1>/i, `<h1>${title}</h1>`);

        // Substituir data no HTML
        html = html.replace(/(<strong>📅 Data:<\/strong> )[^<]+/i, `$1${formattedDate} (${dayName})`);

        // Substituir links relativos por absolutos (logo e home)
        html = html.replace(/href="\.\.\/index\.html"/g, 'href="http://localhost:8080/index.html"');
        html = html.replace(/<a class="navbar-brand" href="[^"]*"/g, '<a class="navbar-brand" href="http://localhost:8080/index.html"');

        // Substituir eventData no JavaScript
        html = html.replace(/id:\s*'[^']*'/, `id: '${id}'`);
        html = html.replace(/slug:\s*'[^']*'/, `slug: '${slug}'`);
        html = html.replace(/title:\s*'[^']*'/, `title: '${title}'`);
        html = html.replace(/date:\s*'[^']*'/, `date: '${date}'`);
        html = html.replace(/time:\s*'[^']*'/, `time: '${time}'`);

        // Salvar página
        fs.writeFileSync(destPath, html, 'utf8');

        console.log(`✓ Página criada: ${safeSlug}.html`);

        res.json({
            success: true,
            message: 'Página do evento criada com sucesso',
            file: {
                path: `/eventos/${safeSlug}.html`,
                url: `http://localhost:8080/eventos/${safeSlug}.html`
            }
        });
    } catch (error) {
        console.error('Erro ao criar página:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Listar banners
app.get('/eventos', (req, res) => {
    try {
        const files = fs.readdirSync(EVENTOS_DIR);
        const imageFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
        });

        const fileList = imageFiles.map(filename => ({
            filename: filename,
            path: `/eventos/${filename}`,
            url: `http://localhost:8080/eventos/${filename}`,
            size: fs.statSync(path.join(EVENTOS_DIR, filename)).size,
            created: fs.statSync(path.join(EVENTOS_DIR, filename)).mtime
        }));

        res.json({
            success: true,
            count: fileList.length,
            files: fileList
        });

    } catch (error) {
        console.error('Erro ao listar arquivos:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Deletar banner
app.delete('/eventos/:filename', (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join(EVENTOS_DIR, filename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                error: 'Arquivo não encontrado'
            });
        }

        fs.unlinkSync(filePath);
        console.log(`✓ Arquivo deletado: ${filename}`);

        res.json({
            success: true,
            message: 'Arquivo deletado com sucesso'
        });

    } catch (error) {
        console.error('Erro ao deletar arquivo:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ========================================
// TRATAMENTO DE ERROS
// ========================================

app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                error: 'Arquivo muito grande. Máximo 5MB'
            });
        }
    }

    res.status(500).json({
        success: false,
        error: error.message
    });
});

// ========================================
// INICIAR SERVIDOR
// ========================================

app.listen(PORT, () => {
    console.log('\n' + '='.repeat(50));
    console.log('🚀 SERVIDOR DE UPLOAD - VITRINNI LOUNGE');
    console.log('='.repeat(50));
    console.log(`✓ Servidor rodando em: http://localhost:${PORT}`);
    console.log(`✓ Pasta de uploads: ${EVENTOS_DIR}`);
    console.log('\nEndpoints disponíveis:');
    console.log(`  POST   http://localhost:${PORT}/upload`);
    console.log(`  GET    http://localhost:${PORT}/eventos`);
    console.log(`  DELETE http://localhost:${PORT}/eventos/:filename`);
    console.log('\n💡 Para parar o servidor: Ctrl+C');
    console.log('='.repeat(50) + '\n');
});

// Tratamento de encerramento
process.on('SIGINT', () => {
    console.log('\n\n👋 Servidor encerrado');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n\n👋 Servidor encerrado');
    process.exit(0);
});
