import { snapshot } from '@af/visual-regression';

import {
	VrContentWidthRowActionSlides,
	VrMatchAnchorNarrowSpan,
	VrMinAnchorNarrowAnchorLongContent,
	VrMinAnchorNarrowSpan,
	VrMinAnchorWideAnchorShortContent,
	VrNoneNarrowSpan,
} from '../../examples/88-vr-popover-min-anchor-narrow-span.vr.ap';

const opts = { drawsOutsideBounds: true } as const;

// The three modes in the same narrow span, which is where their floors decide
// whether the popover wraps or overflows. `'min-anchor'` is floored at the anchor
// width only, so it wraps down to it.
snapshot(VrMinAnchorNarrowSpan, { ...opts, description: 'min-anchor-narrow-span' });

// `'content'` is its natural width, so it overflows the span and slides to the
// inline-end-aligned cell on one line. See
// `notes/decisions/fit-available-space.md` -> Update (2026-09-04).
snapshot(VrNoneNarrowSpan, { ...opts, description: 'none-narrow-span' });

// The same slide in the consumer shape it exists for: a row-action menu near the
// inline-end edge with `inlineSize` left on `'content'`.
snapshot(VrContentWidthRowActionSlides, {
	...opts,
	description: 'content-width-row-action-slides',
});

// `'match-anchor'` has no floor: exactly the anchor width, so it wraps to that
// width and leaves the span's slack unused.
snapshot(VrMatchAnchorNarrowSpan, { ...opts, description: 'match-anchor-narrow-span' });

// The anchor floor in a roomy span, where the popover is free to size to its
// content: the floor binds when the anchor is wider, and does not when the
// content is.
snapshot(VrMinAnchorWideAnchorShortContent, {
	...opts,
	description: 'min-anchor-wide-anchor-short-content',
});
snapshot(VrMinAnchorNarrowAnchorLongContent, {
	...opts,
	description: 'min-anchor-narrow-anchor-long-content',
});
