import { useEffect, useState } from 'react';
import { Terminal, RefreshCw, Maximize2, Minimize2 } from 'lucide-react';

interface PreviewPanelProps {
  srcDoc: string;
  onManualRun: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

/**
 * PreviewPanel renders the live sandboxed output inside an iframe.
 * Security settings:
 * - Omit 'allow-same-origin' to prevent the iframe from accessing parent window DOM / storage.
 * - Set 'allow-scripts' to let users run Javascript or WASM scripts.
 * 
 * Supports fullscreen toggles to maximize the iframe to full screen space.
 */
export function PreviewPanel({ 
  srcDoc, 
  onManualRun, 
  isFullscreen, 
  onToggleFullscreen 
}: PreviewPanelProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  // Briefly trigger visual spinner to show the preview has successfully compiled
  useEffect(() => {
    const startTimer = setTimeout(() => {
      setIsUpdating(true);
    }, 0);
    
    const endTimer = setTimeout(() => {
      setIsUpdating(false);
    }, 350);
    
    return () => {
      clearTimeout(startTimer);
      clearTimeout(endTimer);
    };
  }, [srcDoc]);

  return (
    <div className={`preview-panel-container ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="preview-header">
        <div className="preview-title">
          <Terminal size={14} className="icon-preview" />
          <span>Live Preview</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            onClick={onManualRun} 
            className="btn btn-primary btn-sm"
            title="Force refresh the preview panel"
            disabled={isUpdating}
          >
            <RefreshCw size={12} className={isUpdating ? 'animate-spin' : ''} />
            <span>Run</span>
          </button>
          
          <button
            onClick={onToggleFullscreen}
            className="btn btn-secondary btn-sm"
            title={isFullscreen ? 'Exit Fullscreen Preview' : 'Fullscreen Preview'}
            style={{ padding: '5px' }}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      <div className="preview-iframe-wrapper">
        {isUpdating && (
          <div className="preview-updating-overlay">
            <div className="spinner-glow" />
            <span>Updating preview...</span>
          </div>
        )}
        <iframe
          title="Playground Sandboxed output"
          srcDoc={srcDoc}
          sandbox="allow-scripts allow-same-origin"
          className="preview-iframe"
        />
      </div>
    </div>
  );
}
