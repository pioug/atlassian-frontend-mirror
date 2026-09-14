import { snapshot } from '@af/visual-regression';

import SubtreeThemedPortal from '../../../examples/sub-tree-themed-portal.vr.ap';

snapshot(SubtreeThemedPortal, {
	drawsOutsideBounds: true,
});
