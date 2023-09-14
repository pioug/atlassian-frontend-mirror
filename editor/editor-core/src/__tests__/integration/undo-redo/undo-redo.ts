import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  fullpage,
  editable,
} from '@atlaskit/editor-test-helpers/integration/helpers';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { KEY } from '@atlaskit/editor-test-helpers/page-objects/keyboard';
import { toolbarTestIdPrefix } from '../../../ui/Toolbar/toolbar-types';

const input = 'helloworld ';
const undoButtonTestID = `[data-testid="${toolbarTestIdPrefix}-undo"]`;
const redoButtonTestID = `[data-testid="${toolbarTestIdPrefix}-redo"]`;

async function undoShortcut(page: any, modifierKey: string) {
  await page.browser.keys([modifierKey, 'z']);
  await page.browser.keys([modifierKey]); // release modifier key
}

async function redoShortcut(
  page: any,
  modifierKeys: string[],
  redoKey: string,
) {
  await page.browser.keys([...modifierKeys, redoKey]);
  await page.browser.keys(modifierKeys); // release modifier key
}

BrowserTestCase(
  `undo-redo.ts: should be able to undo & redo via toolbar buttons in the full page editor`,
  {},
  async (client: any) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowUndoRedoButtons: true,
    });

    await page.click(editable);
    await page.type(editable, input);
    expect(await page.getText('p')).toBe(input);
    await page.waitForSelector(undoButtonTestID);
    await page.click(undoButtonTestID);
    expect(await page.getText('p')).not.toBe(input);
    await page.waitForSelector(redoButtonTestID);
    await page.click(redoButtonTestID);
    expect(await page.getText('p')).toBe(input);
  },
);

BrowserTestCase(
  `undo-redo.ts: should be able to undo & redo via keyboard shortcut (Windows)`,
  { skip: ['safari'] },
  async (client: any) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowUndoRedoButtons: true,
    });

    await page.click(editable);
    await page.type(editable, input);
    expect(await page.getText('p')).toBe(input);
    // undo via keyboard
    await undoShortcut(page, KEY.CONTROL);
    expect(await page.getText('p')).not.toBe(input);
    // redo via keyboard
    await redoShortcut(page, [KEY.CONTROL], 'y');
    expect(await page.getText('p')).toBe(input);
  },
);

BrowserTestCase(
  `undo-redo.ts: should be able to undo & redo via keyboard shortcut (Mac)`,
  { skip: ['chrome', 'firefox'] },
  async (client: any) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowUndoRedoButtons: true,
    });

    await page.click(editable);
    await page.type(editable, input);
    expect(await page.getText('p')).toBe(input);

    // undo via keyboard
    await undoShortcut(page, KEY.META);
    expect(await page.getText('p')).not.toBe(input);
    // redo via keyboard
    await redoShortcut(page, [KEY.META, KEY.SHIFT], 'z');
    expect(await page.getText('p')).toBe(input);
  },
);
