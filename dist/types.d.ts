export type ImageStyle = "classico" | "neon" | "aquarela" | "dourado" | "matriz" | "pop-art";
export interface StyleConfig {
    name: string;
    label: string;
    backgroundColor: string | string[];
    textColor: string | string[];
    shadowColor: string;
    shadowBlur: number;
    fontFamily: string;
    fontSize: number;
    borderColor: string;
    gradient: boolean;
    glowEffect: boolean;
}
export interface GeneratorOptions {
    text: string;
    style: ImageStyle;
    width: number;
    height: number;
    showSubtitle: boolean;
    subtitle: string;
}
export interface CanvasDimensions {
    width: number;
    height: number;
}
export interface DownloadOptions {
    filename: string;
    format: "png" | "jpeg";
    quality?: number;
}
export declare const STYLE_CONFIGS: Record<ImageStyle, StyleConfig>;
