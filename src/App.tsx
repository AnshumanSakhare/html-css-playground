import { useState, useEffect, useCallback } from 'react';
import { Toolbar } from './components/Toolbar';
import { SplitLayout } from './components/SplitLayout';
import { EditorPanel } from './components/EditorPanel';
import { PreviewPanel } from './components/PreviewPanel';

import { generatePreviewDocument } from './utils/generatePreviewDocument';
import { generatePythonDocument } from './utils/generatePythonDocument';

// Starter HTML template with a demonstration card
const STARTER_HTML = `<!-- 1. This is the main title on the screen! -->
<h1>Hello, World!</h1>

<!-- 2. This is a paragraph text block -->
<p>Welcome to CodeLab! Let's build something fun.</p>

<!-- 3. This is our cartoon character! Try changing the emoji to a panda 🐼 or cat 🐱 -->
<div class="character">🦊</div>

<!-- 4. This is a speech bubble -->
<div class="bubble">I can speak! Write some HTML and CSS to customize me.</div>
`;

// Starter CSS template
const STARTER_CSS = `/* Change the background color of the screen */
body {
  background-color: #eef2ff; /* Light friendly blue */
  color: #1a1a2e; /* Dark navy text */
  text-align: center;
  font-family: 'Outfit', sans-serif;
  padding-top: 40px;
}

/* Style the main title */
h1 {
  color: #3a5ccc; /* CodeLab blue */
  font-size: 2.2rem;
  margin-bottom: 8px;
}

/* Style the paragraph text */
p {
  color: #5a5a72;
  font-size: 1.1rem;
  margin-bottom: 24px;
}

/* Make our character big and add a hover wiggle animation! */
.character {
  font-size: 5rem;
  display: inline-block;
  cursor: pointer;
  transition: transform 0.2s;
}

.character:hover {
  transform: scale(1.2) rotate(15deg); /* Grows and wiggles when you point at it! */
}

/* Style the speech bubble */
.bubble {
  background-color: #ffffff;
  border: 2px solid #3a5ccc;
  border-radius: 20px;
  padding: 14px;
  max-width: 320px;
  margin: 20px auto;
  font-size: 0.95rem;
  font-weight: 500;
  box-shadow: 0 6px 12px rgba(58, 92, 204, 0.08);
}
`;

// Starter Python script
const STARTER_PYTHON = `# Welcome to your Python Playground!
# Try running this script by clicking the green "Run Code" button above.

print("Hello, World!")
print("Welcome to CodeLab!")

# Let's count from 1 to 5
print("\\nCounting numbers:")
for number in range(1, 6):
    print("Number:", number)

# Try changing the text inside the quotes and click "Run Code" again!
`;

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'info';
}

type Mode = 'web' | 'python';

export function App() {
  const [mode, setMode] = useState<Mode>('web');
  const [html, setHtml] = useState(STARTER_HTML);
  const [css, setCss] = useState(STARTER_CSS);
  const [python, setPython] = useState(STARTER_PYTHON);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // States to track compiled preview code (only updates when Run button is clicked)
  const [renderedCode, setRenderedCode] = useState({ 
    html: STARTER_HTML, 
    css: STARTER_CSS,
    python: STARTER_PYTHON 
  });

  // Derive the current preview iframe srcdoc based on the active mode
  const srcDoc = mode === 'web' 
    ? generatePreviewDocument(renderedCode.html, renderedCode.css)
    : generatePythonDocument(renderedCode.python);

  // Toast Notification manager
  const showToast = useCallback((message: string, type: 'success' | 'info' = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const handleManualRun = useCallback(() => {
    setRenderedCode({ html, css, python });
    showToast('Preview refreshed manually!', 'success');
  }, [html, css, python, showToast]);

  const handleReset = useCallback(() => {
    if (mode === 'web') {
      setHtml(STARTER_HTML);
      setCss(STARTER_CSS);
      setRenderedCode((prev) => ({ ...prev, html: STARTER_HTML, css: STARTER_CSS }));
      showToast('Web playground reset to default code.', 'info');
    } else {
      setPython(STARTER_PYTHON);
      setRenderedCode((prev) => ({ ...prev, python: STARTER_PYTHON }));
      showToast('Python playground reset to default code.', 'info');
    }
  }, [mode, showToast]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  // Keyboard shortcut (Cmd+Enter / Ctrl+Enter) to run code manually
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        handleManualRun();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleManualRun]);

  return (
    <>
      <Toolbar 
        mode={mode}
        onChangeMode={(newMode) => {
          setMode(newMode);
          showToast(`Switched workspace to ${newMode === 'web' ? 'Web Layout' : 'Python WASM'}`, 'info');
        }}
        htmlCode={html} 
        cssCode={css} 
        pythonCode={python}
        onRun={handleManualRun} 
        onReset={handleReset} 
        onShowToast={showToast} 
      />

      <SplitLayout 
        left={
          <EditorPanel 
            mode={mode}
            html={html} 
            css={css} 
            python={python}
            onChangeHTML={(val) => setHtml(val ?? '')} 
            onChangeCSS={(val) => setCss(val ?? '')} 
            onChangePython={(val) => setPython(val ?? '')}
          />
        }
        right={
          <PreviewPanel 
            srcDoc={srcDoc} 
            onManualRun={handleManualRun} 
            isFullscreen={isFullscreen}
            onToggleFullscreen={toggleFullscreen}
          />
        }
      />

      {/* Floating Notifications Portal */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
