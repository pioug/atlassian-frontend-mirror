import { editorTestCase as test, expect } from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  p,
  table,
  tr,
  thEmpty,
  tdEmpty,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  simpleTableWithTwoParagraphAfter,
  simpleTableWithOneParagraphAfter,
} from './__fixtures__/base-adfs';

test.use({
  editorProps: {
    appearance: 'full-page',
    allowTables: {
      advanced: true,
    },
  },
});

test.describe('when document has two paragraph after table', () => {
  test.use({
    adf: simpleTableWithTwoParagraphAfter,
  });

  test('backspace for an empty paragraph not at the end of the document should delete that paragraph and place cursor inside last cell of table', async ({
    editor,
  }) => {
    await editor.selection.set({ anchor: 45, head: 45 });

    await editor.keyboard.press('Backspace');
    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 40,
      head: 40,
    });

    await expect(editor).toHaveDocument(
      doc(
        table({ localId: 'localId' })(
          tr(thEmpty, thEmpty, thEmpty),
          tr(tdEmpty, tdEmpty, tdEmpty),
          tr(tdEmpty, tdEmpty, tdEmpty),
        ),
        p(),
      ),
    );
  });
});

test.describe('when document has one paragraph after table', () => {
  test.use({
    adf: simpleTableWithOneParagraphAfter,
  });

  test('backspace for an empty paragraph at the end of the document should only place cursor inside last cell of table', async ({
    editor,
  }) => {
    await editor.selection.set({ anchor: 45, head: 45 });

    await editor.keyboard.press('Backspace');

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 40,
      head: 40,
    });
    await expect(editor).toHaveDocument(
      doc(
        table({ localId: 'localId' })(
          tr(thEmpty, thEmpty, thEmpty),
          tr(tdEmpty, tdEmpty, tdEmpty),
          tr(tdEmpty, tdEmpty, tdEmpty),
        ),
        p(),
      ),
    );
  });

  test('backspace for a filled paragraph not at the end of the document should place cursor inside last cell of table', async ({
    editor,
  }) => {
    await editor.selection.set({ anchor: 45, head: 45 });

    await editor.keyboard.type('Some random text');

    await editor.selection.set({ anchor: 45, head: 45 });

    await editor.keyboard.press('Backspace');

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 40,
      head: 40,
    });
    await expect(editor).toHaveDocument(
      doc(
        table({ localId: 'localId' })(
          tr(thEmpty, thEmpty, thEmpty),
          tr(tdEmpty, tdEmpty, tdEmpty),
          tr(tdEmpty, tdEmpty, tdEmpty),
        ),
        p('Some random text'),
      ),
    );
  });
});
