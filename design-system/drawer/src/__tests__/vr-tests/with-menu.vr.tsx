import { snapshot } from '@af/visual-regression';

import WithMenu from '../../../examples/01-drawer-menu';

snapshot(WithMenu, {
	drawsOutsideBounds: true,
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
