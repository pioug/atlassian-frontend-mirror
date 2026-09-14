import { expect, type Locator, test } from '@af/integration-testing';

const featureFlag = 'platform-dst-top-layer';

async function isPopoverOpen(locator: Locator): Promise<boolean> {
	return locator.evaluate((element: Element) => element.matches(':popover-open'));
}

test.describe('persistent inline Select menus in top-layer popovers', () => {
	test.beforeEach(async ({ page }) => {
		await page.visitExample<
			typeof import('../../../../../../examples/99-testing-persistent-inline-select-popovers.tsx')
		>('design-system', 'select', 'testing-persistent-inline-select-popovers', { featureFlag });
	});

	test('PopupSelect Escape closes only PopupSelect and leaves its containing popover open', async ({
		page,
	}) => {
		await page.getByRole('button', { name: 'Open PopupSelect outer popover' }).click();
		const outerPopover = page.getByTestId('popup-select-outer-popover');
		await expect(outerPopover).toBeVisible();
		expect(await isPopoverOpen(outerPopover)).toBe(true);

		await page.getByRole('button', { name: 'Open PopupSelect', exact: true }).click();
		await expect(page.getByTestId('persistent-popup-select--menu')).toBeVisible();

		await page.keyboard.press('Escape');

		await expect(page.getByTestId('persistent-popup-select--menu')).toBeHidden();
		await expect(outerPopover).toBeVisible();
		expect(await isPopoverOpen(outerPopover)).toBe(true);
	});

	test('bespoke Popup Escape closes only its persistent inline Select popup', async ({ page }) => {
		await page.getByRole('button', { name: 'Open bespoke outer popover' }).click();
		const outerPopover = page.getByTestId('bespoke-outer-popover');
		await expect(outerPopover).toBeVisible();
		expect(await isPopoverOpen(outerPopover)).toBe(true);

		await page.getByRole('button', { name: 'Open bespoke Select popup' }).click();
		const selectPopup = page.getByTestId('bespoke-select-popup');
		await expect(page.getByRole('listbox')).toBeVisible();
		expect(await isPopoverOpen(selectPopup)).toBe(true);

		await page.keyboard.press('Escape');

		await expect(selectPopup).toBeHidden();
		await expect(outerPopover).toBeVisible();
		expect(await isPopoverOpen(outerPopover)).toBe(true);
	});
});
