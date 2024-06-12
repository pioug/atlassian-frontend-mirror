import { expect, test } from '@af/integration-testing';

const myBadgeAdded = "[data-testid='myBadgeAdded']";
const myBadgeDefault = "[data-testid='myBadgeDefault']";
const myBadgeImportant = "[data-testid='myBadgeImportant']";
const myBadgePrimary = "[data-testid='myBadgePrimary']";

test('Badge should be identified and visible by data-testid', async ({ page }) => {
	await page.visitExample('design-system', 'badge', 'testing');
	await expect(page.locator(myBadgeAdded).first()).toBeVisible();
	await expect(page.locator(myBadgeDefault).first()).toBeVisible();
	await expect(page.locator(myBadgeImportant).first()).toBeVisible();
	await expect(page.locator(myBadgePrimary).first()).toBeVisible();
	await expect(page.locator(myBadgeAdded).first()).toHaveText('2');
	await expect(page.locator(myBadgeDefault).first()).toHaveText('67');
	await expect(page.locator(myBadgeImportant).first()).toHaveText('20');
	await expect(page.locator(myBadgePrimary).first()).toHaveText('19');
});
