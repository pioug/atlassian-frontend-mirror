import { snapshot } from '@af/visual-regression';

import MenuGroupExample from '../../../examples/05-menu-group';

snapshot(MenuGroupExample, {
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
