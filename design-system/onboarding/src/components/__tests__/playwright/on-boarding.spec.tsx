import { expect, test } from '@af/integration-testing';

const tellMeMoreBtn = '[type="button"]';
const dynamicTargetStartBtn = '#Start';
const hideShowBtn = '#Hide';
const spotlight1 = '[data-testid = "spotlight1--dialog"]';
const spotlight2 = '[data-testid = "spotlight2--dialog"]';
const spotlight3 = '[data-testid = "spotlight3--dialog"]';

test('Spotlight tour should not break if a target is not rendered', async ({ page }) => {
	await page.visitExample('design-system', 'onboarding', 'spotlight-with-conditional-targets');

	// start the spotlight tour
	await page.locator(dynamicTargetStartBtn).first().click();
	await expect(page.locator(spotlight1)).toBeVisible();

	await page.locator(tellMeMoreBtn).first().click();
	await expect(page.locator(spotlight2)).toBeVisible();

	await page.locator(tellMeMoreBtn).first().click();
	await expect(page.locator(spotlight3)).toBeVisible();

	await page.locator(tellMeMoreBtn).first().click();

	// hide the second element
	await page.locator(hideShowBtn).first().click();

	const element = ' #examples > div> div:nth-child(2)';
	const text = await page.locator(element).first().textContent();
	expect(text).toBe('Third Element');

	// start the spotlight tour again
	await page.locator(dynamicTargetStartBtn).first().click();
	await expect(page.locator(spotlight1)).toBeVisible();

	await page.locator(tellMeMoreBtn).first().click();
	await expect(page.locator(spotlight3)).toBeVisible();
});
