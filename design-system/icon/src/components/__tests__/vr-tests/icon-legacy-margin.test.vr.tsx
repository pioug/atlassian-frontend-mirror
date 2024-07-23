import { snapshot } from '@af/visual-regression';

import LegacyIconMarginExample from '../../../../examples/106-new-icon-legacy-margin';

snapshot(LegacyIconMarginExample, {
	featureFlags: {
		'platform.design-system-team.enable-new-icons': [true, false],
	},
});
