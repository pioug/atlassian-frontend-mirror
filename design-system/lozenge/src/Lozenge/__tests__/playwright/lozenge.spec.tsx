import { expect, test } from '@af/integration-testing';

test('Lozenge should be able to be identified by data-testid', async ({
  page,
}) => {
  await page.visitExample('design-system', 'lozenge', 'testing');

  const defaultLozenge = page
    .locator("[data-testid='default-lozenge']")
    .first();
  const newLozenge = page.locator("[data-testid='new-lozenge']").first();
  const themedLozenge = page.locator("[data-testid='themed-lozenge']").first();

  await expect(defaultLozenge).toBeVisible();
  await expect(newLozenge).toBeVisible();
  await expect(themedLozenge).toBeVisible();

  await expect(defaultLozenge).toHaveText('Default');
  await expect(newLozenge).toHaveText('New');
  await expect(themedLozenge).toHaveText('Success');
});
