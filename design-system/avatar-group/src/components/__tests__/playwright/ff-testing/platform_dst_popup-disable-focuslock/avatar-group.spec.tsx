// Will be removed in scope of https://product-fabric.atlassian.net/browse/DSP-19675

import { expect, test } from '@af/integration-testing';

const avatarInsideSpan = "span[data-testid='overrides--avatar-0--inner']";

const overflowMenuTrigger = "[data-testid='overrides--overflow-menu--trigger']";

const overflowMenuItemInsideButton = "button[data-testid='overrides--avatar-group-item-4']";

test('should have non interactive avatar inside span', async ({ page }) => {
	await page.visitExample('design-system', 'avatar-group', 'non-interactive-avatar-group', {
		featureFlag: 'platform_dst_popup-disable-focuslock',
	});
	await expect(page.locator(avatarInsideSpan)).toBeVisible();
});

test('should have non interactive overflowed avatar items inside button', async ({ page }) => {
	await page.visitExample('design-system', 'avatar-group', 'non-interactive-avatar-group', {
		featureFlag: 'platform_dst_popup-disable-focuslock',
	});
	await page.click(overflowMenuTrigger);
	await expect(page.locator(overflowMenuItemInsideButton)).toBeVisible();
});
