import { expect, test } from '@af/integration-testing';

const modalZIndex = 510;

const modalDialogPortalSelector = `div.atlaskit-portal[style="z-index: ${modalZIndex};"]`;

test('portal should be created when modal is opened and pass basic aXe audit', async ({ page }) => {
	await page.visitExample('design-system', 'portal', 'complex-layering');
	await page.getByTestId('dialog-trigger').click();

	const isModalPortalCreated =
		await page.webdriverCompatUtils.isAttached(modalDialogPortalSelector);
	expect(isModalPortalCreated).toBe(true);

	await expect(page.getByTestId('modal')).toBeVisible();
});
