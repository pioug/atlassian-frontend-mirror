import { expect, test } from '@af/integration-testing';

test('Checkbox should pass base aXe audit', async ({ page, skipAxeCheck }) => {
	await page.visitExample('design-system', 'checkbox', 'basic-usage');
	const checkboxLabel = page.getByTestId('cb-basic--checkbox-label');
	await expect(checkboxLabel).toBeVisible();
	// Remove skip after DSP-21544 is done
	skipAxeCheck();
});

test('Invalid Checkbox should pass base aXe audit', async ({ page, skipAxeCheck }) => {
	await page.visitExample('design-system', 'checkbox', 'basic-usage');
	const invalidCheckbox = page.getByTestId('cb-invalid--hidden-checkbox');
	await expect(invalidCheckbox.first()).toHaveAttribute('aria-invalid', 'true');
	// Remove skip after DSP-21544 is done
	skipAxeCheck();
});
