#!/bin/bash

##############################################
# Auto-Otimização para Novos Arquivos
# Use este script sempre que adicionar novas imagens/vídeos
##############################################

set -e

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}=== Auto-Otimização de Novos Arquivos ===${NC}\n"

##############################################
# FUNÇÃO: Converter imagem para WebP
##############################################

optimize_image() {
    local input="$1"
    local output="${input%.*}.webp"

    if [ -f "$output" ]; then
        echo -e "  ${YELLOW}→${NC} Já otimizada: $input"
        return
    fi

    echo -e "  ${YELLOW}↻${NC} Otimizando: $input"

    if cwebp -q 85 "$input" -o "$output" > /dev/null 2>&1; then
        local original_size=$(du -h "$input" | cut -f1)
        local webp_size=$(du -h "$output" | cut -f1)

        echo -e "    ${GREEN}✓${NC} $original_size → $webp_size"

        # Remover original (comente esta linha se quiser manter)
        # rm "$input"
    else
        echo -e "    ${RED}✗${NC} Falha ao converter"
    fi
}

##############################################
# FUNÇÃO: Converter vídeo para WebM
##############################################

optimize_video() {
    local input="$1"
    local output="${input%.*}.webm"

    if [ -f "$output" ]; then
        echo -e "  ${YELLOW}→${NC} Já otimizado: $input"
        return
    fi

    echo -e "  ${YELLOW}↻${NC} Otimizando vídeo: $input"

    ffmpeg -i "$input" \
        -c:v libvpx-vp9 \
        -crf 30 \
        -b:v 0 \
        -b:a 128k \
        -c:a libopus \
        -vf scale=-2:1080 \
        -threads 4 \
        -speed 4 \
        "$output" \
        -y \
        > /dev/null 2>&1

    if [ $? -eq 0 ]; then
        local original_size=$(du -h "$input" | cut -f1)
        local webm_size=$(du -h "$output" | cut -f1)

        echo -e "    ${GREEN}✓${NC} $original_size → $webm_size"
    else
        echo -e "    ${RED}✗${NC} Falha ao converter"
    fi
}

##############################################
# PROCESSAR ARQUIVOS
##############################################

# Se argumentos foram passados, processar apenas esses arquivos
if [ $# -gt 0 ]; then
    echo "Processando arquivos especificados..."

    for file in "$@"; do
        case "$file" in
            *.jpg|*.jpeg|*.png)
                optimize_image "$file"
                ;;
            *.mp4|*.mov)
                optimize_video "$file"
                ;;
            *)
                echo -e "${YELLOW}Tipo de arquivo não suportado: $file${NC}"
                ;;
        esac
    done
else
    # Processar todos os arquivos não otimizados
    echo -e "${YELLOW}Buscando novos arquivos para otimizar...${NC}\n"

    # Imagens
    NEW_IMAGES=$(find images eventos -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) \
        ! -name "favicon*" ! -name "*icon*" 2>/dev/null)

    if [ -n "$NEW_IMAGES" ]; then
        echo "Imagens encontradas:"
        while IFS= read -r img; do
            # Verificar se já existe versão WebP
            webp_version="${img%.*}.webp"
            if [ ! -f "$webp_version" ]; then
                optimize_image "$img"
            fi
        done <<< "$NEW_IMAGES"
    else
        echo "  Nenhuma nova imagem encontrada"
    fi

    echo ""

    # Vídeos
    NEW_VIDEOS=$(find videos -type f \( -name "*.mp4" -o -name "*.mov" \) 2>/dev/null)

    if [ -n "$NEW_VIDEOS" ]; then
        echo "Vídeos encontrados:"
        while IFS= read -r vid; do
            # Verificar se já existe versão WebM
            webm_version="${vid%.*}.webm"
            if [ ! -f "$webm_version" ]; then
                optimize_video "$vid"
            fi
        done <<< "$NEW_VIDEOS"
    else
        echo "  Nenhum novo vídeo encontrado"
    fi
fi

echo -e "\n${GREEN}✓ Otimização concluída!${NC}"
echo -e "\n${YELLOW}Lembre-se de atualizar as referências nos HTMLs se necessário${NC}"
