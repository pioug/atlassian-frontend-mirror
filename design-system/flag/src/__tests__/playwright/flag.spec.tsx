import { expect, test } from '@af/integration-testing';

const addFlagBtn = "[data-testid='AddFlag']";
const flagTestId1 = "[data-testid='MyFlagTestId--1']";
const flagTestId2 = "[data-testid='MyFlagTestId--2']";
const flagActionTestId1 =
  "[data-testid='MyFlagTestId--1'] [data-testid='MyFlagAction']";
const flagActionTestId2 =
  "[data-testid='MyFlagTestId--2'] [data-testid='MyFlagAction']";
const dismissFlag = "[aria-label='Dismiss']";

test('Flag and Flag actions should be able to be identified and clicked by data-testid', async ({
  page,
}) => {
  await page.visitExample('design-system', 'flag', 'testing');
  await page.locator(addFlagBtn).first().click();
  await expect(page.locator(flagTestId1).first()).toBeVisible();
  await expect(page.locator(flagActionTestId1).first()).toBeVisible();

  const alertPromise = page.waitForEvent('dialog', async (alertDialog) => {
    await alertDialog.accept();
    return true;
  });
  await page.locator(flagActionTestId1).first().click();
  const alertDialog = await alertPromise;
  expect(alertDialog.type()).toBe('alert');
  expect(alertDialog.message()).toBe('Flag has been clicked!');

  await page.locator(addFlagBtn).first().click();
  await expect(page.locator(flagTestId1).first()).toBeVisible();
  await expect(page.locator(flagActionTestId1).first()).toBeVisible();
  await expect(page.locator(flagTestId2).first()).toBeVisible();
  await expect(page.locator(flagActionTestId2).first()).toBeVisible();

  await page.locator(dismissFlag).first().click();
  await expect(page.locator(flagTestId1).first()).toBeVisible();
  await expect(page.locator(flagActionTestId1).first()).toBeVisible();
});
