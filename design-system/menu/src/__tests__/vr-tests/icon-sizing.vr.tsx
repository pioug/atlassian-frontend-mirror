import { snapshot } from '@af/visual-regression';

import IconSizing from '../../../examples/icon-sizing';

snapshot(IconSizing, {
	featureFlags: {
		platform_ads_component_no_icon_spacing_support: [true, false],
	},
});
