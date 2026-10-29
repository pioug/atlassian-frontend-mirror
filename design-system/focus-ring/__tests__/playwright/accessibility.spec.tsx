import { expect, test } from '@af/integration-testing';

test('focus ring preserves keyboard focus and has no accessibility violations', async ({
	page,
}) => {
	await page.visitExample<typeof import('../../examples/00-basic.vr.ap.tsx')>(
		'design-system',
		'focus-ring',
		'basic',
	);
	const input = page.getByTestId('input');
	const nativeButton = page.getByRole('button', { name: 'Native Button' });
	await expect(nativeButton).toBeFocused();
	await page.keyboard.press('Tab');
	await page.keyboard.press('Tab');
	await expect(input).toBeFocused();
	await expect(page).toBeAccessible();
});
