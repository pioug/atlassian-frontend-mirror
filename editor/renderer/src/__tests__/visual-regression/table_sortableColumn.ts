import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { snapshot, animationFrame, initRendererWithADF } from './_utils';
import * as tableSortable from '../__fixtures__/table-sortable.adf.json';
import * as tableWithMergedCells from '../__fixtures__/table-with-merged-cells.adf.json';
import * as tableWithHeaderColumnButWithoutHeaderRow from '../__fixtures__/table-with-header-column-but-without-header-row.adf.json';
import * as tableWithHeaderColumnButWithoutHeaderRowWithoutNumberColumn from '../__fixtures__/table-with-header-column-but-without-header-row-without-number-column.adf.json';
import { RendererCssClassName } from '../../consts';
import { StatusClassNames } from '../../ui/SortingIcon';
import {
  waitForTooltip,
  waitForText,
} from '@atlaskit/visual-regression/helper';

async function waitForSort(
  page: PuppeteerPage,
  columnIndex = 1,
  sortModifier: 'no_order' | 'asc' | 'desc' | 'not_allowed',
) {
  const col = `th:nth-child(${columnIndex})`;
  const element = 'figure.ak-renderer-tableHeader-sorting-icon';
  const icon = `.sorting-icon-svg__${sortModifier}`;
  await page.waitForSelector(`${col} ${element} ${icon}`);
}

const initRenderer = async (page: PuppeteerPage, adf: any) => {
  await initRendererWithADF(page, {
    appearance: 'full-page',
    viewport: { width: 800, height: 600 },
    adf,
    rendererProps: { allowColumnSorting: true },
  });
};

const getSortableColumnSelector = (nth: number) =>
  `tr:first-of-type .${RendererCssClassName.SORTABLE_COLUMN}:nth-of-type(${nth})`;

const waitForDateText = async (page: PuppeteerPage, text: string) =>
  await waitForText(page, '.date-lozenger-container > span', text);

describe('Snapshot Test: Table sorting', () => {
  let page: PuppeteerPage;

  beforeAll(() => {
    page = global.page;
  });

  afterEach(async () => {
    await animationFrame(page);
    await snapshot(page, undefined, '.pm-table-container');
  });

  describe('sorting', () => {
    beforeEach(async () => {
      await initRenderer(page, tableSortable);
      await page.waitForSelector(`.${RendererCssClassName.SORTABLE_COLUMN}`);
      // default sort order
      await waitForSort(page, 1, 'no_order');
    });
    afterEach(async () => {
      await waitForDateText(page, 'Aug 23, 2019');
    });

    it('should sort table in asc on the first click', async () => {
      await page.click(getSortableColumnSelector(1));
      // new sort order via click
      await waitForSort(page, 1, 'asc');
    });

    it('should show sort A to Z on mouse hover default state', async () => {
      await page.hover(
        `${getSortableColumnSelector(1)} .${StatusClassNames.NO_ORDER}`,
      );
      await waitForTooltip(page);
    });

    it('should sort table in desc on the second click', async () => {
      await page.click(getSortableColumnSelector(1));
      await waitForSort(page, 1, 'asc');
      await page.click(getSortableColumnSelector(1));
      await waitForSort(page, 1, 'desc');
    });

    it('should show sort Z to A on mouse hover after one click', async () => {
      await page.click(getSortableColumnSelector(1));
      await waitForSort(page, 1, 'asc');
      await page.hover(
        `${getSortableColumnSelector(1)} .${StatusClassNames.ASC}`,
      );
      await waitForTooltip(page);
    });

    it('should revert back to original table order on the third click', async () => {
      await page.click(getSortableColumnSelector(1));
      await waitForSort(page, 1, 'asc');
      await page.click(getSortableColumnSelector(1));
      await waitForSort(page, 1, 'desc');
      await page.click(getSortableColumnSelector(1));
      await waitForSort(page, 1, 'no_order');
    });

    it('should show sort clear sorting on mouse hover after two clicks', async () => {
      await page.click(getSortableColumnSelector(1));
      await waitForSort(page, 1, 'asc');
      await page.click(getSortableColumnSelector(1));
      await waitForSort(page, 1, 'desc');

      await page.hover(
        `${getSortableColumnSelector(1)} .${StatusClassNames.DESC}`,
      );
      await waitForTooltip(page);
    });
  });

  describe('when there is merged cells', () => {
    it('should display not allowed message', async () => {
      await initRenderer(page, tableWithMergedCells);

      await page.waitForSelector(
        `.${RendererCssClassName.SORTABLE_COLUMN_NOT_ALLOWED}`,
      );
      await page.hover(
        `${getSortableColumnSelector(1)} .${
          StatusClassNames.SORTING_NOT_ALLOWED
        }`,
      );

      await waitForTooltip(page);
    });
  });

  describe('when there is no header row', () => {
    describe('when the table has number column', () => {
      describe.each([1, 2, 3])('when hover %d th row', (rowNth) => {
        it('should not display any message', async () => {
          await initRenderer(page, tableWithHeaderColumnButWithoutHeaderRow);

          await page.hover(`table tr:nth-child(${rowNth}) th`);

          // No tooltip is expected, but wait before snapshotting just to be sure.
          await page.waitForTimeout(300);
          await animationFrame(page);
          await animationFrame(page);
        });
      });
    });

    describe('when the table has not number column', () => {
      describe.each([1, 2, 3])('when hover %d th row', (rowNth) => {
        it('should not display any message', async () => {
          await initRenderer(
            page,
            tableWithHeaderColumnButWithoutHeaderRowWithoutNumberColumn,
          );

          await page.hover(`table tr:nth-child(${rowNth}) th`);

          // No tooltip is expected, but wait before snapshotting just to be sure.
          await page.waitForTimeout(300);
          await animationFrame(page);
          await animationFrame(page);
        });
      });
    });
  });
});
