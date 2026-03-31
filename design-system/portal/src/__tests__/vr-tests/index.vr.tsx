import { snapshot } from '@af/visual-regression';

import SubtreeThemedPortal from '../../../examples/sub-tree-themed-portal';

snapshot(SubtreeThemedPortal, {
	drawsOutsideBounds: true,
});
