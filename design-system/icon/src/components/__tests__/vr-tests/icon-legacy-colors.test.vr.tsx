import { snapshot } from '@af/visual-regression';

import LegacyIconColorExample from '../../../../examples/105-new-icon-legacy-colors';

snapshot(LegacyIconColorExample, {
	featureFlags: {
		'platform-visual-refresh-icons': [true, false],
	},
});
