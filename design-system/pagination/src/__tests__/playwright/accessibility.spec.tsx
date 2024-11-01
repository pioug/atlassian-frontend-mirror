import { expect, test } from '@af/integration-testing';

test('First pagination item should be focused', async ({ page }) => {
	await page.visitExample('design-system', 'pagination', 'basic');
	await page.locator('[data-testid="pagination--current-page-0"]').focus();
	await expect(page.locator('[data-testid="pagination--current-page-0"]')).toBeFocused();
});

test('Active pagination item should have aria-current', async ({ page }) => {
	await page.visitExample('design-system', 'pagination', 'basic');
	await page.locator('[data-testid="pagination--current-page-0"]').focus();
	await page.keyboard.press('Tab');
	await page.keyboard.press('Enter');
	await expect(page.locator('[data-testid="pagination--current-page-1"]').first()).toHaveAttribute(
		'aria-current',
		'page',
	);
});

test('Prev pagination button should disabled at first init', async ({ page }) => {
	await page.visitExample('design-system', 'pagination', 'basic');
	await expect(page.locator('[data-testid="pagination--left-navigator"]').first()).toHaveAttribute(
		'disabled',
	);
});

test('Prev pagination button should not be disabled after activate any pagination item after the first', async ({
	page,
}) => {
	await page.visitExample('design-system', 'pagination', 'basic');
	await page.locator('[data-testid="pagination--current-page-0"]').focus();
	await page.keyboard.press('Tab');
	await page.keyboard.press('Enter');
	const prevButtonNotDisabled = await page
		.locator('[data-testid="pagination--left-navigator"]')
		.first()
		.getAttribute('disabled');
	expect(prevButtonNotDisabled).toBeNull();
});
