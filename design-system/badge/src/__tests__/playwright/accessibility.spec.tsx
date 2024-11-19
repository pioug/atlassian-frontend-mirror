import { expect, test } from '@af/integration-testing';

const badgeAdded = "[data-testid='myBadgeAdded']";
const badgeDefault = "[data-testid='myBadgeDefault']";
const badgeImportant = "[data-testid='myBadgeImportant']";
const badgePrimary = "[data-testid='myBadgePrimary']";

test('Badge should pass basic aXe audit', async ({ page }) => {
	await page.visitExample('design-system', 'badge', 'testing');
	await expect(page.locator(badgeAdded).first()).toBeVisible();
	await expect(page.locator(badgeDefault).first()).toBeVisible();
	await expect(page.locator(badgeImportant).first()).toBeVisible();
	await expect(page.locator(badgePrimary).first()).toBeVisible();
});
