import { expect, test } from '@af/integration-testing';

const featureFlag = 'platform-dst-popper-consolidation';

test.describe('PopupSelect Popper consolidation', () => {
	test('smoke: opens, stays anchored, and closes when the flag is forced on', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/18-popup-select.vr.ap.tsx')>(
			'design-system',
			'select',
			'popup-select',
			{ featureFlag },
		);

		const trigger = page.getByTestId('button-for-testing');
		const menu = page.getByTestId('select-for-testing--menu');
		await trigger.click();
		await expect(menu).toBeVisible();
		await expect(menu).toBeInViewport();

		const [triggerBounds, menuBounds] = await Promise.all([
			trigger.boundingBox(),
			menu.boundingBox(),
		]);
		expect(triggerBounds).not.toBeNull();
		expect(menuBounds).not.toBeNull();
		expect(menuBounds?.y).toBeGreaterThanOrEqual(triggerBounds?.y ?? 0);

		await page.keyboard.press('Escape');
		await expect(menu).toBeHidden();
	});
});
