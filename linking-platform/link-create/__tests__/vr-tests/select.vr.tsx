import { snapshot } from '@af/visual-regression';

import { DefaultSelect, SelectorAllProps } from '../../examples/vr/vr-select';

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

snapshot(DefaultSelect, options);
snapshot(SelectorAllProps, options);
