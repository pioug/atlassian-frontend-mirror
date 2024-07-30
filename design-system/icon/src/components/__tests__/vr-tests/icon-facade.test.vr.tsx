import { snapshot } from '@af/visual-regression';

import IconFacadeExample from '../../../../examples/vr/vr-icon-facade';

snapshot(IconFacadeExample, {
	featureFlags: {
		['platform-visual-refresh-icons-legacy-facade']: [true, false],
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
