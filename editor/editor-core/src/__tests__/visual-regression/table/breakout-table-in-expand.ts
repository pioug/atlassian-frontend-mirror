import { snapshot, initEditorWithAdf, Appearance } from '../_utils';
import adf from './__fixtures__/breakout-table-in-expand.adf.json';
import { clickFirstCell } from '../../__helpers/page-objects/_table';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';

describe('Snapshot Test: nested breakout table within expand', () => {
  let page: PuppeteerPage;

  beforeAll(async () => {
    page = global.page;
  });

  it(`looks correct`, async () => {
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      adf,
      viewport: { width: 1040, height: 800 },
    });
    await clickFirstCell(page, true);
    await snapshot(page);
  });
});
