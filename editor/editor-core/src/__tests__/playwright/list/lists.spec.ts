import {
  editorTestCase as test,
  expect,
  EditorFocusModel,
} from '@af/editor-libra';
import {
  listInTableAdf,
  floatsAdf,
  listsAdf,
  simpleList,
} from './lists.spec.ts-fixtures';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  table,
  tr,
  td,
  li,
  ul,
  p,
  ol,
} from '@atlaskit/editor-test-helpers/doc-builder';

test.describe('List', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowTables: true,
    },
  });

  test.describe('when list is inside a table', () => {
    test.use({
      adf: listInTableAdf,
    });

    test('list: tabbing through a tableCell that contains a list should go to the next cell', async ({
      editor,
    }) => {
      await editor.selection.set({
        anchor: 18,
        head: 18,
      });
      await editor.keyboard.press('Tab');
      await editor.keyboard.press('Tab');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 64,
        head: 68,
      });
    });

    test('list: tabbing from the first listItem in a tableCell should go to the next cell', async ({
      editor,
    }) => {
      await editor.selection.set({
        anchor: 28,
        head: 28,
      });
      await editor.keyboard.press('Tab');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 64,
        head: 68,
      });
    });

    test('list: tabbing from the second listItem in a tableCell should indent the listItem', async ({
      editor,
    }) => {
      await editor.selection.set({
        anchor: 45,
        head: 45,
      });
      await editor.keyboard.press('Tab');
      await editor.keyboard.press('Tab');

      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 45,
        head: 45,
      });
      await expect(editor).toMatchDocument(
        // prettier-ignore
        doc(
          table()(
            tr.any,
            tr(
              td().any,
              td()(
                ul(
                  li(
                    p('Bullet item 1'),
                    ul(
                      li(
                        p('Bullet item 2'),
                      ),
                    ),
                  ),
                ),
              ),
              td().any,
            ),
            tr.any,
          )
        ),
      );
    });
  });

  test(`shouldn't change focus on tab if the list is not indentable`, async ({
    editor,
  }) => {
    const editorFocusModel = EditorFocusModel.from(editor);

    await editor.keyboard.type('* abc');
    await editor.keyboard.press('Enter');
    await editor.keyboard.press('Tab');
    await editor.keyboard.type('123');
    await editor.keyboard.press('Tab');

    await expect(await editorFocusModel.hasFocus()).toBeTruthy();
    await expect(editor).toMatchDocument(
      // prettier-ignore
      doc(
        ul(
          li(
            p('abc'),
            ul(
              li(
                p('123'),
              ),
            ),
          ),
        ),
      ),
    );
  });

  const shortcutInsertList =
    process.platform === 'darwin' ? 'Meta+Shift+8' : 'Control+Shift+8';
  test('list: should be able to insert lists via keyboard shortcut', async ({
    editor,
  }) => {
    await editor.keyboard.press(shortcutInsertList);

    await expect(editor).toMatchDocument(
      // prettier-ignore
      doc(
        ul(
          li(
            p(),
          ),
        ),
      ),
    );
  });

  test.describe('when restartNumberedLists is enabled', () => {
    test.use({
      editorProps: {
        appearance: 'full-page',
        featureFlags: {
          restartNumberedLists: true,
        },
      },
    });

    test('list: should be able to insert lists via keyboard shortcut ', async ({
      editor,
    }) => {
      await editor.keyboard.press(shortcutInsertList);

      await expect(editor).toMatchDocument(
        // prettier-ignore
        doc(
          ul(
            li(
              p(),
            ),
          ),
        ),
      );
    });
  });

  test.describe('when usign floatsAdf', () => {
    test.use({
      adf: floatsAdf,
    });
    test.use({
      editorProps: {
        appearance: 'full-page',
        media: {
          allowMediaSingle: true,
        },
      },
    });

    // migrated skip config: chrome, safari
    test('list: should be able to navigate lists correctly', async ({
      editor,
    }) => {
      // First paragraph aside the first inline media
      await editor.selection.set({
        anchor: 4,
        head: 4,
      });

      // Go down seven times until the list item: "Six"
      await editor.keyboard.press('ArrowDown');
      await editor.keyboard.press('ArrowDown');
      await editor.keyboard.press('ArrowDown');
      await editor.keyboard.press('ArrowDown');
      await editor.keyboard.press('ArrowDown');
      await editor.keyboard.press('ArrowDown');
      await editor.keyboard.press('ArrowDown');

      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 81,
        head: 81,
      });

      // Second paragraph aside the second inline media
      await editor.selection.set({
        anchor: 140,
        head: 140,
      });

      // Go down seven times until the list item: "Six"
      await editor.keyboard.press('ArrowDown');
      await editor.keyboard.press('ArrowDown');
      await editor.keyboard.press('ArrowDown');
      await editor.keyboard.press('ArrowDown');
      await editor.keyboard.press('ArrowDown');
      await editor.keyboard.press('ArrowDown');
      await editor.keyboard.press('ArrowDown');

      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 217,
        head: 217,
      });
    });
  });

  test.describe('when using listsAdf', () => {
    test.use({
      adf: listsAdf,
    });

    test('list: should handle backspace correctly when at the start of a list', async ({
      editor,
    }) => {
      //Case 2 with indented child
      await editor.selection.set({
        anchor: 14,
        head: 14,
      });
      await editor.keyboard.press('Backspace');
      await expect(editor).toHaveDocument(
        doc(
          ul(
            li(
              p('wefwef1wefwef2'),
              ul(li(p('wefwef3'), ul(li(p('wefwef4')))), li(p('wefwef5'))),
            ),
            li(p('wefwef6')),
          ),
          p(),
          p('wefwef7'),
          ol()(
            li(p('wefwef1')),
            li(
              p('wefwef2'),
              ol()(li(p('wefwef3'), ol()(li(p('wefwef4')))), li(p('wefwef5'))),
            ),
            li(p('wefwef6')),
          ),
          p(),
          p('wefwef7'),
        ),
      );

      //Case 4 with outdented child
      await editor.selection.set({ anchor: 45, head: 45 });
      await editor.keyboard.press('Backspace');
      await expect(editor).toHaveDocument(
        doc(
          ul(
            li(
              p('wefwef1wefwef2'),
              ul(li(p('wefwef3'), ul(li(p('wefwef4wefwef5'))))),
            ),
            li(p('wefwef6')),
          ),
          p(),
          p('wefwef7'),
          ol()(
            li(p('wefwef1')),
            li(
              p('wefwef2'),
              ol()(li(p('wefwef3'), ol()(li(p('wefwef4')))), li(p('wefwef5'))),
            ),
            li(p('wefwef6')),
          ),
          p(),
          p('wefwef7'),
        ),
      );

      //Case 4 with double nested previous listItem
      await editor.selection.set({ anchor: 54, head: 54 });
      await editor.keyboard.press('Backspace');
      await expect(editor).toHaveDocument(
        doc(
          ul(
            li(
              p('wefwef1wefwef2'),
              ul(li(p('wefwef3'), ul(li(p('wefwef4wefwef5wefwef6'))))),
            ),
          ),
          p(),
          p('wefwef7'),
          ol()(
            li(p('wefwef1')),
            li(
              p('wefwef2'),
              ol()(li(p('wefwef3'), ol()(li(p('wefwef4')))), li(p('wefwef5'))),
            ),
            li(p('wefwef6')),
          ),
          p(),
          p('wefwef7'),
        ),
      );

      //Case 3 with indented child
      await editor.selection.set({ anchor: 21, head: 21 });
      await editor.keyboard.press('Backspace');
      await expect(editor).toHaveDocument(
        doc(
          ul(
            li(p('wefwef1wefwef2wefwef3'), ul(li(p('wefwef4wefwef5wefwef6')))),
          ),
          p(),
          p('wefwef7'),
          ol()(
            li(p('wefwef1')),
            li(
              p('wefwef2'),
              ol()(li(p('wefwef3'), ol()(li(p('wefwef4')))), li(p('wefwef5'))),
            ),
            li(p('wefwef6')),
          ),
          p(),
          p('wefwef7'),
        ),
      );

      //Case 3 with no children
      await editor.selection.set({ anchor: 28, head: 28 });
      await editor.keyboard.press('Backspace');
      await expect(editor).toHaveDocument(
        doc(
          ul(li(p('wefwef1wefwef2wefwef3wefwef4wefwef5wefwef6'))),
          p(),
          p('wefwef7'),
          ol()(
            li(p('wefwef1')),
            li(
              p('wefwef2'),
              ol()(li(p('wefwef3'), ol()(li(p('wefwef4')))), li(p('wefwef5'))),
            ),
            li(p('wefwef6')),
          ),
          p(),
          p('wefwef7'),
        ),
      );

      //Case 1 with paragraphs with and without content
      await editor.selection.set({ anchor: 49, head: 49 });
      await editor.keyboard.press('Backspace');
      await expect(editor).toHaveDocument(
        doc(
          ul(li(p('wefwef1wefwef2wefwef3wefwef4wefwef5wefwef6'))),
          p('wefwef7'),
          ol()(
            li(p('wefwef1')),
            li(
              p('wefwef2'),
              ol()(li(p('wefwef3'), ol()(li(p('wefwef4')))), li(p('wefwef5'))),
            ),
            li(p('wefwef6')),
          ),
          p(),
          p('wefwef7'),
        ),
      );

      //Case 1 with paragraphs with and without content
      await editor.selection.set({ anchor: 49, head: 49 });
      await editor.keyboard.press('Backspace');
      await expect(editor).toHaveDocument(
        doc(
          ul(li(p('wefwef1wefwef2wefwef3wefwef4wefwef5wefwef6wefwef7'))),
          ol()(
            li(p('wefwef1')),
            li(
              p('wefwef2'),
              ol()(li(p('wefwef3'), ol()(li(p('wefwef4')))), li(p('wefwef5'))),
            ),
            li(p('wefwef6')),
          ),
          p(),
          p('wefwef7'),
        ),
      );

      //Case 2 with indented child
      await editor.selection.set({ anchor: 69, head: 69 });
      await editor.keyboard.press('Backspace');
      await expect(editor).toHaveDocument(
        doc(
          ul(li(p('wefwef1wefwef2wefwef3wefwef4wefwef5wefwef6wefwef7'))),
          ol()(
            li(
              p('wefwef1wefwef2'),
              ol()(li(p('wefwef3'), ol()(li(p('wefwef4')))), li(p('wefwef5'))),
            ),
            li(p('wefwef6')),
          ),
          p(),
          p('wefwef7'),
        ),
      );

      //Case 4 with outdented child
      await editor.selection.set({ anchor: 100, head: 100 });
      await editor.keyboard.press('Backspace');
      await expect(editor).toHaveDocument(
        doc(
          ul(li(p('wefwef1wefwef2wefwef3wefwef4wefwef5wefwef6wefwef7'))),
          ol()(
            li(
              p('wefwef1wefwef2'),
              ol()(li(p('wefwef3'), ol()(li(p('wefwef4wefwef5'))))),
            ),
            li(p('wefwef6')),
          ),
          p(),
          p('wefwef7'),
        ),
      );

      //Case 4 with double nested previous listItem
      await editor.selection.set({ anchor: 109, head: 109 });
      await editor.keyboard.press('Backspace');
      await expect(editor).toHaveDocument(
        doc(
          ul(li(p('wefwef1wefwef2wefwef3wefwef4wefwef5wefwef6wefwef7'))),
          ol()(
            li(
              p('wefwef1wefwef2'),
              ol()(li(p('wefwef3'), ol()(li(p('wefwef4wefwef5wefwef6'))))),
            ),
          ),
          p(),
          p('wefwef7'),
        ),
      );

      //Case 3 with indented child
      await editor.selection.set({ anchor: 76, head: 76 });
      await editor.keyboard.press('Backspace');
      await expect(editor).toHaveDocument(
        doc(
          ul(li(p('wefwef1wefwef2wefwef3wefwef4wefwef5wefwef6wefwef7'))),
          ol()(
            li(
              p('wefwef1wefwef2wefwef3'),
              ol()(li(p('wefwef4wefwef5wefwef6'))),
            ),
          ),
          p(),
          p('wefwef7'),
        ),
      );

      //Case 3 with no children
      await editor.selection.set({ anchor: 83, head: 83 });
      await editor.keyboard.press('Backspace');
      await expect(editor).toHaveDocument(
        doc(
          ul(li(p('wefwef1wefwef2wefwef3wefwef4wefwef5wefwef6wefwef7'))),
          ol()(li(p('wefwef1wefwef2wefwef3wefwef4wefwef5wefwef6'))),
          p(),
          p('wefwef7'),
        ),
      );

      //Case 1 with paragraphs with and without content
      await editor.selection.set({ anchor: 104, head: 104 });
      await editor.keyboard.press('Backspace');
      await expect(editor).toHaveDocument(
        doc(
          ul(li(p('wefwef1wefwef2wefwef3wefwef4wefwef5wefwef6wefwef7'))),
          ol()(li(p('wefwef1wefwef2wefwef3wefwef4wefwef5wefwef6'))),
          p('wefwef7'),
        ),
      );

      //Case 1 with paragraphs with and without content
      await editor.selection.set({ anchor: 104, head: 104 });
      await editor.keyboard.press('Backspace');
      await expect(editor).toHaveDocument(
        doc(
          ul(li(p('wefwef1wefwef2wefwef3wefwef4wefwef5wefwef6wefwef7'))),
          ol()(li(p('wefwef1wefwef2wefwef3wefwef4wefwef5wefwef6wefwef7'))),
        ),
      );
    });

    test('list: should handle delete correctly when at the end of a list', async ({
      editor,
    }) => {
      await editor.selection.set({
        anchor: 10,
        head: 10,
      });
      await editor.keyboard.press('Delete');
      await expect(editor).toHaveDocument(
        doc(
          ul(
            li(
              p('wefwef1wefwef2'),
              ul(li(p('wefwef3'), ul(li(p('wefwef4')))), li(p('wefwef5'))),
            ),
            li(p('wefwef6')),
          ),
          p(),
          p('wefwef7'),
          ol()(
            li(p('wefwef1')),
            li(
              p('wefwef2'),
              ol()(li(p('wefwef3'), ol()(li(p('wefwef4')))), li(p('wefwef5'))),
            ),
            li(p('wefwef6')),
          ),
          p(),
          p('wefwef7'),
        ),
      );

      await editor.selection.set({ anchor: 39, head: 39 });
      await editor.keyboard.press('Delete');
      await expect(editor).toHaveDocument(
        doc(
          ul(
            li(
              p('wefwef1wefwef2'),
              ul(li(p('wefwef3'), ul(li(p('wefwef4wefwef5'))))),
            ),
            li(p('wefwef6')),
          ),
          p(),
          p('wefwef7'),
          ol()(
            li(p('wefwef1')),
            li(
              p('wefwef2'),
              ol()(li(p('wefwef3'), ol()(li(p('wefwef4')))), li(p('wefwef5'))),
            ),
            li(p('wefwef6')),
          ),
          p(),
          p('wefwef7'),
        ),
      );

      await editor.selection.set({ anchor: 46, head: 46 });
      await editor.keyboard.press('Delete');
      await expect(editor).toHaveDocument(
        doc(
          ul(
            li(
              p('wefwef1wefwef2'),
              ul(li(p('wefwef3'), ul(li(p('wefwef4wefwef5wefwef6'))))),
            ),
          ),
          p(),
          p('wefwef7'),
          ol()(
            li(p('wefwef1')),
            li(
              p('wefwef2'),
              ol()(li(p('wefwef3'), ol()(li(p('wefwef4')))), li(p('wefwef5'))),
            ),
            li(p('wefwef6')),
          ),
          p(),
          p('wefwef7'),
        ),
      );

      await editor.selection.set({ anchor: 17, head: 17 });
      await editor.keyboard.press('Delete');
      await expect(editor).toHaveDocument(
        doc(
          ul(
            li(p('wefwef1wefwef2wefwef3'), ul(li(p('wefwef4wefwef5wefwef6')))),
          ),
          p(),
          p('wefwef7'),
          ol()(
            li(p('wefwef1')),
            li(
              p('wefwef2'),
              ol()(li(p('wefwef3'), ol()(li(p('wefwef4')))), li(p('wefwef5'))),
            ),
            li(p('wefwef6')),
          ),
          p(),
          p('wefwef7'),
        ),
      );

      await editor.selection.set({ anchor: 24, head: 24 });
      await editor.keyboard.press('Delete');
      await expect(editor).toHaveDocument(
        doc(
          ul(li(p('wefwef1wefwef2wefwef3wefwef4wefwef5wefwef6'))),
          p(),
          p('wefwef7'),
          ol()(
            li(p('wefwef1')),
            li(
              p('wefwef2'),
              ol()(li(p('wefwef3'), ol()(li(p('wefwef4')))), li(p('wefwef5'))),
            ),
            li(p('wefwef6')),
          ),
          p(),
          p('wefwef7'),
        ),
      );

      await editor.selection.set({ anchor: 45, head: 45 });
      await editor.keyboard.press('Delete');
      await expect(editor).toHaveDocument(
        doc(
          ul(li(p('wefwef1wefwef2wefwef3wefwef4wefwef5wefwef6'))),
          p('wefwef7'),
          ol()(
            li(p('wefwef1')),
            li(
              p('wefwef2'),
              ol()(li(p('wefwef3'), ol()(li(p('wefwef4')))), li(p('wefwef5'))),
            ),
            li(p('wefwef6')),
          ),
          p(),
          p('wefwef7'),
        ),
      );

      await editor.selection.set({ anchor: 45, head: 45 });
      await editor.keyboard.press('Delete');
      await expect(editor).toHaveDocument(
        doc(
          ul(li(p('wefwef1wefwef2wefwef3wefwef4wefwef5wefwef6wefwef7'))),
          ol()(
            li(p('wefwef1')),
            li(
              p('wefwef2'),
              ol()(li(p('wefwef3'), ol()(li(p('wefwef4')))), li(p('wefwef5'))),
            ),
            li(p('wefwef6')),
          ),
          p(),
          p('wefwef7'),
        ),
      );

      await editor.selection.set({ anchor: 65, head: 65 });
      await editor.keyboard.press('Delete');
      await expect(editor).toHaveDocument(
        doc(
          ul(li(p('wefwef1wefwef2wefwef3wefwef4wefwef5wefwef6wefwef7'))),
          ol()(
            li(
              p('wefwef1wefwef2'),
              ol()(li(p('wefwef3'), ol()(li(p('wefwef4')))), li(p('wefwef5'))),
            ),
            li(p('wefwef6')),
          ),
          p(),
          p('wefwef7'),
        ),
      );

      await editor.selection.set({ anchor: 94, head: 94 });
      await editor.keyboard.press('Delete');
      await expect(editor).toHaveDocument(
        doc(
          ul(li(p('wefwef1wefwef2wefwef3wefwef4wefwef5wefwef6wefwef7'))),
          ol()(
            li(
              p('wefwef1wefwef2'),
              ol()(li(p('wefwef3'), ol()(li(p('wefwef4wefwef5'))))),
            ),
            li(p('wefwef6')),
          ),
          p(),
          p('wefwef7'),
        ),
      );

      await editor.selection.set({ anchor: 101, head: 101 });
      await editor.keyboard.press('Delete');
      await expect(editor).toHaveDocument(
        doc(
          ul(li(p('wefwef1wefwef2wefwef3wefwef4wefwef5wefwef6wefwef7'))),
          ol()(
            li(
              p('wefwef1wefwef2'),
              ol()(li(p('wefwef3'), ol()(li(p('wefwef4wefwef5wefwef6'))))),
            ),
          ),
          p(),
          p('wefwef7'),
        ),
      );

      await editor.selection.set({ anchor: 72, head: 72 });
      await editor.keyboard.press('Delete');
      await expect(editor).toHaveDocument(
        doc(
          ul(li(p('wefwef1wefwef2wefwef3wefwef4wefwef5wefwef6wefwef7'))),
          ol()(
            li(
              p('wefwef1wefwef2wefwef3'),
              ol()(li(p('wefwef4wefwef5wefwef6'))),
            ),
          ),
          p(),
          p('wefwef7'),
        ),
      );

      await editor.selection.set({ anchor: 79, head: 79 });
      await editor.keyboard.press('Delete');
      await expect(editor).toHaveDocument(
        doc(
          ul(li(p('wefwef1wefwef2wefwef3wefwef4wefwef5wefwef6wefwef7'))),
          ol()(li(p('wefwef1wefwef2wefwef3wefwef4wefwef5wefwef6'))),
          p(),
          p('wefwef7'),
        ),
      );

      await editor.selection.set({ anchor: 100, head: 100 });
      await editor.keyboard.press('Delete');
      await expect(editor).toHaveDocument(
        doc(
          ul(li(p('wefwef1wefwef2wefwef3wefwef4wefwef5wefwef6wefwef7'))),
          ol()(li(p('wefwef1wefwef2wefwef3wefwef4wefwef5wefwef6'))),
          p('wefwef7'),
        ),
      );

      await editor.selection.set({ anchor: 100, head: 100 });
      await editor.keyboard.press('Delete');
      await expect(editor).toHaveDocument(
        doc(
          ul(li(p('wefwef1wefwef2wefwef3wefwef4wefwef5wefwef6wefwef7'))),
          ol()(li(p('wefwef1wefwef2wefwef3wefwef4wefwef5wefwef6wefwef7'))),
        ),
      );
    });
  });

  test.describe('when using listsAdf and restartNumberedLists', () => {
    test.use({
      adf: listsAdf,
    });
    test.use({
      editorProps: {
        appearance: 'full-page',
        featureFlags: {
          restartNumberedLists: true,
        },
      },
    });

    test('list: should handle backspace correctly when at the start of a list with restartNumberedLists', async ({
      editor,
    }) => {
      //Case 2 with indented child
      await editor.selection.set({
        anchor: 14,
        head: 14,
      });
      await editor.keyboard.press('Backspace');
      await expect(editor).toHaveDocument(
        doc(
          ul(
            li(
              p('wefwef1wefwef2'),
              ul(li(p('wefwef3'), ul(li(p('wefwef4')))), li(p('wefwef5'))),
            ),
            li(p('wefwef6')),
          ),
          p(),
          p('wefwef7'),
          ol()(
            li(p('wefwef1')),
            li(
              p('wefwef2'),
              ol()(li(p('wefwef3'), ol()(li(p('wefwef4')))), li(p('wefwef5'))),
            ),
            li(p('wefwef6')),
          ),
          p(),
          p('wefwef7'),
        ),
      );

      //Case 4 with outdented child
      await editor.selection.set({ anchor: 45, head: 45 });
      await editor.keyboard.press('Backspace');
      await expect(editor).toHaveDocument(
        doc(
          ul(
            li(
              p('wefwef1wefwef2'),
              ul(li(p('wefwef3'), ul(li(p('wefwef4wefwef5'))))),
            ),
            li(p('wefwef6')),
          ),
          p(),
          p('wefwef7'),
          ol()(
            li(p('wefwef1')),
            li(
              p('wefwef2'),
              ol()(li(p('wefwef3'), ol()(li(p('wefwef4')))), li(p('wefwef5'))),
            ),
            li(p('wefwef6')),
          ),
          p(),
          p('wefwef7'),
        ),
      );

      //Case 4 with double nested previous listItem
      await editor.selection.set({ anchor: 54, head: 54 });
      await editor.keyboard.press('Backspace');
      await expect(editor).toHaveDocument(
        doc(
          ul(
            li(
              p('wefwef1wefwef2'),
              ul(li(p('wefwef3'), ul(li(p('wefwef4wefwef5wefwef6'))))),
            ),
          ),
          p(),
          p('wefwef7'),
          ol()(
            li(p('wefwef1')),
            li(
              p('wefwef2'),
              ol()(li(p('wefwef3'), ol()(li(p('wefwef4')))), li(p('wefwef5'))),
            ),
            li(p('wefwef6')),
          ),
          p(),
          p('wefwef7'),
        ),
      );

      //Case 3 with indented child
      await editor.selection.set({ anchor: 21, head: 21 });
      await editor.keyboard.press('Backspace');
      await expect(editor).toHaveDocument(
        doc(
          ul(
            li(p('wefwef1wefwef2wefwef3'), ul(li(p('wefwef4wefwef5wefwef6')))),
          ),
          p(),
          p('wefwef7'),
          ol()(
            li(p('wefwef1')),
            li(
              p('wefwef2'),
              ol()(li(p('wefwef3'), ol()(li(p('wefwef4')))), li(p('wefwef5'))),
            ),
            li(p('wefwef6')),
          ),
          p(),
          p('wefwef7'),
        ),
      );

      //Case 3 with no children
      await editor.selection.set({ anchor: 28, head: 28 });
      await editor.keyboard.press('Backspace');
      await expect(editor).toHaveDocument(
        doc(
          ul(li(p('wefwef1wefwef2wefwef3wefwef4wefwef5wefwef6'))),
          p(),
          p('wefwef7'),
          ol()(
            li(p('wefwef1')),
            li(
              p('wefwef2'),
              ol()(li(p('wefwef3'), ol()(li(p('wefwef4')))), li(p('wefwef5'))),
            ),
            li(p('wefwef6')),
          ),
          p(),
          p('wefwef7'),
        ),
      );

      //Case 1 with paragraphs with and without content
      await editor.selection.set({ anchor: 49, head: 49 });
      await editor.keyboard.press('Backspace');
      await expect(editor).toHaveDocument(
        doc(
          ul(li(p('wefwef1wefwef2wefwef3wefwef4wefwef5wefwef6'))),
          p('wefwef7'),
          ol()(
            li(p('wefwef1')),
            li(
              p('wefwef2'),
              ol()(li(p('wefwef3'), ol()(li(p('wefwef4')))), li(p('wefwef5'))),
            ),
            li(p('wefwef6')),
          ),
          p(),
          p('wefwef7'),
        ),
      );

      //Case 1 with paragraphs with and without content
      await editor.selection.set({ anchor: 49, head: 49 });
      await editor.keyboard.press('Backspace');
      await expect(editor).toHaveDocument(
        doc(
          ul(li(p('wefwef1wefwef2wefwef3wefwef4wefwef5wefwef6wefwef7'))),
          ol()(
            li(p('wefwef1')),
            li(
              p('wefwef2'),
              ol()(li(p('wefwef3'), ol()(li(p('wefwef4')))), li(p('wefwef5'))),
            ),
            li(p('wefwef6')),
          ),
          p(),
          p('wefwef7'),
        ),
      );

      //Case 2 with indented child
      await editor.selection.set({ anchor: 69, head: 69 });
      await editor.keyboard.press('Backspace');
      await expect(editor).toHaveDocument(
        doc(
          ul(li(p('wefwef1wefwef2wefwef3wefwef4wefwef5wefwef6wefwef7'))),
          ol()(
            li(
              p('wefwef1wefwef2'),
              ol()(li(p('wefwef3'), ol()(li(p('wefwef4')))), li(p('wefwef5'))),
            ),
            li(p('wefwef6')),
          ),
          p(),
          p('wefwef7'),
        ),
      );

      //Case 4 with outdented child
      await editor.selection.set({ anchor: 100, head: 100 });
      await editor.keyboard.press('Backspace');
      await expect(editor).toHaveDocument(
        doc(
          ul(li(p('wefwef1wefwef2wefwef3wefwef4wefwef5wefwef6wefwef7'))),
          ol()(
            li(
              p('wefwef1wefwef2'),
              ol()(li(p('wefwef3'), ol()(li(p('wefwef4wefwef5'))))),
            ),
            li(p('wefwef6')),
          ),
          p(),
          p('wefwef7'),
        ),
      );

      //Case 4 with double nested previous listItem
      await editor.selection.set({ anchor: 109, head: 109 });
      await editor.keyboard.press('Backspace');
      await expect(editor).toHaveDocument(
        doc(
          ul(li(p('wefwef1wefwef2wefwef3wefwef4wefwef5wefwef6wefwef7'))),
          ol()(
            li(
              p('wefwef1wefwef2'),
              ol()(li(p('wefwef3'), ol()(li(p('wefwef4wefwef5wefwef6'))))),
            ),
          ),
          p(),
          p('wefwef7'),
        ),
      );

      //Case 3 with indented child
      await editor.selection.set({ anchor: 76, head: 76 });
      await editor.keyboard.press('Backspace');
      await expect(editor).toHaveDocument(
        doc(
          ul(li(p('wefwef1wefwef2wefwef3wefwef4wefwef5wefwef6wefwef7'))),
          ol()(
            li(
              p('wefwef1wefwef2wefwef3'),
              ol()(li(p('wefwef4wefwef5wefwef6'))),
            ),
          ),
          p(),
          p('wefwef7'),
        ),
      );

      //Case 3 with no children
      await editor.selection.set({ anchor: 83, head: 83 });
      await editor.keyboard.press('Backspace');
      await expect(editor).toHaveDocument(
        doc(
          ul(li(p('wefwef1wefwef2wefwef3wefwef4wefwef5wefwef6wefwef7'))),
          ol()(li(p('wefwef1wefwef2wefwef3wefwef4wefwef5wefwef6'))),
          p(),
          p('wefwef7'),
        ),
      );

      //Case 1 with paragraphs with and without content
      await editor.selection.set({ anchor: 104, head: 104 });
      await editor.keyboard.press('Backspace');
      await expect(editor).toHaveDocument(
        doc(
          ul(li(p('wefwef1wefwef2wefwef3wefwef4wefwef5wefwef6wefwef7'))),
          ol()(li(p('wefwef1wefwef2wefwef3wefwef4wefwef5wefwef6'))),
          p('wefwef7'),
        ),
      );

      //Case 1 with paragraphs with and without content
      await editor.selection.set({ anchor: 104, head: 104 });
      await editor.keyboard.press('Backspace');
      await expect(editor).toHaveDocument(
        doc(
          ul(li(p('wefwef1wefwef2wefwef3wefwef4wefwef5wefwef6wefwef7'))),
          ol()(li(p('wefwef1wefwef2wefwef3wefwef4wefwef5wefwef6wefwef7'))),
        ),
      );
    });

    test('list: should handle delete correctly when at the end of a list', async ({
      editor,
    }) => {
      await editor.selection.set({
        anchor: 10,
        head: 10,
      });
      await editor.keyboard.press('Delete');
      await expect(editor).toHaveDocument(
        doc(
          ul(
            li(
              p('wefwef1wefwef2'),
              ul(li(p('wefwef3'), ul(li(p('wefwef4')))), li(p('wefwef5'))),
            ),
            li(p('wefwef6')),
          ),
          p(),
          p('wefwef7'),
          ol()(
            li(p('wefwef1')),
            li(
              p('wefwef2'),
              ol()(li(p('wefwef3'), ol()(li(p('wefwef4')))), li(p('wefwef5'))),
            ),
            li(p('wefwef6')),
          ),
          p(),
          p('wefwef7'),
        ),
      );

      await editor.selection.set({ anchor: 39, head: 39 });
      await editor.keyboard.press('Delete');
      await expect(editor).toHaveDocument(
        doc(
          ul(
            li(
              p('wefwef1wefwef2'),
              ul(li(p('wefwef3'), ul(li(p('wefwef4wefwef5'))))),
            ),
            li(p('wefwef6')),
          ),
          p(),
          p('wefwef7'),
          ol()(
            li(p('wefwef1')),
            li(
              p('wefwef2'),
              ol()(li(p('wefwef3'), ol()(li(p('wefwef4')))), li(p('wefwef5'))),
            ),
            li(p('wefwef6')),
          ),
          p(),
          p('wefwef7'),
        ),
      );

      await editor.selection.set({ anchor: 46, head: 46 });
      await editor.keyboard.press('Delete');
      await expect(editor).toHaveDocument(
        doc(
          ul(
            li(
              p('wefwef1wefwef2'),
              ul(li(p('wefwef3'), ul(li(p('wefwef4wefwef5wefwef6'))))),
            ),
          ),
          p(),
          p('wefwef7'),
          ol()(
            li(p('wefwef1')),
            li(
              p('wefwef2'),
              ol()(li(p('wefwef3'), ol()(li(p('wefwef4')))), li(p('wefwef5'))),
            ),
            li(p('wefwef6')),
          ),
          p(),
          p('wefwef7'),
        ),
      );

      await editor.selection.set({ anchor: 17, head: 17 });
      await editor.keyboard.press('Delete');
      await expect(editor).toHaveDocument(
        doc(
          ul(
            li(p('wefwef1wefwef2wefwef3'), ul(li(p('wefwef4wefwef5wefwef6')))),
          ),
          p(),
          p('wefwef7'),
          ol()(
            li(p('wefwef1')),
            li(
              p('wefwef2'),
              ol()(li(p('wefwef3'), ol()(li(p('wefwef4')))), li(p('wefwef5'))),
            ),
            li(p('wefwef6')),
          ),
          p(),
          p('wefwef7'),
        ),
      );

      await editor.selection.set({ anchor: 24, head: 24 });
      await editor.keyboard.press('Delete');
      await expect(editor).toHaveDocument(
        doc(
          ul(li(p('wefwef1wefwef2wefwef3wefwef4wefwef5wefwef6'))),
          p(),
          p('wefwef7'),
          ol()(
            li(p('wefwef1')),
            li(
              p('wefwef2'),
              ol()(li(p('wefwef3'), ol()(li(p('wefwef4')))), li(p('wefwef5'))),
            ),
            li(p('wefwef6')),
          ),
          p(),
          p('wefwef7'),
        ),
      );

      await editor.selection.set({ anchor: 45, head: 45 });
      await editor.keyboard.press('Delete');
      await expect(editor).toHaveDocument(
        doc(
          ul(li(p('wefwef1wefwef2wefwef3wefwef4wefwef5wefwef6'))),
          p('wefwef7'),
          ol()(
            li(p('wefwef1')),
            li(
              p('wefwef2'),
              ol()(li(p('wefwef3'), ol()(li(p('wefwef4')))), li(p('wefwef5'))),
            ),
            li(p('wefwef6')),
          ),
          p(),
          p('wefwef7'),
        ),
      );

      await editor.selection.set({ anchor: 45, head: 45 });
      await editor.keyboard.press('Delete');
      await expect(editor).toHaveDocument(
        doc(
          ul(li(p('wefwef1wefwef2wefwef3wefwef4wefwef5wefwef6wefwef7'))),
          ol()(
            li(p('wefwef1')),
            li(
              p('wefwef2'),
              ol()(li(p('wefwef3'), ol()(li(p('wefwef4')))), li(p('wefwef5'))),
            ),
            li(p('wefwef6')),
          ),
          p(),
          p('wefwef7'),
        ),
      );

      await editor.selection.set({ anchor: 65, head: 65 });
      await editor.keyboard.press('Delete');
      await expect(editor).toHaveDocument(
        doc(
          ul(li(p('wefwef1wefwef2wefwef3wefwef4wefwef5wefwef6wefwef7'))),
          ol()(
            li(
              p('wefwef1wefwef2'),
              ol()(li(p('wefwef3'), ol()(li(p('wefwef4')))), li(p('wefwef5'))),
            ),
            li(p('wefwef6')),
          ),
          p(),
          p('wefwef7'),
        ),
      );

      await editor.selection.set({ anchor: 94, head: 94 });
      await editor.keyboard.press('Delete');
      await expect(editor).toHaveDocument(
        doc(
          ul(li(p('wefwef1wefwef2wefwef3wefwef4wefwef5wefwef6wefwef7'))),
          ol()(
            li(
              p('wefwef1wefwef2'),
              ol()(li(p('wefwef3'), ol()(li(p('wefwef4wefwef5'))))),
            ),
            li(p('wefwef6')),
          ),
          p(),
          p('wefwef7'),
        ),
      );

      await editor.selection.set({ anchor: 101, head: 101 });
      await editor.keyboard.press('Delete');
      await expect(editor).toHaveDocument(
        doc(
          ul(li(p('wefwef1wefwef2wefwef3wefwef4wefwef5wefwef6wefwef7'))),
          ol()(
            li(
              p('wefwef1wefwef2'),
              ol()(li(p('wefwef3'), ol()(li(p('wefwef4wefwef5wefwef6'))))),
            ),
          ),
          p(),
          p('wefwef7'),
        ),
      );

      await editor.selection.set({ anchor: 72, head: 72 });
      await editor.keyboard.press('Delete');
      await expect(editor).toHaveDocument(
        doc(
          ul(li(p('wefwef1wefwef2wefwef3wefwef4wefwef5wefwef6wefwef7'))),
          ol()(
            li(
              p('wefwef1wefwef2wefwef3'),
              ol()(li(p('wefwef4wefwef5wefwef6'))),
            ),
          ),
          p(),
          p('wefwef7'),
        ),
      );

      await editor.selection.set({ anchor: 79, head: 79 });
      await editor.keyboard.press('Delete');
      await expect(editor).toHaveDocument(
        doc(
          ul(li(p('wefwef1wefwef2wefwef3wefwef4wefwef5wefwef6wefwef7'))),
          ol()(li(p('wefwef1wefwef2wefwef3wefwef4wefwef5wefwef6'))),
          p(),
          p('wefwef7'),
        ),
      );

      await editor.selection.set({ anchor: 100, head: 100 });
      await editor.keyboard.press('Delete');
      await expect(editor).toHaveDocument(
        doc(
          ul(li(p('wefwef1wefwef2wefwef3wefwef4wefwef5wefwef6wefwef7'))),
          ol()(li(p('wefwef1wefwef2wefwef3wefwef4wefwef5wefwef6'))),
          p('wefwef7'),
        ),
      );

      await editor.selection.set({ anchor: 100, head: 100 });
      await editor.keyboard.press('Delete');
      await expect(editor).toHaveDocument(
        doc(
          ul(li(p('wefwef1wefwef2wefwef3wefwef4wefwef5wefwef6wefwef7'))),
          ol()(li(p('wefwef1wefwef2wefwef3wefwef4wefwef5wefwef6wefwef7'))),
        ),
      );
    });
  });

  test.describe('list: ctrl-d', () => {
    test.use({
      adf: simpleList,
    });

    test.use({
      editorProps: {
        appearance: 'full-page',
      },
    });

    if (process.platform === 'darwin') {
      test.describe('when running on mac', () => {
        test('shortcut should behave the same as delete key', async ({
          editor,
        }) => {
          await editor.selection.set({ anchor: 4, head: 4 });

          await editor.keyboard.press('Control+d');

          await expect(editor).toHaveDocument(doc(ul(li(p('AB')), li(p('C')))));
        });
      });
    } else {
      test.describe('when not running on mac', () => {
        test('shortcut should not change editable content', async ({
          editor,
        }) => {
          await editor.selection.set({ anchor: 4, head: 4 });

          await editor.keyboard.press('Control+d');
          await expect(editor).toHaveDocument(
            doc(ul(li(p('A')), li(p('B')), li(p('C')))),
          );
        });
      });
    }
  });
});
