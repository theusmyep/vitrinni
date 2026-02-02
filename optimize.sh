#!/bin/bash

##############################################
# Script de Otimização Vitrinni Lounge
# Converte imagens para WebP e vídeos para WebM
##############################################

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Otimização Vitrinni Lounge ===${NC}\n"

# Criar diretório de backup
BACKUP_DIR="originals_backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo -e "${YELLOW}1. Criando backup dos originais em: $BACKUP_DIR${NC}"

##############################################
# CONVERTER IMAGENS PARA WEBP
##############################################

echo -e "\n${YELLOW}2. Convertendo imagens para WebP...${NC}"

CONVERTED_IMAGES=0
FAILED_IMAGES=0

# Função para converter uma imagem
convert_image() {
    local input_file="$1"
    local output_file="${input_file%.*}.webp"

    # Pular se já existe WebP
    if [ -f "$output_file" ]; then
        echo "  ✓ Já existe: $output_file"
        return
    fi

    # Fazer backup do original
    local backup_path="$BACKUP_DIR/$input_file"
    mkdir -p "$(dirname "$backup_path")"
    cp "$input_file" "$backup_path"

    # Converter para WebP (qualidade 85 - ótimo balanço qualidade/tamanho)
    if cwebp -q 85 "$input_file" -o "$output_file" > /dev/null 2>&1; then
        echo -e "  ${GREEN}✓${NC} Convertido: $input_file → $output_file"
        ((CONVERTED_IMAGES++))

        # Remover original após conversão bem-sucedida
        # rm "$input_file"
    else
        echo -e "  ${RED}✗${NC} Falha ao converter: $input_file"
        ((FAILED_IMAGES++))
    fi
}

# Exportar função para uso com parallel
export -f convert_image
export BACKUP_DIR CONVERTED_IMAGES FAILED_IMAGES GREEN RED NC

# Encontrar e converter imagens JPG/PNG (excluindo favicons e ícones pequenos)
find images eventos -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) \
    ! -name "favicon*" \
    ! -name "apple-icon*" \
    ! -name "android-icon*" \
    ! -name "ms-icon*" \
    2>/dev/null | while read file; do
    convert_image "$file"
done

echo -e "\n${GREEN}Imagens convertidas: $CONVERTED_IMAGES${NC}"
if [ $FAILED_IMAGES -gt 0 ]; then
    echo -e "${RED}Falhas: $FAILED_IMAGES${NC}"
fi

##############################################
# CONVERTER VÍDEO PARA WEBM
##############################################

echo -e "\n${YELLOW}3. Convertendo vídeo para WebM...${NC}"

if [ -f "videos/vitrinni-background.mp4" ]; then
    # Backup do vídeo original
    cp "videos/vitrinni-background.mp4" "$BACKUP_DIR/vitrinni-background.mp4"

    # Converter para WebM (VP9 codec, muito eficiente)
    echo "  Convertendo vitrinni-background.mp4 → vitrinni-background.webm"

    ffmpeg -i videos/vitrinni-background.mp4 \
        -c:v libvpx-vp9 \
        -crf 30 \
        -b:v 0 \
        -b:a 128k \
        -c:a libopus \
        -vf scale=-2:1080 \
        -threads 4 \
        -speed 4 \
        videos/vitrinni-background.webm \
        -y \
        > /dev/null 2>&1

    if [ $? -eq 0 ]; then
        echo -e "  ${GREEN}✓${NC} Vídeo convertido com sucesso!"

        # Comparar tamanhos
        ORIGINAL_SIZE=$(du -h "videos/vitrinni-background.mp4" | cut -f1)
        NEW_SIZE=$(du -h "videos/vitrinni-background.webm" | cut -f1)
        echo "  Original: $ORIGINAL_SIZE → WebM: $NEW_SIZE"
    else
        echo -e "  ${RED}✗${NC} Falha ao converter vídeo"
    fi
else
    echo "  Vídeo não encontrado"
fi

##############################################
# MINIFICAR CSS E JS
##############################################

echo -e "\n${YELLOW}4. Minificando CSS e JS (opcional)...${NC}"
echo "  Para minificar, instale: npm install -g csso-cli terser"
echo "  Depois execute: csso css/style.css -o css/style.min.css"

##############################################
# RELATÓRIO FINAL
##############################################

echo -e "\n${GREEN}=== Otimização Concluída! ===${NC}\n"

# Calcular economia de espaço
BEFORE_SIZE=$(du -sh "$BACKUP_DIR" 2>/dev/null | cut -f1)
CURRENT_SIZE=$(du -sh images eventos videos 2>/dev/null | awk '{sum+=$1} END {print sum}')

echo "Backup dos originais salvo em: $BACKUP_DIR"
echo -e "\n${YELLOW}Próximos passos:${NC}"
echo "1. Teste o site para garantir que todas as imagens e vídeos funcionam"
echo "2. Execute: ./update-html-references.sh (para atualizar HTMLs)"
echo "3. Se tudo estiver OK, você pode remover o backup: rm -rf $BACKUP_DIR"
echo "4. Commit no Git e deploy!"

echo -e "\n${GREEN}✓ Pronto para deploy!${NC}"
