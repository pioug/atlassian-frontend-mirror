import { snapshot } from '@af/visual-regression';

import LegacyIconMarginExample from '../../../../examples/106-new-icon-legacy-margin';

snapshot(LegacyIconMarginExample, {
	featureFlags: {
		'platform-visual-refresh-icons': [true, false],
	},
});
