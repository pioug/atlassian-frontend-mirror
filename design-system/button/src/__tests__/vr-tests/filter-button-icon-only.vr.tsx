import { snapshot } from '@af/visual-regression';

import FilterButtonIconOnlyExample from '../../../examples/99-filter-button-icon-only.vr.ap';

snapshot(FilterButtonIconOnlyExample, {
	description: 'Icon-only filter buttons with and without a count',
	variants: [{ name: 'Light', environment: { colorScheme: 'light' as const } }],
	featureFlags: {
		'platform-dst-tokens-finesse': [false, true],
	},
});
