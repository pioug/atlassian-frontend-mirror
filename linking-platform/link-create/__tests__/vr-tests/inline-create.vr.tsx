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

snapshot(DefaultInlineCreate, {
	...options,
	featureFlags: {
		'platform_bandicoots-link-create-css': [true, false],
	},
});
snapshot(DefaultInlineCreateWithEditButton, {
	...options,
	featureFlags: {
		'platform_bandicoots-link-create-css': [true, false],
	},
});
