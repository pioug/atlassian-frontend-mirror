import { snapshot } from '@af/visual-regression';

import {
	VrAlignEndShiftForwards,
	VrCenterShiftBackwardsBlockAxis,
	VrCenterShiftForwardsBlockAxis,
	VrCenterShiftForwardsInlineAxis,
	VrDiagonalFlipAlignStartShiftBackwards,
	VrDiagonalFlipAlignStartShiftForwards,
	VrJsFallbackAlignEndShiftBackwards,
	VrJsFallbackAlignEndShiftForwards,
	VrJsFallbackCenterShiftForwardsBlockAxis,
	VrSlideAlignEndShiftForwards,
	VrSlideAlignStartShiftBackwards,
	VrSlideInlineAxisShiftBackwards,
} from '../../examples/87-vr-popover-cross-axis-shift.vr.ap';

const opts = { drawsOutsideBounds: true } as const;

// `align: 'center'` is centered with `anchor-center`, which centers the MARGIN
// box, so a one-sided shift margin moved the popover only half the requested
// distance. These pin the full distance.
snapshot(VrCenterShiftForwardsBlockAxis, {
	...opts,
	description: 'center-shift-forwards-block-axis',
});
snapshot(VrCenterShiftBackwardsBlockAxis, {
	...opts,
	description: 'center-shift-backwards-block-axis',
});
snapshot(VrCenterShiftForwardsInlineAxis, {
	...opts,
	description: 'center-shift-forwards-inline-axis',
});

// The JS fallback resolves the shift into coordinates rather than margins, so it
// was never half strength. Pinned alongside the CSS path so the two cannot drift.
snapshot(VrJsFallbackCenterShiftForwardsBlockAxis, {
	...opts,
	description: 'js-fallback-center-shift-forwards-block-axis',
});

// `forwards` means "toward the cross-axis end" for every align value. The JS
// fallback moved `align: 'end'` the opposite way to the CSS path, so these two
// baselines used to be mirror images about the trigger. They should now be
// indistinguishable: same direction, same distance, on both positioning paths.
snapshot(VrAlignEndShiftForwards, { ...opts, description: 'align-end-shift-forwards' });
snapshot(VrJsFallbackAlignEndShiftForwards, {
	...opts,
	description: 'js-fallback-align-end-shift-forwards',
});
snapshot(VrJsFallbackAlignEndShiftBackwards, {
	...opts,
	description: 'js-fallback-align-end-shift-backwards',
});

// A one-sided shift margin lands on the un-anchored side once
// `position-try-fallbacks` slides the popover across the cross axis, where
// margin has no effect, so the shift used to vanish. Read these by measuring the
// popover's anchored edge against the trigger's: the gap between them is the
// shift, and it was zero before the fix.
//
// The shift points AWAY from the viewport edge that forced the slide in each of
// these. A slide only happens at an edge, so a shift pointing back at that edge
// pushes the popover off screen and the baseline captures a clipped box instead
// of a distance.
snapshot(VrSlideAlignStartShiftBackwards, {
	...opts,
	description: 'slide-align-start-shift-backwards',
});
snapshot(VrSlideAlignEndShiftForwards, {
	...opts,
	description: 'slide-align-end-shift-forwards',
});
snapshot(VrSlideInlineAxisShiftBackwards, {
	...opts,
	description: 'slide-inline-axis-shift-backwards',
});

// The diagonal flip (`flip-block flip-inline`), which is the one fallback where
// the shift does NOT keep its physical direction: a `<try-tactic>` swaps the
// start and end margins, so a cross-axis flip mirrors the shift along with the
// placement. Not a bug, but the exception to the contract the fixtures above pin,
// and previously untested. These two should land on opposite sides of the
// trigger's inline-end edge. See `notes/decisions/placement-offset.md`.
snapshot(VrDiagonalFlipAlignStartShiftForwards, {
	...opts,
	description: 'diagonal-flip-align-start-shift-forwards',
});
snapshot(VrDiagonalFlipAlignStartShiftBackwards, {
	...opts,
	description: 'diagonal-flip-align-start-shift-backwards',
});
