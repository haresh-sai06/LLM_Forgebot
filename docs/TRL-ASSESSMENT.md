# TRL assessment

Assessment date: 26 October 2026. This is an engineering self-assessment of document ingest in a desktop browser. It is not a trained model, a user study, or a certification.

## Result

**TRL 5** for document ingest in the browser only.

The builder's upload step was run in Chrome on this Windows machine. A text file was sent to the local ingest module, and the page showed the extracted sentence and a chunk count. Training was not started.

TRL 6 is not claimed. Nobody outside this session used the builder, and no model was trained. TRL 7–9 are not claimed.

## Evidence

- Host: Windows, Google Chrome 155, headless, viewport 1280×900.
- UI: `npm run dev -- --host 127.0.0.1 --port 4192 --strictPort` in this repository. Vite 5.4.10 reported ready.
- Ingest API: `python ingest_api.py` in `backend`, listening on `http://127.0.0.1:4194`. `GET /health` is served by that process. The handler calls `extract_upload` and does not train.
- The session opened `http://127.0.0.1:4192/builder`, clicked the button whose text is "Next", and uploaded `notes.txt` through `#file-upload`.
- The page then showed "Status: Done", "notes.txt — 278 B — Extracted · 1 chunks", and the sentence beginning "FORGEBOT_MARKER pump inspection notes".
- The page reported no uncaught errors.
- The session did not click "Start Training".
- Unit commands on the same tree: `python -m unittest discover -s tests -p test_*.py -v` — 7 passed, 0 failed. `node --experimental-strip-types --test src/lib/uploadPanelMotion.test.ts` — 3 passed, 0 failed.
- The PDF unit test still checks that `extract_upload` keeps text from every page. That check is a local test, not a second browser session.

## Why this is not higher

| Level | What it requires here | Status |
|---|---|---|
| TRL 4 | Components validated in the lab | Met by the unit tests |
| TRL 5 | Validated in a relevant environment | Met for ingest in desktop Chrome, as recorded above |
| TRL 6 | Prototype demonstrated in a relevant environment | Not met. No outside user and no trained model |
| TRL 7–9 | Operational demonstration, qualification, or proven use | Not met |

## Remaining work for TRL 6

- Have someone other than the author upload a real document and read the chunks.
- Keep training switched off until a separate, explicit training run is requested and recorded.
- Record that session before changing this number.
