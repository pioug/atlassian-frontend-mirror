import { snapshot } from '@af/visual-regression';

import AllFlagsExample from '../../../examples/00-all-flags';
import AllFlagsDefaultIconsExample from '../../../examples/01-all-flags-default-icons';
import AllFlagsLegacyIcons from '../../../examples/02-all-flags-legacy-icons';
import FlagsDifferentIcons from '../../../examples/18-different-icons';
import ExplicitFontStyles from '../../../examples/19-explicit-font-styles';

snapshot(AllFlagsExample, {
	featureFlags: {
		platform_ads_component_no_icon_spacing_support: [true, false],
	},
});
snapshot(AllFlagsDefaultIconsExample, {
	featureFlags: {
		platform_ads_component_no_icon_spacing_support: [true, false],
	},
});
snapshot(AllFlagsLegacyIcons, {
	featureFlags: {
		platform_ads_component_no_icon_spacing_support: [true, false],
	},
});
snapshot(FlagsDifferentIcons, {
	featureFlags: {
		platform_ads_component_no_icon_spacing_support: [true, false],
	},
});

snapshot(ExplicitFontStyles, {
	description: 'Explicit font styles - default state',
	featureFlags: {
		platform_ads_explicit_font_styles: [true, false],
	},
});
snapshot(ExplicitFontStyles, {
	description: 'Explicit font styles - action button hovered',
	featureFlags: {
		platform_ads_explicit_font_styles: true,
	},
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
	featureFlags: {
		platform_ads_explicit_font_styles: true,
	},
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
