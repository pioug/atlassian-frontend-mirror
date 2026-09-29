import { type Page } from '@af/integration-testing';
import { expect as playwrightExpect, snapshotInformational } from '@af/visual-regression';

import { ScalableBreadcrumbIcons } from '../../../../examples/11-truncation.vr.ap';

snapshotInformational(ScalableBreadcrumbIcons, {
	description: 'icons and focus ring at enlarged root font size',
	drawsOutsideBounds: true,
	featureFlags: { 'platform_dst_breadcrumbs-refresh': true },
	prepare: async (page: Page) => {
		const link = page.getByTestId('scalable-medium');
		await page.evaluate(() => {
			document.documentElement.style.fontSize = '32px';
		});
		for (const size of ['medium', 'small']) {
			const icon = page.getByTestId(`scalable-${size}--icon-before`);
			await playwrightExpect(icon).toHaveCSS('width', '48px');
			await playwrightExpect(icon).toHaveCSS('height', '48px');
			await playwrightExpect(icon.locator('svg')).toHaveCSS('width', '32px');
			await playwrightExpect(page.getByTestId(`scalable-${size}`)).toHaveCSS(
				'max-width',
				size === 'medium' ? '192px' : '188px',
			);
		}
		await link.focus();
		await playwrightExpect(link).toBeFocused();
	},
});
