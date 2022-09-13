import type { ElementHandle, Protocol } from 'puppeteer';
import invariant from 'tiny-invariant';

import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

const url = getExampleUrl(
  'drag-and-drop',
  'core',
  'file-adapter',
  global.__BASEURL__,
  'light',
);

async function getElement(selector: string): Promise<ElementHandle<Element>> {
  const handle = await page.$(selector);
  invariant(handle, `Unable to find element with selector: ${selector}`);
  return handle;
}

it('should support dropping of many files at once', async () => {
  const { page } = global;
  await loadPage(page, url);

  // waiting for the drop target to be visible as a way to ensure the example
  // is completely loaded (preemptively avoiding flakiness)
  await page.waitForSelector('[data-testid="drop-target"]', {
    visible: true,
  });

  const body = await getElement('body');
  const dropTarget = await getElement('[data-testid="drop-target"]');
  invariant(dropTarget, `drop target not found`);

  await page.setDragInterception(true);
  const data: Protocol.Input.DragData = {
    dragOperationsMask: 1,
    files: ['./package.json', './tsconfig.json'],
    items: [],
  };

  expect(await page.screenshot()).toMatchProdImageSnapshot();

  await body.dragEnter(data);
  await dropTarget.dragEnter(data);
  await dropTarget.drop(data);

  // just incase there are any delays in the processing of files
  // we will wait until the `dropped-files` element is visible
  // before continuing
  // (eg if the update is delayed by react)
  await page.waitForSelector('[data-testid="dropped-files"]', {
    visible: true,
  });

  const results = await getElement('[data-testid="dropped-files"]');
  const text = await results.evaluate(el => el.textContent);
  expect(text?.includes('package.json')).toBe(true);
  expect(text?.includes('tsconfig.json')).toBe(true);

  expect(await page.screenshot()).toMatchProdImageSnapshot();
});
