import { snapshot, initEditorWithAdf, Appearance } from '../_utils';
import adf from './__fixtures__/table-inside-bodied-extension.adf.json';
import {
  insertRow,
  insertColumn,
  clickFirstCell,
} from '../../__helpers/page-objects/_table';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';

describe('Snapshot Test: table insert/delete', () => {
  let page: PuppeteerPage;
  beforeAll(async () => {
    page = global.page;
  });

  beforeEach(async () => {
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      adf,
      viewport: { width: 1040, height: 500 },
    });
    await clickFirstCell(page, true);
  });

  afterEach(async () => {
    await snapshot(page);
  });

  it('should be able to insert row', async () => {
    await insertRow(page, 1);
  });

  it('should be able to insert column', async () => {
    await insertColumn(page, 1, 'left');
  });
});
