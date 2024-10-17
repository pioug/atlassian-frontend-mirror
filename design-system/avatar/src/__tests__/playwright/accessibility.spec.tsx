import { expect, test } from '@af/integration-testing';

const buttonTypeAvatar = "[data-testid='avataritem-onClick-0--itemInner']";
const hrefTypeAvatar = "[data-testid='avataritem-href-0--itemInner']";
const nonInteractiveAvatar = "[data-testid='avataritem-non-interactive-0--itemInner']";
const disabledAvatar = "[data-testid='avataritem-disabled-0--itemInner']";

test.describe('Avatar', () => {
	test('Basic render', async ({ page }) => {
		await page.visitExample('design-system', 'avatar', 'basicAvatarItem');
		await expect(page.locator(buttonTypeAvatar)).toBeVisible();
		await expect(page.locator(hrefTypeAvatar)).toBeVisible();
		await expect(page.locator(nonInteractiveAvatar)).toBeVisible();
		await expect(page.locator(disabledAvatar)).toBeVisible();
	});
	test('Interactive avatar should receive focus', async ({ page }) => {
		await page.visitExample('design-system', 'avatar', 'basicAvatarItem');
		await page.locator(buttonTypeAvatar).focus();
		await expect(page.locator(buttonTypeAvatar)).toBeFocused();
	});
});
