#!/bin/bash

cd "/Users/matheusmello/Documents/sites 2026/vitrinnilounge.com/www.vitrinnilounge.com"

echo "=== Atualizando HTMLs com WebP + Fallback ==="
echo ""

# Backup
mkdir -p html_backup_$(date +%Y%m%d)
cp *.html html_backup_$(date +%Y%m%d)/ 2>/dev/null

# Lista de arquivos WebP criados
webp_files=$(find images eventos -name "*.webp" -type f 2>/dev/null)

for webp in $webp_files; do
    # Remover .webp para pegar o nome base
    base="${webp%.webp}"

    # Tentar encontrar o original (.jpg, .jpeg ou .png)
    for ext in jpg jpeg png; do
        original="${base}.${ext}"

        if [ -f "$original" ]; then
            echo "Processando: $original → $webp"

            # Atualizar todos os HTMLs
            for html in *.html; do
                # Verificar se o HTML contém referência ao original
                if grep -q "$original" "$html" 2>/dev/null; then
                    # Criar backup individual se ainda não existe
                    if [ ! -f "${html}.bak" ]; then
                        cp "$html" "${html}.bak"
                    fi

                    # Substituir <img src="original"> por <picture><source webp><img original>
                    # Usando sed para fazer a substituição
                    sed -i '' "s|<img src=\"${original}\"|<picture><source srcset=\"${webp}\" type=\"image/webp\"><img src=\"${original}\"|g" "$html"
                    sed -i '' "s|<img loading=\"lazy\" src=\"${original}\"|<picture><source srcset=\"${webp}\" type=\"image/webp\"><img loading=\"lazy\" src=\"${original}\"|g" "$html"

                    # Fechar tags picture (adicionar </picture> depois de </img> ou />)
                    # Isso é mais complexo, vamos fazer em outra passada
                fi
            done
        fi
    done
done

echo ""
echo "=== Atualizando Vídeos com WebM + Fallback ==="

# Atualizar vídeo
if [ -f "videos/vitrinni-background.webm" ]; then
    echo "Adicionando WebM ao vídeo background..."

    for html in *.html; do
        if grep -q "vitrinni-background.mp4" "$html" 2>/dev/null; then
            echo "  Atualizando: $html"

            # Adicionar source WebM antes do MP4
            sed -i '' 's|<source src="videos/vitrinni-background.mp4" type="video/mp4">|<source src="videos/vitrinni-background.webm" type="video/webm">\n            <source src="videos/vitrinni-background.mp4" type="video/mp4">|g' "$html"
        fi
    done
fi

echo ""
echo "✓ HTMLs atualizados!"
echo "Backup salvo em: html_backup_$(date +%Y%m%d)/"
