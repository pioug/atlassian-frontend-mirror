// eslint-disable-next-line import/no-extraneous-dependencies
import type { Locator, Page } from '@playwright/test';

import { snapshotInformational } from '@af/visual-regression';

import SiteSelector from '../../examples/vr/site-selector-vr';
import SiteSelectorDisabled from '../../examples/vr/site-selector-vr-disabled';

snapshotInformational(SiteSelector, {
	prepare: async (page: Page, component: Locator) => {
		await page.getByTestId('jira-datasource-modal--site-selector__control').click();
	},
	description: 'platform-linking-visual-refresh-sllv is enabled',
	drawsOutsideBounds: true,
	featureFlags: {},
});

snapshotInformational(SiteSelectorDisabled, {
	description: 'site selector with disableSiteSelector set to true',
	featureFlags: {
		'add-disablesiteselector': true,
	},
});
