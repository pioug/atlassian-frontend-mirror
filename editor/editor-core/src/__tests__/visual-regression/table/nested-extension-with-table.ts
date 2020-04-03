import { snapshot, initEditorWithAdf, Appearance } from '../_utils';
import adf from './__fixtures__/nested-table.adf.json';
import { clickFirstCell } from '../../__helpers/page-objects/_table';
import { Page } from '../../__helpers/page-objects/_types';

describe('Snapshot Test: nested block extension with table', () => {
  let page: Page;

  beforeAll(async () => {
    page = global.page;
  });

  it(`looks correct`, async () => {
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      adf,
      viewport: { width: 1040, height: 600 },
    });
    await clickFirstCell(page);
    await snapshot(page);
  });
});
