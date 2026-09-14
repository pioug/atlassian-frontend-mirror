import { snapshot } from '@af/visual-regression';

import {
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

// `'none'` is the mode the content floor belongs to, so it cannot wrap: it
// overflows and `position-try-fallbacks` repositions it. This is the contrast that
// pins the content floor as a `'none'` concern and deliberately not a
// `'min-anchor'` one. See `notes/decisions/width-from-anchor-floors.md`.
snapshot(VrNoneNarrowSpan, { ...opts, description: 'none-narrow-span' });

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
