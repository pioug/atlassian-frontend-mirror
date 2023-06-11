import WebdriverPage from '@atlaskit/webdriver-runner/wd-wrapper';
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  fullpage,
  tableSelectors,
  toggleBreakout,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import stickyTable from './__fixtures__/large-table-with-sticky-header';

const scrollTo = async (page: WebdriverPage, height: number) => {
  const editorScrollParentSelector = '.fabric-editor-popup-scroll-parent';
  await page.execute(
    (editorScrollParentSelector: string, height: number) => {
      const editor = document.querySelector(editorScrollParentSelector);
      editor && editor.scroll(0, height);
    },
    editorScrollParentSelector,
    height,
  );
};

// const resizeScrollParent = async (page: WebdriverPage) => {
//   const editorScrollParentSelector = '.ak-editor-fp-content-area';
//   await page.execute((editorScrollParentSelector: string) => {
//     const editor = document.querySelector(editorScrollParentSelector);
//     console.log('editort', editor);
//     editor && editor.setAttribute('width', '1000px');
//   }, editorScrollParentSelector);
// };

const insertColumn = async (page: any, cell: 'first' | 'last') => {
  const columnControl = tableSelectors.nthColumnControl(1);
  const insertButton = tableSelectors.insertButton;
  const firstCell = tableSelectors.topLeftCell;
  const firstCellLastRow = `table > tbody > tr:nth-child(48) > td:nth-child(1)`;

  if (cell === 'first') {
    await page.click(firstCell);
  } else if (cell === 'last') {
    await page.click(firstCellLastRow);
  }

  const columnDecorationSelector = columnControl;
  await page.hover(columnDecorationSelector);

  await page.waitForSelector(insertButton);
  await page.click(insertButton);
};

BrowserTestCase(
  'Sticky header should correctly toggle on and off',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(
      client,
      'editor-plugin-table',
    );

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(stickyTable),
      allowTables: {
        advanced: true,
        stickyHeaders: true,
      },
    });

    await page.waitForSelector('table');

    expect(
      await page.waitForSelector(tableSelectors.stickyTable, {}, true),
    ).toBeTruthy();
    expect(
      await page.waitForSelector(tableSelectors.stickyTr, {}, true),
    ).toBeTruthy();

    await scrollTo(page, window.innerHeight * 100);

    expect(await page.waitForSelector(tableSelectors.stickyTable)).toBeTruthy();
    expect(await page.waitForSelector(tableSelectors.stickyTr)).toBeTruthy();

    await scrollTo(page, 0);

    expect(
      await page.waitForSelector(tableSelectors.stickyTable, {}, true),
    ).toBeTruthy();
    expect(
      await page.waitForSelector(tableSelectors.stickyTr, {}, true),
    ).toBeTruthy();
  },
);

BrowserTestCase(
  'Sticky header should still correctly toggle on and off, after a column has been added',
  { skip: ['safari'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(
      client,
      'editor-plugin-table',
    );

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(stickyTable),
      allowTables: {
        advanced: true,
        stickyHeaders: true,
      },
    });

    await page.waitForSelector('table');

    expect(
      await page.waitForSelector(tableSelectors.stickyTable, {}, true),
    ).toBeTruthy();
    expect(
      await page.waitForSelector(tableSelectors.stickyTr, {}, true),
    ).toBeTruthy();

    await insertColumn(page, 'first');

    await scrollTo(page, window.innerHeight * 100);

    expect(await page.waitForSelector(tableSelectors.stickyTable)).toBeTruthy();
    expect(await page.waitForSelector(tableSelectors.stickyTr)).toBeTruthy();
  },
);

// FIXME: This test was automatically skipped due to failure on 28/05/2023: https://product-fabric.atlassian.net/browse/ED-18110
BrowserTestCase(
  'Sticky header should correctly toggle on and off, after table is scrolled to the bottom and a column has been added',
  {
    // skip: ['safari']
    skip: ['*'],
  },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(
      client,
      'editor-plugin-table',
    );

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(stickyTable),
      allowTables: {
        advanced: true,
        stickyHeaders: true,
      },
    });

    await page.waitForSelector('table');

    await scrollTo(page, window.innerHeight * 100);

    await insertColumn(page, 'last');

    expect(
      await page.waitForSelector(tableSelectors.stickyTable, {}, true),
    ).toBeTruthy();
    expect(
      await page.waitForSelector(tableSelectors.stickyTr, {}, true),
    ).toBeTruthy();

    // ED-16817 This checks for a bug where the table row would become not sticky
    // but the numbered column header would stay sticky
    const numberedCol = await page.$(tableSelectors.numberedColumnTopLeftCell);
    const numberedColStyle = await numberedCol.getAttribute('style');
    expect(!numberedColStyle.includes('top')).toBeTruthy();
  },
);

// FIXME: This test was automatically skipped due to failure on 10/06/2023: https://product-fabric.atlassian.net/browse/ED-18761
BrowserTestCase(
  'Sticky header should resize when the width of parent scroll container changes',
  {
    skip: ['*'],
  },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(
      client,
      'editor-plugin-table',
    );

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(stickyTable),
      allowTables: {
        advanced: true,
        stickyHeaders: true,
      },
      featureFlags: {
        stickyHeadersOptimization: true,
      },
    });

    await page.waitForSelector('table');

    await toggleBreakout(page, 2);

    await scrollTo(page, window.innerHeight * 100);

    await page.execute(() => {
      const editorScrollParentSelector = '.fabric-editor-popup-scroll-parent';
      const editor = document.querySelector(
        editorScrollParentSelector,
      ) as HTMLElement;
      if (editor) {
        editor.style.flexGrow = '0';
        editor.style.width = '750px';
      }
    });

    const table = await page.$(tableSelectors.stickyTable);
    const tableWidth = await table.getSize();
    const stickyHeader = await page.$(tableSelectors.stickyTr);
    const stickyHeaderWidth = await stickyHeader.getSize();

    expect(tableWidth.width).toEqual(stickyHeaderWidth.width);
  },
);
