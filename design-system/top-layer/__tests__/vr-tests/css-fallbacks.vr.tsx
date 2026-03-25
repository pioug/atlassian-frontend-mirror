import { snapshot } from '@af/visual-regression';

import {
	VrFlipBlock,
	VrFlipBoth,
	VrFlipInline,
} from '../../examples/81-vr-popover-css-fallbacks';

const opts = { drawsOutsideBounds: true } as const;

snapshot(VrFlipBlock, { ...opts, description: 'css-fallback-flip-block' });
snapshot(VrFlipInline, { ...opts, description: 'css-fallback-flip-inline' });
snapshot(VrFlipBoth, { ...opts, description: 'css-fallback-flip-both' });
