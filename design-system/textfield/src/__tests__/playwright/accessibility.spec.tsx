import { expect, test } from '@af/integration-testing';

test('Textfield should pass aXe audit', async ({ page }) => {
	await page.visitExample('design-system', 'textfield', 'variations');

	const inputWithError = page.getByTestId('invalid');
	const requiredInput = page.getByTestId('required');
	const baseInput = page.getByTestId('event-handlers');

	await inputWithError.focus();
	await expect(inputWithError).toBeFocused();
	await expect(inputWithError.first()).toHaveAttribute('aria-invalid', 'true');

	await requiredInput.focus();
	await expect(requiredInput).toBeFocused();
	await expect(requiredInput.first()).toHaveAttribute('required');

	await baseInput.focus();
	await expect(baseInput).toBeFocused();
});
