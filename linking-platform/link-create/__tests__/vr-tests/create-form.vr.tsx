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
			name: 'default',
			environment: {},
		},
		{
			name: 'light mode',
			environment: {
				colorScheme: 'light',
			},
		},
	],
};

snapshot(DefaultCreateForm, options);
snapshot(CreateFormIsLoading, options);
snapshot(CreateFormHideFooter, options);
snapshot(CreateFormWithTextField, options);
snapshot(CreateFormWithAsyncSelect, options);
