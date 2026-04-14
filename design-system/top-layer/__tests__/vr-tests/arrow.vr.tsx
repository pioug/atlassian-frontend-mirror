import { snapshot } from '@af/visual-regression';

import {
	VrArrowBlockEnd,
	VrArrowBlockEndAlignEnd,
	VrArrowBlockEndAlignStart,
	VrArrowBlockStart,
	VrArrowBlockStartAlignEnd,
	VrArrowBlockStartAlignStart,
	VrArrowInlineEnd,
	VrArrowInlineEndAlignEnd,
	VrArrowInlineEndAlignStart,
	VrArrowInlineStart,
	VrArrowInlineStartAlignEnd,
	VrArrowInlineStartAlignStart,
} from '../../examples/83-vr-popover-arrow';

const opts = { drawsOutsideBounds: true } as const;

// Single-axis
snapshot(VrArrowBlockStart, { ...opts, description: 'arrow-block-start' });
snapshot(VrArrowBlockEnd, { ...opts, description: 'arrow-block-end' });
snapshot(VrArrowInlineStart, { ...opts, description: 'arrow-inline-start' });
snapshot(VrArrowInlineEnd, { ...opts, description: 'arrow-inline-end' });

// Compound — block
snapshot(VrArrowBlockEndAlignStart, { ...opts, description: 'arrow-block-end-align-start' });
snapshot(VrArrowBlockEndAlignEnd, { ...opts, description: 'arrow-block-end-align-end' });
snapshot(VrArrowBlockStartAlignStart, { ...opts, description: 'arrow-block-start-align-start' });
snapshot(VrArrowBlockStartAlignEnd, { ...opts, description: 'arrow-block-start-align-end' });

// Compound — inline
snapshot(VrArrowInlineEndAlignStart, { ...opts, description: 'arrow-inline-end-align-start' });
snapshot(VrArrowInlineEndAlignEnd, { ...opts, description: 'arrow-inline-end-align-end' });
snapshot(VrArrowInlineStartAlignStart, { ...opts, description: 'arrow-inline-start-align-start' });
snapshot(VrArrowInlineStartAlignEnd, { ...opts, description: 'arrow-inline-start-align-end' });
