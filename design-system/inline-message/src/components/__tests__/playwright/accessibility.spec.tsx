import { expect, test } from '@af/integration-testing';

test('InlineMessage should pass base aXe audit', async ({ page }) => {
	await page.visitExample('design-system', 'inline-message', 'basic');

	const inlineMessage = page.getByTestId('inline-message--button');

	await inlineMessage.focus();
	await expect(inlineMessage).toBeFocused();
	await expect(inlineMessage.first()).toHaveAttribute('aria-expanded', 'false');

	await inlineMessage.click();
	await expect(inlineMessage.first()).toHaveAttribute('aria-expanded', 'true');
});
