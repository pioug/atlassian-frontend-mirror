import { snapshot } from '@af/visual-regression';

import RawIconsExample from '../../examples/05-raw-icons';

snapshot(RawIconsExample, {
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
