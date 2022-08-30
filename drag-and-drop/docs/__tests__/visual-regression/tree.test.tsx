import type { Page } from 'puppeteer';
import invariant from 'tiny-invariant';

import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

import { DragInteraction } from './_utils';

const url = getExampleUrl(
  'drag-and-drop',
  'docs',
  'tree',
  global.__BASEURL__,
  'light',
);

function getItemSelector(itemId: string) {
  return `#tree-item-${itemId}`;
}

function getSubtreeSelector(itemId: string) {
  return `${getItemSelector(itemId)}--subtree`;
}

async function getBoundingBox(page: Page, selector: string) {
  const element = await page.$(selector);
  invariant(element);
  const boundingBox = await element.boundingBox();
  invariant(boundingBox);
  return boundingBox;
}

async function dragAndDrop(
  page: Page,
  {
    source,
    target,
    corner,
  }: {
    source: string;
    target: string;
    corner: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  },
) {
  const [vertical, horizontal] = corner.split('-');

  const sourceBox = await getBoundingBox(page, source);
  const startPoint = { x: sourceBox.x, y: sourceBox.y };

  const dragData = await page.mouse.drag(startPoint, {
    x: startPoint.x + 100,
    y: startPoint.y + 100,
  });

  const targetBox = await getBoundingBox(page, target);
  const endPoint = {
    x: horizontal === 'left' ? targetBox.x : targetBox.x + targetBox.width - 1,
    y: vertical === 'top' ? targetBox.y : targetBox.y + targetBox.height - 1,
  };
  await page.mouse.dragEnter(endPoint, dragData);
  await page.mouse.dragOver(endPoint, dragData);
  await page.mouse.drop(endPoint, dragData);
  await page.mouse.up();

  /**
   * Don't want to be hovering over anything at the end.
   */
  await page.hover(source);
}

const treeSelector = '#tree';

async function setupPage(): Promise<Page> {
  const { page } = global;
  await loadPage(page, url);
  await page.setDragInterception(true);
  await page.waitForSelector('[draggable="true"]');
  return page;
}

describe('tree interactions', () => {
  describe('reordering tree item siblings', () => {
    test('moving to before', async () => {
      const page = await setupPage();

      await dragAndDrop(page, {
        source: getItemSelector('C'),
        target: getItemSelector('B'),
        corner: 'top-left',
      });

      const image = await takeElementScreenShot(page, treeSelector);
      expect(image).toMatchProdImageSnapshot();
    });

    test('moving to after', async () => {
      const page = await setupPage();

      await dragAndDrop(page, {
        source: getItemSelector('B'),
        target: getItemSelector('C'),
        corner: 'bottom-left',
      });

      const image = await takeElementScreenShot(page, treeSelector);
      expect(image).toMatchProdImageSnapshot();
    });
  });

  test('creating a new tree group', async () => {
    const page = await setupPage();

    await dragAndDrop(page, {
      source: getItemSelector('A'),
      target: getItemSelector('B'),
      corner: 'bottom-right',
    });

    const image = await takeElementScreenShot(page, treeSelector);
    expect(image).toMatchProdImageSnapshot();
  });

  describe('moving a tree item into an existing tree group', () => {
    test('relative to parent', async () => {
      const page = await setupPage();

      await dragAndDrop(page, {
        source: getItemSelector('B'),
        target: getItemSelector('A'),
        corner: 'bottom-right',
      });

      const image = await takeElementScreenShot(page, treeSelector);
      expect(image).toMatchProdImageSnapshot();
    });

    test('relative to child', async () => {
      const page = await setupPage();

      /**
       * Expand the tree group
       */
      await page.click(getItemSelector('A'));

      await dragAndDrop(page, {
        source: getItemSelector('B'),
        target: getItemSelector('A1'),
        corner: 'bottom-left',
      });

      const image = await takeElementScreenShot(page, treeSelector);
      expect(image).toMatchProdImageSnapshot();
    });
  });

  test('moving a tree item out of a tree group', async () => {
    const page = await setupPage();

    /**
     * Expand the tree group
     */
    await page.click(getItemSelector('A'));

    await dragAndDrop(page, {
      source: getItemSelector('A1'),
      target: getItemSelector('B'),
      corner: 'top-left',
    });

    const image = await takeElementScreenShot(page, treeSelector);
    expect(image).toMatchProdImageSnapshot();
  });

  describe('moving a tree group', () => {
    test('that is collapsed', async () => {
      const page = await setupPage();

      await dragAndDrop(page, {
        source: getItemSelector('A'),
        target: getItemSelector('C'),
        corner: 'bottom-left',
      });

      const image = await takeElementScreenShot(page, treeSelector);
      expect(image).toMatchProdImageSnapshot();
    });

    test('that is expanded', async () => {
      const page = await setupPage();

      /**
       * Expand the tree group
       */
      await page.click(getItemSelector('A'));

      await dragAndDrop(page, {
        source: getItemSelector('A'),
        target: getItemSelector('C'),
        corner: 'bottom-left',
      });

      const image = await takeElementScreenShot(page, treeSelector);
      expect(image).toMatchProdImageSnapshot();
    });
  });
});

describe('tree group expand/collapse behavior', () => {
  it('should expand on child hover', async () => {
    const page = await setupPage();

    const subtree = getSubtreeSelector('A');

    /**
     * The subtree should be hidden by default.
     */
    await page.waitForSelector(subtree, { hidden: true });

    const drag = new DragInteraction(page);
    await drag.fromSelector(getItemSelector('C'));
    await drag.toSelector(getItemSelector('A'), 'bottom-right');

    /**
     * Now the subtree should be open.
     */
    await page.waitForSelector(subtree, { visible: true });

    const image = await takeElementScreenShot(page, treeSelector);
    expect(image).toMatchProdImageSnapshot();

    /**
     * If we forget to drop it breaks other tests.
     */
    await drag.drop();
  });

  /**
   * This behavior is not explicitly in the design spec,
   * but is inside a grey area.
   *
   * TODO: confirm with design
   */
  it('should collapse on bottom hover', async () => {
    const page = await setupPage();

    const subtree = getSubtreeSelector('A');

    await page.click(getItemSelector('A'));

    /**
     * Make sure subtree is open.
     */
    await page.waitForSelector(subtree, { visible: true });

    const drag = new DragInteraction(page);
    await drag.fromSelector(getItemSelector('C'));
    await drag.toSelector(getItemSelector('A'), 'bottom-left');

    /**
     * Now the subtree should be collapsed
     */
    await page.waitForSelector(subtree, { hidden: true });

    const image = await takeElementScreenShot(page, treeSelector);
    expect(image).toMatchProdImageSnapshot();

    /**
     * If we forget to drop it breaks other tests.
     */
    await drag.drop();
  });
});
