import { snapshot } from '@af/visual-regression';

import AllFlagsExample from '../../../examples/00-all-flags';
import AllFlagsDefaultIconsExample from '../../../examples/01-all-flags-default-icons';
import AllFlagsLegacyIcons from '../../../examples/02-all-flags-legacy-icons';
import FlagsDifferentIcons from '../../../examples/18-different-icons';
import ExplicitFontStyles from '../../../examples/19-explicit-font-styles';

const featureFlagVariants = {
	'jpo-41318-fix-flag-overflow-fg': true,
} as const;

snapshot(AllFlagsExample, {
	featureFlags: featureFlagVariants,
});
snapshot(AllFlagsDefaultIconsExample, {
	featureFlags: featureFlagVariants,
});
snapshot(AllFlagsLegacyIcons, {
	featureFlags: featureFlagVariants,
});
snapshot(FlagsDifferentIcons, {
	featureFlags: featureFlagVariants,
});

snapshot(ExplicitFontStyles, {
	description: 'Explicit font styles - default state',
	featureFlags: featureFlagVariants,
});
snapshot(ExplicitFontStyles, {
	description: 'Explicit font styles - action button hovered',
	featureFlags: featureFlagVariants,
	states: [
		{
			state: 'hovered',
			selector: {
				byRole: 'button',
				options: {
					name: 'Understood',
				},
			},
		},
	],
});

snapshot(ExplicitFontStyles, {
	description: 'Explicit font styles - action button focused',
	featureFlags: featureFlagVariants,
	states: [
		{
			state: 'focused',
			selector: {
				byRole: 'button',
				options: {
					name: 'Understood',
				},
			},
		},
	],
});
