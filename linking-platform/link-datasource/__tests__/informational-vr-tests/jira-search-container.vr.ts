// eslint-disable-next-line import/no-extraneous-dependencies
import type { Locator, Page } from '@playwright/test';

// eslint-disable-next-line no-restricted-imports -- informational VR requires snapshotInformational API.
import { snapshotInformational } from '@af/visual-regression';

import JiraSearchContainerVR from '../../examples/vr/jira-search-container-vr.vr.ap';

snapshotInformational(JiraSearchContainerVR, {
	description: 'Jira search container at 200% zoom with Sample Scrum Project A selected',
	drawsOutsideBounds: true,
	prepare: async (page: Page, _component: Locator) => {
		await page.getByTestId('jlol-basic-filter-project-trigger').waitFor({ state: 'visible' });
		await page.evaluate(() => {
			document.body.style.zoom = '200%';
		});

		await page.getByTestId('jlol-basic-filter-project-trigger').click();

		const projectPopup = page.getByTestId(
			'jlol-basic-filter-project-popup-select-select--container',
		);
		await projectPopup.waitFor({ state: 'visible' });

		await page.fill('#jlol-basic-filter-project-popup-select--input', 'Sample Scrum Project A');

		const sampleProjectOption = projectPopup
			.locator('[data-testid="basic-filter-popup-select-option--icon-label"]')
			.getByText('Sample Scrum Project A', { exact: true });
		await sampleProjectOption.waitFor({ state: 'visible' });
		await sampleProjectOption.click();

		await page.getByTestId('jlol-basic-filter-project-trigger').click();
		await projectPopup.waitFor({ state: 'hidden' });
	},
	featureFlags: {
		platform_lp_jira_searchbar_wrap_a11y: true,
	},
});
