import { snapshot } from '@af/visual-regression';

import SubTreeThemingExample from '../../../examples/10-subtree-theming';

snapshot(SubTreeThemingExample, {
	description: 'Subtree theming',
	featureFlags: {
		'platform_dst_subtree_theming': true,
	},
});
