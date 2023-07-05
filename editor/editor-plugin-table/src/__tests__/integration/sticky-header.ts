import WebdriverPage from '@atlaskit/webdriver-runner/wd-wrapper';
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  fullpage,
  tableSelectors,
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
