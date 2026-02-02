#!/usr/bin/env python3
"""
Script para atualizar HTMLs com imagens WebP + fallback
Similar ao BR Arena
"""

import re
import os
import glob
from pathlib import Path

def update_html_with_webp(html_file):
    """Atualiza um arquivo HTML com tags picture para WebP"""

    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    changes = 0

    # Padrão para encontrar tags <img>
    # Formato: <img src="images/foto.jpg" ...>
    img_pattern = r'<img\s+([^>]*src=["\']([^"\']+\.(jpg|jpeg|png))["\'][^>]*)>'

    def replace_img(match):
        nonlocal changes
        full_tag = match.group(0)
        attributes = match.group(1)
        img_src = match.group(2)
        ext = match.group(3)

        # Verificar se já está dentro de <picture>
        # (para não duplicar)
        start_pos = match.start()
        before_tag = content[max(0, start_pos-100):start_pos]
        if '<picture>' in before_tag and '</picture>' not in before_tag:
            return full_tag

        # Gerar caminho WebP
        webp_src = img_src.rsplit('.', 1)[0] + '.webp'

        # Verificar se o arquivo WebP existe
        if not os.path.exists(webp_src):
            return full_tag

        # Criar tag picture com fallback
        picture_tag = f'''<picture>
                    <source srcset="{webp_src}" type="image/webp">
                    <img {attributes}>
                </picture>'''

        changes += 1
        return picture_tag

    # Aplicar substituição
    new_content = re.sub(img_pattern, replace_img, content)

    # Atualizar vídeos
    video_pattern = r'<source\s+src="videos/vitrinni-background\.mp4"\s+type="video/mp4">'
    if re.search(video_pattern, new_content) and os.path.exists('videos/vitrinni-background.webm'):
        # Adicionar WebM antes do MP4
        new_content = re.sub(
            video_pattern,
            '<source src="videos/vitrinni-background.webm" type="video/webm">\n            <source src="videos/vitrinni-background.mp4" type="video/mp4">',
            new_content
        )
        if '<source src="videos/vitrinni-background.webm"' in new_content:
            changes += 1

    # Salvar apenas se houve mudanças
    if new_content != original_content:
        # Criar backup
        backup_file = html_file + '.bak'
        if not os.path.exists(backup_file):
            with open(backup_file, 'w', encoding='utf-8') as f:
                f.write(original_content)

        # Salvar novo conteúdo
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(new_content)

        print(f"  ✓ {html_file}: {changes} alterações")
        return changes
    else:
        print(f"  - {html_file}: sem alterações")
        return 0

def main():
    print("=== Atualizando HTMLs com WebP + Fallback ===\n")

    # Encontrar todos os HTMLs
    html_files = glob.glob('*.html')

    total_changes = 0
    for html_file in sorted(html_files):
        changes = update_html_with_webp(html_file)
        total_changes += changes

    print(f"\n✓ Total de alterações: {total_changes}")
    print("✓ Backups salvos como: *.html.bak")

if __name__ == '__main__':
    os.chdir('/Users/matheusmello/Documents/sites 2026/vitrinnilounge.com/www.vitrinnilounge.com')
    main()
