import { snapshot, initFullPageEditorWithAdf } from '../_utils';
import adf from './__fixtures__/default-table.adf.json';
import {
  clickFirstCell,
  clickTableOptions,
  clickCellOptions,
  getSelectorForTableCell,
  selectCellOption,
} from '../../__helpers/page-objects/_table';

describe('Table floating toolbar:fullpage', () => {
  let page: any;

  beforeEach(async () => {
    page = global.page;
    await initFullPageEditorWithAdf(page, adf);
    await clickFirstCell(page);
  });

  afterEach(async () => {
    await snapshot(page);
  });

  it('display options', async () => {
    await clickTableOptions(page);
  });

  it('display cell options', async () => {
    await getSelectorForTableCell({ row: 2, cell: 2 });
    await clickCellOptions(page);
  });

  it('display cell background', async () => {
    await getSelectorForTableCell({ row: 2, cell: 2 });
    await selectCellOption(page, 'Cell background');
  });
});
