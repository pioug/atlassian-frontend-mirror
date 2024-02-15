import { expect, test } from '@af/integration-testing';

const trigger = '[data-testid="lite-mode-ddm--trigger"]';
const dropdownMenu = '[data-testid="lite-mode-ddm--content"]';

test('Verify that Dropdown Menu is able to open', async ({ page }) => {
  await page.visitExample(
    'design-system',
    'dropdown-menu',
    'testing-ddm-default',
  );
  await page.locator(trigger).first().click();
  expect(await page.webdriverCompatUtils.isAttached(dropdownMenu)).toBe(true);
});

test('Verify that Dropdown Menu is able to open - stateless', async ({
  page,
}) => {
  await page.visitExample(
    'design-system',
    'dropdown-menu',
    'testing-ddm-stateless',
  );
  await page.locator(trigger).first().click();

  await expect(page.locator(dropdownMenu).first()).toBeVisible();

  await expect(
    page.locator(`#cities button[aria-checked]`).nth(0),
  ).toBeChecked();
  await expect(
    page.locator(`#cities button[aria-checked]`).nth(1),
  ).not.toBeChecked();
});
