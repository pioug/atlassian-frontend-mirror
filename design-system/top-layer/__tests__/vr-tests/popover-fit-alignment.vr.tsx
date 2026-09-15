import { snapshot } from '@af/visual-regression';

import {
	VrFitAlignBottomEnd,
	VrFitAlignBottomStart,
	VrFitAlignRightStart,
} from '../../examples/84-vr-popover-fit-alignment.vr.ap';

const opts = { drawsOutsideBounds: true } as const;

// A fitting `align: 'start'` / `'end'` popover lands its border box ON the
// anchor's edge. The fit margins used to pad both cross-axis sides, insetting it
// by 5px. Each fixture has a ruler flush on the aligned edge, so a regression
// reads as a 5px gap. See `notes/decisions/fit-available-space.md`.
snapshot(VrFitAlignBottomStart, { ...opts, description: 'fit-align-bottom-start' });

// The mirror: `align: 'end'` pads its inline-START side, so the inline-end edge
// stays on the anchor's.
snapshot(VrFitAlignBottomEnd, { ...opts, description: 'fit-align-bottom-end' });

// The same on an INLINE placement, where the cross axis is block: the popover's
// top edge on the trigger's, not 5px below it.
snapshot(VrFitAlignRightStart, { ...opts, description: 'fit-align-right-start' });
