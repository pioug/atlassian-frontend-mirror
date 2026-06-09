import { snapshot } from '@af/visual-regression';

import {
	VrFlipBlock,
	VrFlipBlockEnd,
	VrFlipBlockEndAlignEnd,
	VrFlipBlockEndAlignStart,
	VrFlipBlockStart,
	VrFlipBlockStartAlignEnd,
	VrFlipBlockStartAlignStart,
	VrFlipBoth,
	VrFlipInline,
	VrFlipInlineEnd,
	VrFlipInlineEndAlignEnd,
	VrFlipInlineEndAlignStart,
	VrFlipInlineStart,
} from '../../examples/81-vr-popover-css-fallbacks';

const opts = { drawsOutsideBounds: true } as const;

// Legacy aliases — preserve existing snapshot names
snapshot(VrFlipBlock, { ...opts, description: 'css-fallback-flip-block' });
snapshot(VrFlipInline, { ...opts, description: 'css-fallback-flip-inline' });
snapshot(VrFlipBoth, { ...opts, description: 'css-fallback-flip-both' });

// Single-axis flips — all 4 edges
snapshot(VrFlipBlockEnd, { ...opts, description: 'css-fallback-flip-block-end' });
snapshot(VrFlipBlockStart, { ...opts, description: 'css-fallback-flip-block-start' });
snapshot(VrFlipInlineEnd, { ...opts, description: 'css-fallback-flip-inline-end' });
snapshot(VrFlipInlineStart, { ...opts, description: 'css-fallback-flip-inline-start' });

// Compound flips — block axis with alignment (corners)
snapshot(VrFlipBlockEndAlignStart, {
	...opts,
	description: 'css-fallback-flip-block-end-align-start',
});
snapshot(VrFlipBlockEndAlignEnd, { ...opts, description: 'css-fallback-flip-block-end-align-end' });
snapshot(VrFlipBlockStartAlignStart, {
	...opts,
	description: 'css-fallback-flip-block-start-align-start',
});
snapshot(VrFlipBlockStartAlignEnd, {
	...opts,
	description: 'css-fallback-flip-block-start-align-end',
});

// Compound flips — inline axis with alignment (corners)
snapshot(VrFlipInlineEndAlignStart, {
	...opts,
	description: 'css-fallback-flip-inline-end-align-start',
});
snapshot(VrFlipInlineEndAlignEnd, {
	...opts,
	description: 'css-fallback-flip-inline-end-align-end',
});
