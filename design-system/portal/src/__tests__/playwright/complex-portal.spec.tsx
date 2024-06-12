import { expect, test } from '@af/integration-testing';
import { layers } from '@atlaskit/theme/constants';

const tooltipZIndex = layers.tooltip();
const modalZIndex = 510;
const spotlightZIndex = 701;

const tooltipPortalSelector = `div.atlaskit-portal[style="z-index: ${tooltipZIndex};"]`;
const modalPortalSelector = `div.atlaskit-portal[style="z-index: ${modalZIndex};"]`;
const spotlightPortalSelector = `div.atlaskit-portal[style="z-index: ${spotlightZIndex};"]`;
const openDialogButtonSelector = 'span:has-text("Open Dialog")';
const showOnboardingButtonSelector = 'span:has-text("Show onboarding")';
const clickMeTooltipSelector = 'div[role="tooltip"]:has-text("Click me")';
const parentModalDialogSelector = 'section[role="dialog"]';

test('When we hover over "Open Dialog" button then "Click Me" tooltip should be visible and a portal should be created', async ({
	page,
}) => {
	await page.visitExample('design-system', 'portal', 'complex-layering');
	await page.locator(openDialogButtonSelector).first().hover();
	const tooltip = page.locator(tooltipPortalSelector).locator(clickMeTooltipSelector).first();
	await expect(tooltip).toBeVisible();
	await expect(tooltip).toHaveText('Click me');
});

test('When we click on "Open Dialog" button then a parent modal dialog should be visible and a portal should be created', async ({
	page,
}) => {
	await page.visitExample('design-system', 'portal', 'complex-layering');
	await page.locator(openDialogButtonSelector).first().click();
	const modal = page.locator(modalPortalSelector).locator(parentModalDialogSelector).first();
	const modalHeader = modal.locator('[data-testid="modal--header"]').first();

	await expect(modal).toBeVisible();
	await expect(modalHeader).toHaveText('Modal dialog');
});

test('When we click on "Show onboarding" button then a spot light should be visible and a portal should be created', async ({
	page,
}) => {
	await page.visitExample('design-system', 'portal', 'complex-layering');
	await page.locator(openDialogButtonSelector).first().click();
	const parentModal = page.locator(modalPortalSelector).locator(parentModalDialogSelector).first();
	const showOnboardingButton = parentModal.locator(showOnboardingButtonSelector).first();
	await showOnboardingButton.click();

	const isSpotlightExisting = await page.webdriverCompatUtils.isAttached(spotlightPortalSelector);
	expect(isSpotlightExisting).toBe(true);
});
