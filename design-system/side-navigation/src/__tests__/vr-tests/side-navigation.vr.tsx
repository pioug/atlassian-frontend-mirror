import { snapshot } from '@af/visual-regression';

import NestedSideNavigation from '../../../examples/00-nested-side-navigation';

snapshot(NestedSideNavigation, {
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
