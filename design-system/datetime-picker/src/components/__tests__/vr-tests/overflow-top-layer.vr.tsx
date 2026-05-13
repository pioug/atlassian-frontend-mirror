import { snapshot } from '@af/visual-regression';

import OverflowExample from '../../../../examples/140-overflow';

snapshot(OverflowExample, {
	drawsOutsideBounds: true,
	featureFlags: {
		'platform-dst-top-layer': [true, false],
	},
});
