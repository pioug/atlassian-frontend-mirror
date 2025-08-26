import { snapshot } from '@af/visual-regression';

import SizeFunctionExample from '../../../../examples/09-size-function';

snapshot(SizeFunctionExample, {
	featureFlags: {
		['platform_dst_button_chevron_sizing']: [true, false],
	},
});
