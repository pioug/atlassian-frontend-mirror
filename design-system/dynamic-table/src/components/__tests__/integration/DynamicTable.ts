import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

/* Url to test the example */
const urlDynamicTable = getExampleUrl('core', 'dynamic-table', 'testing');

/* Css selectors used for the test */
const table = "[data-testid='the-table--table']";
const tableHead = "[data-testid='the-table--head']";
const tableHeadCell = "[data-testid='the-table--head--cell']";
const tableHeadName = `${tableHeadCell}:nth-child(1)`;
const tableHeadParty = `${tableHeadCell}:nth-child(2)`;
const tableHeadTerm = `${tableHeadCell}:nth-child(3)`;
const tableHeadComment = `${tableHeadCell}:nth-child(4)`;
const tableRowG = "[data-testid='the-table--row-row-0-George Washington']";
const tableRowJ = "[data-testid='the-table--row-row-1-John Adams']";
const tableRowT = "[data-testid='the-table--row-row-2-Thomas Jefferson']";
const tableRowJa = "[data-testid='the-table--row-row-3-James Madison']";
const tableRowA = "[data-testid='the-table--row-row-15-Abraham Lincoln']";
const tableCell0 = "[data-testid='the-table--cell-0']";
const tableCell1 = "[data-testid='the-table--cell-1']";
const tableCell2 = "[data-testid='the-table--cell-2']";
const tableCell3 = "[data-testid='the-table--cell-3']";

BrowserTestCase(
  'DynamicTable elements should be able to be identified, interacted and sorted by data-testid',
  {} as any,
  async (client: any) => {
    const dynamicTableTest = new Page(client);
    await dynamicTableTest.goto(urlDynamicTable);

    // Check for visibility.
    expect(await dynamicTableTest.isVisible(table)).toBe(true);
    expect(await dynamicTableTest.isVisible(tableHead)).toBe(true);
    expect(await dynamicTableTest.isVisible(tableHeadCell)).toBe(true);
    expect(await dynamicTableTest.isVisible(tableRowG)).toBe(true);
    expect(await dynamicTableTest.isVisible(tableRowJ)).toBe(true);
    expect(await dynamicTableTest.isVisible(tableRowT)).toBe(true);
    expect(await dynamicTableTest.isVisible(tableRowJa)).toBe(true);

    // Check for content without sorting.
    expect(await dynamicTableTest.getText(tableHeadName)).toContain('Name');
    expect(await dynamicTableTest.getText(tableHeadParty)).toContain('Party');
    expect(await dynamicTableTest.getText(tableHeadTerm)).toContain('Term');
    expect(await dynamicTableTest.getText(tableHeadComment)).toContain(
      'Comment',
    );
    expect(
      await dynamicTableTest.getText(`${tableRowG} > ${tableCell0}`),
    ).toContain('George Washington');
    expect(
      await dynamicTableTest.getText(`${tableRowT} > ${tableCell1}`),
    ).toContain('Democratic-Republican');
    expect(
      await dynamicTableTest.getText(`${tableRowJa} > ${tableCell3}`),
    ).toContain('3');

    // Sort by name.
    await dynamicTableTest.click(tableHeadName);

    // Check for visibility & content after sorting.
    expect(await dynamicTableTest.isVisible(tableRowA)).toBe(true);
    expect(
      await dynamicTableTest.getText(`${tableRowA} > ${tableCell0}`),
    ).toContain('Abraham Lincoln');
    expect(
      await dynamicTableTest.getText(`${tableRowA} > ${tableCell1}`),
    ).toContain('Republican');
    expect(
      await dynamicTableTest.getText(`${tableRowA} > ${tableCell2}`),
    ).toContain('1861-1865');
    expect(
      await dynamicTableTest.getText(`${tableRowA} > ${tableCell3}`),
    ).toContain('5');
  },
);
