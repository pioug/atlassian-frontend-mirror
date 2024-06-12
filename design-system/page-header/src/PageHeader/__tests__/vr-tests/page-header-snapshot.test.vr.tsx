import { snapshot } from '@af/visual-regression';

import Default from '../../../../examples/01-default';

snapshot(Default, {
	featureFlags: {
		'platform.design-system-team.page-header-tokenised-typography-styles_lj1ix': [false, true],
	},
});
