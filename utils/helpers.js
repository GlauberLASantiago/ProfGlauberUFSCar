/**
 * helpers.js — Utilitários em JavaScript puro (sem TypeScript)
 * Usados pela index.html via <script type="module">
 */

/**
 * Copia o Data URL de um canvas para a área de transferência como imagem PNG.
 * @param {HTMLCanvasElement} canvas
 * @returns {Promise<void>}
 */
export async function copyCanvasToClipboard(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(async (blob) => {
      if (!blob) return reject(new Error("Falha ao criar blob do canvas."));
      try {
        const item = new ClipboardItem({ "image/png": blob });
        await navigator.clipboard.write([item]);
        resolve();
      } catch (err) {
        reject(err);
      }
    }, "image/png");
  });
}

/**
 * Formata uma data para o padrão brasileiro.
 * @param {Date} date
 * @returns {string}
 */
export function formatDateBR(date = new Date()) {
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Converte um valor hexadecimal de cor para objeto RGB.
 * @param {string} hex  Ex: "#ff6b6b" ou "#fff"
 * @returns {{ r: number, g: number, b: number } | null}
 */
export function hexToRgb(hex) {
  const expanded = hex.replace(
    /^#([a-f\d])([a-f\d])([a-f\d])$/i,
    (_, r, g, b) => `#${r}${r}${g}${g}${b}${b}`
  );
  const result = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(expanded);
  if (!result) return null;
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

/**
 * Calcula o contraste relativo entre duas cores e retorna "black" ou "white"
 * como a cor de texto mais legível sobre a cor de fundo.
 * @param {string} bgHex
 * @returns {"black" | "white"}
 */
export function getReadableTextColor(bgHex) {
  const rgb = hexToRgb(bgHex);
  if (!rgb) return "white";
  // Luminância relativa (WCAG 2.1)
  const luminance =
    0.2126 * linearize(rgb.r / 255) +
    0.7152 * linearize(rgb.g / 255) +
    0.0722 * linearize(rgb.b / 255);
  return luminance > 0.179 ? "black" : "white";
}

/** @param {number} c */
function linearize(c) {
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/**
 * Debounce — atrasa a execução de uma função até que pare de ser chamada.
 * @template {(...args: unknown[]) => void} T
 * @param {T} fn
 * @param {number} delay  Milissegundos
 * @returns {T}
 */
export function debounce(fn, delay) {
  let timer;
  return function (...args) {
    const ctx = this;
    clearTimeout(timer);
    timer = setTimeout(function () { fn.apply(ctx, args); }, delay);
  };
}

/**
 * Mostra uma notificação toast temporária na tela.
 * @param {string} message
 * @param {"success" | "error" | "info"} type
 * @param {number} duration  Milissegundos
 */
export function showToast(message, type = "info", duration = 2500) {
  const existing = document.getElementById("app-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.id = "app-toast";
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: ${type === "success" ? "#28a745" : type === "error" ? "#dc3545" : "#0f3460"};
    color: white;
    padding: 0.75rem 1.25rem;
    border-radius: 8px;
    font-size: 0.9rem;
    box-shadow: 0 4px 16px rgba(0,0,0,0.4);
    z-index: 9999;
    animation: fadeIn 0.3s ease;
    font-family: system-ui, sans-serif;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), duration);
}
