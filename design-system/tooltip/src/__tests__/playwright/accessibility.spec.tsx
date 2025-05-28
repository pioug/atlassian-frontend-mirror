import { expect, test } from '@af/integration-testing';

test('Tooltip should pass basic aXe audit', async ({ page }) => {
	await page.visitExample('design-system', 'tooltip', 'default-tooltip', {
		'react-18-mode': 'legacy',
	});

	await page.getByRole('button', { name: 'Hover over me' }).hover();
	await expect(page.getByTestId('default-tooltip')).toBeVisible();
});

test('Nesting Tooltip should pass basic aXe audit', async ({ page }) => {
	await page.visitExample('design-system', 'tooltip', 'nesting', { 'react-18-mode': 'legacy' });

	await page.getByRole('button', { name: 'Hover over me or my icon' }).hover();
	await expect(page.getByTestId('outer-nesting-tooltip')).toBeVisible();

	await page.getByTestId('icon').hover();
	await expect(page.getByTestId('inner-nesting-tooltip')).toBeVisible();
});
