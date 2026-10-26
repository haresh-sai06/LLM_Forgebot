"""Local ingest API. It extracts and chunks an upload. It does not train.

The standard-library server is used so this does not depend on the machine's
FastAPI/Starlette pair, which currently fails to construct an application.
"""

import json
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import ingest

HOST = "127.0.0.1"
PORT = 4194
MAX_BYTES = 20 * 1024 * 1024
ALLOWED_ORIGIN = "http://127.0.0.1:4192"


class IngestHandler(BaseHTTPRequestHandler):
    def _cors(self) -> None:
        self.send_header("Access-Control-Allow-Origin", ALLOWED_ORIGIN)
        self.send_header("Access-Control-Allow-Headers", "Content-Type, X-Filename")
        self.send_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")

    def _json(self, status: int, payload: dict) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self._cors()
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self) -> None:
        self.send_response(204)
        self._cors()
        self.end_headers()

    def do_GET(self) -> None:
        if self.path.split("?", 1)[0] != "/health":
            self._json(404, {"status": "unreadable", "excerpt": "", "chunks": [], "chunkCount": 0})
            return
        self._json(200, {"status": "ok", "trains": False})

    def do_POST(self) -> None:
        if self.path.split("?", 1)[0] != "/ingest":
            self._json(404, {"status": "unreadable", "excerpt": "", "chunks": [], "chunkCount": 0})
            return
        length = int(self.headers.get("Content-Length", "0") or "0")
        if length <= 0 or length > MAX_BYTES:
            self._json(400, {"status": "unreadable", "excerpt": "", "chunks": [], "chunkCount": 0})
            return
        data = self.rfile.read(length)
        filename = self.headers.get("X-Filename") or "upload.txt"
        self._json(200, ingest.extract_upload(filename, data))

    def log_message(self, fmt: str, *args) -> None:
        print("%s - %s" % (self.address_string(), fmt % args))


def main() -> None:
    server = ThreadingHTTPServer((HOST, PORT), IngestHandler)
    print(f"ingest api http://{HOST}:{PORT}")
    server.serve_forever()


if __name__ == "__main__":
    main()
