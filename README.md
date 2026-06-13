# HTML/CSS Playground

A beautiful, modern, and responsive split-screen code playground that lets users write HTML and CSS code and instantly preview the rendered results with sandboxed safety.

---

## 🚀 Key Features

* **Instant Live Preview**: Updates automatically as you type with a debounced delay of 300ms.
* **Dual Editors**: Clean syntax-highlighted HTML and CSS code panels powered by the Monaco Editor (`vs-dark` theme, line numbers, auto-indentation, smooth cursor blinking).
* **Custom Resizable Panels**: Drag-to-resize divider that dynamically switches between horizontal splits (desktop) and vertical splits (mobile).
* **Sandboxed Security**: Executes user code inside a secure, sandboxed iframe (`sandbox="allow-scripts"` without `allow-same-origin`) to completely isolate user scripts from accessing parent context or local storage.
* **Action Center**:
  * **Run**: Refresh preview immediately (or use the shortcut `Ctrl+Enter` / `Cmd+Enter`).
  * **Copy HTML & Copy CSS**: Fast clipboard copy with instant visual checkmark feedback.
  * **Reset**: Restore the playground back to the default interactive template.
  * **Download**: Package and download your code as a single standalone HTML document containing inline CSS.
* **Premium Aesthetics**: Beautiful, glassmorphic dark theme built with curated HSL color parameters,Outfit fonts, and micro-interactions.

---

## 🛠️ Tech Stack

* **React 19**
* **TypeScript**
* **Vite**
* **Monaco Editor** (`@monaco-editor/react`)
* **Lucide React** (icons)

---

## 💻 How to Install & Run Locally

### 1. Install Dependencies
Run the package installer from the project root:
```bash
npm install
```

### 2. Start the Development Server
Launch the local Vite server:
```bash
npm run dev
```
Once started, open `http://localhost:5173` (or the console URL provided by Vite) in your browser.

### 3. Build for Production
Bundle the project into optimized, static files:
```bash
npm run build
```
The compiled files will output into the `/dist` directory.

### 4. Code Linting Check
Verify code formatting and React patterns:
```bash
npm run lint
```

---

## ⌨️ Keyboard Shortcuts

* **Force Refresh Preview**: Press `Ctrl+Enter` (Windows/Linux) or `Cmd+Enter` (macOS) while focused in the window.

---

## 🔒 Security Sandboxing
To ensure absolute security, the preview panel embeds the output document inside an iframe sandboxed with:
```html
<iframe sandbox="allow-scripts" />
```
By omitting `allow-same-origin`, the browser treats the rendering context as a unique domain origin. This restricts scripts inside the iframe from performing operations against the parent document domain, such as stealing cookies, reading local storage, or hijacking the window context.
