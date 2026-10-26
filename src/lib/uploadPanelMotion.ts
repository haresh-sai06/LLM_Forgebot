export type UploadPhase = "idle" | "reading" | "done";

export type PanelEntranceMotion = {
  animate: boolean;
  durationMs: number;
  translatePx: number;
  opacityFrom: number;
  easing: "ease-out";
};

const ENTRANCE_MS = 240;
const ENTRANCE_PX = 8;

/**
 * Decides the upload card entrance from the prefers-reduced-motion flag.
 * Callers pass the media-query result; this function does not touch the DOM.
 */
export function panelEntranceMotion(prefersReducedMotion: boolean): PanelEntranceMotion {
  if (prefersReducedMotion) {
    return {
      animate: false,
      durationMs: 0,
      translatePx: 0,
      opacityFrom: 1,
      easing: "ease-out",
    };
  }

  return {
    animate: true,
    durationMs: ENTRANCE_MS,
    translatePx: ENTRANCE_PX,
    opacityFrom: 0,
    easing: "ease-out",
  };
}

export function uploadPanelPhase(fileCount: number, isReading: boolean): UploadPhase {
  if (isReading) return "reading";
  if (fileCount > 0) return "done";
  return "idle";
}

export function uploadStatusCopy(phase: UploadPhase, fileCount: number): { label: string; detail: string } {
  if (phase === "reading") {
    return {
      label: "Reading",
      detail: "Extracting text with the local ingest module. Training has not started.",
    };
  }
  if (phase === "done") {
    const noun = fileCount === 1 ? "file" : "files";
    return {
      label: "Done",
      detail: `${fileCount} ${noun} ready. Each row says Extracted or Unreadable.`,
    };
  }
  return {
    label: "Idle",
    detail: "No files selected. Drop files here or use Browse Files.",
  };
}

export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "Unknown size";
  if (bytes < 1024) return `${Math.round(bytes)} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
