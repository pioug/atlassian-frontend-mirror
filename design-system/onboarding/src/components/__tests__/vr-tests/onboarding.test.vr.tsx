import { snapshot } from '@af/visual-regression';

import SpotlightTargetTabs from '../../../../examples/105-spotlight-target-tabs';
import { SpotlightBasicChildrenFunctionDefaultOpenExample } from '../../../../examples/11-spotlight-basic-children-function';

snapshot(SpotlightTargetTabs, {
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
