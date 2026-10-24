#!/usr/bin/env python3
"""
Suno Pure Audio Studio Capture - Portfolio Web Server
Serves the interactive portfolio website on port 8089
"""

import http.server
import socketserver
import os
import sys

PORT = 8089
WEB_DIR = os.path.dirname(os.path.abspath(__file__))

class StudioPortfolioHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=WEB_DIR, **kwargs)

    def end_headers(self):
        # Enable caching and CORS for Web Audio demo
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

def run():
    os.chdir(WEB_DIR)
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), StudioPortfolioHandler) as httpd:
        print(f"\n=======================================================")
        print(f"🎙️  Suno Pure Audio Studio Capture - Portfolio Website")
        print(f"🌐  Serving at: http://localhost:{PORT}")
        print(f"📁  Directory: {WEB_DIR}")
        print(f"=======================================================\n")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server...")

if __name__ == '__main__':
    run()
