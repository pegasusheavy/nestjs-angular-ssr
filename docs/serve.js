#!/usr/bin/env node

/**
 * Simple static file server for previewing the GitHub Pages site locally.
 * 
 * Usage:
 *   node docs/serve.js
 *   # or
 *   cd docs && node serve.js
 * 
 * Then open http://localhost:3000 in your browser.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DOCS_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
};

const server = http.createServer((req, res) => {
  // Parse URL and remove query string
  let urlPath = req.url.split('?')[0];
  
  // Default to index.html
  if (urlPath === '/') {
    urlPath = '/index.html';
  }

  const filePath = path.join(DOCS_DIR, urlPath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // File not found - try serving index.html for SPA routing
        fs.readFile(path.join(DOCS_DIR, 'index.html'), (err2, indexContent) => {
          if (err2) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(indexContent);
          }
        });
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`
  🚀 Documentation server running!
  
  Local:   http://localhost:${PORT}
  
  Press Ctrl+C to stop.
  `);
});

