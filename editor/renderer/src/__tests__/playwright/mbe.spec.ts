import { rendererTestCase as test, expect } from './not-libra';

test.use({ rendererMountOptions: { exampleType: 'multi-bodied-extension' } });

test.describe('MBE Renderer', () => {
  test(`Load an MBE Node in renderer and only first frame should be visible`, async ({
    renderer,
  }) => {
    await renderer.waitForRendererStable();
    const firstTabFrame = renderer.page
      .locator('div[data-extension-frame="true"]')
      .first();

    await expect(firstTabFrame).toBeVisible();
  });

  test(`Switch to tab 2 and confirm that only it should visible`, async ({
    renderer,
  }) => {
    await renderer.waitForRendererStable();
    const firstTabFrame = renderer.page
      .locator('div[data-extension-frame="true"]')
      .nth(0);
    const secondTabFrame = renderer.page
      .locator('div[data-extension-frame="true"]')
      .nth(1);
    const thirdTabFrame = renderer.page
      .locator('div[data-extension-frame="true"]')
      .nth(2);

    const secondTabButton = renderer.page
      .locator('button[data-testid="mbe-button-select-tab"]')
      .nth(1);
    await secondTabButton.click();

    await expect(firstTabFrame).toBeHidden();
    await expect(secondTabFrame).toBeVisible();
    await expect(thirdTabFrame).toBeHidden();
  });

  test(`Confirm that add and delete buttons should not be visible`, async ({
    renderer,
  }) => {
    await renderer.waitForRendererStable();
    const addButton = renderer.page.locator(
      'button[data-testid="mbe-button-add-tab"]',
    );
    const deleteButton = renderer.page
      .locator('button[data-testid="mbe-button-remove-tab"]')
      .nth(0);

    await expect(addButton).toBeHidden();
    await expect(deleteButton).toBeHidden();
  });
});
