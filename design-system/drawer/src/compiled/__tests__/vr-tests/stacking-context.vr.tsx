import { snapshot } from '@af/visual-regression';

import StackingContext from '../../../../examples/102-composition-stacking-contexts';

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
