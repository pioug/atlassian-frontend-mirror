import { snapshot, initEditorWithAdf, Appearance } from '../_utils';
import adf from './__fixtures__/nested-table.adf.json';
import { clickFirstCell } from '../../__helpers/page-objects/_table';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';

describe('Snapshot Test: nested block extension with table', () => {
  let page: PuppeteerPage;

  beforeAll(async () => {
    page = global.page;
  });

  // FIXME: This test was automatically skipped due to failure on 9/2/2021: https://product-fabric.atlassian.net/browse/ED-13694
  it.skip(`looks correct`, async () => {
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      adf,
      viewport: { width: 1040, height: 600 },
    });
    await clickFirstCell(page, true);
    await snapshot(page);
  });
});
