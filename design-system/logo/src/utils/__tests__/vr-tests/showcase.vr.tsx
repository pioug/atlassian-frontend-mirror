import { snapshot } from '@af/visual-regression';

import ShowcaseExample from '../../../../examples/internal-logo-component/01-showcase';
import ShowcaseLegacyExample from '../../../../examples/internal-logo-component/02-showcase-legacy';

snapshot(ShowcaseExample, {
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
		// We explicitly want to test the dark theme variant, as we are going outside of the standard ADS light/dark
		// theming system.
		// e.g. icons use the exact same colors across both color modes, while the logos (wordmarks) do follow the theming.
		// eslint-disable-next-line @atlaskit/design-system/no-dark-theme-vr-tests
		{
			name: 'Dark',
			environment: {
				colorScheme: 'dark',
			},
		},
	],
	featureFlags: {
		'assets-platform-branding': true,
	},
});

snapshot(ShowcaseLegacyExample, {
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
