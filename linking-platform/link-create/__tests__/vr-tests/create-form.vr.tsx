import { snapshot } from '@af/visual-regression';

import {
	CreateFormHideFooter,
	CreateFormIsLoading,
	CreateFormWithAsyncSelect,
	CreateFormWithTextField,
	DefaultCreateForm,
} from '../../examples/vr/vr-create-form';

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

snapshot(DefaultCreateForm, {
	...options,
	featureFlags: {
		'platform_bandicoots-link-create-css': [true, false],
	},
});
snapshot(CreateFormIsLoading, {
	...options,
	featureFlags: {
		'platform_bandicoots-link-create-css': [true, false],
	},
});
snapshot(CreateFormHideFooter, {
	...options,
	featureFlags: {
		'platform_bandicoots-link-create-css': [true, false],
	},
});
snapshot(CreateFormWithTextField, {
	...options,
	featureFlags: {
		'platform_bandicoots-link-create-css': [true, false],
	},
});
snapshot(CreateFormWithAsyncSelect, {
	...options,
	featureFlags: {
		'platform_bandicoots-link-create-css': [true, false],
	},
});
