import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { tableNewColumnMinWidth } from '@atlaskit/editor-common';
import { PluginKey } from 'prosemirror-state';
import {
  editable,
  getDocFromElement,
  fullpage,
  resizeColumn,
  selectColumns,
  updateEditorProps,
} from '../_helpers';

import {
  insertColumn,
  clickFirstCell,
  selectTable,
} from '../../__helpers/page-objects/_table';

import {
  tableWithRowSpan,
  tableWithRowSpanAndColSpan,
  twoColFullWidthTableWithContent,
  tableWithDynamicLayoutSizing,
  tableInsideColumns,
  resizedTableWithStackedColumns,
  tableForBulkResize,
  tableForBulkResize3Cols,
  tableForBulkResizeWithNumberCol,
} from './__fixtures__/resize-documents';
import { tableWithMinWidthColumnsDocument } from './__fixtures__/table-with-min-width-columns-document';
import { pluginKey as tableResizingPluginKey } from '../../../plugins/table/pm-plugins/table-resizing';

import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../__helpers/testing-example-helpers';

BrowserTestCase(
  'Can resize normally with a rowspan in the non last column.',
  { skip: ['edge'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(tableWithRowSpan),
      allowTables: {
        advanced: true,
      },
    });

    await resizeColumn(page, { cellHandlePos: 2, resizeWidth: 50 });

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'Can resize normally with a rowspan and colspan',
  { skip: ['edge'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(tableWithRowSpanAndColSpan),
      allowTables: {
        advanced: true,
      },
    });

    await resizeColumn(page, { cellHandlePos: 22, resizeWidth: -50 });

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'Can resize normally on a full width table with content',
  { skip: ['edge', 'firefox', 'safari'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(twoColFullWidthTableWithContent),
      allowTables: {
        advanced: true,
      },
    });

    await resizeColumn(page, { cellHandlePos: 2, resizeWidth: -100 });

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  `Created column should be set to ${tableNewColumnMinWidth}px`,
  { skip: ['edge', 'safari'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(tableWithMinWidthColumnsDocument),
      allowTables: {
        advanced: true,
      },
    });

    await insertColumn(page, 0, 'right');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  "Can't resize the last column of a table with dynamic sizing enabled.",
  { skip: ['edge'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(tableWithDynamicLayoutSizing),
      allowTables: {
        advanced: true,
      },
      allowDynamicTextSizing: true,
    });

    await resizeColumn(page, { cellHandlePos: 10, resizeWidth: -100 });

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'Can resize the last column when table is nested in Columns',
  { skip: ['edge', 'firefox', 'safari'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(tableInsideColumns),
      allowTables: {
        advanced: true,
      },
      allowLayouts: true,
    });

    await resizeColumn(page, { cellHandlePos: 10, resizeWidth: -100 });

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'Should stack columns to the left when widths of some of the columns equal minWidth',
  { skip: ['edge'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(resizedTableWithStackedColumns),
      allowTables: {
        advanced: true,
      },
    });

    await resizeColumn(page, { cellHandlePos: 14, resizeWidth: -200 });

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

[
  {
    test: 'Should stack columns to the right and go to overflow',
    featureFlags: {},
  },
  {
    test:
      'Should stack columns to the right and go to overflow with overflowShadowsOptimisation',
    featureFlags: {
      tableOverflowShadowsOptimization: true,
    },
  },
].forEach(({ test, featureFlags }) => {
  BrowserTestCase(
    test,
    { skip: ['edge'] },
    async (client: any, testName: string) => {
      const page = await goToEditorTestingWDExample(client);

      await mountEditor(page, {
        appearance: fullpage.appearance,
        defaultValue: JSON.stringify(resizedTableWithStackedColumns),
        allowTables: {
          advanced: true,
        },
        featureFlags,
      });

      await resizeColumn(page, { cellHandlePos: 2, resizeWidth: 420 });

      const doc = await page.$eval(editable, getDocFromElement);
      expect(doc).toMatchCustomDocSnapshot(testName);
    },
  );
});

BrowserTestCase(
  'Should bulk resize 3 columns in 4 columns table',
  { skip: ['edge', 'firefox', 'safari'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(tableForBulkResize3Cols),
      allowTables: {
        advanced: true,
      },
    });

    await clickFirstCell(page);
    await selectTable(page);
    await resizeColumn(page, { cellHandlePos: 6, resizeWidth: -20 });

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'Should recover from overflow when number col is selected',
  { skip: ['edge', 'firefox', 'safari'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(tableForBulkResizeWithNumberCol),
      allowTables: {
        advanced: true,
      },
    });

    await clickFirstCell(page);
    await selectTable(page);
    await resizeColumn(page, { cellHandlePos: 2, resizeWidth: -20 });

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'Should bulk resize selected columns',
  { skip: ['edge', 'firefox', 'safari'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(tableForBulkResize),
      allowTables: {
        advanced: true,
      },
    });

    await clickFirstCell(page);
    await selectColumns(page, [0, 1]);
    await resizeColumn(page, { cellHandlePos: 2, resizeWidth: 52 });

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'Can resize normally while editor changes its appearance',
  { skip: ['edge', 'firefox', 'safari'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(tableForBulkResize),
      allowTables: {
        advanced: true,
      },
    });

    const resizeHandlePos = 2;

    // We grab the resize handle and then change editor appearance to full-widths
    // in which case we expect the editor not to throw
    await (page as any).browser.execute(
      (handlePos: number, pluginKey: PluginKey) => {
        const view = (window as any).__editorView;
        if (!view) {
          return;
        }
        view.dispatch(
          view.state.tr.setMeta(pluginKey, {
            type: 'SET_RESIZE_HANDLE_POSITION',
            data: {
              resizeHandlePos: handlePos,
            },
          }),
        );
        view.dom.dispatchEvent(
          new MouseEvent('mousedown', { clientX: handlePos }),
        );
      },
      resizeHandlePos,
      tableResizingPluginKey,
    );

    // doesn't reject the promise (throw)
    expect(updateEditorProps(page, { appearance: 'full-width' })).resolves
      .toBeUndefined;
  },
);
