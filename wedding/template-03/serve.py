import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8080

class WeddingTemplateHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

def main():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    with socketserver.TCPServer(("", PORT), WeddingTemplateHandler) as httpd:
        url = f"http://localhost:{PORT}/index.html"
        print("=" * 60)
        print(f" Wedding Invitation Template 03 (Royale)")
        print(f" Server running at: http://localhost:{PORT}/")
        print(f" Opening: {url}")
        print(" Press Ctrl+C to stop the server.")
        print("=" * 60)
        try:
            webbrowser.open(url)
        except Exception:
            pass
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")

if __name__ == "__main__":
    main()

