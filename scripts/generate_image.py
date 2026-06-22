#!/usr/bin/env python3
"""
generate_image.py — Gerador de imagens em Python usando Pillow.

Gera imagens do nome "Prof. Glauber Santiago" em diversos estilos
e salva como arquivos PNG na pasta 'output/'.

Requisitos:
    pip install Pillow

Uso:
    python3 scripts/generate_image.py
    python3 scripts/generate_image.py --text "Prof. Glauber" --style neon
"""

import argparse
import os
import math
from typing import Tuple, List

try:
    from PIL import Image, ImageDraw, ImageFont, ImageFilter
    PIL_AVAILABLE = True
    _AnyFont = ImageFont.FreeTypeFont | ImageFont.ImageFont
except ImportError:
    PIL_AVAILABLE = False
    _AnyFont = None  # type: ignore[assignment]


# ─── Configurações de estilos ─────────────────────────────────────────────────

STYLES = {
    "classico": {
        "bg_color": (26, 26, 46),
        "text_color": (232, 213, 183),
        "border_color": (232, 213, 183),
        "shadow": True,
    },
    "neon": {
        "bg_color": (10, 10, 10),
        "text_color": (0, 255, 255),
        "border_color": (255, 0, 255),
        "shadow": True,
    },
    "dourado": {
        "bg_color": (26, 26, 46),
        "text_color": (255, 215, 0),
        "border_color": (255, 215, 0),
        "shadow": True,
    },
    "matriz": {
        "bg_color": (0, 0, 0),
        "text_color": (0, 255, 65),
        "border_color": (0, 255, 65),
        "shadow": True,
    },
    "pop-art": {
        "bg_color": (255, 107, 107),
        "text_color": (45, 52, 54),
        "border_color": (45, 52, 54),
        "shadow": False,
    },
}

IMG_WIDTH = 700
IMG_HEIGHT = 280
OUTPUT_DIR = "output"


# ─── Funções auxiliares ───────────────────────────────────────────────────────

def _ensure_output_dir() -> None:
    """Cria a pasta de saída se não existir."""
    os.makedirs(OUTPUT_DIR, exist_ok=True)


def _load_font(size: int) -> "ImageFont.FreeTypeFont | ImageFont.ImageFont":
    """Tenta carregar uma fonte TrueType; usa a fonte padrão como fallback."""
    candidates = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf",
        "/System/Library/Fonts/Supplemental/Georgia Bold.ttf",
        "C:\\Windows\\Fonts\\georgiab.ttf",
    ]
    for path in candidates:
        if os.path.isfile(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def _draw_border(draw: "ImageDraw.ImageDraw", width: int, height: int,
                 color: Tuple[int, int, int], margin: int = 16) -> None:
    """Desenha uma borda retangular com cantos ornamentais."""
    draw.rectangle(
        [margin, margin, width - margin, height - margin],
        outline=color + (180,),
        width=2,
    )
    corner = 18
    points = [
        (margin, margin, margin + corner, margin),
        (margin, margin, margin, margin + corner),
        (width - margin - corner, margin, width - margin, margin),
        (width - margin, margin, width - margin, margin + corner),
        (margin, height - margin - corner, margin, height - margin),
        (margin, height - margin, margin + corner, height - margin),
        (width - margin, height - margin - corner, width - margin, height - margin),
        (width - margin - corner, height - margin, width - margin, height - margin),
    ]
    for x0, y0, x1, y1 in points:
        draw.line([(x0, y0), (x1, y1)], fill=color + (255,), width=3)


def _draw_decorative_lines(draw: "ImageDraw.ImageDraw", width: int, height: int,
                            color: Tuple[int, int, int]) -> None:
    """Desenha linhas horizontais decorativas."""
    center_y = int(height * 0.42)
    line_y1 = center_y - 55
    line_y2 = center_y + 65
    fill = color + (120,)

    draw.line([(int(width * 0.1), line_y1), (int(width * 0.9), line_y1)],
              fill=fill, width=1)
    draw.line([(int(width * 0.1), line_y2), (int(width * 0.9), line_y2)],
              fill=fill, width=1)


def _get_centered_position(draw: "ImageDraw.ImageDraw", text: str,
                            font: "ImageFont.FreeTypeFont | ImageFont.ImageFont",
                            width: int, center_y: int) -> Tuple[int, int]:
    """Calcula a posição centralizada para o texto."""
    bbox = draw.textbbox((0, 0), text, font=font)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]
    x = (width - text_w) // 2
    y = center_y - text_h // 2
    return x, y


# ─── Gerador principal ────────────────────────────────────────────────────────

def generate_image(
    text: str = "Prof. Glauber Santiago",
    style_name: str = "classico",
    subtitle: str = "Universidade Federal de São Carlos",
    show_subtitle: bool = True,
) -> "Image.Image":
    """
    Gera uma imagem PIL com o texto no estilo especificado.

    Args:
        text: Texto principal a renderizar.
        style_name: Nome do estilo (ver STYLES).
        subtitle: Texto do subtítulo.
        show_subtitle: Exibir subtítulo.

    Returns:
        Objeto PIL.Image.
    """
    if not PIL_AVAILABLE:
        raise RuntimeError(
            "Pillow não está instalado. Execute: pip install Pillow"
        )

    style = STYLES.get(style_name, STYLES["classico"])
    bg = style["bg_color"]
    fg = style["text_color"]
    border_color = style["border_color"]

    img = Image.new("RGBA", (IMG_WIDTH, IMG_HEIGHT), bg + (255,))
    draw = ImageDraw.Draw(img)

    font_size = 54
    font = _load_font(font_size)

    # Adapta tamanho da fonte
    while True:
        bbox = draw.textbbox((0, 0), text, font=font)
        if (bbox[2] - bbox[0]) <= IMG_WIDTH * 0.85 or font_size <= 20:
            break
        font_size -= 2
        font = _load_font(font_size)

    center_y = int(IMG_HEIGHT * 0.42)
    x, y = _get_centered_position(draw, text, font, IMG_WIDTH, center_y)

    # Sombra
    if style.get("shadow"):
        shadow_offset = 3
        r, g, b = fg
        shadow_color = (max(0, r - 80), max(0, g - 80), max(0, b - 80), 160)
        draw.text((x + shadow_offset, y + shadow_offset), text,
                  font=font, fill=shadow_color)

    # Texto principal
    draw.text((x, y), text, font=font, fill=fg + (255,))

    # Subtítulo
    if show_subtitle and subtitle:
        sub_font = _load_font(20)
        sub_y = int(IMG_HEIGHT * 0.62)
        sx, sy = _get_centered_position(draw, subtitle, sub_font, IMG_WIDTH, sub_y)
        draw.text((sx, sy), subtitle, font=sub_font,
                  fill=fg + (200,))

    # Decorações
    _draw_decorative_lines(draw, IMG_WIDTH, IMG_HEIGHT, border_color)
    _draw_border(draw, IMG_WIDTH, IMG_HEIGHT, border_color)

    # Marca d'água
    wm_font = _load_font(11)
    wm_text = "UFSCar"
    wm_bbox = draw.textbbox((0, 0), wm_text, font=wm_font)
    wm_x = IMG_WIDTH - (wm_bbox[2] - wm_bbox[0]) - 20
    wm_y = IMG_HEIGHT - (wm_bbox[3] - wm_bbox[1]) - 12
    draw.text((wm_x, wm_y), wm_text, font=wm_font,
              fill=(255, 255, 255, 70))

    return img.convert("RGB")


def generate_all_styles(text: str, subtitle: str, show_subtitle: bool) -> List[str]:
    """Gera imagens em todos os estilos disponíveis e salva em disco."""
    _ensure_output_dir()
    saved: List[str] = []
    safe_text = text.replace(" ", "_").lower()

    for style_name in STYLES:
        img = generate_image(
            text=text,
            style_name=style_name,
            subtitle=subtitle,
            show_subtitle=show_subtitle,
        )
        filename = f"{OUTPUT_DIR}/{safe_text}_{style_name}.png"
        img.save(filename, "PNG")
        saved.append(filename)
        print(f"  ✔  {filename}")

    return saved


# ─── CLI ──────────────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Gerador de imagens do Prof. Glauber Santiago (Python + Pillow)"
    )
    parser.add_argument(
        "--text",
        default="Prof. Glauber Santiago",
        help="Texto principal a renderizar",
    )
    parser.add_argument(
        "--style",
        choices=list(STYLES.keys()) + ["all"],
        default="all",
        help="Estilo visual (default: all — gera todos)",
    )
    parser.add_argument(
        "--subtitle",
        default="Universidade Federal de São Carlos",
        help="Subtítulo",
    )
    parser.add_argument(
        "--no-subtitle",
        action="store_true",
        help="Oculta o subtítulo",
    )
    args = parser.parse_args()

    if not PIL_AVAILABLE:
        print("⚠  Pillow não encontrado. Instale com:  pip install Pillow")
        return

    show_sub = not args.no_subtitle

    print(f"\n🎨  Gerando imagens para: \"{args.text}\"\n")
    if args.style == "all":
        files = generate_all_styles(args.text, args.subtitle, show_sub)
        print(f"\n✅  {len(files)} imagens salvas em '{OUTPUT_DIR}/'")
    else:
        _ensure_output_dir()
        img = generate_image(
            text=args.text,
            style_name=args.style,
            subtitle=args.subtitle,
            show_subtitle=show_sub,
        )
        safe_text = args.text.replace(" ", "_").lower()
        filename = f"{OUTPUT_DIR}/{safe_text}_{args.style}.png"
        img.save(filename, "PNG")
        print(f"✅  Imagem salva em: {filename}")


if __name__ == "__main__":
    main()
