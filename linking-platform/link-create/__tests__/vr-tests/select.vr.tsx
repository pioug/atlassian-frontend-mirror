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

snapshot(DefaultSelect, {
	...options,
	featureFlags: {
		'platform_bandicoots-link-create-css': [true, false],
	},
});
snapshot(SelectorAllProps, {
	...options,
	featureFlags: {
		'linking-platform-create-field-error-association': [true, false],
		'platform_bandicoots-link-create-css': [true, false],
	},
});
