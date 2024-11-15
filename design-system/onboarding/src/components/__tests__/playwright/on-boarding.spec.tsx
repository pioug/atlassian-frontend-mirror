import { expect, test } from '@af/integration-testing';

const tellMeMoreBtn = '[type="button"]';
const dynamicTargetStartBtn = '#Start';
const hideShowBtn = '#Hide';
const spotlight1 = '[data-testid = "spotlight1--dialog"]';
const spotlight2 = '[data-testid = "spotlight2--dialog"]';
const spotlight3 = '[data-testid = "spotlight3--dialog"]';
const referencedLabelSpotlightTrigger = '[data-testid="open-spotlight-referenced-label"]';
const explicitLabelSpotlightTrigger = '[data-testid="open-spotlight-explicit-label"]';
const referencedLabelSpotlight = '[data-testid="referenced-label--dialog-container"]';
const explicitLabelSpotlight = '[data-testid="explicit-label--dialog-container"]';

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
	const text = page.locator(element).first();
	await expect(text).toHaveText('Third Element');

	// start the spotlight tour again
	await page.locator(dynamicTargetStartBtn).first().click();
	await expect(page.locator(spotlight1)).toBeVisible();

	await page.locator(tellMeMoreBtn).first().click();
	await expect(page.locator(spotlight3)).toBeVisible();
});

[true, false].forEach((ffValue) => {
	test(`Focus should not go beyond spotlight dialog, FG ${ffValue}`, async ({ page }) => {
		await page.visitExample(
			'design-system',
			'onboarding',
			'spotlight-dialog-width',
			ffValue
				? {
						featureFlag: 'platform_dst_onboarding-bump-react-focus-lock',
					}
				: {},
		);
		const spotlightDialogTrigger = page.getByTestId('spotlight-dialog-trigger');
		await spotlightDialogTrigger.click();
		await spotlightDialogTrigger.focus();
		await expect(spotlightDialogTrigger).not.toBeFocused();
	});
});

test('Spotlight dialog should match a11y dialog pattern', async ({ page }) => {
	/**
	 * a11y dialog pattern includes existence of such attributes as aria-modal="true" role="dialog"
	 * and either explicit label set with aria-label or referenced label set by aria-labelledby
	 */
	await page.visitExample('design-system', 'onboarding', 'spotlight-basic-with-label');

	// check for referenced label
	await expect(page.locator(referencedLabelSpotlightTrigger)).toBeVisible();
	await page.locator(referencedLabelSpotlightTrigger).click();
	await expect(page.locator(referencedLabelSpotlight)).toHaveAttribute('aria-modal', 'true');
	await expect(page.locator(referencedLabelSpotlight)).toHaveRole('dialog');
	await expect(page.locator(referencedLabelSpotlight)).toHaveAttribute(
		'aria-labelledby',
		'spotlight-dialog-label',
	);
	await page.getByText('Got it').click();

	// check for explicit label
	await page.locator(explicitLabelSpotlightTrigger).click();
	await expect(page.locator(explicitLabelSpotlight)).toHaveAttribute('aria-modal', 'true');
	await expect(page.locator(explicitLabelSpotlight)).toHaveRole('dialog');
	await expect(page.locator(explicitLabelSpotlight)).toHaveAttribute(
		'aria-label',
		'Introducing new feature',
	);
});
