import { snapshot } from '@af/visual-regression';

// Import all examples
import Basic from '../../../examples/0-basic';
import Appearance from '../../../examples/1-appearance';
import Sizes from '../../../examples/5-sizes';
import DefensiveStyling from '../../../examples/6-defensive-styling';

// Test basic examples
snapshot(Basic, { featureFlags: { 'platform-logo-rebrand': [false, true] } });
snapshot(Appearance, {
	featureFlags: { 'platform-logo-rebrand': [false, true] },
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
snapshot(Sizes, { featureFlags: { 'platform-logo-rebrand': [false, true] } });
snapshot(DefensiveStyling, { featureFlags: { 'platform-logo-rebrand': [false, true] } });

// Test basic and appearance examples with the plaform-logo-rebrand-servco feature flag
snapshot(Basic, {
	featureFlags: {
		'platform-logo-rebrand': [false, true],
		'platform-logo-rebrand-servco': [false, true],
	},
});

const FlaggedPlatformLogos = Basic;
snapshot(FlaggedPlatformLogos, {
	featureFlags: {
		'platform-logo-rebrand-team-eu': [true],
	},
});

snapshot(Appearance, {
	featureFlags: {
		'platform-logo-rebrand': [false, true],
		'platform-logo-rebrand-servco': [false, true],
	},
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
