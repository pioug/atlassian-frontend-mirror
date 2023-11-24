import {
  editorTestCase as test,
  expect,
  EditorEmojiModel,
  EditorNodeContainerModel,
  EditorMentionModel,
  EditorPopupModel,
  EditorStatusModel,
  fixTest,
  BROWSERS,
} from '@af/editor-libra';

// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  p,
  emoji,
  mention,
  panel,
  status,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { statusAdf, statusWithTextAdf } from './status.spec.ts-fixtures';

const endShortcut = process.platform === 'darwin' ? 'Meta+ArrowRight' : 'End';

test.describe('status: ', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowPanel: true,
      allowStatus: true,
    },
  });

  test('insert an emoji, then a mention, move to right before the emoji and try to add text between both', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const emojiModel = EditorEmojiModel.from(nodes.emoji, editor);
    const mentionModel = EditorMentionModel.from(editor);

    await emojiModel.search('grinning');
    await editor.keyboard.type(': ');

    await mentionModel.search('Carolyn');
    await editor.keyboard.press('Enter');
    await expect(nodes.mention.first()).toBeVisible();

    await editor.keyboard.press('ArrowLeft');
    await editor.keyboard.press('ArrowLeft');
    await editor.keyboard.press('ArrowLeft');
    await editor.keyboard.press('ArrowLeft');

    await editor.keyboard.type('ear to ear');

    await expect(editor).toHaveDocument(
      doc(
        p(
          emoji({
            id: '1f600',
            shortName: ':grinning:',
            text: '😀',
          })(),
          ' ear to ear ',
          mention({ id: '0', text: '@Carolyn' })(),
          ' ',
        ),
      ),
    );
  });

  test('insert status into panel, move cursor to right before status, and add text', async ({
    editor,
  }) => {
    fixTest({
      jiraIssueId: 'ED-21115',
      reason:
        'Extra space shown in assertion only on pipelines but not locally',
      browsers: [BROWSERS.webkit],
    });

    const nodes = EditorNodeContainerModel.from(editor);
    const statusModel = EditorStatusModel.from(nodes.status, editor);
    const pickerModel = await statusModel.picker();

    await editor.typeAhead.searchAndInsert('Info');
    await expect(nodes.panel.first()).toBeVisible();
    await editor.typeAhead.searchAndInsert('status');
    await expect(pickerModel.statusPickerInput).toBeFocused();

    await editor.keyboard.type('Successful');

    await pickerModel.statusPickerInput.click();
    await editor.keyboard.press('Enter');

    await expect(pickerModel.statusPickerInput).toBeHidden();

    await editor.keyboard.press('Backspace');
    await editor.keyboard.press('ArrowLeft');
    await editor.keyboard.press('ArrowLeft');

    await editor.keyboard.type('This test is ');

    await expect(editor).toMatchDocument(
      doc(
        panel({ panelType: 'info' })(
          p(
            'This test is ',
            status({
              text: 'Successful',
              color: 'neutral',
              localId: '',
            }),
          ),
        ),
      ),
    );
  });

  test('insert status into panel, move cursor to right before panel, move right, and add text', async ({
    editor,
  }) => {
    fixTest({
      jiraIssueId: 'ED-21115',
      reason:
        'Extra space shown in assertion only on pipelines but not locally',
      browsers: [BROWSERS.webkit],
    });
    const nodes = EditorNodeContainerModel.from(editor);
    const statusModel = EditorStatusModel.from(nodes.status, editor);
    const pickerModel = await statusModel.picker();

    await editor.typeAhead.searchAndInsert('Info');
    await expect(nodes.panel.first()).toBeVisible();

    await editor.typeAhead.searchAndInsert('status');

    await expect(pickerModel.statusPickerInput).toBeFocused();

    await editor.keyboard.type('Successful');
    await pickerModel.statusPickerInput.click();
    await editor.keyboard.press('Enter');

    await expect(pickerModel.statusPickerInput).toBeHidden();
    await editor.keyboard.press('Backspace');
    await editor.keyboard.press('ArrowLeft');
    await editor.keyboard.press('ArrowLeft');
    await editor.keyboard.press('ArrowLeft');
    await editor.keyboard.press('ArrowRight');

    await editor.keyboard.type('This test is ');

    await expect(editor).toMatchDocument(
      doc(
        panel({ panelType: 'info' })(
          p(
            'This test is ',
            status({
              text: 'Successful',
              color: 'neutral',
              localId: '',
            }),
          ),
        ),
      ),
    );
  });

  const selectAllShortcut =
    process.platform === 'darwin' ? 'Meta+a' : 'Control+a';

  test('insert status with neutral, change colour and text', async ({
    editor,
  }) => {
    fixTest({
      jiraIssueId: 'ED-21115',
      reason:
        'Extra space shown in assertion only on pipelines but not locally',
      browsers: [BROWSERS.webkit],
    });
    const nodes = EditorNodeContainerModel.from(editor);
    const popup = EditorPopupModel.from(editor);
    const statusModel = EditorStatusModel.from(nodes.status, editor);
    const pickerModel = await statusModel.picker();

    await editor.typeAhead.searchAndInsert('status');

    await expect(pickerModel.statusPickerInput).toBeFocused();
    await editor.keyboard.type('Successful');
    await pickerModel.statusPickerInput.click();
    await editor.keyboard.press('Enter');

    const statusPicker = await statusModel.openStatusPicker(popup);

    await nodes.status.first().click();
    await expect(pickerModel.statusPickerInput).toBeVisible();

    await pickerModel.statusPickerInput.click();
    await expect(pickerModel.statusPickerInput).toBeFocused();

    await editor.keyboard.press(selectAllShortcut);
    await editor.keyboard.type('Not ready');
    await editor.keyboard.press('Tab');
    await statusPicker.colourPurple.click();

    await expect(editor).toMatchDocument(
      doc(
        p(
          status({
            text: 'Not ready',
            color: 'purple',
            localId: '',
          }),
          ' ',
        ),
      ),
    );
  });

  test.describe('without text ', () => {
    test.use({
      adf: statusAdf,
    });

    test('clicking after a status produces a text selection to its right', async ({
      editor,
    }) => {
      await editor.selection.set({ anchor: 2, head: 2 });

      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 2,
        head: 2,
      });
    });
  });

  test.describe('with text ', () => {
    test.use({
      adf: statusWithTextAdf,
    });

    test('selecting line with a status and text via keys', async ({
      editor,
    }) => {
      await editor.selection.set({ anchor: 2, head: 2 });
      await editor.keyboard.press(endShortcut);

      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 19,
        head: 19,
      });

      await editor.keyboard.press('Shift+Home');

      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 19,
        head: 1,
      });
    });
  });
});
