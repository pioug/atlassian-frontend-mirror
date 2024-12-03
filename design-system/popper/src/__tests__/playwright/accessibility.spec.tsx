import { expect, test } from '@af/integration-testing';

test('Popper should pass basic aXe audit', async ({ page }) => {
	await page.visitExample('design-system', 'popper', 'scroll-container');
	const verticalScrollIdentifier = page.getByTestId('vertical-scroll-identifier');
	const horizontalScrollIdentifier = page.getByTestId('horizontal-scroll-identifier');
	const expandedPopup = page.getByTestId('expanded-popup');

	await verticalScrollIdentifier.scrollIntoViewIfNeeded();
	await expect(verticalScrollIdentifier).toBeVisible();

	await horizontalScrollIdentifier.scrollIntoViewIfNeeded();
	await expect(expandedPopup).toBeVisible();
});
