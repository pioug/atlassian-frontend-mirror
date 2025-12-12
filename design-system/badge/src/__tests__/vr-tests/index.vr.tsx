import { snapshot } from '@af/visual-regression';

import BadgeBasic from '../../../examples/0-basic';
import BadgeCustomization from '../../../examples/4-customization';
import BadgeContainers from '../../../examples/5-containers';
import BadgeVisualUplifts from '../../../examples/6-badge-visual-uplifts-behind-ff';

snapshot(BadgeCustomization);
snapshot(BadgeContainers);

snapshot(BadgeBasic, {
	variants: [
		{
			name: 'light',
			environment: {
				colorScheme: 'light',
			},
		},
		{
			name: 'none',
			environment: {
				colorScheme: 'no-preference',
			},
		},
	],
});

snapshot(BadgeVisualUplifts, {
	description: 'badge-visual-uplifts-ff-on',
	featureFlags: {
		'platform-dst-lozenge-tag-badge-visual-uplifts': true,
	},
	variants: [
		{
			name: 'visual-uplift',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});

snapshot(BadgeVisualUplifts, {
	description: 'badge-visual-uplifts-ff-off',
	featureFlags: {
		'platform-dst-lozenge-tag-badge-visual-uplifts': false,
	},
	variants: [
		{
			name: 'visual-uplift',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
