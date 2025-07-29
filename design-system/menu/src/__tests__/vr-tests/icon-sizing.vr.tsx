import { snapshot } from '@af/visual-regression';

import IconSizing from '../../../examples/icon-sizing';

snapshot(IconSizing, {
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
