import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  snapshot,
  initFullPageEditorWithAdf,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import adf from './__fixtures__/default-table.adf.json';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { pressKey } from '@atlaskit/editor-test-helpers/page-objects/keyboard';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  clickFirstCell,
  clickTableOptions,
  clickCellOptionsInFloatingToolbar,
  clickCellBackgroundInFloatingToolbar,
  clickCellOptions,
  selectCellOption,
  floatingToolbarAriaLabel as tableFloatingToolbarAriaLabel,
  tableSelectors,
} from '@atlaskit/editor-test-helpers/page-objects/table';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { waitForFloatingControl } from '@atlaskit/editor-test-helpers/page-objects/toolbar';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { selectors } from '@atlaskit/editor-test-helpers/page-objects/editor';

const dropdownListSelector =
  '[aria-label="Popup"] [data-role="droplistContent"]';

describe('Table floating toolbar:fullpage - no snapshot', () => {
  let page: PuppeteerPage;

  // FIXME: toolbar centering isn't right...
  beforeEach(async () => {
    page = global.page;
    await initFullPageEditorWithAdf(page, adf);
    // Focus the table and select the first (non header row) cell
    await clickFirstCell(page, true);
    // Wait for floating table controls underneath the table
    await waitForFloatingControl(page, tableFloatingToolbarAriaLabel);
  });

  it('display correct "Cell background" menu item background color', async () => {
    const cellBackgroundMenuItemColor = `getComputedStyle(document.querySelector('[data-testid="dropdown-item__${tableSelectors.cellBackgroundText}"]')).backgroundColor`;
    const cellBackgroundMenuItemSelector = `[data-testid="dropdown-item__${tableSelectors.cellBackgroundText}"]`;

    const blue = `rgb(179, 212, 255)`;
    const grey = `rgb(244, 245, 247)`;

    /**
     * Click cell context menu drop down
     * Click "Cell background" - menu item background color should be blue
     * Click on color palette - "Cell background" menu item background color shold be grey
     */
    await clickCellOptions(page);

    await page.hover(cellBackgroundMenuItemSelector);
    await page.mouse.down();
    const bgColor = await page.evaluate(cellBackgroundMenuItemColor);
    expect(bgColor).toEqual(blue);
    await page.mouse.up();

    await page.hover(tableSelectors.cellBackgroundSubmenuSelector);
    await page.mouse.down();
    const bgColorSubmenuActive = await page.evaluate(
      cellBackgroundMenuItemColor,
    );
    expect(bgColorSubmenuActive).toEqual(grey);
  });
});

describe('Table floating toolbar:fullpage', () => {
  let page: PuppeteerPage;

  // FIXME: toolbar centering isn't right...
  beforeEach(async () => {
    page = global.page;
    await initFullPageEditorWithAdf(page, adf);
    // Focus the table and select the first (non header row) cell
    await clickFirstCell(page, true);
    // Wait for floating table controls underneath the table
    await waitForFloatingControl(page, tableFloatingToolbarAriaLabel);
  });

  afterEach(async () => {
    await snapshot(page);
  });

  it('display options', async () => {
    // Click table options within the floating toolbar
    await clickTableOptions(page);
    // Wait for the drop down list within floating table controls to be shown
    await page.waitForSelector(
      `[aria-label="${tableFloatingToolbarAriaLabel}"] ${dropdownListSelector}`,
    );
  });

  it('display cell options', async () => {
    // Click table cell options button within the selected cell
    await clickCellOptions(page);
    // Wait for table cell options drop down list to be shown
    await page.waitForSelector(dropdownListSelector);
  });

  // FIXME DTR-1737 This test is skipped because current snapshot doesn't have a check mark icon on color palette.
  it.skip('display cell background', async () => {
    // Wait for table cell options drop down list to be shown, then
    // select background color option and wait for color picker popout to be shown
    await selectCellOption(page, 'Cell background');

    await page.waitForSelector(
      `${dropdownListSelector} .pm-table-contextual-submenu`,
    );
  });

  describe('Table cell options in floating toolbar', () => {
    beforeEach(async () => {
      page = global.page;
      await initFullPageEditorWithAdf(page, adf, undefined, undefined, {});
      // Focus the table and select the first (non header row) cell
      await clickFirstCell(page, true);
      // Wait for floating table controls underneath the table
      await waitForFloatingControl(page, tableFloatingToolbarAriaLabel);
    });

    it('displays cell options in floating toolbar', async () => {
      await clickCellOptionsInFloatingToolbar(page);
      await page.waitForSelector(
        `[aria-label="${tableFloatingToolbarAriaLabel}"] ${dropdownListSelector}`,
      );
    });

    it('display cell background in floating toolbar', async () => {
      await clickCellBackgroundInFloatingToolbar(page);
      await page.waitForSelector(selectors.colorPicker);
    });

    it('arrow navigation key works in color palatte', async () => {
      await clickCellBackgroundInFloatingToolbar(page);
      await page.waitForSelector(selectors.colorPicker);
      await pressKey(page, 'ArrowDown');
      await pressKey(page, 'ArrowDown');
      await pressKey(page, 'ArrowRight');
      await pressKey(page, 'ArrowUp');
      await pressKey(page, 'ArrowRight');
      await pressKey(page, 'ArrowRight');
      await pressKey(page, 'ArrowDown');
      await pressKey(page, 'ArrowDown');
      await pressKey(page, 'ArrowLeft');
    });
  });
});
