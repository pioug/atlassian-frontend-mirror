import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { fullpage } from '@atlaskit/editor-test-helpers/integration/helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';

import tableWithTextAndEmptyRow from './__fixtures__/table-with-text-and-empty-row';
import {
  multiCellTableSelectionTopLeftToBottomRight,
  multiCellTableSelectionBottomRightToFirstCell,
  multiCellTableSelectionBottomRightToMiddleTopCell,
} from '@atlaskit/editor-test-helpers/page-objects/table';
import isEqual from 'lodash/isEqual';

BrowserTestCase(
  'multi cell table selection should correctly highlight entire table selection',
  { skip: ['chrome'] }, // https://product-fabric.atlassian.net/browse/DTR-330
  async (client: any) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowTables: {
        advanced: true,
      },
      defaultValue: tableWithTextAndEmptyRow,
    });

    await multiCellTableSelectionTopLeftToBottomRight(page);

    const selection = await page.execute(() => {
      const view = (window as any).__editorView;
      return view.state.selection;
    });

    const isMatch = isEqual(selection, { type: 'cell', anchor: 2, head: 97 });
    expect(isMatch).toBe(true);
  },
);

BrowserTestCase(
  'multi cell table selection should correctly highlight table selection from the second row',
  { skip: ['chrome'] }, // https://product-fabric.atlassian.net/browse/DTR-330
  async (client: any) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowTables: {
        advanced: true,
      },
      defaultValue: tableWithTextAndEmptyRow,
    });

    await multiCellTableSelectionBottomRightToFirstCell(page);

    const selection = await page.execute(() => {
      const view = (window as any).__editorView;
      return view.state.selection;
    });

    const isMatch = isEqual(selection, { anchor: 97, head: 31, type: 'cell' });
    expect(isMatch).toBe(true);
  },
);

BrowserTestCase(
  'multi cell table selection should correctly highlight table selection from the second column',
  { skip: ['chrome'] }, // https://product-fabric.atlassian.net/browse/DTR-330
  async (client: any) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowTables: {
        advanced: true,
      },
      defaultValue: tableWithTextAndEmptyRow,
    });

    await multiCellTableSelectionBottomRightToMiddleTopCell(page);

    const selection = await page.execute(() => {
      const view = (window as any).__editorView;
      return view.state.selection;
    });

    const isMatch = isEqual(selection, { anchor: 97, head: 11, type: 'cell' });
    expect(isMatch).toBe(true);
  },
);
