import { snapshot } from '@af/visual-regression';

import {
	VrJsFallbackBlockEnd,
	VrJsFallbackBlockEndAlignEnd,
	VrJsFallbackBlockEndAlignStart,
	VrJsFallbackBlockStart,
	VrJsFallbackInlineEnd,
	VrJsFallbackInlineEndAlignEnd,
	VrJsFallbackInlineEndAlignStart,
	VrJsFallbackInlineStart,
} from '../../examples/82-vr-popover-js-fallback';

const opts = { drawsOutsideBounds: true } as const;

snapshot(VrJsFallbackBlockEnd, { ...opts, description: 'js-fallback-block-end' });
snapshot(VrJsFallbackBlockStart, { ...opts, description: 'js-fallback-block-start' });
snapshot(VrJsFallbackInlineEnd, { ...opts, description: 'js-fallback-inline-end' });
snapshot(VrJsFallbackInlineStart, { ...opts, description: 'js-fallback-inline-start' });
snapshot(VrJsFallbackBlockEndAlignStart, {
	...opts,
	description: 'js-fallback-block-end-align-start',
});
snapshot(VrJsFallbackBlockEndAlignEnd, { ...opts, description: 'js-fallback-block-end-align-end' });
snapshot(VrJsFallbackInlineEndAlignStart, {
	...opts,
	description: 'js-fallback-inline-end-align-start',
});
snapshot(VrJsFallbackInlineEndAlignEnd, {
	...opts,
	description: 'js-fallback-inline-end-align-end',
});
