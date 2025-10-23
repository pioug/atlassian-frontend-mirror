import { snapshot } from '@af/visual-regression';

import CustomThemeExample from '../../../../examples/internal-logo-component/03-showcase-custom-theme';

snapshot(CustomThemeExample, {
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
	featureFlags: {
		'assets-platform-branding': true,
	},
});
