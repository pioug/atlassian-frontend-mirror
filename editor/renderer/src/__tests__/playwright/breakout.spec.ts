import { rendererTestCase as test, expect } from './not-libra';
import { adf } from './breakout.spec.ts-fixtures';

test.use({ adf });

const TABLE_CONTAINER_BUT_FULL_WIDTH =
  '.pm-table-container[data-layout="full-width"]';
test('Addapts full-width table after scrolling to resizing', async ({
  renderer,
}) => {
  const container = renderer.page.locator(TABLE_CONTAINER_BUT_FULL_WIDTH);

  await renderer.page.setViewportSize({
    width: 480,
    height: 480,
  });
  await renderer.waitForRendererStable();

  const tableElement = await container.elementHandle();
  await tableElement!.waitForElementState('stable');
  //await renderer.page.evaluate(() => (document.body.style.width = '480px'));

  const beforeWidth = await container.evaluate((el) => {
    return window.getComputedStyle(el).width;
  });

  await renderer.page.mouse.wheel(0, 100);
  await tableElement!.waitForElementState('stable');
  //await renderer.page.evaluate(() => window.scrollBy(0, 100));

  await renderer.waitForRendererStable();
  //await renderer.page.evaluate(() => (document.body.style.width = '330px'));
  await renderer.page.setViewportSize({
    width: 330,
    height: 480,
  });
  await renderer.waitForRendererStable();
  await tableElement!.waitForElementState('stable');

  const afterWidth = await container.evaluate((el) => {
    return window.getComputedStyle(el).width;
  });
  expect(beforeWidth).toBe('480px');
  expect(afterWidth).toBe('330px');
});
