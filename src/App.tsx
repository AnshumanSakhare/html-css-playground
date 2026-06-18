import { useState, useEffect, useCallback } from 'react';
import { Toolbar } from './components/Toolbar';
import { SplitLayout } from './components/SplitLayout';
import { EditorPanel } from './components/EditorPanel';
import { PreviewPanel } from './components/PreviewPanel';

import { generatePreviewDocument } from './utils/generatePreviewDocument';
import { generatePythonDocument } from './utils/generatePythonDocument';

// Starter HTML template with a demonstration card
const STARTER_HTML = `<div class="card">
  <div class="badge">Live Playground</div>
  <h1>HTML/CSS Sandbox</h1>
  <p>
    Write your markup in <strong>index.html</strong> and style it inside 
    <strong>styles.css</strong>. Changes will automatically preview on the right 
    with a 300ms debounce.
  </p>
  
  <button id="interactive-btn">Interactive Test</button>
  <p id="feedback-msg" class="feedback hidden">✓ JavaScript works inside sandbox!</p>
</div>

<script>
  const button = document.getElementById('interactive-btn');
  const feedback = document.getElementById('feedback-msg');
  
  button.addEventListener('click', () => {
    feedback.classList.remove('hidden');
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
      button.style.transform = 'none';
    }, 100);
    
    setTimeout(() => {
      feedback.classList.add('hidden');
    }, 3000);
  });
</script>
`;

// Starter CSS template
const STARTER_CSS = `body {
  background: radial-gradient(circle at 50% 30%, #171c2a 0%, #0c0e17 100%);
  color: #f8fafc;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 2rem);
  font-family: system-ui, -apple-system, sans-serif;
  margin: 0;
  padding: 1rem;
}

.card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 2rem;
  max-width: 440px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.badge {
  background: linear-gradient(135deg, #6366f1 0%, #0ea5e9 100%);
  color: #ffffff;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 4px 12px;
  border-radius: 9999px;
  display: inline-block;
  margin-bottom: 1.25rem;
}

h1 {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  background: linear-gradient(135deg, #ffffff 30%, #94a3b8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

p {
  color: #94a3b8;
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
}

button {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: #ffffff;
  border: none;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
  transition: all 0.2s ease;
}

button:hover {
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.6);
}

.feedback {
  margin-top: 1rem;
  margin-bottom: 0;
  color: #10b981;
  font-size: 0.85rem;
  font-weight: 500;
  transition: opacity 0.3s ease;
}

.hidden {
  display: none;
}
`;

// Starter Python script
const STARTER_PYTHON = `# Welcome to the Python WASM Sandbox!
# Write standard Python here, print messages, run math, or raise errors.

import math
import sys

print("Hello from Python WASM (Pyodide)!")
print("Python Version:", sys.version)
print("----------------------------------------")

# Perform mathematical calculations
print("Calculating Square Roots:")
for i in range(1, 6):
    root = math.sqrt(i)
    print(f"  √{i} = {root:.5f}")
    
print("\\nGenerating a Fibonacci sequence:")
def fibonacci(n):
    seq = [0, 1]
    while len(seq) < n:
        seq.append(seq[-1] + seq[-2])
    return seq
    
print("  First 10 Fib numbers:", fibonacci(10))
print("\\nAll output is safely run inside your local browser.")
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
