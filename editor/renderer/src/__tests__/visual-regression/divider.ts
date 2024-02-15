import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { initRendererWithADF, snapshot } from './_utils';
import * as adfWithDivider from './__fixtures__/divider.adf.json';

describe('Snapshot Test: Divider', () => {
  let page: PuppeteerPage;
  beforeAll(() => {
    page = global.page;
  });

  test('should render the divider node properly', async () => {
    await initRendererWithADF(page, {
      adf: adfWithDivider,
      appearance: 'full-page',
      viewport: { width: 500, height: 200 },
    });

    await snapshot(page);
  });
});
