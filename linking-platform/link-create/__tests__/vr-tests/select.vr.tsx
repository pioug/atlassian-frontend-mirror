import { snapshot } from '@af/visual-regression';

import { DefaultSelect, SelectorAllProps } from '../../examples/vr/vr-select';

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

snapshot(DefaultSelect, options);
snapshot(SelectorAllProps, {
	...options,
	featureFlags: { 'linking-platform-create-field-error-association': [true, false] },
});
