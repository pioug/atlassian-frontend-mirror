import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { initRendererWithADF, snapshot } from './_utils';
import * as placeholderAdf from './__fixtures__/placeholder.adf.json';
import { selectors } from '../__helpers/page-objects/_placeholder';

describe('Snapshot Test: Placeholder', () => {
  let page: PuppeteerPage;
  beforeAll(() => {
    page = global.page;
  });

  test('should render the date node properly', async () => {
    await initRendererWithADF(page, {
      adf: placeholderAdf,
      appearance: 'full-page',
      viewport: { width: 200, height: 200 },
      rendererProps: { allowPlaceholderText: true },
    });

    await page.waitForSelector(selectors.placeholder);
    await snapshot(page);
  });
});
