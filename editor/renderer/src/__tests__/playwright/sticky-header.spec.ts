import type { Page } from '@playwright/test';
import { rendererTestCase as test, expect } from './not-libra';
import { selectors } from '../__helpers/page-objects/_renderer';
import { stickyHeadersAllTables } from '../__fixtures__/sticky-header-adf';

async function scrollToPos(page: Page, pos: number) {
  return page.evaluate((pos: number) => {
    if (!window) {
      return;
    }
    window.scrollTo(0, pos);
    // wait for the scroll animation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(null);
      }, 50);
    });
  }, pos);
}

test.describe('when the viewport width changes', () => {
  test.use({
    adf: stickyHeadersAllTables,
    rendererProps: {
      stickyHeaders: {
        offsetTop: 0,
      },
    },
  });

  test.beforeEach(async ({ renderer }) => {
    await scrollToPos(renderer.page, 345);
  });

  test('should be the same after increasing in size', async ({ renderer }) => {
    await renderer.page.setViewportSize({ width: 1600, height: 868 });

    const table = renderer.page.locator(selectors.table);
    const stickyHeader = renderer.page.locator(selectors.stickyHeader);

    // Scroll to the second table in the list
    const tableBoundingBox = await table.nth(1).boundingBox();
    const stickyHeaderBoundingBox = await stickyHeader.nth(1).boundingBox();
    expect(tableBoundingBox?.width).toBe(stickyHeaderBoundingBox?.width);
  });

  test('should be the same after decreasing in size', async ({ renderer }) => {
    await renderer.page.setViewportSize({ width: 600, height: 868 });

    const table = renderer.page.locator(selectors.table);
    const stickyHeader = renderer.page.locator(selectors.stickyHeader);

    // Scroll to the second table in the list
    const tableBoundingBox = await table.nth(1).boundingBox();
    const stickyHeaderBoundingBox = await stickyHeader.nth(1).boundingBox();
    expect(tableBoundingBox?.width).toBe(stickyHeaderBoundingBox?.width);
  });

  test('should be the same after increasing then decreasing in size', async ({
    renderer,
  }) => {
    await renderer.page.setViewportSize({ width: 1600, height: 868 });
    await renderer.page.setViewportSize({ width: 600, height: 868 });

    const table = renderer.page.locator(selectors.table);
    const stickyHeader = renderer.page.locator(selectors.stickyHeader);

    // Scroll to the second table in the list
    const tableBoundingBox = await table.nth(1).boundingBox();
    const stickyHeaderBoundingBox = await stickyHeader.nth(1).boundingBox();
    expect(tableBoundingBox?.width).toBe(stickyHeaderBoundingBox?.width);
  });

  test('should be the same after decreasing then increasing in size', async ({
    renderer,
  }) => {
    await renderer.page.setViewportSize({ width: 600, height: 868 });
    await renderer.page.setViewportSize({ width: 1600, height: 868 });

    const table = renderer.page.locator(selectors.table);
    const stickyHeader = renderer.page.locator(selectors.stickyHeader);

    // Scroll to the second table in the list
    const tableBoundingBox = await table.nth(1).boundingBox();
    const stickyHeaderBoundingBox = await stickyHeader.nth(1).boundingBox();
    expect(tableBoundingBox?.width).toBe(stickyHeaderBoundingBox?.width);
  });
});
