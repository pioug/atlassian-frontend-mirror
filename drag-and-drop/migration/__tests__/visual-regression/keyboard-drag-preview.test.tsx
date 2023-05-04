import type { ElementHandle, Page } from 'puppeteer';
import invariant from 'tiny-invariant';

import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

async function getByTestId(
  page: Page,
  testId: string,
): Promise<ElementHandle<Element>> {
  const element = await page.$(`[data-testid="${testId}"]`);
  invariant(element !== null);
  return element;
}

const cases = [
  ['in standard lists', 'board'],
  ['with react-window', 'react-window'],
  ['with react-virtualized', 'react-virtualized'],
] as const;

/**
 * Usually, taking a screenshot in puppeteer fires a resize event,
 * which cancels the active keyboard drag.
 *
 * This helper passes the `{ captureBeyondViewport: false }` flag,
 * which seems to avoid this resizing behavior.
 */
async function screenshotPageWithoutCaptureBeyondViewport(page: Page) {
  return page.screenshot({ captureBeyondViewport: false });
}

describe('keyboard drag previews', () => {
  cases.forEach(([id, example]) => {
    const url = getExampleUrl(
      'drag-and-drop',
      'migration',
      example,
      global.__BASEURL__,
      'light',
    );

    describe(id, () => {
      describe('vertical', () => {
        it('should display correctly in its initial position', async () => {
          const { page } = global;
          await loadPage(page, url);

          const cardA0 = await getByTestId(page, 'item-A0');
          await cardA0.focus();
          await page.keyboard.press('Space');

          expect(
            await screenshotPageWithoutCaptureBeyondViewport(page),
          ).toMatchProdImageSnapshot();
        });

        it('should display correctly in an away position (moving in home list)', async () => {
          const { page } = global;
          await loadPage(page, url);

          const cardA0 = await getByTestId(page, 'item-A0');
          await cardA0.focus();
          await page.keyboard.press('Space');
          await page.keyboard.press('ArrowDown');

          expect(
            await screenshotPageWithoutCaptureBeyondViewport(page),
          ).toMatchProdImageSnapshot();
        });

        it('should display correctly when returning home (moving in home list)', async () => {
          const { page } = global;
          await loadPage(page, url);

          const cardA0 = await getByTestId(page, 'item-A0');
          await cardA0.focus();
          await page.keyboard.press('Space');

          await page.keyboard.press('ArrowDown');
          await page.keyboard.press('ArrowUp');

          expect(
            await screenshotPageWithoutCaptureBeyondViewport(page),
          ).toMatchProdImageSnapshot();
        });

        it('should display correctly in an away position (moving from an away list)', async () => {
          const { page } = global;
          await loadPage(page, url);

          const cardA0 = await getByTestId(page, 'item-A0');
          await cardA0.focus();
          await page.keyboard.press('Space');
          await page.keyboard.press('ArrowRight');
          await page.keyboard.press('ArrowRight');

          expect(
            await screenshotPageWithoutCaptureBeyondViewport(page),
          ).toMatchProdImageSnapshot();
        });

        it('should display correctly when returning home (moving from an away list)', async () => {
          const { page } = global;
          await loadPage(page, url);

          const cardA0 = await getByTestId(page, 'item-A0');
          await cardA0.focus();
          await page.keyboard.press('Space');

          await page.keyboard.press('ArrowRight');
          await page.keyboard.press('ArrowRight');
          await page.keyboard.press('ArrowLeft');
          await page.keyboard.press('ArrowLeft');

          expect(
            await screenshotPageWithoutCaptureBeyondViewport(page),
          ).toMatchProdImageSnapshot();
        });
      });

      describe('horizontal', () => {
        it('should display correctly in its initial position', async () => {
          const { page } = global;
          await loadPage(page, url);

          const columnA = await getByTestId(page, 'column-A--header');
          await columnA.focus();
          await page.keyboard.press('Space');

          /**
           * This test was exhibiting weird behavior.
           *
           * It would display correctly when:
           * - Running manually
           * - Running only this test in isolation
           *
           * But when running all of the tests it would display
           * incorrectly.
           *
           * Hiding the radiogroup on the side results in consistent behavior.
           */
          await page.$eval('[role="radiogroup"]', element => {
            if (element instanceof HTMLElement) {
              element.style.display = 'none';
            }
          });

          expect(
            await screenshotPageWithoutCaptureBeyondViewport(page),
          ).toMatchProdImageSnapshot();
        });

        it('should display correctly in an away position ', async () => {
          const { page } = global;
          await loadPage(page, url);

          const columnA = await getByTestId(page, 'column-A--header');
          await columnA.focus();
          await page.keyboard.press('Space');
          await page.keyboard.press('ArrowRight');

          expect(
            await screenshotPageWithoutCaptureBeyondViewport(page),
          ).toMatchProdImageSnapshot();
        });

        it('should display correctly when returning home ', async () => {
          const { page } = global;
          await loadPage(page, url);

          const columnA = await getByTestId(page, 'column-A--header');
          await columnA.focus();
          await page.keyboard.press('Space');

          await page.keyboard.press('ArrowRight');
          await page.keyboard.press('ArrowLeft');

          expect(
            await screenshotPageWithoutCaptureBeyondViewport(page),
          ).toMatchProdImageSnapshot();
        });
      });
    });
  });
});
