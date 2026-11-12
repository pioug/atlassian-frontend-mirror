import { Device, snapshot } from '@af/visual-regression';

import {
	VrAnchorFloorCramped,
	VrAnchorFloorRoomy,
	VrFitFloorCrampedDefault,
	VrFitFloorCrampedMinSizeZero,
	VrFitFloorRoomyDefault,
	VrFitFloorRoomyMinSizeZero,
	VrFitFloorShortViewport,
	VrJsFallbackFitFloorModestCell,
	VrJsFallbackFitFloorRoomy,
} from '../../examples/89-vr-popover-fit-floor.vr.ap';

const opts = { drawsOutsideBounds: true } as const;

// The floor's former COST, now removed where `calc-size()` is supported. VR runs
// Chromium, where the default floor is never more than the content, so this hugs
// its 56px content like the `minSize: 0` control below. Safari and Firefox still
// stretch it to the 150px floor; `fit-available-space.spec.tsx` pins that.
snapshot(VrFitFloorRoomyDefault, { ...opts, description: 'fit-floor-roomy-default' });

// The same fixture with `placement.minSize: 0` as the ONLY difference. In VR
// (Chromium) the two snapshots now match apart from the label, because the
// content-sized floor asks for no more than the content. Where `calc-size()` is
// not supported, the height difference between them is the floor and nothing else.
snapshot(VrFitFloorRoomyMinSizeZero, { ...opts, description: 'fit-floor-roomy-min-size-zero' });

// The floor's BENEFIT: only 40px of room below the anchor, so the floored margin
// box overflows the cell and the popover moves above it at full size.
snapshot(VrFitFloorCrampedDefault, { ...opts, description: 'fit-floor-cramped-default' });

// The escape hatch in the same cramped cell: with no floor nothing moves the
// clamped popover, so it letterboxes below the anchor.
snapshot(VrFitFloorCrampedMinSizeZero, { ...opts, description: 'fit-floor-cramped-min-size-zero' });

// The JavaScript fallback twins of the two fixtures above, which had none: the
// floor is CSS-path-only, so `js-fallback-fit-floor-roomy` hugs the same 56px
// content that `fit-floor-roomy-default` stretches to 150px wherever `calc-size()`
// is not supported. Read them as a pair.
// What the pair guards is the popover's SIZE and SIDE on both paths; every
// fixture in this file renders a solid block rather than a `PopoverSurface`, so
// none of them says anything about the surface's own rendering.
snapshot(VrJsFallbackFitFloorRoomy, { ...opts, description: 'js-fallback-fit-floor-roomy' });

// The same absence as a SIDE rather than a size, which is the harm the floor
// would do here: 56px of content fits the 90px cell, so the popover stays below
// the anchor. With the floor written on this path neither side holds its margin
// box and it flips above instead.
snapshot(VrJsFallbackFitFloorModestCell, {
	...opts,
	description: 'js-fallback-fit-floor-modest-cell',
});

// The floor's VALUE. `<Popup shouldFitContainer shouldFitViewport>` on a small
// trigger, floored at the ANCHOR's width, where the old
// `max(150px, anchor-size(self-inline))` rendered an 80px trigger's popover at
// 150px.
snapshot(VrAnchorFloorRoomy, { ...opts, description: 'fit-floor-anchor-roomy' });

// The same anchor floor against the viewport edge: the smaller floor still makes
// the margin box overflow the cell, so the popover moves to the inline-start
// side rather than letterboxing.
snapshot(VrAnchorFloorCramped, { ...opts, description: 'fit-floor-anchor-cramped' });

// The default floor YIELDING, on the only VR device short enough to show it:
// 393px wide with a 100px anchor, so neither cell holds the unclamped 163px
// margin box. Unclamped the popover hung off the inline-end edge; clamped it
// flips to the roomier cell. The block-axis twin is Playwright case E.
snapshot(VrFitFloorShortViewport, {
	...opts,
	description: 'fit-floor-short-viewport',
	variants: [{ name: 'mobile', device: Device.MOBILE_CHROME }],
});
