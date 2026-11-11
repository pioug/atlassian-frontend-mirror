import { snapshot } from '@af/visual-regression';

import VrLayerShowOrderDialogDialog, {
	VrLayerShowOrderDialogPopover,
	VrLayerShowOrderDialogPopoverDialog,
	VrLayerShowOrderPopoverDialog,
	VrLayerShowOrderPopoverDialogPopover,
	VrLayerShowOrderPopoverPopover,
} from '../../examples/89-vr-layer-show-order.vr.ap';

// Nested layers that open in the same commit show in order: the innermost one is on top. This is a
// defensive fix for React's effect order. Do not design nested layers to open in the same commit.
const options = { drawsOutsideBounds: true } as const;

snapshot(VrLayerShowOrderDialogDialog, options);
snapshot(VrLayerShowOrderDialogPopover, options);
snapshot(VrLayerShowOrderPopoverPopover, options);
snapshot(VrLayerShowOrderPopoverDialog, options);
snapshot(VrLayerShowOrderDialogPopoverDialog, options);
snapshot(VrLayerShowOrderPopoverDialogPopover, options);
