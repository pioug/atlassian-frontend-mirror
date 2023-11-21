import { expect, test } from '@af/integration-testing';

const textAreaTestId = "[data-testid='MyTextAreaTestId']";

test('TextArea should be able to be clicked by data-testid', async ({
  page,
}) => {
  await page.visitExample('design-system', 'textarea', 'testing');
  const textArea = page.locator(textAreaTestId).first();
  await expect(textArea).toBeVisible();
  await expect(textArea).toHaveValue('I have a data-testid');
});
