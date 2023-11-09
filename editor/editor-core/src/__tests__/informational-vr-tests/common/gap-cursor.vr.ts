import { snapshotInformational } from '@af/visual-regression';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { Page, Locator } from '@playwright/test';
import {
  EditorDividerModel,
  EditorGapCursorModel,
  EditorNodeContainerModel,
  EditorPageModel,
} from '@af/editor-libra/page-models';

import { CONTENT_AREA_TEST_ID } from '../../../ui/Appearance/FullPage/FullPageContentArea';

import {
  EditorGapCursorDefault,
  EditorGapCursorLayout,
} from './gap-cursor.fixtures';

snapshotInformational(EditorGapCursorDefault, {
  description: 'Right side gap cursor for code block',
  selector: {
    byTestId: CONTENT_AREA_TEST_ID,
  },
  prepare: async (page: Page, component: Locator) => {
    const editor = await EditorPageModel.from({ page });
    const nodes = EditorNodeContainerModel.from(editor);
    await nodes.codeBlock.click();
    editor.keyboard.press('ArrowRight');
    editor.keyboard.press('ArrowRight');
    const gapCursor = EditorGapCursorModel.from(editor);
    await gapCursor.waitForStable();
  },
});

snapshotInformational(EditorGapCursorDefault, {
  description: 'Left side gap cursor for panel',
  selector: {
    byTestId: CONTENT_AREA_TEST_ID,
  },
  prepare: async (page: Page, component: Locator) => {
    const editor = await EditorPageModel.from({ page });
    const nodes = EditorNodeContainerModel.from(editor);
    await nodes.panel.click();
    editor.keyboard.press('ArrowLeft');
    editor.keyboard.press('ArrowLeft');
    const gapCursor = EditorGapCursorModel.from(editor);
    await gapCursor.waitForStable();
  },
});

snapshotInformational(EditorGapCursorDefault, {
  description: 'Gapcursor on table on ArrowUp',
  selector: {
    byTestId: CONTENT_AREA_TEST_ID,
  },
  prepare: async (page: Page, component: Locator) => {
    const editor = await EditorPageModel.from({ page });
    const nodes = EditorNodeContainerModel.from(editor);
    await nodes.panel.click();
    editor.keyboard.press('ArrowLeft');
    editor.keyboard.press('ArrowLeft');
    editor.keyboard.press('ArrowUp');
    const gapCursor = EditorGapCursorModel.from(editor);
    await gapCursor.waitForStable();
  },
});

snapshotInformational(EditorGapCursorDefault, {
  description: 'Table gap cursor on ArrowDown',
  selector: {
    byTestId: CONTENT_AREA_TEST_ID,
  },
  prepare: async (page: Page, component: Locator) => {
    const editor = await EditorPageModel.from({ page });
    const nodes = EditorNodeContainerModel.from(editor);
    await nodes.codeBlock.click();
    editor.keyboard.press('ArrowRight');
    editor.keyboard.press('ArrowRight');
    editor.keyboard.press('ArrowDown');
    const gapCursor = EditorGapCursorModel.from(editor);
    await gapCursor.waitForStable();
  },
});

snapshotInformational(EditorGapCursorLayout, {
  description: 'Layout: gap cursor on action inside a layout on ArrowRight',
  selector: {
    byTestId: CONTENT_AREA_TEST_ID,
  },
  prepare: async (page: Page, component: Locator) => {
    const editor = await EditorPageModel.from({ page });
    const nodes = EditorNodeContainerModel.from(editor);
    await nodes.status.click();
    editor.keyboard.press('ArrowRight');
    editor.keyboard.press('ArrowRight');
    const gapCursor = EditorGapCursorModel.from(editor);
    await gapCursor.waitForStable();
  },
});

snapshotInformational(EditorGapCursorLayout, {
  description: 'Gap cursor before divider',
  selector: {
    byTestId: CONTENT_AREA_TEST_ID,
  },
  prepare: async (page: Page, component: Locator) => {
    const editor = await EditorPageModel.from({ page });
    const nodes = EditorNodeContainerModel.from(editor);
    const p = component.locator('.ProseMirror p:first-of-type');
    await p.click();
    const divider = EditorDividerModel.from(nodes.divider.nth(0));
    await divider.select();
    editor.keyboard.press('ArrowLeft');
    const gapCursor = EditorGapCursorModel.from(editor);
    await gapCursor.waitForStable();
  },
});

snapshotInformational(EditorGapCursorLayout, {
  description: 'Gap cursor after divider',
  selector: {
    byTestId: CONTENT_AREA_TEST_ID,
  },
  prepare: async (page: Page, component: Locator) => {
    const editor = await EditorPageModel.from({ page });
    const nodes = EditorNodeContainerModel.from(editor);
    const p = component.locator('.ProseMirror p:first-of-type');
    await p.click();
    const divider = EditorDividerModel.from(nodes.divider.nth(0));
    await divider.select();
    editor.keyboard.press('ArrowRight');
    const gapCursor = EditorGapCursorModel.from(editor);
    await gapCursor.waitForStable();
  },
});

snapshotInformational(EditorGapCursorLayout, {
  description: 'Gap cursor before last divider',
  selector: {
    byTestId: CONTENT_AREA_TEST_ID,
  },
  prepare: async (page: Page, component: Locator) => {
    const editor = await EditorPageModel.from({ page });
    const nodes = EditorNodeContainerModel.from(editor);
    const p = component.locator('.ProseMirror p:first-of-type');
    await p.click();
    const divider = EditorDividerModel.from(nodes.divider.nth(1));
    await divider.select();
    editor.keyboard.press('ArrowLeft');
    const gapCursor = EditorGapCursorModel.from(editor);
    await gapCursor.waitForStable();
  },
});

// Skipped flaky test
snapshotInformational.skip(EditorGapCursorLayout, {
  description: 'Gap cursor after last divider',
  selector: {
    byTestId: CONTENT_AREA_TEST_ID,
  },
  prepare: async (page: Page, component: Locator) => {
    const editor = await EditorPageModel.from({ page });
    const nodes = EditorNodeContainerModel.from(editor);
    const p = component.locator('.ProseMirror p:first-of-type');
    await p.click();
    const divider = EditorDividerModel.from(nodes.divider.nth(1));
    await divider.select();
    editor.keyboard.press('ArrowRight');
    const gapCursor = EditorGapCursorModel.from(editor);
    await gapCursor.waitForStable();
  },
});
