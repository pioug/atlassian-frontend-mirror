import { snapshot } from '@af/visual-regression';

import {
	VrBlockEnd,
	VrBlockEndInlineEnd,
	VrBlockEndInlineStart,
	VrBlockStart,
	VrBlockStartInlineEnd,
	VrBlockStartInlineStart,
	VrInlineEnd,
	VrInlineEndBlockEnd,
	VrInlineEndBlockStart,
	VrInlineStart,
	VrInlineStartBlockEnd,
	VrInlineStartBlockStart,
} from '../../examples/80-vr-popover-placements';

const opts = { drawsOutsideBounds: true } as const;

// Single-axis
snapshot(VrBlockStart, { ...opts, description: 'placement-block-start' });
snapshot(VrBlockEnd, { ...opts, description: 'placement-block-end' });
snapshot(VrInlineStart, { ...opts, description: 'placement-inline-start' });
snapshot(VrInlineEnd, { ...opts, description: 'placement-inline-end' });

// Compound
snapshot(VrBlockStartInlineStart, { ...opts, description: 'placement-block-start-inline-start' });
snapshot(VrBlockStartInlineEnd, { ...opts, description: 'placement-block-start-inline-end' });
snapshot(VrBlockEndInlineStart, { ...opts, description: 'placement-block-end-inline-start' });
snapshot(VrBlockEndInlineEnd, { ...opts, description: 'placement-block-end-inline-end' });
snapshot(VrInlineStartBlockStart, { ...opts, description: 'placement-inline-start-block-start' });
snapshot(VrInlineStartBlockEnd, { ...opts, description: 'placement-inline-start-block-end' });
snapshot(VrInlineEndBlockStart, { ...opts, description: 'placement-inline-end-block-start' });
snapshot(VrInlineEndBlockEnd, { ...opts, description: 'placement-inline-end-block-end' });
