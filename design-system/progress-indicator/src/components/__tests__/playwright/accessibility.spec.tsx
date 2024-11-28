import { expect, test } from '@af/integration-testing';

test('ProgressIndicator, progress-indicator-appearances should pass basic aXe audit', async ({
	page,
}) => {
	await page.visitExample('design-system', 'progress-indicator', 'progress-indicator-appearances');

	await expect(page.locator('[data-testid="progress-indicator"]')).toBeVisible();
});

test('ProgressIndicator, progress-indicator-interaction should pass basic aXe audit', async ({
	page,
}) => {
	await page.visitExample('design-system', 'progress-indicator', 'progress-indicator-interaction');
	const indicator = page.locator('[data-testid="progress-indicator-ind-0"]');

	await expect(indicator).toBeVisible();
	await await expect(indicator).toHaveAttribute('aria-selected', 'true');
});
