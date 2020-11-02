import { snapshot, initEditorWithAdf, Appearance } from '../_utils';
import * as tableWithBackgroundColorsADF from './__fixtures__/table-with-background-colors.adf.json';
import {
  clickFirstCell,
  getSelectorForTableCell,
  selectRow,
} from '../../__helpers/page-objects/_table';
import { tableSelectors } from '../../__helpers/page-objects/_table';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { pressKeyCombo } from '../../__helpers/page-objects/_keyboard';
import { animationFrame } from '../../__helpers/page-objects/_editor';
import { retryUntilStablePosition } from '../../__helpers/page-objects/_toolbar';

let page: PuppeteerPage;
const initEditor = async (adf: Object) => {
  await initEditorWithAdf(page, {
    appearance: Appearance.fullPage,
    adf,
    viewport: { width: 1040, height: 500 },
    editorProps: {
      allowTables: {
        allowHeaderRow: true,
        allowBackgroundColor: true,
        advanced: true,
      },
    },
  });
  await clickFirstCell(page, true);
};

describe('Snapshot Test: table insert row', () => {
  const click = async (page: any, selector: string) => {
    await page.waitForSelector(selector);
    await retryUntilStablePosition(
      page,
      () => page.click(selector),
      '[aria-label*="Table floating controls"]',
      1000,
    );
  };

  beforeAll(() => {
    page = global.page;
  });

  beforeEach(async () => {
    await initEditor(tableWithBackgroundColorsADF);
  });

  afterEach(async () => {
    await animationFrame(page);
    await animationFrame(page);
    await snapshot(page, {}, tableSelectors.tableWrapper);
  });

  it('should insert before the selection using keyboard shortcuts', async () => {
    const lastCell = getSelectorForTableCell({
      row: 3,
      cell: 1,
    });
    await click(page, lastCell);
    await pressKeyCombo(page, ['Control', 'Alt', 'ArrowUp']);
  });

  it('should insert after the selection using keyboard shortcuts', async () => {
    const lastCell = getSelectorForTableCell({
      row: 3,
      cell: 1,
    });
    await click(page, lastCell);
    await pressKeyCombo(page, ['Control', 'Alt', 'ArrowDown']);
  });

  describe('when there is a cell selection', () => {
    beforeEach(async () => {
      await selectRow(2);
      await selectRow(3, true);
      await selectRow(4, true);
      await page.mouse.move(0, 0);
    });

    it('should add after the selection', async () => {
      await pressKeyCombo(page, ['Control', 'Alt', 'ArrowDown']);
    });

    it('should add before the selection', async () => {
      await pressKeyCombo(page, ['Control', 'Alt', 'ArrowUp']);
    });
  });
});
