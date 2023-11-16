import {
  EditorNodeContainerModel,
  EditorPopupModel,
  EditorDateInputModel,
  editorTestCase as test,
  expect,
  fixTest,
  BROWSERS,
} from '@af/editor-libra';
import { escapeKeydownAdf, taskDateAdf } from './date.spec.ts-fixtures';

test.describe('date: libra test', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowDate: true,
    },
  });

  test('keyboard-accessibility.ts: Type in date using input', async ({
    editor,
  }) => {
    const popupModel = EditorPopupModel.from(editor);
    const nodes = EditorNodeContainerModel.from(editor);
    const inputModel = EditorDateInputModel.from(popupModel);

    await editor.typeAhead.searchAndInsert('Date');
    await expect(inputModel.input).toBeFocused();
    await editor.keyboard.press('Backspace');
    await editor.keyboard.type('2/29/2020');
    await editor.keyboard.press('Enter');
    await expect(nodes.date.first()).toHaveText(/Feb 29, 2020/);
  });
});

test.describe('date: libra test - en-GB locale', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowDate: true,
    },
    editorMountOptions: {
      i18n: {
        locale: 'en-GB',
      },
    },
  });

  test('keyboard-accessibility.ts: Type in en-GB date using input', async ({
    editor,
  }) => {
    const popupModel = EditorPopupModel.from(editor);
    const nodes = EditorNodeContainerModel.from(editor);
    const inputModel = EditorDateInputModel.from(popupModel);

    await editor.typeAhead.searchAndInsert('Date');
    await expect(inputModel.input).toBeFocused();
    await editor.keyboard.press('Backspace');
    await editor.keyboard.type('29/02/2020');
    await editor.keyboard.press('Enter');
    await expect(nodes.date.first()).toHaveText(/29 Feb 2020/);
  });

  test('keyboard-accessibility.ts: Type in (slightly) misformatted en-GB date using input', async ({
    editor,
  }) => {
    const popupModel = EditorPopupModel.from(editor);
    const nodes = EditorNodeContainerModel.from(editor);
    const inputModel = EditorDateInputModel.from(popupModel);

    await editor.typeAhead.searchAndInsert('Date');
    await expect(inputModel.input).toBeFocused();
    await editor.keyboard.press('Backspace');
    await editor.keyboard.type('29/2/2020');
    await editor.keyboard.press('Enter');

    await expect(nodes.date.first()).toHaveText(/29 Feb 2020/);
  });

  test('keyboard-accessibility.ts: Arrow up on year increments year by 1 and keeps same day/month when they exist', async ({
    editor,
  }) => {
    const popupModel = EditorPopupModel.from(editor);
    const nodes = EditorNodeContainerModel.from(editor);
    const inputModel = EditorDateInputModel.from(popupModel);

    await editor.typeAhead.searchAndInsert('Date');
    await expect(inputModel.input).toBeFocused();
    await editor.keyboard.press('Backspace');
    await editor.keyboard.type('15/7/2020');
    await editor.keyboard.press('ArrowUp');
    await editor.keyboard.press('Enter');

    await expect(nodes.date.first()).toHaveText(/15 Jul 2021/);
  });

  test("keyboard-accessibility.ts: When incrementing year by one, rolls over or back day when day doesn't exist in new year", async ({
    editor,
  }) => {
    const popupModel = EditorPopupModel.from(editor);
    const nodes = EditorNodeContainerModel.from(editor);
    const inputModel = EditorDateInputModel.from(popupModel);

    await editor.typeAhead.searchAndInsert('Date');
    await expect(inputModel.input).toBeFocused();
    await editor.keyboard.press('Backspace');
    await editor.keyboard.type('29/2/2020');
    await editor.keyboard.press('ArrowUp');
    await editor.keyboard.press('Enter');

    await expect(nodes.date.first()).toHaveText(/28 Feb 2021/);
  });

  test('keyboard-accessibility.ts: Arrow up in textfield works on existing date', async ({
    editor,
  }) => {
    fixTest({
      jiraIssueId: 'ED-20967',
      reason:
        'FIXME: This test was automatically skipped due to failure on 15/11/2023: https://product-fabric.atlassian.net/browse/ED-20967',
      browsers: [BROWSERS.webkit],
    });

    const popupModel = EditorPopupModel.from(editor);
    const nodes = EditorNodeContainerModel.from(editor);
    const inputModel = EditorDateInputModel.from(popupModel);

    await editor.typeAhead.searchAndInsert('Date');
    await editor.keyboard.type('15/7/2020');
    await editor.keyboard.press('Enter');
    await nodes.date.click();
    await inputModel.input.focus();
    await editor.keyboard.press('ArrowRight');
    await editor.keyboard.press('ArrowUp');
    await editor.keyboard.press('Enter');

    await expect(nodes.date.first()).toHaveText(/15 Jul 2021/);
  });

  test('keyboard-accessibility.ts: Ctrl/Cmd-c on existing date copies node not text', async ({
    editor,
  }) => {
    const popupModel = EditorPopupModel.from(editor);
    const nodes = EditorNodeContainerModel.from(editor);
    const inputModel = EditorDateInputModel.from(popupModel);
    await editor.typeAhead.searchAndInsert('Date');
    await expect(inputModel.input).toBeFocused();
    await editor.keyboard.type('17/2/2020');
    await editor.keyboard.press('Enter');

    await editor.selection.set({
      anchor: 1,
      head: 3,
    });

    // Hit Ctrl/Cmd-C
    await editor.copy();
    await editor.keyboard.press('ArrowRight');
    await editor.keyboard.press('ArrowRight');
    await editor.paste();

    await expect(nodes.date.nth(0)).toHaveText(/17 Feb 2020/);
    await expect(nodes.date.nth(1)).toHaveText(/17 Feb 2020/);
  });

  test('keyboard-accessibility.ts: Tab on existing date selected the input', async ({
    editor,
  }) => {
    const popupModel = EditorPopupModel.from(editor);
    const nodes = EditorNodeContainerModel.from(editor);
    const inputModel = EditorDateInputModel.from(popupModel);

    await editor.typeAhead.searchAndInsert('Date');
    await expect(inputModel.input).toBeFocused();
    await editor.keyboard.press('Backspace');
    await editor.keyboard.type('17/2/2020');
    await editor.keyboard.press('Enter');

    await nodes.date.click();

    await expect(inputModel.input).not.toBeFocused();
    await editor.keyboard.press('Tab');
    await expect(inputModel.input).toBeFocused();
  });
});

test.describe('date: libra test - hu locale', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowDate: true,
    },
    editorMountOptions: {
      i18n: {
        locale: 'hu',
      },
    },
  });
  test('keyboard-accessibility.ts: Type in hu-HU (Hungarian) date using input', async ({
    editor,
  }) => {
    const popupModel = EditorPopupModel.from(editor);
    const nodes = EditorNodeContainerModel.from(editor);
    const inputModel = EditorDateInputModel.from(popupModel);

    await editor.typeAhead.searchAndInsert('Date');
    await expect(inputModel.input).toBeFocused();
    await editor.keyboard.press('Backspace');
    await editor.keyboard.type('2020. 02. 29.');
    await editor.keyboard.press('Enter');

    await expect(nodes.date.first()).toHaveText(/2020. febr. 29./);
  });

  test('keyboard-accessibility.ts: Type in a (slightly) misformatted hu (Hungarian) date using input', async ({
    editor,
  }) => {
    const popupModel = EditorPopupModel.from(editor);
    const nodes = EditorNodeContainerModel.from(editor);
    const inputModel = EditorDateInputModel.from(popupModel);

    await editor.typeAhead.searchAndInsert('Date');
    await expect(inputModel.input).toBeFocused();
    await editor.keyboard.press('Backspace');
    await editor.keyboard.type('2020.2.29');
    await editor.keyboard.press('Enter');

    await expect(nodes.date.first()).toHaveText(/2020. febr. 29./);
  });
});

test.describe('date: libra test', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowDate: true,
    },
  });
  test(`keyboard-accessibility.ts: Backspace after opening existing date should delete it`, async ({
    editor,
  }) => {
    const popupModel = EditorPopupModel.from(editor);
    const nodes = EditorNodeContainerModel.from(editor);
    const inputModel = EditorDateInputModel.from(popupModel);

    await editor.typeAhead.searchAndInsert('Date');
    await expect(inputModel.input).toBeFocused();
    await editor.keyboard.press('Enter');
    await nodes.date.click();
    await editor.keyboard.press('Backspace');

    await expect(nodes.date).toBeHidden();
  });

  test('quick-insert.ts: Insert date via quick insert', async ({ editor }) => {
    fixTest({
      jiraIssueId: 'ED-20526',
      reason: 'FIXME: mockDate facility require',
    });

    //     const JAN_1ST_2019_AEST_TIMEZONE = {
    //       year: 2019,
    //       monthIndex: 0,
    //       day: 1,
    //       hour: 0,
    //       minute: 0,
    //       tz: 11,
    //     };
    //     await page.mockDate(JAN_1ST_2019_AEST_TIMEZONE);
    //     // 1st Jan 2019 00:00 AEST / 31st Dec 2018 13:00 UTC
    //
    //     await mountEditor(page, {
    //       appearance: 'full-page',
    //       allowDate: true,
    //     });
    //
    //     await page.click(editable);
    //
    //     await quickInsert(page, 'Date');
    //
    //     const doc = await page.$eval(editable, getDocFromElement);
    //     expect(doc).toMatchCustomDocSnapshot(testName);
    //     await page.teardownMockDate();
    //   }
    /********/
  });

  test("quick-insert.ts: Uses today's date in user's local timezone as initial selection", async ({
    editor,
  }) => {
    fixTest({
      jiraIssueId: 'ED-20526',
      reason: 'FIXME: mockDate facility require',
    });

    //     const JAN_1ST_2019_AEST_TIMEZONE = {
    //       year: 2019,
    //       monthIndex: 0,
    //       day: 1,
    //       hour: 0,
    //       minute: 0,
    //       tz: 11,
    //     };
    //     await page.mockDate(JAN_1ST_2019_AEST_TIMEZONE);
    //     // 1st Jan 2019 00:00 AEST / 31st Dec 2018 13:00 UTC
    //
    //     await mountEditor(page, {
    //       appearance: 'full-page',
    //       allowDate: true,
    //     });
    //
    //     await page.click(editable);
    //     await quickInsert(page, 'Date');
    //
    //     expect(stripZeroWidthSpaces(await page.getText(dateLozenge))).toBe(
    //       'Jan 1, 2019',
    //     );
    //     await page.teardownMockDate();
    //   }
    /********/
  });

  test('quick-insert.ts: format date to localized version', async ({
    editor,
  }) => {
    fixTest({
      jiraIssueId: 'ED-20526',
      reason: 'FIXME: mockDate facility require',
    });

    //     const JAN_1ST_2019_AEST_TIMEZONE = {
    //       year: 2019,
    //       monthIndex: 0,
    //       day: 1,
    //       hour: 0,
    //       minute: 0,
    //       tz: 11,
    //     };
    //     await page.mockDate(JAN_1ST_2019_AEST_TIMEZONE);
    //     // 1st Jan 2019 00:00 AEST / 31st Dec 2018 13:00 UTC
    //
    //     await mountEditor(
    //       page,
    //       {
    //         appearance: 'full-page',
    //         allowDate: true,
    //       },
    //       { i18n: { locale: 'pt' } },
    //     );
    //
    //     await page.click(editable);
    //     await quickInsert(page, 'Date');
    //
    //     const lozengeText = stripZeroWidthSpaces(await page.getText(dateLozenge));
    //
    //     expect(lozengeText).toBe('1 de jan. de 2019');
    //
    //     await mountEditor(
    //       page,
    //       {
    //         appearance: 'full-page',
    //         allowDate: true,
    //       },
    //       { i18n: { locale: 'es' } },
    //     );
    //
    //     await page.click(editable);
    //     await quickInsert(page, 'Date');
    //
    //     const lozengeText2 = stripZeroWidthSpaces(await page.getText(dateLozenge));
    //     expect(lozengeText2).toBe('1 ene 2019');
    //     await page.teardownMockDate();
  });
});

test.describe('date: libra test - format date', () => {
  test.use({
    adf: taskDateAdf,
    editorProps: {
      appearance: 'full-page',
      allowDate: true,
    },
  });

  test(`Format date in task item`, async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    await expect(nodes.actionList).toHaveText(/Aug 15, 2017/);
  });
});

test.describe('date: escape-keydown', () => {
  test.use({
    adf: escapeKeydownAdf,
    editorProps: {
      appearance: 'full-page',
      allowDate: true,
    },
  });
});
