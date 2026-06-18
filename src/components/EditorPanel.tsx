import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Eye, FileCode2, Sliders, Terminal } from 'lucide-react';

interface EditorPanelProps {
  mode: 'web' | 'python';
  html: string;
  css: string;
  python: string;
  onChangeHTML: (value: string | undefined) => void;
  onChangeCSS: (value: string | undefined) => void;
  onChangePython: (value: string | undefined) => void;
}

type EditorMode = 'split' | 'html' | 'css';

// Loading skeleton placeholder for Monaco
const EditorSkeleton = ({ label }: { label: string }) => (
  <div className="editor-skeleton">
    <div className="editor-skeleton-header">
      <div className="skeleton-title" />
    </div>
    <div className="editor-skeleton-body">
      <div className="skeleton-line w-2/3" />
      <div className="skeleton-line w-1/2" />
      <div className="skeleton-line w-3/4" />
      <div className="skeleton-line w-1/3" />
      <span className="skeleton-loading-text">Loading {label} Editor...</span>
    </div>
  </div>
);

// Common UI element: Playful window status dots
const WindowDots = () => (
  <div className="window-dots">
    <span className="window-dot dot-red" />
    <span className="window-dot dot-yellow" />
    <span className="window-dot dot-green" />
  </div>
);

/**
 * EditorPanel renders the HTML and CSS code editors side-by-side or stacked.
 * In Python mode, it displays a single, full-height python editor.
 * Includes macOS-style window dots in panel headers for a playful educational look.
 */
export function EditorPanel({ 
  mode: playgroundMode, 
  html, 
  css, 
  python, 
  onChangeHTML, 
  onChangeCSS, 
  onChangePython 
}: EditorPanelProps) {
  const [panelView, setPanelView] = useState<EditorMode>('split');
  const [isMobile, setIsMobile] = useState(false);

  // Synchronize screen size to force tabbed mode on small viewports
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile && panelView === 'split') {
        setPanelView('html');
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [panelView]);

  const editorOptions = {
    minimap: { enabled: false },
    fontSize: 14,
    fontFamily: '"Fira Code", monospace, Consolas, Monaco, "Courier New"',
    lineNumbers: 'on' as const,
    roundedSelection: true,
    scrollBeyondLastLine: false,
    readOnly: false,
    cursorBlinking: 'smooth' as const,
    cursorSmoothCaretAnimation: 'on' as const,
    automaticLayout: true,
    padding: { top: 12, bottom: 12 },
    tabSize: 2,
  };



  if (playgroundMode === 'python') {
    return (
      <div className="editor-panel-container">
        <div className="editor-panel-tabs">
          <div className="tabs-group">
            <button className="tab-btn active">
              <Terminal size={14} className="icon-python" />
              <span>script.py</span>
            </button>
          </div>
        </div>
        
        <div className="editor-workspace python">
          <div className="editor-wrapper">
            <div className="editor-header">
              <WindowDots />
              <span className="editor-badge python-badge">Python</span>
              <span className="editor-filename">script.py</span>
            </div>
            <div className="editor-container">
              <Editor
                height="100%"
                language="python"
                theme="vs-dark"
                value={python}
                onChange={onChangePython}
                options={editorOptions}
                loading={<EditorSkeleton label="Python" />}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="editor-panel-container">
      {/* Panel Tab Controls */}
      <div className="editor-panel-tabs">
        <div className="tabs-group">
          {!isMobile && (
            <button
              onClick={() => setPanelView('split')}
              className={`tab-btn ${panelView === 'split' ? 'active' : ''}`}
            >
              <Sliders size={14} />
              <span>Split View</span>
            </button>
          )}
          <button
            onClick={() => setPanelView('html')}
            className={`tab-btn ${panelView === 'html' ? 'active' : ''}`}
          >
            <FileCode2 size={14} className="icon-html" />
            <span>index.html</span>
          </button>
          <button
            onClick={() => setPanelView('css')}
            className={`tab-btn ${panelView === 'css' ? 'active' : ''}`}
          >
            <Eye size={14} className="icon-css" />
            <span>styles.css</span>
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className={`editor-workspace ${panelView}`}>
        {(panelView === 'split' || panelView === 'html') && (
          <div className="editor-wrapper html-editor-wrapper">
            <div className="editor-header">
              <WindowDots />
              <span className="editor-badge html-badge">HTML</span>
              <span className="editor-filename">index.html</span>
            </div>
            <div className="editor-container">
              <Editor
                height="100%"
                language="html"
                theme="vs-dark"
                value={html}
                onChange={onChangeHTML}
                options={editorOptions}
                loading={<EditorSkeleton label="HTML" />}
              />
            </div>
          </div>
        )}

        {(panelView === 'split' || panelView === 'css') && (
          <div className="editor-wrapper css-editor-wrapper">
            <div className="editor-header">
              <WindowDots />
              <span className="editor-badge css-badge">CSS</span>
              <span className="editor-filename">styles.css</span>
            </div>
            <div className="editor-container">
              <Editor
                height="100%"
                language="css"
                theme="vs-dark"
                value={css}
                onChange={onChangeCSS}
                options={editorOptions}
                loading={<EditorSkeleton label="CSS" />}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
