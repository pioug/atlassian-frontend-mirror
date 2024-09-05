import { snapshot } from '@af/visual-regression';

import {
	DefaultInlineCreate,
	DefaultInlineCreateWithEditButton,
} from '../../examples/vr/vr-inline-create';

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

snapshot(DefaultInlineCreate, options);
snapshot(DefaultInlineCreateWithEditButton, options);
