import { expect, test } from '@af/integration-testing';

test('focus should not go beyond drawer container', async ({ page }) => {
	await page.visitExample<typeof import('../../../examples/02-drawer-default.vr.ap.tsx')>(
		'design-system',
		'drawer',
		'drawer-default',
		{ 'react-18-mode': 'modern' },
	);
	const drawerTrigger = page.getByTestId('drawer-trigger');
	await drawerTrigger.click();
	await drawerTrigger.focus();
	await expect(drawerTrigger).not.toBeFocused();
});
