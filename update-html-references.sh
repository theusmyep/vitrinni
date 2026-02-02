#!/bin/bash

##############################################
# Atualiza referências de imagens e vídeos nos HTMLs
# Substitui .jpg/.png por .webp e .mp4 por .webm
##############################################

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}=== Atualizando Referências HTML ===${NC}\n"

# Backup dos HTMLs antes de modificar
BACKUP_HTML="html_backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_HTML"

echo -e "${YELLOW}1. Criando backup dos HTMLs em: $BACKUP_HTML${NC}"

# Copiar todos os HTMLs para backup
find . -maxdepth 1 -name "*.html" -exec cp {} "$BACKUP_HTML/" \;

##############################################
# ATUALIZAR IMAGENS: .jpg/.png → .webp
##############################################

echo -e "\n${YELLOW}2. Atualizando referências de imagens...${NC}"

# Lista de imagens convertidas para WebP
WEBP_FILES=$(find images eventos -name "*.webp" -type f 2>/dev/null)

for webp_file in $WEBP_FILES; do
    # Remover extensão .webp para obter o nome base
    base_name="${webp_file%.webp}"

    # Procurar por .jpg, .jpeg ou .png nos HTMLs
    for ext in jpg jpeg png; do
        old_ref="${base_name}.${ext}"

        if [ -f "$old_ref" ] || grep -q "$old_ref" *.html 2>/dev/null; then
            echo "  Substituindo: $old_ref → $webp_file"

            # Atualizar em todos os arquivos HTML
            find . -maxdepth 1 -name "*.html" -type f -exec sed -i '' "s|${old_ref}|${webp_file}|g" {} \;
        fi
    done
done

##############################################
# ATUALIZAR VÍDEO: .mp4 → .webm (com fallback)
##############################################

echo -e "\n${YELLOW}3. Atualizando referências de vídeos...${NC}"

if [ -f "videos/vitrinni-background.webm" ]; then
    echo "  Adicionando suporte WebM com fallback MP4"

    # Encontrar todas as referências ao vídeo MP4 e adicionar WebM com fallback
    find . -maxdepth 1 -name "*.html" -type f | while read html_file; do
        if grep -q "vitrinni-background.mp4" "$html_file"; then
            echo "    Atualizando: $html_file"

            # Substituir tag <source> única por duas (WebM + MP4 fallback)
            sed -i '' 's|<source src="videos/vitrinni-background.mp4" type="video/mp4">|<source src="videos/vitrinni-background.webm" type="video/webm">\n            <source src="videos/vitrinni-background.mp4" type="video/mp4">|g' "$html_file"
        fi
    done
fi

##############################################
# ADICIONAR SUPORTE PICTURE COM FALLBACK
##############################################

echo -e "\n${YELLOW}4. (Opcional) Adicionar tags <picture> para melhor compatibilidade${NC}"
echo "  As imagens WebP já funcionam na maioria dos browsers modernos"
echo "  Para suporte total, considere usar <picture> com fallback"

##############################################
# RELATÓRIO
##############################################

echo -e "\n${GREEN}=== Atualização Concluída! ===${NC}\n"
echo "Backup dos HTMLs salvos em: $BACKUP_HTML"
echo ""
echo -e "${YELLOW}Próximos passos:${NC}"
echo "1. Abra o site em http://localhost:8080 e teste todas as páginas"
echo "2. Verifique se todas as imagens e vídeos estão carregando"
echo "3. Use o DevTools (Network) para confirmar que WebP/WebM estão sendo usados"
echo "4. Se tudo OK, remova os backups e faça commit"
echo ""
echo -e "${GREEN}✓ Referências atualizadas!${NC}"
