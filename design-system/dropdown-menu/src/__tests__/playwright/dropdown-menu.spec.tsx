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

test.describe('Keyboard navigation', () => {
  const triggerDataId = 'dropdown--trigger';
  const contentDataId = 'dropdown--content';
  const firstToggleId = 'toggle-1';

  // TODO DSP-16638
  // Enable this testcase after cleaning up the feature flag.
  // Currently feature flag conditional flow is not supported for Playwright.
  test.skip('Verify that Dropdown Menu is closing on Tab press and focus on the next interactive element', async ({
    page,
  }) => {
    await page.visitExample(
      'design-system',
      'dropdown-menu',
      'testing-keyboard-navigation',
    );

    await page.getByTestId(triggerDataId).press('Enter');
    await expect(page.getByTestId(contentDataId)).toBeVisible();

    await page.getByTestId(contentDataId).press('Tab');
    await expect(page.getByTestId(contentDataId)).toBeHidden();
    await expect(page.locator(`#${firstToggleId}`)).toBeFocused();
  });

  // TODO DSP-16638
  // Enable this testcase after cleaning up the feature flag.
  // Currently feature flag conditional flow is not supported for Playwright.
  test.skip('Verify that Dropdown Menu is closing on Shift+Tab press and focus on trigger', async ({
    page,
  }) => {
    await page.visitExample(
      'design-system',
      'dropdown-menu',
      'testing-keyboard-navigation',
    );

    await page.getByTestId(triggerDataId).press('Enter');
    await page.getByTestId(contentDataId).press('Shift+Tab');

    await expect(page.getByTestId(contentDataId)).toBeHidden();
    await expect(page.getByTestId(triggerDataId)).toBeFocused();
  });

  // TODO DSP-16638
  // Enable this testcase after cleaning up the feature flag.
  // Currently feature flag conditional flow is not supported for Playwright.
  test.skip('Verify that Dropdown Menu items navigation works on keyUp and keyDown', async ({
    page,
  }) => {
    await page.visitExample(
      'design-system',
      'dropdown-menu',
      'testing-keyboard-navigation',
    );

    await page.getByTestId(triggerDataId).press('Enter');
    // Should set focus on the first element
    await expect(page.getByRole('menuitem', { name: 'Move' })).toBeFocused();

    await page.getByRole('menuitem', { name: 'Move' }).press('ArrowDown');
    // Should move focus to the second element
    await expect(page.getByRole('menuitem', { name: 'Clone' })).toBeFocused();

    await page.getByRole('menuitem', { name: 'Clone' }).press('ArrowDown');
    // Should move focus to the first element
    await expect(page.getByRole('menuitem', { name: 'Move' })).toBeFocused();

    await page.getByRole('menuitem', { name: 'Move' }).press('ArrowUp');
    // Should move focus to the last element
    await expect(page.getByRole('menuitem', { name: 'Clone' })).toBeFocused();
  });
});
