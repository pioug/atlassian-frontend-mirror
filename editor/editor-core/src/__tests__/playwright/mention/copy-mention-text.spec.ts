import {
  editorTestCase as test,
  expect,
  EditorNodeContainerModel,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  p,
  doc,
  mention,
  code_block,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { cardAndMentionAdf } from './copy-mention-text.spec.ts-fixtures/adf';

test.describe('Mention Copy', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      media: {
        allowMediaSingle: true,
      },
    },
    adf: cardAndMentionAdf,
  });
  test('copy a mention node and paste it into codeblock', async ({
    editor,
  }) => {
    let nodes = EditorNodeContainerModel.from(editor);
    await editor.selection.set({ anchor: 1, head: 19 });
    await editor.copy();
    const codeBlock = nodes.codeBlock.first();
    await codeBlock.click();
    await editor.paste();
    await expect(editor).toHaveDocument(
      doc(
        p('Hi ', mention({ id: '0', text: '@Carolyn' })(), ', How are you?'),
        code_block()('Hi @Carolyn, How are you?'),
        p(''),
      ),
    );
  });
});
