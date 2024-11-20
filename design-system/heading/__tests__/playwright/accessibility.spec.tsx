import { expect, test } from '@af/integration-testing';

test('Heading passes aXe audit', async ({ page }) => {
	await page.visitExample('design-system', 'heading', 'basic');
	const heading = page.getByTestId('heading-xxlarge');
	await heading.focus();
	await expect(heading).toBeVisible();
});
