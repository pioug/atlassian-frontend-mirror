import { snapshot } from '@af/visual-regression';

import {
	VrArrowFlipBlockEnd,
	VrArrowFlipBlockEndAlignEnd,
	VrArrowFlipBlockEndAlignStart,
	VrArrowFlipBlockStart,
	VrArrowFlipBlockStartAlignEnd,
	VrArrowFlipBlockStartAlignStart,
	VrArrowFlipInlineEnd,
	VrArrowFlipInlineStart,
} from '../../examples/84-vr-popover-arrow-fallbacks';

const opts = { drawsOutsideBounds: true } as const;

// Single-axis flips
snapshot(VrArrowFlipBlockEnd, { ...opts, description: 'arrow-fallback-flip-block-end' });
snapshot(VrArrowFlipBlockStart, { ...opts, description: 'arrow-fallback-flip-block-start' });
snapshot(VrArrowFlipInlineEnd, { ...opts, description: 'arrow-fallback-flip-inline-end' });
snapshot(VrArrowFlipInlineStart, { ...opts, description: 'arrow-fallback-flip-inline-start' });

// Compound flips (corners)
snapshot(VrArrowFlipBlockEndAlignStart, {
	...opts,
	description: 'arrow-fallback-flip-block-end-align-start',
});
snapshot(VrArrowFlipBlockEndAlignEnd, {
	...opts,
	description: 'arrow-fallback-flip-block-end-align-end',
});
snapshot(VrArrowFlipBlockStartAlignStart, {
	...opts,
	description: 'arrow-fallback-flip-block-start-align-start',
});
snapshot(VrArrowFlipBlockStartAlignEnd, {
	...opts,
	description: 'arrow-fallback-flip-block-start-align-end',
});
