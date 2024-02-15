import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { initRendererWithADF, snapshot } from './_utils';
import * as adfWithDate from '../__fixtures__/date.adf.json';
import { selectors } from '../__helpers/page-objects/_date';

describe('Snapshot Test: Date', () => {
  let page: PuppeteerPage;
  beforeAll(() => {
    page = global.page;
  });

  test('should render the date node properly', async () => {
    await initRendererWithADF(page, {
      adf: adfWithDate,
      appearance: 'full-page',
      viewport: { width: 500, height: 200 },
    });

    await page.waitForSelector(selectors.date);
    await snapshot(page);
  });
});
