import { snapshot } from '@af/visual-regression';

import StackingContext from '../../../examples/42-drawer-stacking-contexts.vr.ap';

snapshot(StackingContext, {
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
