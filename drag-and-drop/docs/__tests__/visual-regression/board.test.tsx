import type { Page } from 'puppeteer';
import invariant from 'tiny-invariant';

import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

/**
 * The header is the draggable part of a column.
 */
async function getColumnHeader(page: Page, columnId: string) {
  return page.$(`[data-testid="column-${columnId}--header"]`);
}

async function getItem(page: Page, itemId: string) {
  return page.$(`[data-testid="item-${itemId}"]`);
}

describe('board', () => {
  const url = getExampleUrl(
    'drag-and-drop',
    'docs',
    'board',
    global.__BASEURL__,
    'light',
  );

  it('should load properly', async () => {
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector('[draggable="true"]');
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('should allow sorting swimlanes', async () => {
    const { page } = global;
    await loadPage(page, url);
    await page.setDragInterception(true);

    await page.waitForSelector('[draggable="true"]');

    const dragHandle = await getColumnHeader(page, 'C');
    const dropTarget = await getColumnHeader(page, 'B');

    invariant(dragHandle);
    invariant(dropTarget);

    await dragHandle.dragAndDrop(dropTarget);

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('should allow sorting tasks in a swimlane', async () => {
    const { page } = global;
    await loadPage(page, url);
    await page.setDragInterception(true);

    await page.waitForSelector('[draggable="true"]');

    const dragHandle = await getItem(page, 'A4');
    const dropTarget = await getItem(page, 'A0');

    invariant(dragHandle);
    invariant(dropTarget);

    await dragHandle.dragAndDrop(dropTarget);

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('should allow moving tasks between swimlanes', async () => {
    const { page } = global;
    await loadPage(page, url);
    await page.setDragInterception(true);

    await page.waitForSelector('[draggable="true"]');

    const dragHandle = await getItem(page, 'A0');
    const dropTarget = await getItem(page, 'B0');

    invariant(dragHandle);
    invariant(dropTarget);

    await dragHandle.dragAndDrop(dropTarget);

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
