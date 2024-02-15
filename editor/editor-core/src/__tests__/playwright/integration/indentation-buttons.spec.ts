import {
  EditorMainToolbarModel,
  expect,
  editorTestCase as test,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  h1,
  indentation,
  li,
  p,
  taskItem,
  taskList,
  ul,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { adfs } from './indentation-buttons.spec.ts-fixtures';

test.describe('Editor toolbar indentation buttons:', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowIndentation: true,
      showIndentationButtons: true,
    },
  });

  test.describe('Indent button click', () => {
    test.describe('top-level paragraph', () => {
      test.use({
        adf: adfs.paragraph,
      });

      test('should indent', async ({ editor }) => {
        const toolbar = EditorMainToolbarModel.from(editor);
        await toolbar.clickAt('Indent');
        await expect(editor).toMatchDocument(
          doc(indentation({ level: 1 })(p('hello world'))),
        );
      });
    });

    test.describe('top-level headings', () => {
      test.use({
        adf: adfs.heading,
      });

      test('should indent', async ({ editor }) => {
        const toolbar = EditorMainToolbarModel.from(editor);
        await toolbar.clickAt('Indent');
        await expect(editor).toMatchDocument(
          doc(indentation({ level: 1 })(h1('hello world'))),
        );
      });
    });

    test.describe('list item', () => {
      test('should indent', async ({ editor }) => {
        const toolbar = EditorMainToolbarModel.from(editor);
        await editor.keyboard.type('- hello');
        await editor.keyboard.press('Enter');
        await editor.keyboard.type('world');
        await toolbar.clickAt('Indent');
        await expect(editor).toMatchDocument(
          doc(ul(li(p('hello'), ul(li(p('world')))))),
        );
      });
    });

    test.describe('task list item', () => {
      test.use({
        adf: adfs.taskList,
      });

      test('should indent', async ({ editor }) => {
        const toolbar = EditorMainToolbarModel.from(editor);
        await editor.selection.set({ anchor: 12, head: 12 });
        await toolbar.clickAt('Indent');
        await expect(editor).toMatchDocument(
          doc(
            taskList()(
              taskItem({ localId: expect.any(String), state: 'TODO' })('hello'),
              taskList()(
                taskItem({ localId: expect.any(String), state: 'TODO' })(
                  'world',
                ),
              ),
            ),
          ),
        );
      });
    });
  });

  test.describe('Outdent button click', () => {
    test.describe('top-level paragraph', () => {
      test.use({
        adf: adfs.indentedParagraph,
      });

      test('should outdent', async ({ editor }) => {
        const toolbar = EditorMainToolbarModel.from(editor);
        await toolbar.clickAt('Outdent');
        await expect(editor).toMatchDocument(doc(p('hello world')));
      });
    });

    test.describe('top-level heading', () => {
      test.use({
        adf: adfs.indentedHeading,
      });

      test('should outdent', async ({ editor }) => {
        const toolbar = EditorMainToolbarModel.from(editor);
        await toolbar.clickAt('Outdent');
        await expect(editor).toMatchDocument(doc(h1('hello world')));
      });
    });

    test.describe('list item', () => {
      test.use({
        adf: adfs.indentedList,
      });

      test('should outdent', async ({ editor }) => {
        const toolbar = EditorMainToolbarModel.from(editor);
        await editor.selection.set({ anchor: 12, head: 12 });
        await toolbar.clickAt('Outdent');
        await expect(editor).toMatchDocument(
          doc(ul(li(p('hello')), li(p('world')))),
        );
      });
    });

    test.describe('task list', () => {
      test.use({
        adf: adfs.indentedTaskList,
      });

      test('should outdent', async ({ editor }) => {
        const toolbar = EditorMainToolbarModel.from(editor);
        await editor.selection.set({ anchor: 10, head: 10 });
        await toolbar.clickAt('Outdent');
        await expect(editor).toMatchDocument(
          doc(
            taskList()(
              taskItem({ localId: expect.any(String), state: 'TODO' })('hello'),
              taskItem({ localId: expect.any(String), state: 'TODO' })('world'),
            ),
          ),
        );
      });
    });
  });
});
