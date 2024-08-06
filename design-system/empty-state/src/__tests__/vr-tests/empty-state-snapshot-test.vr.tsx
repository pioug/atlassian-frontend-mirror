import { snapshot } from '@af/visual-regression';

import Basic from '../../../examples/0-basic';

snapshot(Basic, {
	featureFlags: {
		'platform.design-system-team.empty-state-typography-updates_gndrj': [false, true],
	},
});
