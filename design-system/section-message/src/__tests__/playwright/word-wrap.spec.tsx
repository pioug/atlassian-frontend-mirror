import { expect, test } from '@af/integration-testing';

const sectionMessage = "[data-testid='overflow-section-message']";

const content = "[data-testid='overflow-section-message--content']";

test('SectionMessage should wrap long text onto new lines', async ({
  page,
}) => {
  await page.visitExample('design-system', 'section-message', 'testing');
  await page.setViewportSize({ width: 1000, height: 1000 });
  const sectionMessageBox = await page
    .locator(sectionMessage)
    .first()
    .boundingBox();
  const contentBox = await page.locator(content).first().boundingBox();
  expect(contentBox!.width).toBeLessThan(sectionMessageBox!.width);
});
