import os
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "backend"))

import fitz

import ingest


class ExtractPdfTextTests(unittest.TestCase):
    def test_reads_every_page_not_only_the_first(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = os.path.join(tmp, "multi.pdf")
            doc = fitz.open()
            try:
                doc.new_page().insert_text((72, 72), "")
                doc.new_page().insert_text(
                    (72, 72), "PAGE1 unique content that should be extracted."
                )
                doc.new_page().insert_text(
                    (72, 72), "PAGE2 unique content that should be extracted."
                )
                doc.save(path)
            finally:
                doc.close()

            extracted = ingest.extract_pdf_text(path)

        self.assertIn("PAGE1", extracted)
        self.assertIn("PAGE2", extracted)


class ChunkTextTests(unittest.TestCase):
    def test_keeps_every_long_chunk(self):
        # max_tokens=13 -> step = int(13/1.3) = 10 words.
        # Ten copies of "token" are 59 characters, so each slice qualifies.
        words = ["token"] * 30
        chunks = ingest.chunk_text(" ".join(words), max_tokens=13)
        self.assertEqual(len(chunks), 3)
        self.assertTrue(all(len(chunk.split()) == 10 for chunk in chunks))

    def test_empty_text_returns_empty_list(self):
        self.assertEqual(ingest.chunk_text("   "), [])

    def test_small_max_tokens_does_not_crash(self):
        token = "x" * 60
        chunks = ingest.chunk_text(f"{token} {token}", max_tokens=1)
        self.assertEqual(chunks, [token, token])


class ExtractUploadTests(unittest.TestCase):
    def test_text_upload_returns_the_sentence_and_a_chunk(self):
        sentence = "FORGEBOT_MARKER pump inspection notes " + ("token " * 40)
        result = ingest.extract_upload("notes.txt", sentence.encode("utf-8"))
        self.assertEqual(result["status"], "extracted")
        self.assertIn("FORGEBOT_MARKER", result["excerpt"])
        self.assertGreaterEqual(result["chunkCount"], 1)
        self.assertIn("FORGEBOT_MARKER", result["chunks"][0])

    def test_pdf_upload_keeps_every_page(self):
        doc = fitz.open()
        try:
            doc.new_page().insert_text((72, 72), "PAGE1 unique content that should be extracted from the upload.")
            doc.new_page().insert_text((72, 72), "PAGE2 unique content that should be extracted from the upload.")
            data = doc.tobytes()
        finally:
            doc.close()
        result = ingest.extract_upload("manual.pdf", data)
        self.assertEqual(result["status"], "extracted")
        self.assertIn("PAGE1", result["excerpt"] + " ".join(result["chunks"]))
        self.assertIn("PAGE2", " ".join(result["chunks"]) + result["excerpt"])

    def test_unknown_type_is_unreadable(self):
        result = ingest.extract_upload("model.bin", b"not text")
        self.assertEqual(result["status"], "unreadable")
        self.assertEqual(result["chunks"], [])


if __name__ == "__main__":
    unittest.main()
