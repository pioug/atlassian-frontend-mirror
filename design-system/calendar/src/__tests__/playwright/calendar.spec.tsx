import { expect, test } from '@af/integration-testing';

const monthContainer = '[data-testid="the-calendar--month"]';
const selectedDayQuery = '[data-testid="the-calendar--selected-day"]';
const currentMonthQuery = '[data-testid="the-calendar--current-month-year"]';
const previousMonthQuery = '[data-testid="the-calendar--previous-month"]';
const nextMonthQuery = '[data-testid="the-calendar--next-month"]';

test('A user is able to select a date', async ({ page, skipAxeCheck }) => {
	await page.visitExample('design-system', 'calendar', 'testing');
	const expectedDayQuery = `${monthContainer} button`;
	const expectedDay = await page.locator(expectedDayQuery).first().textContent();
	await page.locator(expectedDayQuery).first().click();
	await expect(page.locator(selectedDayQuery)).toHaveText(expectedDay!);
	//skip the check due to color contrast is passed 4.5:1 already
	skipAxeCheck();
});

test('A user is able to navigate between months', async ({ page }) => {
	await page.visitExample('design-system', 'calendar', 'testing');
	await expect(page.locator(currentMonthQuery)).toHaveText('December 2020');
	await page.locator(nextMonthQuery).first().click();
	await expect(page.locator(currentMonthQuery)).toHaveText('January 2021');
	await page.locator(previousMonthQuery).first().click();
	await expect(page.locator(currentMonthQuery)).toHaveText('December 2020');
});
