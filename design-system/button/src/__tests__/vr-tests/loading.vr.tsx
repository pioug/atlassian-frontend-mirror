import { snapshot } from '@af/visual-regression';

import LoadingExample from '../../../examples/75-loading';

// FIXME Jest 29 - dark varient of this VR test keep failing
snapshot.skip(LoadingExample, {
	variants: [
		{
			name: 'Default',
			environment: {},
		},
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
