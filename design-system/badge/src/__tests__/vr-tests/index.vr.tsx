import { snapshot } from '@af/visual-regression';

import BadgeBasic from '../../../examples/0-basic';
import BadgeCustomization from '../../../examples/4-customization';
import BadgeContainers from '../../../examples/5-containers';

snapshot(BadgeCustomization, {
	featureFlags: {
		'platform.design-system-team.component-visual-refresh_t8zbo': [true, false],
	},
});
snapshot(BadgeContainers, {
	featureFlags: {
		'platform.design-system-team.component-visual-refresh_t8zbo': [true, false],
	},
});

snapshot(BadgeBasic, {
	variants: [
		{
			name: 'light',
			environment: {
				colorScheme: 'light',
			},
		},
		{
			name: 'dark',
			environment: {
				colorScheme: 'dark',
			},
		},
		{
			name: 'none',
			environment: {
				colorScheme: 'no-preference',
			},
		},
	],
	featureFlags: {
		'platform.design-system-team.component-visual-refresh_t8zbo': [true, false],
	},
});
