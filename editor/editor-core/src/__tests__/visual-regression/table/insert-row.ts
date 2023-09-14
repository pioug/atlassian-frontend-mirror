// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  snapshot,
  initEditorWithAdf,
  Appearance,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import * as tableWithBackgroundColorsADF from './__fixtures__/table-with-background-colors.adf.json';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  clickFirstCell,
  getSelectorForTableCell,
  selectRow,
  tableSelectors,
} from '@atlaskit/editor-test-helpers/page-objects/table';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { pressKeyCombo } from '@atlaskit/editor-test-helpers/page-objects/keyboard';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { animationFrame } from '@atlaskit/editor-test-helpers/page-objects/editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { retryUntilStablePosition } from '@atlaskit/editor-test-helpers/page-objects/toolbar';

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

const hideFloatingToolbar = async (page: PuppeteerPage) => {
  await page.evaluate(
    (floatingToolbarSelector) => {
      const elem = document.querySelector(floatingToolbarSelector);
      elem && (elem.style.display = 'none');
    },
    [tableSelectors.floatingToolbar],
  );
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
    // we omit floating toolbar from the snapshot
    // as its not part of the test focus and appears to flake into/out of appearance.
    // TODO: remove hideFloatingToolbar() logic and fix flakiness ED-15254
    await hideFloatingToolbar(page);
    await snapshot(page, {}, tableSelectors.tableWrapper);
  });

  it('should insert before the selection using keyboard shortcuts', async () => {
    const lastCell = getSelectorForTableCell({
      row: 3,
      cell: 1,
    });
    await click(page, lastCell);
    await animationFrame(page);
    await animationFrame(page);
    await pressKeyCombo(page, ['Control', 'Alt', 'ArrowUp']);
  });

  it('should insert after the selection using keyboard shortcuts', async () => {
    const lastCell = getSelectorForTableCell({
      row: 3,
      cell: 1,
    });
    await click(page, lastCell);
    await animationFrame(page);
    await animationFrame(page);
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
