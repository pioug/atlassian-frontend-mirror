import { snapshot } from '@af/visual-regression';

import {
	VrSurfaceResetColorDialog,
	VrSurfaceResetColorPopover,
} from '../../examples/83-vr-surface-reset-color.vr.ap';

// Guards the `color` surface reset on the `Popover` and `Dialog` hosts. Each host
// opens inside a red region that sets `color.text` to vivid blue, and holds
// uncoloured text. The text must render blue. Red text means the region colour
// leaked in. Black text means the UA `color: CanvasText` came back. The blue is
// needed because the VR threshold cannot tell #000 from the real `color.text`.
// See `surfaceResetStyles` in
// src/popover/popover.tsx and src/dialog/dialog-content.tsx.
const opts = { drawsOutsideBounds: true } as const;

snapshot(VrSurfaceResetColorPopover, { ...opts, description: 'surface-reset-color-popover' });
snapshot(VrSurfaceResetColorDialog, { ...opts, description: 'surface-reset-color-dialog' });
