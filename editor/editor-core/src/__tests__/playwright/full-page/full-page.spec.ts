import {
  EditorDateInputModel,
  EditorDateModel,
  EditorFloatingToolbarModel,
  EditorNodeContainerModel,
  EditorPopupModel,
  EditorTableModel,
  expect,
  editorTestCase as test,
} from '@af/editor-libra';

import { tableAdf, twoDatesAdf } from './full-page.spec.ts-fixtures/adf';

test.describe('calendar', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowDate: true,
    },
  });

  test('user should be able to open calendar', async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);

    await editor.typeAhead.searchAndInsert('date');
    await expect(nodes.date.first()).toBeVisible();
  });

  test('clicking date when calendar is open should close it', async ({
    editor,
  }) => {
    const popupModel = EditorPopupModel.from(editor);
    const nodes = EditorNodeContainerModel.from(editor);
    const inputModel = EditorDateInputModel.from(popupModel);

    await editor.typeAhead.searchAndInsert('date');
    await expect(inputModel.input).toBeVisible();
    await nodes.date.first().click();
    await expect(inputModel.input).toBeHidden();
  });
});

test.describe('calendar duo', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowDate: true,
    },
    adf: twoDatesAdf,
  });

  test('clicking another date should open its date picker', async ({
    editor,
  }) => {
    const popupModel = EditorPopupModel.from(editor);
    const nodes = EditorNodeContainerModel.from(editor);
    const dateModel = EditorDateModel.from(nodes.date.first());
    const dateModel2 = EditorDateModel.from(nodes.date.last());

    const calendarModel = await dateModel.openCalendar(popupModel);
    await expect(calendarModel.input).toHaveValue('12/5/2023');

    const calendarModel2 = await dateModel2.openCalendar(popupModel);
    await expect(calendarModel2.input).toHaveValue('12/6/2023');
  });
});

test.describe('table', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowTables: true,
    },
    adf: tableAdf,
  });
  test('table floating toolbar should be visible after scrolling', async ({
    editor,
  }) => {
    await editor.page.setViewportSize({ width: 800, height: 400 });

    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      tableModel,
    );
    const cell = await tableModel.cell(0);
    await cell.click();

    await expect(floatingToolbarModel.toolbar).toBeVisible();
    for (let i = 0; i < 10; i++) {
      await editor.keyboard.press('Enter');
    }
    await expect(floatingToolbarModel.toolbar).toBeVisible();

    for (let i = 0; i < 10; i++) {
      await editor.keyboard.press('ArrowUp');
    }
    await expect(floatingToolbarModel.toolbar).toBeVisible();
  });
});
