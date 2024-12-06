import type { Locator, Page } from '@playwright/test';

import { snapshotInformational } from '@af/visual-regression';

import BasicAvatarGroup from '../../../../examples/02-basic-avatar-group';
import OverridesMoreIndicatorExample from '../../../../examples/30-overrides-more-indicator';

snapshotInformational(BasicAvatarGroup, {
	prepare: async (page: Page, component: Locator) => {
		await component.getByTestId('stack--overflow-menu--trigger').click();
	},
	description: 'More indicator should open overflow dropdown',
});

snapshotInformational(OverridesMoreIndicatorExample, {
	prepare: async (page: Page, component: Locator) => {
		await component.getByTestId('stack--overflow-menu--trigger-0').click();
	},
	description: 'More indicator with override should open overflow dropdown',
});
