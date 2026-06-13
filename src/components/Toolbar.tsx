import { useState } from 'react';
import { Play, RotateCcw, Copy, FileDown, Check, Code2, Terminal } from 'lucide-react';
import { generatePreviewDocument } from '../utils/generatePreviewDocument';

interface ToolbarProps {
  mode: 'web' | 'python';
  onChangeMode: (mode: 'web' | 'python') => void;
  htmlCode: string;
  cssCode: string;
  pythonCode: string;
  onRun: () => void;
  onReset: () => void;
  onShowToast: (message: string, type: 'success' | 'info') => void;
}

/**
 * Toolbar provides the main actions header:
 * - App title & icon
 * - Mode Selector (Web vs Python)
 * - Run (trigger manual compile)
 * - Copy actions matching active workspace mode
 * - Reset back to the template
 * - Download unified file matching workspace (.html or .py)
 */
export function Toolbar({ 
  mode, 
  onChangeMode, 
  htmlCode, 
  cssCode, 
  pythonCode, 
  onRun, 
  onReset, 
  onShowToast 
}: ToolbarProps) {
  const [copiedHTML, setCopiedHTML] = useState(false);
  const [copiedCSS, setCopiedCSS] = useState(false);
  const [copiedPython, setCopiedPython] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleCopyHTML = async () => {
    try {
      await navigator.clipboard.writeText(htmlCode);
      setCopiedHTML(true);
      onShowToast('HTML copied to clipboard!', 'success');
      setTimeout(() => setCopiedHTML(false), 2000);
    } catch {
      onShowToast('Failed to copy HTML code.', 'info');
    }
  };

  const handleCopyCSS = async () => {
    try {
      await navigator.clipboard.writeText(cssCode);
      setCopiedCSS(true);
      onShowToast('CSS copied to clipboard!', 'success');
      setTimeout(() => setCopiedCSS(false), 2000);
    } catch {
      onShowToast('Failed to copy CSS code.', 'info');
    }
  };

  const handleCopyPython = async () => {
    try {
      await navigator.clipboard.writeText(pythonCode);
      setCopiedPython(true);
      onShowToast('Python code copied to clipboard!', 'success');
      setTimeout(() => setCopiedPython(false), 2000);
    } catch {
      onShowToast('Failed to copy Python code.', 'info');
    }
  };

  const handleDownload = () => {
    setDownloading(true);
    try {
      let blob: Blob;
      let filename: string;

      if (mode === 'web') {
        const combinedDocument = generatePreviewDocument(htmlCode, cssCode);
        blob = new Blob([combinedDocument], { type: 'text/html;charset=utf-8;' });
        filename = 'playground-project.html';
      } else {
        blob = new Blob([pythonCode], { type: 'text/plain;charset=utf-8;' });
        filename = 'playground-script.py';
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      onShowToast('Project downloaded successfully!', 'success');
    } catch {
      onShowToast('Failed to download project.', 'info');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <header className="toolbar">
      <div className="toolbar-branding">
        <Code2 className="logo-icon animate-pulse" size={24} />
        <h1>
          Dev<span>Playground</span>
        </h1>

        {/* Mode Selector Segmented Control */}
        <div className="mode-selector">
          <button 
            onClick={() => onChangeMode('web')}
            className={`mode-selector-btn ${mode === 'web' ? 'active' : ''}`}
            title="Switch to HTML/CSS Web view"
          >
            <Code2 size={14} />
            <span>Web (HTML/CSS)</span>
          </button>
          <button 
            onClick={() => onChangeMode('python')}
            className={`mode-selector-btn ${mode === 'python' ? 'active' : ''}`}
            title="Switch to Python WebAssembly editor"
          >
            <Terminal size={14} className="icon-python" />
            <span>Python WASM</span>
          </button>
        </div>
      </div>

      <div className="toolbar-actions">
        <button 
          onClick={onRun} 
          className="btn btn-primary"
          title="Refresh Preview (Ctrl+Enter / Cmd+Enter)"
        >
          <Play size={16} />
          <span className="btn-text">Run</span>
        </button>

        <div className="divider" />

        {mode === 'web' ? (
          <>
            <button 
              onClick={handleCopyHTML} 
              className={`btn btn-secondary ${copiedHTML ? 'success' : ''}`}
              title="Copy HTML to Clipboard"
            >
              {copiedHTML ? <Check size={16} className="text-success" /> : <Copy size={16} />}
              <span className="btn-text">{copiedHTML ? 'Copied HTML' : 'Copy HTML'}</span>
            </button>

            <button 
              onClick={handleCopyCSS} 
              className={`btn btn-secondary ${copiedCSS ? 'success' : ''}`}
              title="Copy CSS to Clipboard"
            >
              {copiedCSS ? <Check size={16} className="text-success" /> : <Copy size={16} />}
              <span className="btn-text">{copiedCSS ? 'Copied CSS' : 'Copy CSS'}</span>
            </button>
          </>
        ) : (
          <button 
            onClick={handleCopyPython} 
            className={`btn btn-secondary ${copiedPython ? 'success' : ''}`}
            title="Copy Python Code to Clipboard"
          >
            {copiedPython ? <Check size={16} className="text-success" /> : <Copy size={16} />}
            <span className="btn-text">{copiedPython ? 'Copied Python' : 'Copy Python'}</span>
          </button>
        )}

        <button 
          onClick={handleDownload} 
          disabled={downloading}
          className="btn btn-secondary"
          title={mode === 'web' ? 'Download combined HTML' : 'Download Python script'}
        >
          <FileDown size={16} />
          <span className="btn-text">Download</span>
        </button>

        <div className="divider" />

        <button 
          onClick={onReset} 
          className="btn btn-danger"
          title="Reset to default template"
        >
          <RotateCcw size={16} />
          <span className="btn-text">Reset</span>
        </button>
      </div>
    </header>
  );
}
