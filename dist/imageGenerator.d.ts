import { GeneratorOptions, DownloadOptions } from "./types.js";
export declare class ImageGenerator {
    private canvas;
    private ctx;
    constructor(canvas: HTMLCanvasElement);
    /**
     * Gera uma imagem do nome no canvas com o estilo especificado.
     */
    generate(options: GeneratorOptions): void;
    /**
     * Desenha o fundo do canvas (gradiente ou cor sólida).
     */
    private drawBackground;
    /**
     * Desenha partículas decorativas no fundo.
     */
    private drawParticles;
    /**
     * Desenha a borda decorativa ao redor da imagem.
     */
    private drawBorder;
    /**
     * Desenha elementos decorativos (linhas, ornamentos).
     */
    private drawDecorativeElements;
    /**
     * Desenha o texto principal com sombra e efeito de brilho se configurado.
     */
    private drawMainText;
    /**
     * Adapta o tamanho da fonte para que o texto caiba na largura do canvas.
     */
    private adaptFontSize;
    /**
     * Desenha o subtítulo abaixo do texto principal.
     */
    private drawSubtitle;
    /**
     * Desenha uma marca d'água discreta no rodapé.
     */
    private drawWatermark;
    /**
     * Exporta o canvas como Data URL e dispara o download.
     */
    download(opts: DownloadOptions): void;
    /**
     * Retorna o canvas como Data URL (para exibição em <img> ou preview).
     */
    toDataURL(format?: "png" | "jpeg"): string;
}
