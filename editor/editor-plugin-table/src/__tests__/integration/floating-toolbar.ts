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
    const sortAtoZButtonSelector =
      'div[data-role=droplistContent] div[role=presentation]';
    const sortZtoAButtonSelector =
      'div[data-role=droplistContent] div[role=presentation]:nth-of-type(2)';
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

    // Hover Sort column A -> Z button then it should show tooltip
    const sortAtoZButton = await page.$(sortAtoZButtonSelector);
    await sortAtoZButton.moveTo();
    const tooltip = await page.$(tooltipSelector);
    await tooltip.waitForExist();
    expect((await page.$$(tooltipSelector)).length).toBe(1);

    // Tooltip should be removed after mouseout to next button
    const sortZtoAButton = await page.$(sortZtoAButtonSelector);
    await sortZtoAButton.moveTo();
    await tooltip.waitUntil(async () => {
      return (await page.$$(tooltipSelector)).length === 0;
    });
  },
);
