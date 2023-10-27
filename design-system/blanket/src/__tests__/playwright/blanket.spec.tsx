import { expect, test } from '@af/integration-testing';

const toggleIsTinted = "[data-testid='is-tinted']";
const toggleClickThrough = "[data-testid='allow-click-through']";
const increment = "[data-testid='increment']";
const countIncrementClicked = "[data-testid='count-increment-clicked']";
const countBlanketClicked = "[data-testid='count-blanket-clicked']";

test('can click through un-tinted blanket when click through allowed', async ({
  page,
}) => {
  await page.visitExample('design-system', 'blanket', 'variants');
  await expect(page.locator(countIncrementClicked).first()).toHaveText('0');
  await page.click(increment);
  await expect(page.locator(countIncrementClicked).first()).toHaveText('1');
});

test('can click through tinted blanket when click through allowed', async ({
  page,
}) => {
  await page.visitExample('design-system', 'blanket', 'variants');
  await page.click(toggleIsTinted);
  await expect(page.locator(countIncrementClicked).first()).toHaveText('0');
  await page.click(increment);
  await expect(page.locator(countIncrementClicked).first()).toHaveText('1');
});

test('cannot click through un-tinted blanket when click through disallowed', async ({
  page,
}) => {
  await page.visitExample('design-system', 'blanket', 'variants');
  await page.click(toggleClickThrough);
  await expect(page.locator(countIncrementClicked).first()).toHaveText('0');
  // The button is disabled as expected so we don't want to wait on actionability checks
  // eslint-disable-next-line playwright/no-force-option
  await page.click(increment, { force: true });
  await expect(page.locator(countIncrementClicked).first()).toHaveText('0');
});

test('cannot click through tinted blanket when click through disallowed', async ({
  page,
}) => {
  await page.visitExample('design-system', 'blanket', 'variants');
  await page.click(toggleIsTinted);
  await page.click(toggleClickThrough);
  await expect(page.locator(countIncrementClicked).first()).toHaveText('0');
  // The button is disabled as expected so we don't want to wait on actionability checks
  // eslint-disable-next-line playwright/no-force-option
  await page.click(increment, { force: true });
  await expect(page.locator(countIncrementClicked).first()).toHaveText('0');
});

test('blanket should not register onClick event if click through disallowed and mouseDown event starts on children @migration_status=manual', async ({
  page,
}) => {
  await page.visitExample('design-system', 'blanket', 'variants');
  await page.click(toggleClickThrough);

  /**
   * TODO: Start selecting text in the child and then drag off to the blanket
   */
  await expect(page.locator(countBlanketClicked).first()).toHaveText('0');
});
