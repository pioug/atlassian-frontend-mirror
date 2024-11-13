import { expect, test } from '@af/integration-testing';

test('Heading passes aXe audit', async ({ page }) => {
	await page.visitExample('design-system', 'heading', 'basic');
	const heading = page.getByTestId('headingH900');
	await heading.focus();
	await expect(heading).toBeVisible();
});
