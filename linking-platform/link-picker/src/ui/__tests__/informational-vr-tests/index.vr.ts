import type { Locator, Page } from '@playwright/test';

import { snapshotInformational } from '@af/visual-regression';

import { DefaultExample } from '../../examples';

snapshotInformational(DefaultExample, {
	description:
		'Link Picker Invalid Url - displays correctly formatted error message when no url entered',
	featureFlags: {
		'navx-1368-link-picker-a11y-mandatory-states': true,
	},
	prepare: async (_: Page, component: Locator) => {
		await component.getByTestId('link-picker-insert-button').click();
	},
});
