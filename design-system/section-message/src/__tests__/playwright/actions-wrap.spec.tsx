import { expect, test } from '@af/integration-testing';

const sectionMessage = "[data-testid='overflow-actions-section-message']";

const actions = "[data-testid='overflow-actions-section-message--content']";

test('SectionMessage should wrap actions onto new lines', async ({ page }) => {
  await page.visitExample('design-system', 'section-message', 'testing');
  await page.setViewportSize({ width: 1000, height: 1000 });
  const sectionMessageBox = await page
    .locator(sectionMessage)
    .first()
    .boundingBox();
  const actionsBox = await page.locator(actions).first().boundingBox();
  expect(actionsBox!.width).toBeLessThan(sectionMessageBox!.width);
});
