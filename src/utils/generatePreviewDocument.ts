/**
 * Combines the user-provided HTML and CSS into a complete, standalone HTML document.
 * This document is structured properly with DOCTYPE, meta tags, and style elements.
 * 
 * @param html The raw HTML markup from the editor.
 * @param css The custom CSS styles from the editor.
 * @returns A single unified HTML string suitable for an iframe's srcdoc.
 */
export function generatePreviewDocument(html: string, css: string): string {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Playground Live Preview</title>
    <style>
      /* CSS Reset / Base Setup for preview */
      body {
        margin: 0;
        padding: 1rem;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        color: #333333;
        background-color: #ffffff;
      }
      
      /* User CSS Injection */
      ${css}
    </style>
  </head>
  <body>
    ${html}
  </body>
</html>`;
}
