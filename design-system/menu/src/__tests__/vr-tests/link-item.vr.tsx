import { snapshot } from '@af/visual-regression';

import LinkItem from '../../../examples/link-item';

snapshot(LinkItem, {
	featureFlags: {
		'platform.design-system-team.menu-tokenised-typography-styles': [false, true],
	},
});
