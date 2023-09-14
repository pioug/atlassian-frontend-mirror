import {
  editorTestCase as test,
  expect,
  EditorPanelModel,
  EditorEmojiModel,
  EditorNodeContainerModel,
} from '@af/editor-libra';
import { singleInfoPanel } from './__fixtures__/adf-documents-panel';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  panel,
  p,
  emoji,
} from '@atlaskit/editor-test-helpers/doc-builder';

test.describe('Panel - Gap cursor - Type-ahead', () => {
  test.use({
    adf: singleInfoPanel,
    editorProps: {
      appearance: 'full-page',
      allowPanel: true,
    },
  });

  test('opens a quick insert menu from the left gap cursor of a panel and inserts an emoji before the panel', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const panelModel = EditorPanelModel.from(nodes.panel);

    // Put cursor in panel content, this happens automatically in Confluence pages
    await panelModel.clickContent();

    // Move the selection to the left gap cursor
    await editor.keyboard.press('ArrowLeft'); // Selects the panel
    await editor.keyboard.press('ArrowLeft'); // Selects the gap cursor

    await expect(editor).toHaveSelection({
      pos: 0,
      side: 'left',
      type: 'gapcursor',
    });

    // Insert an emoji through the typeahead menu
    const emojiModel = EditorEmojiModel.from(nodes.emoji, editor);
    await emojiModel.insertViaTypeahead({ shortName: 'smile' });

    await expect(editor).toHaveDocument(
      doc(
        p(emoji({ shortName: ':smile:', id: '1f604', text: '😄' })(), ' '),
        panel({ panelType: 'info' })(p()),
        p(),
      ),
    );
  });

  test('opens a quick insert menu from the right gap cursor of a panel and inserts an emoji after the panel', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const panelModel = EditorPanelModel.from(nodes.panel);

    // Put cursor in panel content, this happens automatically in Confluence pages
    await panelModel.clickContent();

    // Move the selection to the left gap cursor
    await editor.keyboard.press('ArrowRight'); // Selects the panel
    await editor.keyboard.press('ArrowRight'); // Selects the gap cursor

    await expect(editor).toHaveSelection({
      pos: 4,
      side: 'right',
      type: 'gapcursor',
    });

    // Insert an emoji through the typeahead menu
    const emojiModel = EditorEmojiModel.from(nodes.emoji, editor);
    await emojiModel.insertViaTypeahead({ shortName: 'smile' });

    await expect(editor).toHaveDocument(
      doc(
        panel({ panelType: 'info' })(p()),
        p(emoji({ shortName: ':smile:', id: '1f604', text: '😄' })(), ' '),
        p(),
      ),
    );
  });
});
