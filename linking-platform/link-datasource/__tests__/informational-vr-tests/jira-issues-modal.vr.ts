// eslint-disable-next-line import/no-extraneous-dependencies
import type { Locator, Page } from '@playwright/test';

import { snapshotInformational } from '@af/visual-regression';

import JiraIssuesConfigModalFromButton from '../../examples/vr/jira-issues-config-modal-from-button';

snapshotInformational(JiraIssuesConfigModalFromButton, {
	prepare: async (page: Page, _component: Locator) => {
		await page.getByTestId('toggle-modal').first().click();
		await page.getByTestId('jira-datasource-modal').waitFor({
			state: 'visible',
		});
		page.keyboard.press('Escape'); // Close the modal to ensure it is not open
	},
	drawsOutsideBounds: true,
	description: 'Jira Issues Modal should return focus on Escape key press',
	featureFlags: {
		'navx-1180-sllv-return-focus-on-escape': true,
	},
});

snapshotInformational(JiraIssuesConfigModalFromButton, {
	prepare: async (page: Page, _component: Locator) => {
		await page.getByTestId('toggle-modal').first().click();
		await page.getByTestId('jira-datasource-modal').waitFor({
			state: 'visible',
		});
		page.keyboard.press('Escape'); // Close the modal to ensure it is not open
	},
	drawsOutsideBounds: true,
	description: 'Jira Issues Modal should not return focus on Escape key press',
	featureFlags: {
		'navx-1180-sllv-return-focus-on-escape': false,
	},
});
