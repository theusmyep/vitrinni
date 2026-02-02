#!/bin/bash

cd "/Users/matheusmello/Documents/sites 2026/vitrinnilounge.com/www.vitrinnilounge.com"

echo "=== Convertendo Imagens para WebP ==="
echo ""

# Converter JPG
echo "Convertendo imagens JPG..."
CONVERTED=0
find images eventos -type f \( -name "*.jpg" -o -name "*.jpeg" \) ! -name "favicon*" ! -name "*icon*" 2>/dev/null | while read img; do
  webp="${img%.*}.webp"
  if [ ! -f "$webp" ]; then
    printf "  %-50s" "$img"
    if cwebp -q 85 "$img" -o "$webp" >/dev/null 2>&1; then
      echo "✓"
      CONVERTED=$((CONVERTED + 1))
    else
      echo "✗"
    fi
  fi
done

echo ""
echo "Convertendo imagens PNG (exceto ícones)..."
find images eventos -type f -name "*.png" ! -name "favicon*" ! -name "*icon*" ! -name "*apple*" ! -name "*android*" ! -name "*ms-icon*" 2>/dev/null | while read img; do
  webp="${img%.*}.webp"
  if [ ! -f "$webp" ]; then
    printf "  %-50s" "$img"
    if cwebp -q 85 "$img" -o "$webp" >/dev/null 2>&1; then
      echo "✓"
    else
      echo "✗"
    fi
  fi
done

echo ""
echo "=== Convertendo Vídeo para WebM ==="
if [ -f "videos/vitrinni-background.mp4" ] && [ ! -f "videos/vitrinni-background.webm" ]; then
  echo "Convertendo vitrinni-background.mp4..."
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
    2>&1 | grep -E "time=|Duration:"
  echo "✓ Vídeo convertido"
else
  echo "Vídeo já convertido ou não encontrado"
fi

echo ""
echo "=== Resultado ==="
echo "WebP criados: $(find images eventos -name "*.webp" | wc -l)"
echo "WebM criados: $(find videos -name "*.webm" | wc -l)"
echo ""
echo "✓ Conversão concluída!"
