import { snapshot } from '@af/visual-regression';

import Example from '../../../../examples/vr/vr-new-icon-button';

snapshot(Example, {
	featureFlags: {
		['platform-visual-refresh-icons']: [true, false],
	},
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
