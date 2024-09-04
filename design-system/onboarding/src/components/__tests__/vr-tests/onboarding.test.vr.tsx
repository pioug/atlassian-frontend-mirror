import { snapshot } from '@af/visual-regression';

import SpotlightTargetTabs from '../../../../examples/105-spotlight-target-tabs';

snapshot(SpotlightTargetTabs, {
	variants: [
		{
			name: 'default',
			environment: {},
		},
		{
			name: 'light mode',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
