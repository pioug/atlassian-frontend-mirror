import { expect, test } from '@af/integration-testing';

const checkboxLabelQuery = "[data-testid='the-checkbox--checkbox-label']";

const hiddenCheckboxQuery = "[data-testid='the-checkbox--hidden-checkbox']";

test('Checkbox should be able to be clicked by data-testid', async ({
  page,
}) => {
  await page.visitExample('design-system', 'checkbox', 'testing');
  await page.click(checkboxLabelQuery);
  await expect(page.locator(hiddenCheckboxQuery)).toBeChecked();
});

test('Checkbox should be checked when clicked with a modifier such as shift+click', async ({
  page,
}) => {
  await page.visitExample('design-system', 'checkbox', 'testing');
  await page.click(checkboxLabelQuery, { modifiers: ['Shift'] });
  await expect(page.locator(hiddenCheckboxQuery)).toBeChecked();
});
