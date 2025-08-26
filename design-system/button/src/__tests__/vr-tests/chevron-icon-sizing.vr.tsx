import { snapshot } from '@af/visual-regression';

import ChevronIconSizingExample from '../../../examples/35-chevron-icon-sizing';

snapshot(ChevronIconSizingExample, {
	description: 'Chevron icon sizing',
	featureFlags: {
		platform_dst_button_chevron_sizing: [true, false],
	},
});
