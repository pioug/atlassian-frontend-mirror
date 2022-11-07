import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';

import { snapshot, initRendererWithADF } from './_utils';
import listsWithCodeblock from './__fixtures__/lists-with-codeblocks.adf.json';
import { selectors as rendererSelectors } from '../__helpers/page-objects/_renderer';
import { selectors as codeBlockSelectors } from '../__helpers/page-objects/_codeblock';

describe('Snapshot Test: List', () => {
  let page: PuppeteerPage;
  beforeAll(() => {
    page = global.page;
  });

  it('with codeblocks', async () => {
    await initRendererWithADF(page, {
      adf: listsWithCodeblock,
      appearance: 'full-page',
      viewport: { width: 600, height: 1000 },
    });
    await page.waitForSelector(rendererSelectors.document);
    await page.waitForSelector(codeBlockSelectors.codeBlock);
    await snapshot(page);
  });
});
