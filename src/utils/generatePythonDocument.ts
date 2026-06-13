/**
 * Generates an HTML document that loads Pyodide (CPython WebAssembly port) 
 * from a CDN, redirects standard outputs/errors to a browser terminal console, 
 * and executes Python code client-side.
 * 
 * To prevent code-escaping issues (such as user scripts containing backticks or quotes),
 * the Python code is base64-encoded in React and decoded using `atob` inside the iframe.
 * 
 * @param pythonCode The raw Python script.
 * @returns An HTML string suitable for rendering inside a sandboxed iframe.
 */
export function generatePythonDocument(pythonCode: string): string {
  // Convert UTF-8 Python code string safely to base64
  let base64Code: string;
  try {
    base64Code = btoa(unescape(encodeURIComponent(pythonCode)));
  } catch {
    base64Code = btoa(pythonCode); // fallback
  }

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Python Console Runner</title>
    <style>
      body {
        margin: 0;
        padding: 1rem;
        background-color: #0b0f19;
        color: #f8fafc;
        font-family: 'Fira Code', 'JetBrains Mono', Consolas, Monaco, monospace;
        font-size: 0.9rem;
        line-height: 1.5;
        height: 100vh;
        box-sizing: border-box;
        overflow-y: auto;
      }
      
      #terminal {
        display: flex;
        flex-direction: column;
        word-break: break-all;
        white-space: pre-wrap;
      }
      
      .stdout {
        color: #10b981; /* Green output */
      }
      
      .stderr {
        color: #f43f5e; /* Coral red errors */
        font-weight: 500;
      }
      
      .system {
        color: #64748b; /* Muted slate system logs */
        font-style: italic;
      }
      
      /* Simple flashing terminal cursor */
      .cursor::after {
        content: '█';
        animation: blink 1s step-start infinite;
        color: #6366f1;
        margin-left: 2px;
      }
      
      @keyframes blink {
        50% { opacity: 0; }
      }
    </style>
    
  </head>
  <body>
    <div id="terminal">
      <span class="system">Initializing Pyodide (Python WASM Engine v0.26.1)...</span>
      <span class="system">This may take a few seconds on first load...</span>
      <span class="system cursor">Downloading assets...</span>
    </div>

    <script type="module">
      import { loadPyodide } from 'https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.mjs';

      const terminalEl = document.getElementById('terminal');
      
      function printLog(text, typeClass) {
        const span = document.createElement('span');
        span.className = typeClass;
        span.textContent = text + '\\n';
        terminalEl.appendChild(span);
        
        // Auto scroll to bottom
        window.scrollTo(0, document.body.scrollHeight);
      }

      async function runPython() {
        try {
          // Initialize WebAssembly environment
          const pyodide = await loadPyodide({
            indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.1/full/'
          });
          
          // Clear loading indicators
          terminalEl.innerHTML = '';

          // Redirect stdout (print statements)
          pyodide.setStdout({
            batched: (text) => printLog(text, 'stdout')
          });

          // Redirect stderr (unhandled errors)
          pyodide.setStderr({
            batched: (text) => printLog(text, 'stderr')
          });

          // Decode base64 python code back to UTF-8
          const base64Data = "${base64Code}";
          const pythonScript = decodeURIComponent(escape(atob(base64Data)));

          // Execute script asynchronously
          await pyodide.runPythonAsync(pythonScript);
        } catch (err) {
          // Catch compilation or runtime syntax errors
          printLog('Traceback (most recent call last):', 'stderr');
          printLog(err.message, 'stderr');
        }
      }

      runPython();
    </script>
  </body>
</html>`;
}
