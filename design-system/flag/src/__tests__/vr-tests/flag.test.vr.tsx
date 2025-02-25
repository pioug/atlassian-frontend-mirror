import { snapshot } from '@af/visual-regression';

import AllFlagsExample from '../../../examples/00-all-flags';
import AllFlagsDefaultIconsExample from '../../../examples/01-all-flags-default-icons';
import AllFlagsLegacyIcons from '../../../examples/02-all-flags-legacy-icons';
import FlagsDifferentIcons from '../../../examples/18-different-icons';

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
