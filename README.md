# Gerador de Imagens — Prof. Glauber Santiago 🎨

App web que gera imagens artísticas do nome **Prof. Glauber Santiago** em múltiplos estilos visuais, desenvolvido para a **Universidade Federal de São Carlos (UFSCar)**.

## ✨ Funcionalidades

- **6 estilos visuais**: Clássico, Neon, Aquarela, Dourado, Matriz, Pop Art
- Personalização do texto principal e subtítulo
- Download das imagens em PNG (estilo atual ou todos de uma vez)
- Cópia para a área de transferência
- Gerador de imagens standalone em Python (via Pillow)
- Build automatizado via Bash

## 🌐 Linguagens utilizadas

| Linguagem      | Arquivo(s)                              | Função                                   |
|----------------|-----------------------------------------|------------------------------------------|
| **HTML5**      | `index.html`                            | Estrutura da página                      |
| **CSS3**       | `styles/main.css`, `styles/animations.css` | Estilização e animações               |
| **TypeScript** | `src/app.ts`, `src/imageGenerator.ts`, `src/types.ts` | Lógica da aplicação e geração de imagens no Canvas |
| **JavaScript** | `utils/helpers.js`                      | Utilitários (clipboard, toast, debounce) |
| **Python 3**   | `scripts/generate_image.py`             | Geração de imagens via CLI (Pillow)      |
| **Bash**       | `scripts/build.sh`                      | Automação do build                       |

## 📁 Estrutura de arquivos

```
ProfGlauberUFSCar/
├── index.html                    # App principal (HTML5)
├── package.json                  # Configuração Node/npm
├── tsconfig.json                 # Configuração TypeScript
├── README.md
│
├── src/                          # Código-fonte TypeScript
│   ├── app.ts                    # Ponto de entrada da aplicação
│   ├── imageGenerator.ts         # Gerador de imagens no Canvas
│   └── types.ts                  # Tipos e configurações de estilos
│
├── dist/                         # TypeScript compilado (JS)
│   ├── app.js
│   ├── imageGenerator.js
│   └── types.js
│
├── styles/                       # CSS
│   ├── main.css                  # Estilos principais
│   └── animations.css            # Animações e transições
│
├── utils/                        # JavaScript utilitário
│   └── helpers.js                # clipboard, toast, debounce, hexToRgb
│
├── scripts/                      # Scripts externos
│   ├── generate_image.py         # Gerador Python (Pillow)
│   └── build.sh                  # Script de build Bash
│
└── output/                       # Imagens geradas pelo Python
```

## 🚀 Como usar

### Abrir no navegador (sem servidor)

Abra `index.html` diretamente em qualquer navegador moderno — ou sirva com:

```bash
bash scripts/build.sh --serve
```

### Build TypeScript

```bash
npm install
npm run build           # compilação única
npm run watch           # modo watch
```

Ou usando o script Bash:

```bash
bash scripts/build.sh
```

### Gerar imagens via Python

```bash
pip install Pillow

# Todos os estilos
python3 scripts/generate_image.py

# Estilo específico
python3 scripts/generate_image.py --style neon

# Texto personalizado
python3 scripts/generate_image.py --text "Prof. Glauber" --style dourado

# Ver ajuda
python3 scripts/generate_image.py --help
```

As imagens são salvas em `output/`.

## 🎨 Estilos disponíveis

| Estilo     | Descrição                                      |
|------------|------------------------------------------------|
| `classico` | Fundo escuro azul-marinho com texto dourado suave |
| `neon`     | Fundo preto com texto ciano e brilho neon       |
| `aquarela` | Gradiente pêssego com texto roxo               |
| `dourado`  | Fundo escuro com texto dourado brilhante        |
| `matriz`   | Fundo preto com texto verde ("The Matrix")      |
| `pop-art`  | Fundo vermelho vibrante com texto escuro bold   |

## 🛠️ Tecnologias

- **Canvas API** (HTML5) — renderização de imagens no navegador
- **TypeScript 5** — tipagem estática e módulos ES
- **CSS Custom Properties** — variáveis de design
- **CSS Animations** — transições e animações declarativas
- **Pillow (PIL)** — geração de imagens server-side/CLI em Python
- **Bash** — automação de build

---

*Universidade Federal de São Carlos — UFSCar*
