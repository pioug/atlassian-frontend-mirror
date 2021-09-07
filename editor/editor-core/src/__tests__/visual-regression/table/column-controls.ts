import { snapshot, initEditorWithAdf, Appearance } from '../_utils';
import { animationFrame } from '../../__helpers/page-objects/_editor';
import {
  getSelectorForTableCell,
  selectCellOption,
  tableSelectors,
  selectColumn,
  clickFirstCell,
  grabResizeHandle,
  hoverColumnControls,
} from '../../__helpers/page-objects/_table';
import {
  pressKeyDown,
  pressKeyUp,
} from '../../__helpers/page-objects/_keyboard';
import adf from './__fixtures__/default-table.adf.json';
import adfTableWithoutTableHeader from './__fixtures__/table-without-table-header.adf.json';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';

describe('Table context menu: merge-split cells', () => {
  let page: PuppeteerPage;

  const initEditor = async (adf: Object) => {
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      adf,
      viewport: { width: 1040, height: 400 },
      editorProps: {
        allowTables: {
          advanced: true,
        },
      },
    });
    await clickFirstCell(page);
  };

  const tableMergeCells = async (fromCell: string, toCell: string) => {
    await page.click(fromCell);
    await pressKeyDown(page, 'Shift');
    await page.click(toCell);
    await pressKeyUp(page, 'Shift');
    await page.waitForSelector(tableSelectors.selectedCell);
    await selectCellOption(page, tableSelectors.mergeCellsText);
    await snapshot(page);
  };

  beforeAll(async () => {
    page = global.page;
  });

  beforeEach(async () => {
    await initEditor(adf);
  });

  it(`should render column controls for each column regardless of merged cells in the first row`, async () => {
    const from = getSelectorForTableCell({
      row: 1,
      cell: 1,
    });
    const to = getSelectorForTableCell({ row: 1, cell: 3 });
    await tableMergeCells(from, to);
  });

  it('should display the borders when the column controls are selected', async () => {
    await selectColumn(1);

    await snapshot(page, { tolerance: 0 }, tableSelectors.nthColumnControl(1));
  });

  // FIXME: This test was automatically skipped due to failure on 8/26/2021: https://product-fabric.atlassian.net/browse/ED-13677
  it.skip('should display column resizer handler on top of the column controls', async () => {
    await grabResizeHandle(page, { colIdx: 1, row: 2 });
    await animationFrame(page);
    await snapshot(page, { tolerance: 0 }, tableSelectors.nthColumnControl(1));
  });

  describe('when there is no table header', () => {
    beforeEach(async () => {
      await initEditor(adfTableWithoutTableHeader);
    });

    it('should display hover effect', async () => {
      await hoverColumnControls(page, 1, 'right');
      await snapshot(page);
    });

    it('should display selected effect', async () => {
      await selectColumn(1);
      await snapshot(page);
    });
  });
});
