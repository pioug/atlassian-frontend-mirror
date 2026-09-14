import { snapshot } from '@af/visual-regression';

import {
	VrPopoverWidthFromAnchorMatchAnchor,
	VrPopoverWidthFromAnchorMinAnchor,
	VrPopoverWidthFromAnchorNone,
} from '../../examples/86-vr-popover-width-from-anchor.vr.ap';

snapshot(VrPopoverWidthFromAnchorNone, { drawsOutsideBounds: true });
snapshot(VrPopoverWidthFromAnchorMatchAnchor, { drawsOutsideBounds: true });
snapshot(VrPopoverWidthFromAnchorMinAnchor, { drawsOutsideBounds: true });
