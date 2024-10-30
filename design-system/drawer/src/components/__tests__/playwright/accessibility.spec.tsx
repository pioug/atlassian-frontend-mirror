import { expect, test } from '@af/integration-testing';

test('focus should not go beyond drawer container', async ({ page }) => {
	await page.visitExample('design-system', 'drawer', 'drawer-default');
	const drawerTrigger = page.getByTestId('drawer-trigger');
	await drawerTrigger.click();
	await drawerTrigger.focus();
	await expect(drawerTrigger).not.toBeFocused();
});
