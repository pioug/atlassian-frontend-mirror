import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';

import { selectors as codeBlockSelectors } from '../__helpers/page-objects/_codeblock';
import { selectors as listSelectors } from '../__helpers/page-objects/_list';
import { selectors as rendererSelectors } from '../__helpers/page-objects/_renderer';
import { initRendererWithADF, snapshot } from './_utils';
import listsOlUlAdf from './__fixtures__/lists-ordered-unordered-adf.json';
import { createListAdf } from './__fixtures__/lists-starting-from-adf';
import listsWithCodeblock from './__fixtures__/lists-with-codeblocks.adf.json';

describe('Snapshot Test: List', () => {
  let page: PuppeteerPage;
  beforeAll(() => {
    page = global.page;
  });

  // TODO: This test is failing legitimitely in the atlaskit renderer examples
  // However, it looks correct in Confluence and on branch deploys
  // Need to investigate why the marker alignment is off in renderer examples
  // and fix in DTR-2112
  it.skip('with codeblocks', async () => {
    await initRendererWithADF(page, {
      adf: listsWithCodeblock,
      appearance: 'full-page',
      viewport: { width: 600, height: 1000 },
    });
    await page.waitForSelector(rendererSelectors.document);
    await page.waitForSelector(codeBlockSelectors.codeBlock);
    await snapshot(page);
  });

  describe('custom start numbers', () => {
    const testCases = [
      { listStart: 1, expectedVisualStart: 1 },
      { listStart: 99, expectedVisualStart: 99 },
      { listStart: 0, expectedVisualStart: 0 },
      { listStart: 3.9, expectedVisualStart: 3 },
      { listStart: 999, expectedVisualStart: 999 },
      { listStart: 9999, expectedVisualStart: 9999 },
      // we expect the minimum:0 ADF schema validation rule to ensure
      // that the adf validator discards negative order attribute values,
      // forcing these to render with the default 1 visually
      { listStart: -3, expectedVisualStart: 1 },
      { listStart: -1.9, expectedVisualStart: 1 },
    ];

    testCases.forEach(({ listStart, expectedVisualStart }) => {
      it(`renders list with start ${listStart} as starting from ${expectedVisualStart}`, async () => {
        const listStartingFromAdf = createListAdf({ order: listStart });
        await initRendererWithADF(page, {
          adf: listStartingFromAdf,
          appearance: 'full-page',
          viewport: { width: 600, height: 1000 },
          rendererProps: {
            useSpecBasedValidator: true,
          },
        });
        await page.waitForSelector(rendererSelectors.document);
        await snapshot(page, undefined, listSelectors.orderedList);
      });
    });
  });

  it('renders both ol and ul lists with numbers below 100 with same left padding', async () => {
    await initRendererWithADF(page, {
      adf: listsOlUlAdf,
      appearance: 'full-page',
      viewport: { width: 300, height: 200 },
      rendererProps: {
        useSpecBasedValidator: true,
      },
    });
    await page.waitForSelector(rendererSelectors.document);
    await snapshot(page);
  });
});
