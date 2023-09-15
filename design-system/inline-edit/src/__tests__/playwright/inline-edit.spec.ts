import { expect, test } from '@af/integration-testing';

/* Css selectors used for the inline edit tests */
const readViewContentWrapper = 'button[aria-label="Edit"] + div';
const editInput = 'edit-view';

test.describe('Inline Edit Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.visitExample('design-system', 'inline-edit', 'validation');
  });
  test('Displays error message', async ({ page }) => {
    const readView = page.locator(readViewContentWrapper);
    await readView.click();

    const input = page.getByTestId(editInput);
    await input.click();
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Backspace');

    await expect(page.locator('div#error-message')).toBeVisible();
  });

  test('Should hide edit view after submit', async ({ page }) => {
    const readView = page.locator(readViewContentWrapper);
    await readView.click();

    const input = page.getByTestId(editInput);
    await expect(input).toBeFocused();
    await page.keyboard.insertText('hello');

    const confirm = page.getByRole('button', { name: 'Confirm' });
    await confirm.click();

    await expect(readView).toBeVisible();
    await expect(input).toBeHidden();
    await expect(confirm).toBeHidden();
  });
});

test.describe('Default Inline Edit', () => {
  test.beforeEach(async ({ page }) => {
    await page.visitExample('design-system', 'inline-edit', 'basic-usage');
  });
  test('Should hide edit button after confirmation', async ({ page }) => {
    const readView = page.locator(readViewContentWrapper);
    await readView.click();

    const confirm = page.getByRole('button', { name: 'Confirm' });
    await expect(confirm).toBeVisible();

    await confirm.click();
    await expect(page.getByRole('button', { name: 'Confirm' })).toBeHidden();
  });

  test('Should hide edit button after pressing Enter', async ({ page }) => {
    const readView = page.locator(readViewContentWrapper);
    await readView.click();

    const input = page.getByRole('textbox', { name: 'Inline edit' });
    await expect(input).toBeFocused();
    await page.keyboard.press('Enter');

    await expect(page.getByRole('button', { name: 'Confirm' })).toBeHidden();
  });

  test('Should remain editable after navigating by keyboard', async ({
    page,
  }) => {
    const edit = page.getByRole('button', { name: 'Edit' });
    await edit.focus();
    await page.keyboard.press('Enter');

    const input = page.getByRole('textbox', { name: 'Inline edit' });
    await expect(input).toBeFocused();
    await page.keyboard.press('Tab');

    const confirm = page.getByRole('button', { name: 'Confirm' });
    await expect(confirm).toBeFocused();
    await page.keyboard.press('Tab');

    const cancel = page.getByRole('button', { name: 'Cancel' });
    await expect(cancel).toBeFocused();
  });
});

test.describe('Inline Edit with Datepicker', () => {
  test.beforeEach(async ({ page }) => {
    await page.visitExample(
      'design-system',
      'inline-edit',
      'inline-edit-with-datepicker',
    );
  });
  test('Selecting a date in a datepicker using keyboard should return to edit view', async ({
    page,
  }) => {
    const edit = page.getByRole('button', { name: 'Edit' });
    await edit.focus();
    await page.keyboard.press('Enter');

    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('Enter');

    await page.keyboard.press('Tab');

    // Is not the same for Safari
    const timePicker = page.locator(
      '[data-testid="datepicker--timepicker--container"] [aria-autocomplete="list"]',
    );
    await expect(timePicker).toBeFocused();
  });
});
