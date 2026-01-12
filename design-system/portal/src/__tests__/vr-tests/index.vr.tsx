import { snapshot } from '@af/visual-regression';

import SubtreeThemedPortal from '../../../examples/sub-tree-themed-portal';

snapshot(SubtreeThemedPortal, {
	featureFlags: {
		platform_dst_subtree_theming: [true, false],
	},
	drawsOutsideBounds: true,
});
