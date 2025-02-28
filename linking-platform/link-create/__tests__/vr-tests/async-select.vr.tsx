import { snapshot } from '@af/visual-regression';

import { AsyncSelectorAllProps, DefaultAsyncSelect } from '../../examples/vr/vr-async-select';

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

snapshot(DefaultAsyncSelect, {
	...options,
});
snapshot(AsyncSelectorAllProps, {
	...options,
	featureFlags: {
		'linking-platform-create-field-error-association': [true, false],
	},
});
