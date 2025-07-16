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
	featureFlags: {
		platform_ads_component_no_icon_spacing_support: [true, false],
	},
});
