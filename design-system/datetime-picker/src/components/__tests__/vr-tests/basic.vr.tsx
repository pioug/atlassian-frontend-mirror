import { snapshot } from '@af/visual-regression';

import BasicExamples from '../../../../examples/00-basic';

snapshot(BasicExamples, {
	variants: [
		{
			environment: { colorScheme: 'light' },
			name: 'light',
		},
	],
});
