import { expect, test } from '@af/integration-testing';

test('CodeBidiWarning should be able to be identified by data-testid', async ({
  page,
}) => {
  await page.visitExample('design-system', 'code', 'code-bidi-characters');
  await expect(
    page.locator("[data-testid='bidi-warning-renderedConditional2Js']").first(),
  ).toBeVisible();
});
