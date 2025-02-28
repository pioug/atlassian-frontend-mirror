import type { Locator, Page } from '@playwright/test';

import { snapshotInformational } from '@af/visual-regression';

import { CreateFormWithRequiredFields } from '../../examples/vr/vr-create-form';

type OptionsType = Parameters<typeof snapshotInformational>[1];

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

snapshotInformational(CreateFormWithRequiredFields, {
	...options,
	prepare: async (_: Page, component: Locator) => {
		await component.getByRole('button', { name: 'Create' }).click();
	},
});
