import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

import { getElement } from './_utils';

const url = getExampleUrl(
  'pragmatic-drag-and-drop',
  'core',
  'scroll-just-enough-into-view',
  global.__BASEURL__,
  'light',
);

describe('scrollJustEnoughIntoView', () => {
  const containerSelector = '[data-testid="container"]';
  const getCardSelector = (index: number) => `[data-testid="card-${index}"]`;

  it('should scroll the element into full view', async () => {
    const { page } = global;
    await loadPage(page, url);

    /**
     * The second card in the list, which is only partially visible.
     */
    const cardSelector = getCardSelector(1);

    await page.waitForSelector(cardSelector);

    const beforeSnapshot = await takeElementScreenShot(page, containerSelector);
    expect(beforeSnapshot).toMatchProdImageSnapshot();

    const card = await getElement(cardSelector);

    /**
     * This drag is not meant to move anything,
     * it is just to trigger the scroll into view behavior.
     */
    await page.setDragInterception(true);
    await card.drag({ x: 0, y: 0 });

    const afterSnapshot = await takeElementScreenShot(page, containerSelector);
    expect(afterSnapshot).toMatchProdImageSnapshot();

    /**
     * If we don't finish the drop then Puppeteer will hang.
     */
    await card.drop();
  });

  it('should not scroll if the element is already in full view', async () => {
    const { page } = global;
    await loadPage(page, url);
    await page.setDragInterception(true);

    /**
     * The first card in the list, which is fully visible.
     */
    const cardSelector = getCardSelector(0);

    await page.waitForSelector(cardSelector, {
      visible: true,
    });

    const beforeSnapshot = await takeElementScreenShot(page, containerSelector);
    expect(beforeSnapshot).toMatchProdImageSnapshot();

    const card = await getElement(cardSelector);

    /**
     * This drag is not meant to move anything,
     * it is just to trigger the scroll into view behavior.
     */
    await page.setDragInterception(true);
    await card.drag({ x: 0, y: 0 });

    /**
     * The visual should not have changed at all.
     */
    const afterSnapshot = await takeElementScreenShot(page, containerSelector);
    expect(afterSnapshot).toEqual(beforeSnapshot);

    /**
     * If we don't finish the drop then Puppeteer will hang.
     */
    await card.drop();
  });
});
