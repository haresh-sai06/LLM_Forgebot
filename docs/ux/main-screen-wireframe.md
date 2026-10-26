# Main screen wireframe — upload panel

Scope is the Bot Builder upload step only (`/builder`, step 2, “Upload Data”). The header, stepper, data-source tabs, guidelines column, and other pages stay as they are. This is not a new design system.

## Regions

```
+------------------------------------------------------------------+
| Bot Builder header (unchanged)                                   |
+------------------------------------------------------------------+
| Stepper: Choose Model · Upload Data · Customize · Train · Export |
+------------------------------------------------------------------+
| Upload Training Data                                             |
| +----------------------------------------+  +------------------+ |
| | PRIMARY PANEL (this change)            |  | Data Guidelines  | |
| | Status: Idle | Reading | Done          |  | (unchanged)      | |
| | one sentence under that word           |  |                  | |
| | +------------------------------------+ |  | Data Upload Limit| |
| | | Drop zone                          | |  | (unchanged)      | |
| | | Drag and drop files here           | |  +------------------+ |
| | | Upload training files              | |                     |
| | | Drop-zone text when a drag is over | |                     |
| | | [Browse Files]                     | |                     |
| | +------------------------------------+ |                     |
| | Result list                            |                     |
| | name — size — Read | Unreadable       |                     |
| | [Remove]                               |                     |
| +----------------------------------------+                     |
| Data Sources / Formats / Preprocessing tabs (unchanged)        |
+------------------------------------------------------------------+
| Previous / Next (unchanged)                                      |
+------------------------------------------------------------------+
```

The primary panel is the existing upload card. Drag and drop now accepts files. Browse still opens the same file input. Training is not started from this panel.

## Motion

On mount, the upload card fades in and moves at most 8px (translateY 8px to 0) over 240ms with ease-out. Opacity goes from 0 to 1. Nothing else on the page uses this animation. The project already has Framer Motion elsewhere; this card does not add a library and does not use the longer 20px slide already on the home page.

## Reduced motion

`panelEntranceMotion` in `src/lib/uploadPanelMotion.ts` is a pure function. It takes the `prefers-reduced-motion` match and does not read the DOM.

- `false`: animate, 240ms, 8px, opacity from 0, easing `ease-out`.
- `true`: do not animate, duration 0, translate 0, opacity from 1.

The card omits the `upload-panel-enter` class when the function returns `animate: false`. A `prefers-reduced-motion: reduce` rule also sets `animation: none` on that class.

## States

The status word is always visible text. Color is not the state.

- Idle: no files selected and nothing is being read.
- Reading: file headers are being read locally after browse or drop. The detail line says training has not started.
- Done: one or more files are listed. Each row ends with the word Read or Unreadable, plus the file size.

Removing every file returns the panel to Idle.
