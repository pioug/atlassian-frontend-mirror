import { snapshot } from '@af/visual-regression';

import OverflowExample from '../../../../examples/140-overflow.vr.ap';

snapshot(OverflowExample, {
	drawsOutsideBounds: true,
});
