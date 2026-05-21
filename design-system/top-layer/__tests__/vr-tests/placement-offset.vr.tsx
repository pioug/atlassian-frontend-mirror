import { snapshot } from '@af/visual-regression';

import {
	VrBlockEndAlignEndShiftBackwards,
	VrBlockEndAlignEndShiftForwards,
	VrBlockEndAlignStartShiftForwards,
	VrBlockEndGapAndShift,
	VrBlockEndGapLarge,
	VrBlockEndGapToken,
	VrBlockEndShiftBackwards,
	VrBlockEndShiftForwards,
	VrBlockEndShiftToken,
	VrBlockStartAlignEndShiftForwards,
	VrBlockStartShiftBackwards,
	VrBlockStartShiftForwards,
	VrFlipBlockEndShift,
	VrFlipBlockEndShiftBackwards,
	VrFlipBlockStartGapAndShift,
	VrFlipBlockStartShiftBackwards,
	VrFlipInlineEndShift,
	VrFlipInlineEndShiftBackwards,
	VrFlipInlineStartGapAndShift,
	VrFlipInlineStartShiftBackwards,
	VrInlineEndAlignEndShiftForwards,
	VrInlineEndShiftBackwards,
	VrInlineEndShiftForwards,
	VrInlineStartAlignEndShiftForwards,
	VrInlineStartShiftBackwards,
	VrInlineStartShiftForwards,
	VrJsFallbackBlockEndAlignEndShiftForwards,
	VrJsFallbackBlockEndGap,
	VrJsFallbackBlockEndGapAndShift,
	VrJsFallbackBlockEndGapToken,
	VrJsFallbackBlockEndShift,
	VrJsFallbackBlockEndShiftBackwards,
	VrJsFallbackBlockEndShiftToken,
	VrJsFallbackInlineEndGap,
	VrJsFallbackInlineEndShift,
} from '../../examples/85-vr-popover-placement-offset';

const opts = { drawsOutsideBounds: true } as const;

// Block-axis shift (cross axis is inline)
snapshot(VrBlockEndShiftForwards, { ...opts, description: 'block-end-shift-forwards' });
snapshot(VrBlockEndShiftBackwards, { ...opts, description: 'block-end-shift-backwards' });
snapshot(VrBlockStartShiftForwards, { ...opts, description: 'block-start-shift-forwards' });
snapshot(VrBlockStartShiftBackwards, { ...opts, description: 'block-start-shift-backwards' });

// Inline-axis shift (cross axis is block)
snapshot(VrInlineEndShiftForwards, { ...opts, description: 'inline-end-shift-forwards' });
snapshot(VrInlineEndShiftBackwards, { ...opts, description: 'inline-end-shift-backwards' });
snapshot(VrInlineStartShiftForwards, { ...opts, description: 'inline-start-shift-forwards' });
snapshot(VrInlineStartShiftBackwards, { ...opts, description: 'inline-start-shift-backwards' });

// Shift combined with non-default align
snapshot(VrBlockEndAlignStartShiftForwards, {
	...opts,
	description: 'block-end-align-start-shift-forwards',
});
snapshot(VrBlockEndAlignEndShiftBackwards, {
	...opts,
	description: 'block-end-align-end-shift-backwards',
});

// Align: 'end' + shift forwards (locks in the per-align margin-side fix)
snapshot(VrBlockEndAlignEndShiftForwards, {
	...opts,
	description: 'block-end-align-end-shift-forwards',
});
snapshot(VrBlockStartAlignEndShiftForwards, {
	...opts,
	description: 'block-start-align-end-shift-forwards',
});
snapshot(VrInlineEndAlignEndShiftForwards, {
	...opts,
	description: 'inline-end-align-end-shift-forwards',
});
snapshot(VrInlineStartAlignEndShiftForwards, {
	...opts,
	description: 'inline-start-align-end-shift-forwards',
});

// Custom gap
snapshot(VrBlockEndGapLarge, { ...opts, description: 'block-end-gap-large' });
snapshot(VrBlockEndGapAndShift, { ...opts, description: 'block-end-gap-and-shift' });

// Token strings (probe + cache resolution path)
snapshot(VrBlockEndGapToken, { ...opts, description: 'block-end-gap-token' });
snapshot(VrBlockEndShiftToken, { ...opts, description: 'block-end-shift-token' });

// Section A: JS fallback path with non-default offset
snapshot(VrJsFallbackBlockEndGap, { ...opts, description: 'js-fallback-block-end-gap' });
snapshot(VrJsFallbackBlockEndShift, { ...opts, description: 'js-fallback-block-end-shift' });
snapshot(VrJsFallbackInlineEndGap, { ...opts, description: 'js-fallback-inline-end-gap' });
snapshot(VrJsFallbackInlineEndShift, { ...opts, description: 'js-fallback-inline-end-shift' });

// JS fallback: backwards shift (signed-pixel resolution)
snapshot(VrJsFallbackBlockEndShiftBackwards, {
	...opts,
	description: 'js-fallback-block-end-shift-backwards',
});

// JS fallback: align: 'end' + shift forwards (per-align sign flip)
snapshot(VrJsFallbackBlockEndAlignEndShiftForwards, {
	...opts,
	description: 'js-fallback-block-end-align-end-shift-forwards',
});

// JS fallback: combined custom gap and shift
snapshot(VrJsFallbackBlockEndGapAndShift, {
	...opts,
	description: 'js-fallback-block-end-gap-and-shift',
});

// JS fallback: design-token gap + shift (DOM-probe resolution)
snapshot(VrJsFallbackBlockEndGapToken, {
	...opts,
	description: 'js-fallback-block-end-gap-token',
});
snapshot(VrJsFallbackBlockEndShiftToken, {
	...opts,
	description: 'js-fallback-block-end-shift-token',
});

// Section B: CSS edge flip with non-default offset
snapshot(VrFlipBlockEndShift, { ...opts, description: 'flip-block-end-shift' });
snapshot(VrFlipBlockStartGapAndShift, {
	...opts,
	description: 'flip-block-start-gap-and-shift',
});
snapshot(VrFlipInlineEndShift, { ...opts, description: 'flip-inline-end-shift' });
snapshot(VrFlipInlineStartGapAndShift, {
	...opts,
	description: 'flip-inline-start-gap-and-shift',
});

// Section B (continued): backwards-shift through a flip
snapshot(VrFlipBlockEndShiftBackwards, {
	...opts,
	description: 'flip-block-end-shift-backwards',
});
snapshot(VrFlipBlockStartShiftBackwards, {
	...opts,
	description: 'flip-block-start-shift-backwards',
});
snapshot(VrFlipInlineEndShiftBackwards, {
	...opts,
	description: 'flip-inline-end-shift-backwards',
});
snapshot(VrFlipInlineStartShiftBackwards, {
	...opts,
	description: 'flip-inline-start-shift-backwards',
});
