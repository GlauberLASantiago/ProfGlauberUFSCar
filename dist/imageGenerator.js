// imageGenerator.ts — Módulo TypeScript para geração de imagens no Canvas
import { STYLE_CONFIGS, } from "./types.js";
export class ImageGenerator {
    constructor(canvas) {
        this.canvas = canvas;
        const ctx = canvas.getContext("2d");
        if (!ctx)
            throw new Error("Canvas 2D context não disponível.");
        this.ctx = ctx;
    }
    /**
     * Gera uma imagem do nome no canvas com o estilo especificado.
     */
    generate(options) {
        const { text, style, width, height, showSubtitle, subtitle } = options;
        const config = STYLE_CONFIGS[style];
        this.canvas.width = width;
        this.canvas.height = height;
        this.drawBackground(config, width, height);
        this.drawBorder(config, width, height);
        this.drawDecorativeElements(config, width, height);
        this.drawMainText(config, text, width, height);
        if (showSubtitle && subtitle) {
            this.drawSubtitle(config, subtitle, width, height);
        }
        this.drawWatermark(width, height);
    }
    /**
     * Desenha o fundo do canvas (gradiente ou cor sólida).
     */
    drawBackground(config, width, height) {
        if (config.gradient && Array.isArray(config.backgroundColor)) {
            const grad = this.ctx.createLinearGradient(0, 0, width, height);
            grad.addColorStop(0, config.backgroundColor[0]);
            grad.addColorStop(1, config.backgroundColor[1]);
            this.ctx.fillStyle = grad;
        }
        else {
            this.ctx.fillStyle = config.backgroundColor;
        }
        this.ctx.fillRect(0, 0, width, height);
        // Efeito de partículas de fundo para estilos neon/matriz
        if (config.glowEffect) {
            this.drawParticles(config, width, height);
        }
    }
    /**
     * Desenha partículas decorativas no fundo.
     */
    drawParticles(config, width, height) {
        const color = Array.isArray(config.textColor)
            ? config.textColor[0]
            : config.textColor;
        this.ctx.save();
        this.ctx.globalAlpha = 0.15;
        for (let i = 0; i < 40; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const r = Math.random() * 2 + 0.5;
            this.ctx.beginPath();
            this.ctx.arc(x, y, r, 0, Math.PI * 2);
            this.ctx.fillStyle = color;
            this.ctx.fill();
        }
        this.ctx.restore();
    }
    /**
     * Desenha a borda decorativa ao redor da imagem.
     */
    drawBorder(config, width, height) {
        const margin = 16;
        this.ctx.save();
        this.ctx.strokeStyle = config.borderColor;
        this.ctx.lineWidth = 2.5;
        this.ctx.globalAlpha = 0.8;
        // Borda externa
        this.ctx.strokeRect(margin, margin, width - margin * 2, height - margin * 2);
        // Cantos ornamentais
        const cornerSize = 18;
        this.ctx.lineWidth = 4;
        this.ctx.globalAlpha = 1;
        const corners = [
            [margin, margin, cornerSize, cornerSize],
            [width - margin - cornerSize, margin, cornerSize, cornerSize],
            [margin, height - margin - cornerSize, cornerSize, cornerSize],
            [
                width - margin - cornerSize,
                height - margin - cornerSize,
                cornerSize,
                cornerSize,
            ],
        ];
        corners.forEach(([x, y, w, h]) => {
            this.ctx.beginPath();
            this.ctx.moveTo(x + w, y);
            this.ctx.lineTo(x, y);
            this.ctx.lineTo(x, y + h);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.moveTo(x + w, y + h);
            this.ctx.lineTo(x + w, y);
            this.ctx.stroke();
        });
        this.ctx.restore();
    }
    /**
     * Desenha elementos decorativos (linhas, ornamentos).
     */
    drawDecorativeElements(config, width, height) {
        const cy = height * 0.42;
        const lineY1 = cy - 55;
        const lineY2 = cy + 65;
        this.ctx.save();
        this.ctx.strokeStyle = config.borderColor;
        this.ctx.globalAlpha = 0.5;
        this.ctx.lineWidth = 1;
        // Linha superior
        this.ctx.beginPath();
        this.ctx.moveTo(width * 0.1, lineY1);
        this.ctx.lineTo(width * 0.9, lineY1);
        this.ctx.stroke();
        // Linha inferior
        this.ctx.beginPath();
        this.ctx.moveTo(width * 0.1, lineY2);
        this.ctx.lineTo(width * 0.9, lineY2);
        this.ctx.stroke();
        // Diamante central nos ornamentos
        const drawDiamond = (x, y, size) => {
            this.ctx.save();
            this.ctx.globalAlpha = 0.9;
            this.ctx.fillStyle = config.borderColor;
            this.ctx.beginPath();
            this.ctx.moveTo(x, y - size);
            this.ctx.lineTo(x + size, y);
            this.ctx.lineTo(x, y + size);
            this.ctx.lineTo(x - size, y);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.restore();
        };
        drawDiamond(width * 0.5, lineY1, 5);
        drawDiamond(width * 0.5, lineY2, 5);
        drawDiamond(width * 0.1, lineY1, 3);
        drawDiamond(width * 0.9, lineY1, 3);
        this.ctx.restore();
    }
    /**
     * Desenha o texto principal com sombra e efeito de brilho se configurado.
     */
    drawMainText(config, text, width, height) {
        this.ctx.save();
        const fontSize = this.adaptFontSize(config.fontSize, text, width);
        this.ctx.font = `bold ${fontSize}px ${config.fontFamily}`;
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        // Sombra / brilho
        this.ctx.shadowColor = config.shadowColor;
        this.ctx.shadowBlur = config.shadowBlur;
        if (config.glowEffect) {
            // Múltiplas camadas para efeito neon
            for (let i = 0; i < 4; i++) {
                this.ctx.shadowBlur = config.shadowBlur * (i + 1);
                this.ctx.fillStyle = Array.isArray(config.textColor)
                    ? config.textColor[0]
                    : config.textColor;
                this.ctx.fillText(text, width / 2, height * 0.42);
            }
        }
        else if (config.gradient && Array.isArray(config.textColor)) {
            const grad = this.ctx.createLinearGradient(0, 0, width, 0);
            grad.addColorStop(0, config.textColor[0]);
            grad.addColorStop(1, config.textColor[1]);
            this.ctx.fillStyle = grad;
            this.ctx.fillText(text, width / 2, height * 0.42);
        }
        else {
            this.ctx.fillStyle = Array.isArray(config.textColor)
                ? config.textColor[0]
                : config.textColor;
            this.ctx.fillText(text, width / 2, height * 0.42);
        }
        this.ctx.restore();
    }
    /**
     * Adapta o tamanho da fonte para que o texto caiba na largura do canvas.
     */
    adaptFontSize(baseFontSize, text, width) {
        let fontSize = baseFontSize;
        this.ctx.font = `bold ${fontSize}px Georgia`;
        while (this.ctx.measureText(text).width > width * 0.85 &&
            fontSize > 20) {
            fontSize -= 2;
            this.ctx.font = `bold ${fontSize}px Georgia`;
        }
        return fontSize;
    }
    /**
     * Desenha o subtítulo abaixo do texto principal.
     */
    drawSubtitle(config, subtitle, width, height) {
        this.ctx.save();
        const color = Array.isArray(config.textColor)
            ? config.textColor[0]
            : config.textColor;
        this.ctx.font = `20px ${config.fontFamily}`;
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillStyle = color;
        this.ctx.globalAlpha = 0.85;
        this.ctx.shadowColor = config.shadowColor;
        this.ctx.shadowBlur = config.shadowBlur * 0.5;
        this.ctx.fillText(subtitle, width / 2, height * 0.62);
        this.ctx.restore();
    }
    /**
     * Desenha uma marca d'água discreta no rodapé.
     */
    drawWatermark(width, height) {
        this.ctx.save();
        this.ctx.font = "12px Arial, sans-serif";
        this.ctx.textAlign = "right";
        this.ctx.textBaseline = "bottom";
        this.ctx.fillStyle = "rgba(255,255,255,0.3)";
        this.ctx.fillText("UFSCar", width - 20, height - 12);
        this.ctx.restore();
    }
    /**
     * Exporta o canvas como Data URL e dispara o download.
     */
    download(opts) {
        const mime = opts.format === "jpeg" ? "image/jpeg" : "image/png";
        const quality = opts.quality ?? 0.95;
        const dataURL = this.canvas.toDataURL(mime, quality);
        const a = document.createElement("a");
        a.href = dataURL;
        a.download = opts.filename;
        a.click();
    }
    /**
     * Retorna o canvas como Data URL (para exibição em <img> ou preview).
     */
    toDataURL(format = "png") {
        const mime = format === "jpeg" ? "image/jpeg" : "image/png";
        return this.canvas.toDataURL(mime, 0.95);
    }
}
//# sourceMappingURL=imageGenerator.js.map