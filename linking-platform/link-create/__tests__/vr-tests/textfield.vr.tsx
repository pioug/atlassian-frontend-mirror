import { snapshot } from '@af/visual-regression';

import { DefaultTextField, TextFieldWithMultiProps } from '../../examples/vr/vr-textfield';

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

snapshot(DefaultTextField, {
	...options,
});
snapshot(TextFieldWithMultiProps, {
	...options,
	featureFlags: {
		'linking-platform-create-field-error-association': [true, false],
	},
});
