// app.ts — Ponto de entrada principal da aplicação TypeScript
import { ImageGenerator } from "./imageGenerator.js";
import { STYLE_CONFIGS } from "./types.js";
const state = {
    currentStyle: "classico",
    currentText: "Prof. Glauber Santiago",
    currentSubtitle: "Universidade Federal de São Carlos",
    showSubtitle: true,
    galleryImages: [],
};
/** Aguarda o DOM estar pronto e inicializa a aplicação */
document.addEventListener("DOMContentLoaded", () => {
    initUI();
    buildStyleCards();
    generateInitialGallery();
    generatePreview();
});
/**
 * Configura os eventos do formulário e botões.
 */
function initUI() {
    const textInput = document.getElementById("text-input");
    const subtitleInput = document.getElementById("subtitle-input");
    const subtitleToggle = document.getElementById("subtitle-toggle");
    const generateBtn = document.getElementById("generate-btn");
    const downloadBtn = document.getElementById("download-btn");
    const downloadAllBtn = document.getElementById("download-all-btn");
    textInput.value = state.currentText;
    subtitleInput.value = state.currentSubtitle;
    subtitleToggle.checked = state.showSubtitle;
    textInput.addEventListener("input", () => {
        state.currentText = textInput.value || "Prof. Glauber Santiago";
        generatePreview();
    });
    subtitleInput.addEventListener("input", () => {
        state.currentSubtitle = subtitleInput.value;
        generatePreview();
    });
    subtitleToggle.addEventListener("change", () => {
        state.showSubtitle = subtitleToggle.checked;
        generatePreview();
    });
    generateBtn.addEventListener("click", () => {
        generatePreview();
        animateButton(generateBtn, "✓ Gerado!");
    });
    downloadBtn.addEventListener("click", () => {
        downloadCurrentImage();
        animateButton(downloadBtn, "✓ Baixado!");
    });
    downloadAllBtn.addEventListener("click", () => {
        downloadAllStyles();
        animateButton(downloadAllBtn, "✓ Baixando...");
    });
}
/**
 * Constrói os cartões de seleção de estilo na barra lateral.
 */
function buildStyleCards() {
    const container = document.getElementById("style-cards");
    container.innerHTML = "";
    Object.values(STYLE_CONFIGS).forEach((config) => {
        const card = document.createElement("div");
        card.className = `style-card${config.name === state.currentStyle ? " active" : ""}`;
        card.dataset["style"] = config.name;
        const preview = document.createElement("canvas");
        preview.width = 120;
        preview.height = 60;
        const gen = new ImageGenerator(preview);
        gen.generate({
            text: "Prof.",
            style: config.name,
            width: 120,
            height: 60,
            showSubtitle: false,
            subtitle: "",
        });
        card.appendChild(preview);
        const label = document.createElement("span");
        label.textContent = config.label;
        card.appendChild(label);
        card.addEventListener("click", () => {
            state.currentStyle = config.name;
            document.querySelectorAll(".style-card").forEach((c) => {
                c.classList.remove("active");
            });
            card.classList.add("active");
            generatePreview();
        });
        container.appendChild(card);
    });
}
/**
 * Gera e exibe o preview no canvas principal.
 */
function generatePreview() {
    const canvas = document.getElementById("main-canvas");
    const gen = new ImageGenerator(canvas);
    gen.generate({
        text: state.currentText,
        style: state.currentStyle,
        width: 700,
        height: 280,
        showSubtitle: state.showSubtitle,
        subtitle: state.currentSubtitle,
    });
    // Atualiza a imagem de preview no modal/lightbox se existir
    const previewImg = document.getElementById("preview-img");
    if (previewImg) {
        previewImg.src = gen.toDataURL("png");
    }
}
/**
 * Faz download da imagem no estilo atual.
 */
function downloadCurrentImage() {
    const canvas = document.getElementById("main-canvas");
    const gen = new ImageGenerator(canvas);
    const styleName = state.currentStyle;
    const safeText = state.currentText.replace(/\s+/g, "_").toLowerCase();
    gen.download({
        filename: `${safeText}_${styleName}.png`,
        format: "png",
    });
}
/**
 * Gera e faz download de todos os estilos com intervalo de 400 ms entre eles.
 */
function downloadAllStyles() {
    const styles = Object.keys(STYLE_CONFIGS);
    const offscreenCanvas = document.createElement("canvas");
    const gen = new ImageGenerator(offscreenCanvas);
    const safeText = state.currentText.replace(/\s+/g, "_").toLowerCase();
    styles.forEach((style, i) => {
        setTimeout(() => {
            gen.generate({
                text: state.currentText,
                style,
                width: 700,
                height: 280,
                showSubtitle: state.showSubtitle,
                subtitle: state.currentSubtitle,
            });
            gen.download({
                filename: `${safeText}_${style}.png`,
                format: "png",
            });
        }, i * 400);
    });
}
/**
 * Gera a galeria inicial com todos os estilos disponíveis.
 */
function generateInitialGallery() {
    const gallery = document.getElementById("gallery");
    gallery.innerHTML = "";
    const styles = Object.keys(STYLE_CONFIGS);
    styles.forEach((style) => {
        const card = document.createElement("div");
        card.className = "gallery-card";
        const canvas = document.createElement("canvas");
        canvas.width = 350;
        canvas.height = 140;
        const gen = new ImageGenerator(canvas);
        gen.generate({
            text: state.currentText,
            style,
            width: 350,
            height: 140,
            showSubtitle: false,
            subtitle: "",
        });
        const img = document.createElement("img");
        img.src = gen.toDataURL("png");
        img.alt = `Estilo ${STYLE_CONFIGS[style].label}`;
        img.className = "gallery-img";
        const label = document.createElement("p");
        label.className = "gallery-label";
        label.textContent = STYLE_CONFIGS[style].label;
        const useBtn = document.createElement("button");
        useBtn.className = "gallery-use-btn";
        useBtn.textContent = "Usar este estilo";
        useBtn.addEventListener("click", () => {
            state.currentStyle = style;
            document.querySelectorAll(".style-card").forEach((c) => {
                const el = c;
                el.classList.toggle("active", el.dataset["style"] === style);
            });
            generatePreview();
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
        card.appendChild(img);
        card.appendChild(label);
        card.appendChild(useBtn);
        gallery.appendChild(card);
    });
}
/**
 * Anima o botão clicado e restaura o texto original após 1.5 s.
 */
function animateButton(btn, tempText) {
    const original = btn.textContent ?? "";
    btn.textContent = tempText;
    btn.disabled = true;
    setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
    }, 1500);
}
//# sourceMappingURL=app.js.map