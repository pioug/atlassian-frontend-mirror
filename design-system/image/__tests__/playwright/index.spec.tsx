import { expect, test } from '@af/integration-testing';

const exampleComponent = "[data-testid='image']";

test('Image should be able to be identified by data-testid', async ({
  page,
}) => {
  await page.visitExample('design-system', 'image', 'basic');
  await expect(page.locator(exampleComponent).first()).toBeVisible();
});
