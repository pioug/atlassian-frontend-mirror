/* eslint-disable playwright/max-nested-describe */
import {
  editorTestCase as test,
  expect,
  EditorPlaceholderTextModel,
  EditorTypeAheadModel,
} from '@af/editor-libra';
import {
  onePlaceholderInsideTableCells,
  twoPlaceholdersInsideTableCells,
} from './navigation.spec.ts-fixtures';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  p,
  table,
  tr,
  td,
  placeholder,
  taskList,
  taskItem,
} from '@atlaskit/editor-test-helpers/doc-builder';

test.describe('navigation', () => {
  test.describe('placeholder-text: arrow navigation', () => {
    test.describe('when there are two placeholder inside a table', () => {
      test.use({
        adf: twoPlaceholdersInsideTableCells,
        editorProps: {
          appearance: 'full-page',
          allowTemplatePlaceholders: {
            allowInserting: true,
          },
          allowTables: true,
        },
      });

      test.describe('and the arrow navigation is used to change the cursor position', () => {
        test.describe('and the cursor ends after the second placeholder', () => {
          // migrated skip config:
          test('it should add the content after the placeholder', async ({
            editor,
          }) => {
            await editor.selection.set({
              anchor: 48,
              head: 48,
            });
            await editor.keyboard.press('ArrowLeft');
            await editor.keyboard.type('lol');

            await expect(editor).toMatchDocument(
              doc(
                table()(
                  tr.any,
                  tr(
                    td()(p.any),
                    td()(
                      p(
                        placeholder({
                          text: "e.g., How your team's work fits into the company's FY20 OKRs and business strategy",
                        }),
                        'lol',
                      ),
                      p(),
                    ),
                  ),
                ),
              ),
            );
          });
        });

        test.describe('and the cursor ends at the second placeholder', () => {
          // migrated skip config: safari
          test('it should replace the placeholder to the text content', async ({
            editor,
          }) => {
            await editor.selection.set({
              anchor: 48,
              head: 48,
            });

            await editor.keyboard.press('ArrowLeft');
            await editor.keyboard.press('ArrowLeft');
            await editor.keyboard.type('lol');

            await expect(editor).toMatchDocument(
              doc(table()(tr.any, tr(td()(p.any), td()(p('lol'), p())))),
            );
          });
        });

        test.describe('and the cursor ends after the first placeholder', () => {
          // migrated skip config:
          test('it should add the content after the placeholder', async ({
            editor,
          }) => {
            await editor.selection.set({
              anchor: 48,
              head: 48,
            });

            await editor.keyboard.press('ArrowLeft');
            await editor.keyboard.press('ArrowLeft');
            await editor.keyboard.press('ArrowLeft');
            await editor.keyboard.type('lol');

            await expect(editor).toMatchDocument(
              doc(
                table()(
                  tr.any,
                  tr(
                    td()(
                      p(
                        placeholder({
                          text: 'Type /user profile to add a team member',
                        }),
                        'lol',
                      ),
                    ),
                    td()(p.any, p.any),
                  ),
                ),
              ),
            );
          });
        });

        test.describe('and the cursor ends at the first placeholder', () => {
          test('it should replace the placeholder to the text content', async ({
            editor,
          }) => {
            await editor.selection.set({
              anchor: 48,
              head: 48,
            });

            await editor.keyboard.press('ArrowLeft');
            await editor.keyboard.press('ArrowLeft');
            await editor.keyboard.press('ArrowLeft');
            await editor.keyboard.press('ArrowLeft');
            await editor.keyboard.type('lol');

            await expect(editor).toMatchDocument(
              doc(table()(tr.any, tr(td()(p('lol')), td()(p.any, p.any)))),
            );
          });
        });

        test.describe('and the cursor moves from after the first placeholder to at the second placeholder', () => {
          // migrated skip config:
          test('it should replace the second placeholder to the text content', async ({
            editor,
          }) => {
            await editor.selection.set({
              anchor: 48,
              head: 48,
            });

            await editor.keyboard.press('ArrowLeft');
            await editor.keyboard.press('ArrowLeft');
            await editor.keyboard.press('ArrowLeft');
            await editor.keyboard.press('ArrowRight');
            await editor.keyboard.type('lol');

            await expect(editor).toMatchDocument(
              doc(table()(tr.any, tr(td()(p.any), td()(p('lol'), p.any)))),
            );
          });
        });
      });
    });

    test.describe('when there is one placeholder inside a table', () => {
      test.use({
        adf: onePlaceholderInsideTableCells,
        editorProps: {
          appearance: 'full-page',
          allowTemplatePlaceholders: {
            allowInserting: true,
          },
          allowTables: true,
        },
      });

      test.describe('and the arrow navigation is used to change the cursor position', () => {
        test.describe('and the cursor ends at the empty cell', () => {
          // migrated skip config:
          test('it should add the content in the empty cell', async ({
            editor,
          }) => {
            await editor.selection.set({
              anchor: 47,
              head: 47,
            });

            await editor.keyboard.press('ArrowLeft');
            await editor.keyboard.press('ArrowLeft');
            await editor.keyboard.press('ArrowLeft');
            await editor.keyboard.type('lol');

            await expect(editor).toMatchDocument(
              doc(table()(tr.any, tr(td()(p('lol')), td()(p.any, p.any)))),
            );
          });
        });

        test.describe('and the cursor moves from after the empty cell to at the placeholder', () => {
          // migrated skip config:
          test('it should replace the second placeholder to the text content', async ({
            editor,
          }) => {
            await editor.selection.set({
              anchor: 47,
              head: 47,
            });

            await editor.keyboard.press('ArrowLeft');
            await editor.keyboard.press('ArrowLeft');
            await editor.keyboard.press('ArrowLeft');
            await editor.keyboard.press('ArrowRight');
            await editor.keyboard.type('lol');

            await expect(editor).toMatchDocument(
              doc(table()(tr.any, tr(td()(p.any), td()(p('lol'), p.any)))),
            );
          });
        });
      });
    });
  });

  test.describe('placeholder-text: mouse click', () => {
    test.use({
      adf: onePlaceholderInsideTableCells,
      editorProps: {
        appearance: 'full-page',
        allowTemplatePlaceholders: {
          allowInserting: true,
        },
        allowTables: true,
      },
    });

    test.describe('when there is one placeholder inside a table', () => {
      test.describe('and the user clicks at the second placeholder', () => {
        test('it should select the placeholder', async ({ editor }) => {
          await editor.selection.set({
            anchor: 47,
            head: 47,
          });

          const placeholderTextModel = new EditorPlaceholderTextModel(editor);
          await placeholderTextModel.clickPlaceholderText();

          await editor.keyboard.type('lol');

          await expect(editor).toMatchDocument(
            doc(table()(tr.any, tr(td()(p.any), td()(p('lol'), p.any)))),
          );
        });
      });
    });
  });

  test.describe('placeholder-text: type-ahead', () => {
    test.use({
      adf: twoPlaceholdersInsideTableCells,
      editorProps: {
        appearance: 'full-page',
        allowTemplatePlaceholders: {
          allowInserting: true,
        },
        allowTables: true,
      },
    });

    test.describe('when there are two placeholder inside a table', () => {
      test.describe('and the arrow navigation is used to change the cursor position', () => {
        test.describe('and the cursor is in front of the second placeholder', () => {
          // migrated skip config:
          test('it should replace the placeholder with the type-ahead item', async ({
            editor,
          }) => {
            await editor.selection.set({
              anchor: 48,
              head: 48,
            });

            const typeaheadModel = EditorTypeAheadModel.from(editor);

            await editor.keyboard.press('ArrowLeft');
            await editor.keyboard.press('ArrowLeft');

            await typeaheadModel.searchAndInsert('Action');
            await editor.keyboard.press('ArrowDown');
            await editor.keyboard.press('Enter');

            await expect(editor).toMatchDocument(
              doc(
                table()(
                  tr.any,
                  tr(
                    td()(p.any),
                    td()(
                      taskList({})(taskItem({ state: 'TODO' })()),
                      p.any,
                      p.any,
                    ),
                  ),
                ),
              ),
            );
          });
        });

        test.describe('and the cursor is in front of the first placeholder', () => {
          // migrated skip config:
          test('it should replace the placeholder with the type-ahead item', async ({
            editor,
          }) => {
            await editor.selection.set({
              anchor: 48,
              head: 48,
            });

            const typeaheadModel = EditorTypeAheadModel.from(editor);

            await editor.keyboard.press('ArrowLeft');
            await editor.keyboard.press('ArrowLeft');
            await editor.keyboard.press('ArrowLeft');
            await editor.keyboard.press('ArrowLeft');

            await typeaheadModel.searchAndInsert('Action');
            await editor.keyboard.press('ArrowDown');
            await editor.keyboard.press('Enter');

            await expect(editor).toMatchDocument(
              doc(
                table()(
                  tr.any,
                  tr(
                    td()(taskList({})(taskItem({ state: 'TODO' })()), p.any),
                    td()(p.any, p.any),
                  ),
                ),
              ),
            );
          });
        });
      });
    });
  });
});
