import { snapshot } from '@af/visual-regression';

import {
	VrFitBackstopTallerThanViewport,
	VrFitScrollCappedSurface,
} from '../../examples/89-vr-popover-fit-scroll.vr.ap';

const opts = { drawsOutsideBounds: true } as const;

// What a capped popover LOOKS like, which the geometry tests in
// `__tests__/playwright/fit-available-space.spec.tsx` measure but cannot review:
// the surface scrolling inside the cap, its sticky footer pinned to the bottom of
// the scrollport, and its rounded edge and shadow 5px clear of the viewport
// bottom. Uncapped, the popover is 600px tall and all of that is off screen.
snapshot(VrFitScrollCappedSurface, { ...opts, description: 'fit-scroll-capped-surface' });

// Rule 3's unconditional viewport backstop, with NOTHING fitting: no cell cap, no
// flip floor, and `max-block-size: calc(100dvh - 10px)` alone holding 2000px of
// content. An inline placement centres it vertically, so both capped block edges
// land on screen.
snapshot(VrFitBackstopTallerThanViewport, {
	...opts,
	description: 'fit-backstop-taller-than-viewport',
});
