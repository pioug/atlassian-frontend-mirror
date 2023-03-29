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

/**
 * Makes the profile pictures invisible.
 *
 * Doing this because the SVG profile pictures were causing flakiness in VR.
 */
async function hideImagesToAvoidFlakiness(page: Page) {
  return page.$$eval('img', images => {
    images.forEach(img => {
      if (img instanceof HTMLElement) {
        img.style.opacity = '0';
      }
    });
  });
}

// TODO: unskip this - original context: https://atlassian.slack.com/archives/CFJ9DU39U/p1680052647889709
describe.skip('board', () => {
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
    await hideImagesToAvoidFlakiness(page);
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('should allow sorting swimlanes', async () => {
    const { page } = global;
    await loadPage(page, url);
    await page.setDragInterception(true);

    await page.waitForSelector('[draggable="true"]');

    const dragHandle = await getColumnHeader(page, 'trello');
    const dropTarget = await getColumnHeader(page, 'jira');

    invariant(dragHandle);
    invariant(dropTarget);

    await dragHandle.dragAndDrop(dropTarget);

    await hideImagesToAvoidFlakiness(page);
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('should allow sorting tasks in a swimlane', async () => {
    const { page } = global;
    await loadPage(page, url);
    await page.setDragInterception(true);

    await page.waitForSelector('[draggable="true"]');

    const dragHandle = await getItem(page, 'Gael');
    const dropTarget = await getItem(page, 'Alexander');

    invariant(dragHandle);
    invariant(dropTarget);

    await dragHandle.dragAndDrop(dropTarget);

    await hideImagesToAvoidFlakiness(page);
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('should allow moving tasks between swimlanes', async () => {
    const { page } = global;
    await loadPage(page, url);
    await page.setDragInterception(true);

    await page.waitForSelector('[draggable="true"]');

    const dragHandle = await getItem(page, 'Alexander');
    const dropTarget = await getItem(page, 'Helena');

    invariant(dragHandle);
    invariant(dropTarget);

    await dragHandle.dragAndDrop(dropTarget);

    await hideImagesToAvoidFlakiness(page);
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
