import { expect, test } from '@af/integration-testing';

const exampleComponent = "[data-testid='image']";

test('Image should pass basic aXe audit', async ({ page }) => {
	await page.visitExample<typeof import('../../examples/themed.tsx')>(
		'design-system',
		'image',
		'themed',
	);
	const altText = page.locator(exampleComponent).first();
	await expect(page.locator(exampleComponent).first()).toBeVisible();
	await await expect(altText).toHaveAttribute('alt', 'Theming in action');
});
