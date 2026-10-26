import assert from "node:assert/strict";
import { test } from "node:test";
import {
  formatFileSize,
  panelEntranceMotion,
  uploadPanelPhase,
  uploadStatusCopy,
} from "./uploadPanelMotion.ts";

test("reduced motion skips the entrance", () => {
  const motion = panelEntranceMotion(true);
  assert.equal(motion.animate, false);
  assert.equal(motion.durationMs, 0);
  assert.equal(motion.translatePx, 0);
  assert.equal(motion.opacityFrom, 1);
  assert.equal(motion.easing, "ease-out");
});

test("motion branch is a short ease-out entrance", () => {
  const motion = panelEntranceMotion(false);
  assert.equal(motion.animate, true);
  assert.equal(motion.easing, "ease-out");
  assert.equal(motion.opacityFrom, 0);
  assert.ok(motion.durationMs >= 200 && motion.durationMs <= 280);
  assert.ok(motion.translatePx > 0 && motion.translatePx <= 8);
});

test("upload phase names idle, reading, and done in words", () => {
  assert.equal(uploadPanelPhase(0, false), "idle");
  assert.equal(uploadPanelPhase(0, true), "reading");
  assert.equal(uploadPanelPhase(2, true), "reading");
  assert.equal(uploadPanelPhase(2, false), "done");
  assert.equal(uploadStatusCopy("idle", 0).label, "Idle");
  assert.equal(uploadStatusCopy("reading", 0).label, "Reading");
  assert.match(uploadStatusCopy("done", 1).detail, /Extracted or Unreadable/);
  assert.equal(formatFileSize(1536), "1.5 KB");
});
