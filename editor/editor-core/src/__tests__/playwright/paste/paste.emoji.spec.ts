import {
  editorTestCase as test,
  expect,
  EditorTableModel,
  EditorNodeContainerModel,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  p,
  doc,
  emoji,
  code_block,
  table,
  tr,
  th,
  thEmpty,
  tdEmpty,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { emojiWithsimpleTable } from './__fixtures__/adf-document';
test.use({
  editorProps: {
    appearance: 'full-page',
    media: {
      allowMediaSingle: true,
    },
    allowTables: {
      advanced: true,
    },
  },
  adf: emojiWithsimpleTable,
});
test.describe('floating toolbar', () => {
  test('scroll buttons', async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);
    await editor.selection.set({ anchor: 1, head: 2 });
    await editor.copy();
    const cellModel = await tableModel.cell(1);
    await cellModel.click();
    await editor.typeAhead.searchAndInsert('code snippet');
    await editor.paste();
    await expect(editor).toHaveDocument(
      doc(
        p(emoji({ shortName: ':slight_smile:', id: '1f642', text: '🙂' })()),
        table({ localId: 'localId', layout: 'default' })(
          tr(
            thEmpty,
            th()(
              code_block()(),
              p(
                emoji({
                  shortName: ':slight_smile:',
                  id: '1f642',
                  text: '🙂',
                })(),
                '',
              ),
            ),
            thEmpty,
          ),
          tr(tdEmpty, tdEmpty, tdEmpty),
          tr(tdEmpty, tdEmpty, tdEmpty),
        ),
      ),
    );
  });
});
