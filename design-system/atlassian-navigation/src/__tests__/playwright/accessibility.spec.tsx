import { expect, test } from '@af/integration-testing';

test('Atlassian-navigation, should pass basic aXe audit', async ({ page }) => {
	await page.visitExample('design-system', 'atlassian-navigation', 'jira-integration-example');
	await expect(page.locator('[data-testid="atlassian-navigation-header"]')).toBeVisible();
	await expect(
		page.locator('[data-testid="atlassian-navigation-secondary-actions"]'),
	).toBeVisible();
});
