import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { fullpage } from '../_helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../__helpers/testing-example-helpers';

import tableWithTextAndEmptyRow from './__fixtures__/table-with-text-and-empty-row';
import {
  multiCellTableSelectionTopLeftToBottomRight,
  multiCellTableSelectionBottomRightToFirstCell,
  multiCellTableSelectionBottomRightToMiddleTopCell,
} from '../../__helpers/page-objects/_table';
import isEqual from 'lodash/isEqual';

BrowserTestCase(
  'multi cell table selection should correctly highlight entire table selection',
  {},
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
  {},
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
  {},
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
