#!/usr/bin/env bash
# build.sh — Script de build do projeto Prof. Glauber Image Generator
# Linguagem: Bash (Shell Script)
#
# Uso:
#   bash scripts/build.sh          # build completo
#   bash scripts/build.sh --watch  # modo watch (TypeScript)
#   bash scripts/build.sh --serve  # build + servidor local

set -euo pipefail

# ─── Cores para o terminal ────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
RESET='\033[0m'

# ─── Funções utilitárias ──────────────────────────────────────────────────────

log_info()    { echo -e "${CYAN}[INFO]${RESET}  $*"; }
log_ok()      { echo -e "${GREEN}[OK]${RESET}    $*"; }
log_warn()    { echo -e "${YELLOW}[WARN]${RESET}  $*"; }
log_error()   { echo -e "${RED}[ERROR]${RESET} $*" >&2; }

banner() {
  echo -e "${BOLD}"
  echo "╔═══════════════════════════════════════════════╗"
  echo "║  Prof. Glauber Santiago — Image Generator     ║"
  echo "║  Build Script v1.0 (Bash)                     ║"
  echo "╚═══════════════════════════════════════════════╝"
  echo -e "${RESET}"
}

require_cmd() {
  local cmd="$1"
  if ! command -v "$cmd" &>/dev/null; then
    log_error "Comando '$cmd' não encontrado. Por favor, instale-o."
    exit 1
  fi
}

# ─── Verificar dependências ───────────────────────────────────────────────────

check_deps() {
  log_info "Verificando dependências..."
  require_cmd node
  require_cmd npm

  local node_ver
  node_ver=$(node --version)
  local npm_ver
  npm_ver=$(npm --version)
  log_ok "Node.js ${node_ver} | npm ${npm_ver}"
}

# ─── Instalar dependências npm ────────────────────────────────────────────────

install_deps() {
  if [ ! -d "node_modules" ]; then
    log_info "Instalando dependências npm..."
    npm install --silent
    log_ok "Dependências instaladas."
  else
    log_info "node_modules já existe; pulando npm install."
  fi
}

# ─── Compilar TypeScript ──────────────────────────────────────────────────────

build_typescript() {
  log_info "Compilando TypeScript..."
  local tsc_bin="./node_modules/.bin/tsc"

  if [ ! -f "$tsc_bin" ]; then
    log_error "TypeScript (tsc) não encontrado em node_modules."
    exit 1
  fi

  if "$tsc_bin" 2>&1; then
    log_ok "TypeScript compilado com sucesso → dist/"
  else
    log_error "Falha na compilação TypeScript."
    exit 1
  fi
}

# ─── Verificar arquivos de saída ──────────────────────────────────────────────

verify_output() {
  local required_files=(
    "dist/app.js"
    "dist/imageGenerator.js"
    "dist/types.js"
    "index.html"
    "styles/main.css"
    "styles/animations.css"
    "utils/helpers.js"
  )

  log_info "Verificando arquivos de saída..."
  local all_ok=true

  for f in "${required_files[@]}"; do
    if [ -f "$f" ]; then
      local size
      size=$(du -sh "$f" | cut -f1)
      log_ok "  ${f} (${size})"
    else
      log_warn "  AUSENTE: ${f}"
      all_ok=false
    fi
  done

  if $all_ok; then
    log_ok "Todos os arquivos de saída estão presentes."
  else
    log_warn "Alguns arquivos de saída estão ausentes."
  fi
}

# ─── Criar pasta output para Python ──────────────────────────────────────────

prepare_output_dir() {
  if [ ! -d "output" ]; then
    mkdir -p output
    log_ok "Pasta 'output/' criada para imagens geradas pelo Python."
  fi
}

# ─── Modo watch ──────────────────────────────────────────────────────────────

watch_mode() {
  log_info "Modo watch ativado. Pressione Ctrl+C para sair."
  ./node_modules/.bin/tsc --watch
}

# ─── Servidor local simples ───────────────────────────────────────────────────

serve_mode() {
  if command -v python3 &>/dev/null; then
    log_info "Iniciando servidor Python na porta 8080..."
    log_info "Acesse: http://localhost:8080"
    python3 -m http.server 8080
  elif command -v npx &>/dev/null; then
    log_info "Iniciando servidor npx http-server na porta 8080..."
    npx http-server . -p 8080
  else
    log_error "Nenhum servidor HTTP disponível (python3 ou npx)."
    exit 1
  fi
}

# ─── Resumo do build ──────────────────────────────────────────────────────────

build_summary() {
  echo ""
  echo -e "${BOLD}${GREEN}═══════════════════════════════════════${RESET}"
  echo -e "${BOLD}${GREEN}  Build concluído com sucesso!${RESET}"
  echo -e "${BOLD}${GREEN}═══════════════════════════════════════${RESET}"
  echo ""
  echo -e "  ${CYAN}Abra no navegador:${RESET} index.html"
  echo -e "  ${CYAN}Servidor local:${RESET}    bash scripts/build.sh --serve"
  echo -e "  ${CYAN}Gerar imagens:${RESET}     python3 scripts/generate_image.py"
  echo ""
}

# ─── Ponto de entrada ─────────────────────────────────────────────────────────

main() {
  banner

  # Muda para a raiz do projeto (diretório pai deste script)
  local script_dir
  script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  cd "${script_dir}/.."

  case "${1:-}" in
    --watch)
      check_deps
      install_deps
      watch_mode
      ;;
    --serve)
      check_deps
      install_deps
      build_typescript
      verify_output
      prepare_output_dir
      serve_mode
      ;;
    *)
      check_deps
      install_deps
      build_typescript
      verify_output
      prepare_output_dir
      build_summary
      ;;
  esac
}

main "$@"
