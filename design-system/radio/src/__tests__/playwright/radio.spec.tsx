import { expect, test } from '@af/integration-testing';

const labelQuery = "[data-testid='red--radio-label']";

const inputQuery = "[data-testid='red--radio-input']";

test('Radio should be able to be clicked by data-testid', async ({ page }) => {
  await page.visitExample('design-system', 'radio', 'testing');
  await page.locator(labelQuery).first().click();
  const input = page.locator(inputQuery).first();
  await expect(input).toBeChecked();
});
