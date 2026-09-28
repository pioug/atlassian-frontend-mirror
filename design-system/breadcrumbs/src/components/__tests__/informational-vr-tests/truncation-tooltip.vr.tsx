import { type Page } from '@af/integration-testing';
import { expect as playwrightExpect, snapshotInformational } from '@af/visual-regression';

import BreadcrumbsTruncation from '../../../../examples/11-truncation.vr.ap';

snapshotInformational(BreadcrumbsTruncation, {
	description: 'truncation tooltip',
	drawsOutsideBounds: true,
	featureFlags: {
		'platform_dst_breadcrumbs-refresh': [false, true],
	},
	prepare: async (page: Page) => {
		await page.getByTestId('truncation-tooltip-target').hover();
		const tooltip = page.getByRole('tooltip');
		await playwrightExpect(tooltip).toBeVisible();
		await playwrightExpect(tooltip).toHaveText('Supercalifragilisticexpialidocious');
	},
});
