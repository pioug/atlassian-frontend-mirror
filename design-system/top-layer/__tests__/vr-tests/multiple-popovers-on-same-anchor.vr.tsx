import { snapshot } from '@af/visual-regression';

import VrMultiplePopoversOnSameAnchor from '../../examples/vr-multiple-popovers-on-same-anchor';

const opts = { drawsOutsideBounds: true } as const;

// Two manual Popovers anchored to the same trigger element with different
// placements (block-start above, block-end below). Both should render in
// their correct positions; regression coverage for the second
// useAnchorPosition call previously overwriting the first's anchor-name.
snapshot(VrMultiplePopoversOnSameAnchor, {
	...opts,
	description: 'multiple-popovers-on-same-anchor',
});
