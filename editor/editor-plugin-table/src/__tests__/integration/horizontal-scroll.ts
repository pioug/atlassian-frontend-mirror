import WebdriverPage from '@atlaskit/webdriver-runner/wd-wrapper';
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  fullpage,
  resizeColumn,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import {
  insertColumn,
  insertTable,
} from '@atlaskit/editor-test-helpers/page-objects/table';
import basicTableAdf from './__fixtures__/basic-table';
import nestedInExpand from './__fixtures__/nested-in-expand';
import { nestedInExtension } from './__fixtures__/nested-in-extension';
import { table as tableInsideLayout } from './__fixtures__/table-inside-layout';
import { emptyLayout } from './__fixtures__/empty-layout';

// TODO - Add wider screen size here once editor-common fix is made ED-16647
const screenWidths = [1920];

const breakout = async (
  page: WebdriverPage,
  breakoutButton: WebdriverIO.Element,
) => {
  let tableContainer = await page.$('.pm-table-container');

  const currentWidth = await tableContainer.getCSSProperty('width');
  breakoutButton.click();

  await page.waitUntil(async () => {
    tableContainer = await page.$('.pm-table-container');
    const updatedWidth = await tableContainer.getCSSProperty('width');
    return updatedWidth.value !== currentWidth.value;
  });
};

const assertTableDoesNotScroll = async (page: WebdriverPage) => {
  const table = await page.$('.pm-table-wrapper');

  const tableScrollWidth = await table.getProperty('scrollWidth');
  const tableOffsetWidth = await table.getProperty('offsetWidth');

  expect(tableScrollWidth).toEqual(tableOffsetWidth);
};

const assertTableDoesScroll = async (page: WebdriverPage) => {
  const table = await page.$('.pm-table-wrapper');

  const tableScrollWidth = await table.getProperty('scrollWidth');
  const tableOffsetWidth = (await table.getProperty('offsetWidth')) as number;

  expect(tableScrollWidth).toBeGreaterThan(tableOffsetWidth);
};

BrowserTestCase(
  'Table: Does not scroll when column is resized and a new column is inserted',
  { skip: [] },
  async (client: any, testName: string) => {
    for (const screenWidth of screenWidths) {
      const page = await goToEditorTestingWDExample(
        client,
        'editor-plugin-table',
        { width: screenWidth, height: 1440 },
      );

      await mountEditor(page, {
        appearance: fullpage.appearance,
        defaultValue: basicTableAdf,
        allowTables: {
          advanced: true,
          allowDistributeColumns: true,
        },
        allowLayouts: true,
      });

      await resizeColumn(page, { cellHandlePos: 2, resizeWidth: -100 });
      await insertColumn(page, 0, 'right');
      await assertTableDoesNotScroll(page);
    }
  },
);

BrowserTestCase(
  'Table: Does not scroll when column is resized and breakout button is clicked 3x',
  { skip: ['safari'] },
  async (client: any, testName: string) => {
    for (const screenWidth of screenWidths) {
      const page = await goToEditorTestingWDExample(
        client,
        'editor-plugin-table',
        { width: screenWidth, height: 1440 },
      );

      await mountEditor(page, {
        appearance: fullpage.appearance,
        defaultValue: basicTableAdf,
        allowTables: {
          advanced: true,
          allowDistributeColumns: true,
        },
        allowLayouts: true,
        allowBreakout: true,
      });

      await resizeColumn(page, { cellHandlePos: 2, resizeWidth: -100 });
      await insertColumn(page, 0, 'right');

      const breakoutButton = await page.$('[aria-label="Go wide"]');

      await breakout(page, breakoutButton);
      await assertTableDoesNotScroll(page);

      await breakout(page, breakoutButton);
      await assertTableDoesNotScroll(page);

      await breakout(page, breakoutButton);
      await assertTableDoesNotScroll(page);
    }
  },
);

BrowserTestCase(
  'Table: Does not scroll when nested in expand, column is resized and breakout button is clicked',
  { skip: [] },
  async (client: any, testName: string) => {
    for (const screenWidth of screenWidths) {
      const page = await goToEditorTestingWDExample(
        client,
        'editor-plugin-table',
        { width: screenWidth, height: 1440 },
      );

      await mountEditor(page, {
        appearance: fullpage.appearance,
        defaultValue: nestedInExpand,
        allowTables: {
          advanced: true,
          allowDistributeColumns: true,
        },
        allowExpand: true,
        allowLayouts: true,
        allowBreakout: true,
      });

      const breakoutButton = await page.$('[aria-label="Go wide"]');

      await resizeColumn(page, { cellHandlePos: 3, resizeWidth: -100 });
      await breakout(page, breakoutButton);
      await assertTableDoesNotScroll(page);
    }
  },
);

BrowserTestCase(
  'Table: Last column can be resized to remove scroll',
  { skip: [] },
  async (client: any, testName: string) => {
    for (const screenWidth of screenWidths) {
      const page = await goToEditorTestingWDExample(
        client,
        'editor-plugin-table',
        { width: screenWidth, height: 1440 },
      );

      await mountEditor(page, {
        appearance: fullpage.appearance,
        defaultValue: basicTableAdf,
        allowTables: {
          advanced: true,
          allowDistributeColumns: true,
        },
        allowExpand: true,
        allowLayouts: true,
        allowBreakout: true,
      });

      await resizeColumn(page, { cellHandlePos: 2, resizeWidth: 1000 });
      await assertTableDoesScroll(page);
      await resizeColumn(page, { cellHandlePos: 10, resizeWidth: -1000 });
      await assertTableDoesNotScroll(page);
    }
  },
);

BrowserTestCase(
  'Table: When nested in expand, last column can be resized to remove scroll',
  { skip: [] },
  async (client: any, testName: string) => {
    for (const screenWidth of screenWidths) {
      const page = await goToEditorTestingWDExample(
        client,
        'editor-plugin-table',
        { width: screenWidth, height: 1440 },
      );

      await mountEditor(page, {
        appearance: fullpage.appearance,
        defaultValue: nestedInExpand,
        allowTables: {
          advanced: true,
          allowDistributeColumns: true,
        },
        allowExpand: true,
        allowLayouts: true,
        allowBreakout: true,
      });

      await resizeColumn(page, { cellHandlePos: 3, resizeWidth: 1000 });
      await assertTableDoesScroll(page);
      await resizeColumn(page, { cellHandlePos: 11, resizeWidth: -1000 });
      await assertTableDoesNotScroll(page);
    }
  },
);

BrowserTestCase(
  'Table: When nested in layout, last column can be resized to remove scroll',
  { skip: [] },
  async (client: any, testName: string) => {
    for (const screenWidth of screenWidths) {
      const page = await goToEditorTestingWDExample(
        client,
        'editor-plugin-table',
        { width: screenWidth, height: 1440 },
      );

      await mountEditor(page, {
        appearance: fullpage.appearance,
        defaultValue: tableInsideLayout,
        allowTables: {
          advanced: true,
          allowDistributeColumns: true,
        },
        allowExpand: true,
        allowLayouts: true,
        allowBreakout: true,
      });

      await resizeColumn(page, { cellHandlePos: 8, resizeWidth: 1000 });
      await assertTableDoesScroll(page);
      await resizeColumn(page, { cellHandlePos: 16, resizeWidth: -1000 });
      await assertTableDoesNotScroll(page);
    }
  },
);

BrowserTestCase(
  'Table: When nested in bodied macro, last column can be resized to remove scroll',
  { skip: [] },
  async (client: any, testName: string) => {
    for (const screenWidth of screenWidths) {
      const page = await goToEditorTestingWDExample(
        client,
        'editor-plugin-table',
        { width: screenWidth, height: 1440 },
      );

      await mountEditor(page, {
        appearance: fullpage.appearance,
        defaultValue: nestedInExtension,
        allowTables: {
          advanced: true,
          allowDistributeColumns: true,
        },
        allowExpand: true,
        allowLayouts: true,
        allowBreakout: true,
        allowExtension: true,
      });

      await resizeColumn(page, { cellHandlePos: 3, resizeWidth: 1000 });
      await assertTableDoesScroll(page);
      await resizeColumn(page, { cellHandlePos: 11, resizeWidth: -1000 });
      await assertTableDoesNotScroll(page);
    }
  },
);

BrowserTestCase(
  'Table: Scrolls when there are more columns added than can fit the current width',
  { skip: [] },
  async (client: any, testName: string) => {
    for (const screenWidth of screenWidths) {
      const page = await goToEditorTestingWDExample(
        client,
        'editor-plugin-table',
        { width: screenWidth, height: 1440 },
      );

      await mountEditor(page, {
        appearance: fullpage.appearance,
        defaultValue: basicTableAdf,
        allowTables: {
          advanced: true,
          allowDistributeColumns: true,
        },
        allowExpand: true,
        allowLayouts: true,
        allowBreakout: true,
      });

      const numberOfColumns = 14;
      for (const _column of [...Array(numberOfColumns).keys()]) {
        await insertColumn(page, 0, 'right');
      }

      await assertTableDoesScroll(page);
    }
  },
);

BrowserTestCase(
  'Table: Does not scroll when nested in Bodied Macro, column is resized and breakout button is clicked',
  { skip: [] },
  async (client: any, testName: string) => {
    for (const screenWidth of screenWidths) {
      const page = await goToEditorTestingWDExample(
        client,
        'editor-plugin-table',
        { width: screenWidth, height: 1440 },
      );

      await mountEditor(page, {
        appearance: fullpage.appearance,
        defaultValue: JSON.stringify(nestedInExtension),
        allowTables: {
          advanced: true,
        },
        allowExtension: true,
      });

      await resizeColumn(page, { cellHandlePos: 3, resizeWidth: -100 });
      await insertColumn(page, 0, 'right');
      await assertTableDoesNotScroll(page);
    }
  },
);

BrowserTestCase(
  'Table: Does not scroll when nested in layout, column is resized and breakout button is clicked',
  { skip: [] },
  async (client: any, testName: string) => {
    for (const screenWidth of screenWidths) {
      const page = await goToEditorTestingWDExample(
        client,
        'editor-plugin-table',
        { width: screenWidth, height: 1440 },
      );

      await mountEditor(page, {
        appearance: fullpage.appearance,
        defaultValue: JSON.stringify(tableInsideLayout),
        allowTables: {
          advanced: true,
        },
        allowLayouts: {
          allowBreakout: true,
        },
        allowBreakout: true,
      });

      const breakoutButton = await page.$('[aria-label="Go wide"]');

      await resizeColumn(page, { cellHandlePos: 8, resizeWidth: -100 });
      await breakout(page, breakoutButton);
      await assertTableDoesNotScroll(page);
    }
  },
);

BrowserTestCase(
  'Table: Does not scroll when nested in single column layout, table column is resized and breakout button is clicked',
  { skip: [] },
  async (client: any, testName: string) => {
    for (const screenWidth of screenWidths) {
      const page = await goToEditorTestingWDExample(
        client,
        'editor-plugin-table',
        { width: screenWidth, height: 1440 },
      );

      await mountEditor(page, {
        appearance: fullpage.appearance,
        defaultValue: JSON.stringify(tableInsideLayout),
        allowTables: {
          advanced: true,
          allowDistributeColumns: true,
        },
        allowLayouts: {
          allowBreakout: true,
          UNSAFE_allowSingleColumnLayout: true,
        },
        allowBreakout: true,
      });

      await resizeColumn(page, { cellHandlePos: 8, resizeWidth: -100 });

      const singleColumnButton = await page.$('[aria-label="Single column"]');
      singleColumnButton.click();

      const breakoutButton = await page.$('[aria-label="Go wide"]');

      await breakout(page, breakoutButton);
      await assertTableDoesNotScroll(page);
    }
  },
);

BrowserTestCase(
  'Table: Does not scroll when nested in three columns layout, table column is resized and breakout button is clicked',
  { skip: [] },
  async (client: any, testName: string) => {
    for (const screenWidth of screenWidths) {
      const page = await goToEditorTestingWDExample(
        client,
        'editor-plugin-table',
        { width: screenWidth, height: 1440 },
      );

      await mountEditor(page, {
        appearance: fullpage.appearance,
        defaultValue: JSON.stringify(tableInsideLayout),
        allowTables: {
          advanced: true,
          allowDistributeColumns: true,
        },
        allowLayouts: {
          allowBreakout: true,
          UNSAFE_allowSingleColumnLayout: true,
        },
        allowBreakout: true,
      });

      await resizeColumn(page, { cellHandlePos: 8, resizeWidth: -100 });

      const threeColumnButton = await page.$('[aria-label="Three columns"]');
      threeColumnButton.click();

      const breakoutButton = await page.$('[aria-label="Go wide"]');

      await breakout(page, breakoutButton);
      await assertTableDoesNotScroll(page);
    }
  },
);

BrowserTestCase(
  'Table: Does not scroll when nested in full-width layout, columns is resized and new column is inserted',
  { skip: [] },
  async (client: any, testName: string) => {
    for (const screenWidth of screenWidths) {
      const page = await goToEditorTestingWDExample(
        client,
        'editor-plugin-table',
        { width: screenWidth, height: 1440 },
      );

      await mountEditor(page, {
        appearance: fullpage.appearance,
        defaultValue: emptyLayout,
        allowTables: {
          advanced: true,
        },
        allowLayouts: {
          allowBreakout: true,
        },
        allowBreakout: true,
      });

      const goWideButton = await page.$('[aria-label="Go wide"]');
      goWideButton.click();
      goWideButton.click();

      insertTable(page);
      await assertTableDoesNotScroll(page);
      await resizeColumn(page, { cellHandlePos: 4, resizeWidth: -100 });
      await insertColumn(page, 0, 'right');
      await assertTableDoesNotScroll(page);
    }
  },
);
