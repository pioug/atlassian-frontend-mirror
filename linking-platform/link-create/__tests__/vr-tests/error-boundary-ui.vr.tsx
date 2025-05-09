import { snapshot } from '@af/visual-regression';

import { DefaultErrorBoundary } from '../../examples/vr/vr-error-boundary-ui';

type OptionsType = Parameters<typeof snapshot>[1];

const options: OptionsType = {
	variants: [
		{
			name: 'light mode',
			environment: {
				colorScheme: 'light',
			},
		},
	],
};

snapshot(DefaultErrorBoundary, {
	...options,
	featureFlags: {
		'platform-link-create-button-migration': [true, false],
	},
});
