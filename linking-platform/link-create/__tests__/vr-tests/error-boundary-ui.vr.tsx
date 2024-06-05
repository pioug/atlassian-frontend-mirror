import { snapshot } from '@af/visual-regression';

import { DefaultErrorBoundary } from '../../examples/vr/vr-error-boundary-ui';

type OptionsType = Parameters<typeof snapshot>[1];

const options: OptionsType = {
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
		{
			name: 'dark mode',
			environment: {
				colorScheme: 'dark',
			},
		},
	],
};

snapshot(DefaultErrorBoundary, options);
