import { snapshot } from '@af/visual-regression';

import {
	VrJsFallbackBlockEnd,
	VrJsFallbackBlockEndAlignEnd,
	VrJsFallbackBlockEndAlignStart,
	VrJsFallbackBlockStart,
	VrJsFallbackBlockStartAlignEnd,
	VrJsFallbackBlockStartAlignStart,
	VrJsFallbackInlineEnd,
	VrJsFallbackInlineEndAlignEnd,
	VrJsFallbackInlineEndAlignStart,
	VrJsFallbackInlineStart,
	VrJsFallbackInlineStartAlignEnd,
	VrJsFallbackInlineStartAlignStart,
} from '../../examples/82-vr-popover-js-fallback';

const opts = { drawsOutsideBounds: true } as const;

// Single-axis
snapshot(VrJsFallbackBlockEnd, { ...opts, description: 'js-fallback-block-end' });
snapshot(VrJsFallbackBlockStart, { ...opts, description: 'js-fallback-block-start' });
snapshot(VrJsFallbackInlineEnd, { ...opts, description: 'js-fallback-inline-end' });
snapshot(VrJsFallbackInlineStart, { ...opts, description: 'js-fallback-inline-start' });

// Compound — block axis
snapshot(VrJsFallbackBlockEndAlignStart, {
	...opts,
	description: 'js-fallback-block-end-align-start',
});
snapshot(VrJsFallbackBlockEndAlignEnd, { ...opts, description: 'js-fallback-block-end-align-end' });
snapshot(VrJsFallbackBlockStartAlignStart, {
	...opts,
	description: 'js-fallback-block-start-align-start',
});
snapshot(VrJsFallbackBlockStartAlignEnd, {
	...opts,
	description: 'js-fallback-block-start-align-end',
});

// Compound — inline axis
snapshot(VrJsFallbackInlineEndAlignStart, {
	...opts,
	description: 'js-fallback-inline-end-align-start',
});
snapshot(VrJsFallbackInlineEndAlignEnd, {
	...opts,
	description: 'js-fallback-inline-end-align-end',
});
snapshot(VrJsFallbackInlineStartAlignStart, {
	...opts,
	description: 'js-fallback-inline-start-align-start',
});
snapshot(VrJsFallbackInlineStartAlignEnd, {
	...opts,
	description: 'js-fallback-inline-start-align-end',
});
