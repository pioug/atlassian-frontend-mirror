import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { snapshot, initRendererWithADF } from './_utils';

import * as adf from '../__fixtures__/code-block.adf.json';

describe('Snapshot Test: CodeBlock', () => {
  let page: PuppeteerPage;
  beforeAll(() => {
    page = global.page;
  });

  afterEach(async () => {
    await snapshot(page, undefined, '.code-block');
  });

  test(`should render copy-to-clipboard button correctly on hover `, async () => {
    await initRendererWithADF(page, {
      appearance: 'full-page',
      rendererProps: { allowCopyToClipboard: true },
      adf,
    });
    await page.waitForSelector('.code-block');
    await page.hover('.code-block');
    await page.waitForSelector('.code-block .copy-to-clipboard');
    await page.hover('.code-block .copy-to-clipboard');
  });
});
