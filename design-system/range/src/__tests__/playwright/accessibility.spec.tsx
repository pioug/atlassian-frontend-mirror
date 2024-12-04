import { expect, test } from '@af/integration-testing';

test('should be rendered and pass basic aXe audit', async ({ page }) => {
	await page.visitExample('design-system', 'range', 'basic-example-uncontrolled');
	await expect(page.getByTestId('range-uncontrolled').first()).toBeVisible();
});
