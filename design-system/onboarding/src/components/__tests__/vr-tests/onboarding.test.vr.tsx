import { snapshot } from '@af/visual-regression';

import SpotlightTargetHeight from '../../../../examples/104-spotlight-target-height';
import { SpotlightBasicChildrenFunctionDefaultOpenExample } from '../../../../examples/11-spotlight-basic-children-function';

snapshot(SpotlightTargetHeight, {
	variants: [
		{
			name: 'default',
			environment: {},
		},
		{
			name: 'light mode',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});

snapshot(SpotlightBasicChildrenFunctionDefaultOpenExample, { drawsOutsideBounds: true });
