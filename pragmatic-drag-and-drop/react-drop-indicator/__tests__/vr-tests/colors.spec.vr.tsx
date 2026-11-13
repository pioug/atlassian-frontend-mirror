import { snapshot } from '@af/visual-regression';

import ColorsExample, { CustomTheme } from '../../examples/colors.vr.ap';

snapshot(ColorsExample, {
	variants: [
		{ name: 'light', environment: { colorScheme: 'light' } },
		// eslint-disable-next-line @atlaskit/design-system/no-dark-theme-vr-tests -- DSP-26300 requires dark comparisons of the both color schemes over the destination background.
		{ name: 'dark', environment: { colorScheme: 'dark' } },
	],
	featureFlags: {
		'platform-dst-tokens-finesse': [false, true],
	},
});

snapshot(CustomTheme, {
	variants: [
		{ name: 'light', environment: { colorScheme: 'light' } },
		// eslint-disable-next-line @atlaskit/design-system/no-dark-theme-vr-tests -- DSP-26300 requires custom-theme compatibility comparisons in dark mode.
		{ name: 'dark', environment: { colorScheme: 'dark' } },
	],
	featureFlags: {
		'platform-dst-tokens-finesse': [false, true],
	},
});
