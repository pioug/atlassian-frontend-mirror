import { snapshot } from '@af/visual-regression';

import CustomThemeExample from '../../examples/03-showcase-custom-theme';

snapshot(CustomThemeExample, {
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
