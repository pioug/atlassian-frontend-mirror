import { expect, test } from '@af/integration-testing';

const query = "[data-testid='the-textfield']";

test('Textfield should be able to be clicked by data-testid', async ({
  page,
}) => {
  await page.visitExample('design-system', 'textfield', 'testing');
  const textField = page.locator(query).first();
  await expect(textField).toBeVisible();
  await expect(textField).toHaveValue('I have a data-testid');
});
