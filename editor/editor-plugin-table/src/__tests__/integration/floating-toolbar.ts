import {
  animationFrame,
  editable,
  fullpage,
  getDocFromElement,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import {
  clickFirstCell,
  multiCellTableSelectionBottomRightToMiddleTopCell,
  tableSelectors,
} from '@atlaskit/editor-test-helpers/page-objects/table';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';

import { TableCssClassName } from '../../plugins/table/types';

import basicTable from './__fixtures__/basic-table';
import basicTableWithMergedCell from './__fixtures__/basic-table-with-merged-cell';
import { documentWithMergedCells } from './__fixtures__/merged-rows-and-cols-document';

BrowserTestCase(
  'should floating toolbar context menu sit above other context menu layers',
  { skip: [] },
  async (client: any) => {
    const page = await goToEditorTestingWDExample(
      client,
      'editor-plugin-table',
    );
    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowTables: {
        advanced: true,
        allowColumnSorting: true,
        allowDistributeColumns: true,
        allowCellOptionsInFloatingToolbar: true,
      },
      defaultValue: basicTable,
    });
    const tableFloatingToolbarContextMenuSelector = `div[aria-label="Table floating controls"][data-editor-popup=true]`;
    // Select the all cells under column 2 and 3
    await multiCellTableSelectionBottomRightToMiddleTopCell(page);
    // Table floating toolbar should appear, then click on "Cell Options", which brings up another context menu
    const cellOptionsMenuItem = await (
      await page.$(tableFloatingToolbarContextMenuSelector)
    ).$(`button=${tableSelectors.cellOptionsFloatingToolbarText}`);
    await cellOptionsMenuItem.waitForClickable();
    await cellOptionsMenuItem.click();
    // Get the z-index style value of the delete icon popup
    const popupZIndex = await page.evaluate(() => {
      const popupSelector = 'div[aria-label="Popup"][data-editor-popup=true]';
      const deleteIconSelector = 'button.pm-table-controls__delete-button';
      return +(
        (
          document
            ?.querySelector(`${popupSelector} ${deleteIconSelector}`)
            ?.closest(popupSelector) as HTMLElement | null
        )?.style.zIndex || 0
      );
    });
    // Get the z-index style value of the table floating toolbar context menu
    const floatingTablePopupZIndex = await page.evaluate(() => {
      const floatingTablePopupSelector =
        'div[aria-label="Table floating controls"][data-editor-popup=true]';
      return +(
        (
          document?.querySelector(
            floatingTablePopupSelector,
          ) as HTMLElement | null
        )?.style.zIndex || 0
      );
    });
    // Floating toolbar context menu should sit above the popup
    expect(floatingTablePopupZIndex).toBeGreaterThan(popupZIndex);
  },
);

BrowserTestCase(
  'should show hover indicators on delete columns menu option',
  { skip: ['safari'] }, // The test does not pass on CI but works on physical browser
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(
      client,
      'editor-plugin-table',
    );
    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowTables: {
        advanced: true,
        allowColumnSorting: true,
        allowDistributeColumns: true,
        allowCellOptionsInFloatingToolbar: true,
      },
      defaultValue: basicTable,
    });
    const tableFloatingToolbarContextMenuSelector = `div[aria-label="Table floating controls"][data-editor-popup=true]`;

    // First click on the cell
    await clickFirstCell(page);

    // Table floating toolbar should appear, then click on "Cell Options", which brings up another context menu
    const cellOptionsMenuItem = await (
      await page.$(tableFloatingToolbarContextMenuSelector)
    ).$(`button=${tableSelectors.cellOptionsFloatingToolbarText}`);
    await cellOptionsMenuItem.waitForClickable();
    await cellOptionsMenuItem.click();

    // Hover on the "Delete column" menu option on the context menu
    const deleteColumnMenuItem = await (
      await page.$(tableFloatingToolbarContextMenuSelector)
    ).$(`button=${tableSelectors.removeColumnText}`);
    await deleteColumnMenuItem.moveTo();
    await animationFrame(page);

    // Check the first column cells should have the hover indicators appear
    const hoverCells = await page.$$(
      `tbody tr th.${TableCssClassName.HOVERED_CELL}.${TableCssClassName.HOVERED_COLUMN}, tbody tr td.${TableCssClassName.HOVERED_CELL}.${TableCssClassName.HOVERED_COLUMN}`,
    );
    expect(hoverCells.length).toBe(3);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'should show hover indicators on delete rows menu option',
  { skip: ['safari'] }, // The test does not pass on CI but works on physical browser
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(
      client,
      'editor-plugin-table',
    );
    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowTables: {
        allowColumnSorting: true,
        allowDistributeColumns: true,
        allowCellOptionsInFloatingToolbar: true,
      },
      defaultValue: basicTable,
    });
    const tableFloatingToolbarContextMenuSelector = `div[aria-label="Table floating controls"][data-editor-popup=true]`;

    // First click on the cell
    await clickFirstCell(page);

    // Table floating toolbar should appear, then click on "Cell Options", which brings up another context menu
    const cellOptionsMenuItem = await (
      await page.$(tableFloatingToolbarContextMenuSelector)
    ).$(`button=${tableSelectors.cellOptionsFloatingToolbarText}`);
    await cellOptionsMenuItem.waitForClickable();
    await cellOptionsMenuItem.click();

    // Hover on the "Delete row" menu option on the context menu
    const deleteRowMenuItem = await (
      await page.$(tableFloatingToolbarContextMenuSelector)
    ).$(`button=${tableSelectors.removeRowText}`);
    await deleteRowMenuItem.moveTo();
    await animationFrame(page);

    // Check the first row cells should have the hover indicators appear (second row from the top)
    const hoverCells = await page.$$(
      `tbody tr:nth-child(2) td.${TableCssClassName.HOVERED_CELL}.${TableCssClassName.HOVERED_ROW}`,
    );
    expect(hoverCells.length).toBe(3);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'should show tooltip on hover on disabled sort button then remove it on mouse out',
  { skip: ['safari'] }, // The test does not pass on CI but works on physical browser
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(
      client,
      'editor-plugin-table',
    );
    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowTables: {
        allowColumnSorting: true,
        allowDistributeColumns: true,
        allowCellOptionsInFloatingToolbar: true,
      },
      defaultValue: documentWithMergedCells,
    });
    const tableFloatingToolbarContextMenuSelector = `div[aria-label="Table floating controls"][data-editor-popup=true]`;
    const sortColumnButtonSelector =
      'div[data-role=droplistContent] div[role=presentation]';
    const tooltipSelector = 'div.atlaskit-portal div[role=tooltip]';

    // Click on the cell on the table
    await clickFirstCell(page);

    // Table floating toolbar should appear, then hover on "Cell Options", which brings up another context menu
    const cellOptionsMenuItem = await (
      await page.$(tableFloatingToolbarContextMenuSelector)
    ).$(`button=${tableSelectors.cellOptionsFloatingToolbarText}`);
    await cellOptionsMenuItem.waitForClickable();
    await cellOptionsMenuItem.click();

    // No tooltip is shown
    expect((await page.$$(tooltipSelector)).length).toBe(0);

    // Expect there are 2 sort column tooltip menu option
    const sortColumnButtons = await page.$$(sortColumnButtonSelector);
    expect(sortColumnButtons.length).toBe(2);
    const tooltip = await page.$(tooltipSelector);

    // Hover Sort column A -> Z button then it should show tooltip, and should be removed after mouseout
    const sortAtoZButton = sortColumnButtons[0];
    await sortAtoZButton.moveTo();
    await tooltip.waitForExist();
    expect((await page.$$(tooltipSelector)).length).toBe(1);
    await cellOptionsMenuItem.moveTo();
    await tooltip.waitUntil(async () => {
      return (await page.$$(tooltipSelector)).length === 0;
    });

    // Hover Sort column Z -> A button then it should show tooltip, and should be removed after mouseout
    const sortZtoAButton = sortColumnButtons[1];
    await sortZtoAButton.moveTo();
    await tooltip.waitForExist();
    expect((await page.$$(tooltipSelector)).length).toBe(1);
    await cellOptionsMenuItem.moveTo();
    await tooltip.waitUntil(async () => {
      return (await page.$$(tooltipSelector)).length === 0;
    });
  },
);

BrowserTestCase(
  'should show yellow highlight on the megred rows when hover disabled sort column ASC menu option',
  { skip: ['safari'] }, // The test does not pass on CI but works on physical browser
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(
      client,
      'editor-plugin-table',
    );
    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowTables: {
        allowColumnSorting: true,
        allowDistributeColumns: true,
        allowCellOptionsInFloatingToolbar: true,
      },
      defaultValue: basicTableWithMergedCell,
    });
    const tableFloatingToolbarContextMenuSelector = `div[aria-label="Table floating controls"][data-editor-popup=true]`;

    // Click on the cell on the table
    await clickFirstCell(page);

    // Table floating toolbar should appear, then hover on "Cell Options", which brings up another context menu
    const cellOptionsMenuItem = await (
      await page.$(tableFloatingToolbarContextMenuSelector)
    ).$(`button=${tableSelectors.cellOptionsFloatingToolbarText}`);
    await cellOptionsMenuItem.waitForClickable();
    await cellOptionsMenuItem.click();

    // Hover on the "Sort column ASC" menu option on the context menu
    const sortColumnAscMenuItem = await (
      await page.$(tableFloatingToolbarContextMenuSelector)
    ).$(`button=${tableSelectors.sortColumnASC}`);
    await sortColumnAscMenuItem.moveTo();
    await animationFrame(page);

    // Check there the yellow highlight background on the merged cells.
    const highlightedCell = await page.$$(
      `tbody tr:nth-child(3) td.${TableCssClassName.HOVERED_CELL_WARNING}`,
    );
    expect(highlightedCell.length).toBe(1);
    await animationFrame(page);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'should show yellow highlight on the megred rows when hover disabled sort column DESC menu option',
  { skip: ['safari'] }, // The test does not pass on CI but works on physical browser
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(
      client,
      'editor-plugin-table',
    );
    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowTables: {
        allowColumnSorting: true,
        allowDistributeColumns: true,
        allowCellOptionsInFloatingToolbar: true,
      },
      defaultValue: basicTableWithMergedCell,
    });
    const tableFloatingToolbarContextMenuSelector = `div[aria-label="Table floating controls"][data-editor-popup=true]`;

    // Click on the cell on the table
    await clickFirstCell(page);

    // Table floating toolbar should appear, then hover on "Cell Options", which brings up another context menu
    const cellOptionsMenuItem = await (
      await page.$(tableFloatingToolbarContextMenuSelector)
    ).$(`button=${tableSelectors.cellOptionsFloatingToolbarText}`);
    await cellOptionsMenuItem.waitForClickable();
    await cellOptionsMenuItem.click();

    // Hover on the "Sort column DESC" menu option on the context menu
    const sortColumnDescMenuItem = await (
      await page.$(tableFloatingToolbarContextMenuSelector)
    ).$(`button=${tableSelectors.sortColumnDESC}`);
    await sortColumnDescMenuItem.moveTo();
    await animationFrame(page);

    // Check there the yellow highlight background on the merged cells.
    const highlightedCell = await page.$$(
      `tbody tr:nth-child(3) td.${TableCssClassName.HOVERED_CELL_WARNING}`,
    );
    expect(highlightedCell.length).toBe(1);
    await animationFrame(page);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'should the context menu disabled item stay open when clicked.',
  { skip: [] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(
      client,
      'editor-plugin-table',
    );
    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowTables: {
        allowColumnSorting: true,
        allowDistributeColumns: true,
        allowCellOptionsInFloatingToolbar: true,
      },
      defaultValue: basicTable,
    });
    const tableFloatingToolbarContextMenuSelector = `div[aria-label="Table floating controls"][data-editor-popup=true]`;

    // First click on the cell
    await clickFirstCell(page);

    // Table floating toolbar should appear, then click on "Cell Options", which brings up another context menu
    const tableFloatingToolbar = await page.$(
      tableFloatingToolbarContextMenuSelector,
    );
    tableFloatingToolbar.waitForExist();
    await animationFrame(page);

    const cellOptionsMenuItem = await tableFloatingToolbar.$(
      `button=${tableSelectors.cellOptionsFloatingToolbarText}`,
    );
    await cellOptionsMenuItem.waitForClickable();
    await cellOptionsMenuItem.click();
    await animationFrame(page);

    // Hover on the "Merge Cell" menu option on the context menu (which should be disabled)
    const mergeCellsMenuItem = await tableFloatingToolbar.$(
      `button=${tableSelectors.mergeCellsText}`,
    );
    expect(await mergeCellsMenuItem.getAttribute('disabled')).toBe('true');
    await mergeCellsMenuItem.moveTo();
    await mergeCellsMenuItem.click();
    await animationFrame(page);

    // The context menu should remains open, thus the menu item should still be visible
    expect(await mergeCellsMenuItem.isDisplayed()).toBe(true);
  },
);
