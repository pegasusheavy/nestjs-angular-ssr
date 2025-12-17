#!/usr/bin/env node

/**
 * Simple static file server for previewing the GitHub Pages site locally.
 *
 * Usage:
 *   node docs/serve.js
 *   # or
 *   cd docs && node serve.js
 *   # or with custom port
 *   PORT=50123 node docs/serve.js
 *
 * The server will automatically find an available port starting from 50000.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const net = require('net');

const BASE_PORT = 50000;
const MAX_PORT = 50100;
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

/**
 * Check if a port is available
 */
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close();
      resolve(true);
    });
    server.listen(port);
  });
}

/**
 * Find an available port starting from basePort
 */
async function findAvailablePort(basePort, maxPort) {
  for (let port = basePort; port <= maxPort; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available ports found between ${basePort} and ${maxPort}`);
}

/**
 * Create the HTTP server
 */
function createServer() {
  return http.createServer((req, res) => {
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
}

/**
 * Main entry point
 */
async function main() {
  const server = createServer();

  // Use PORT env var if set, otherwise find an available port
  let port;
  if (process.env.PORT) {
    port = parseInt(process.env.PORT, 10);
    const available = await isPortAvailable(port);
    if (!available) {
      console.error(`\n  ❌ Port ${port} is already in use.`);
      console.log(`  Finding an available port...\n`);
      port = await findAvailablePort(BASE_PORT, MAX_PORT);
    }
  } else {
    port = await findAvailablePort(BASE_PORT, MAX_PORT);
  }

  server.listen(port, () => {
    console.log(`
  🚀 Documentation server running!

  Local:   http://localhost:${port}

  Press Ctrl+C to stop.
    `);
  });

  server.on('error', (err) => {
    console.error(`\n  ❌ Server error: ${err.message}\n`);
    process.exit(1);
  });
}

main().catch((err) => {
  console.error(`\n  ❌ Failed to start server: ${err.message}\n`);
  process.exit(1);
});
