import { snapshot } from '@af/visual-regression';

import {
	VrPopoverWidthFromAnchorMatchAnchor,
	VrPopoverWidthFromAnchorMinAnchor,
	VrPopoverWidthFromAnchorNone,
} from '../../examples/86-vr-popover-width-from-anchor';

snapshot(VrPopoverWidthFromAnchorNone, { drawsOutsideBounds: true });
snapshot(VrPopoverWidthFromAnchorMatchAnchor, { drawsOutsideBounds: true });
snapshot(VrPopoverWidthFromAnchorMinAnchor, { drawsOutsideBounds: true });
