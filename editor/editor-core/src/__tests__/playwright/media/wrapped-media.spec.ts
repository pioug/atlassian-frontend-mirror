import {
  editorTestCase as test,
  EditorNodeContainerModel,
  expect,
  fixTest,
  BROWSERS,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  table,
  tr,
  td,
  doc,
  p,
  mediaSingle,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { wrappedMediaInsideTable } from './__fixtures__/adf-documents';

test.describe('wrapped media', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowTables: true,
      media: {
        allowMediaSingle: true,
      },
    },

    adf: wrappedMediaInsideTable,
  });
  test.beforeEach(({ browserName }) => {
    fixTest({
      jiraIssueId: 'DTR-1609',
      reason:
        'There is an actual bug when trying to click in the gap between the wrapped image and the table cell',
      condition: browserName === BROWSERS.firefox,
    });
  });

  test.describe('when the user click right after the wrapped media inside a table', () => {
    // This is a pixel number. We are using this to position the mouse a litle bit after the media card
    const offset = 40;

    test('should set the selection after the wrapped media', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const firstMedia = nodes.media.first();

      const mediaBox = await firstMedia.boundingBox();
      await editor.page.mouse.click(
        mediaBox!.x + mediaBox!.width + offset,
        mediaBox!.y + offset,
      );
      await editor.waitForEditorStable();

      await expect(editor).toHaveSelection({
        pos: 20,
        side: 'right',
        type: 'gapcursor',
      });
    });

    test.describe('and when the user types something', () => {
      test('should insert the content right after the wrapper media', async ({
        editor,
      }) => {
        const nodes = EditorNodeContainerModel.from(editor);
        const firstMedia = nodes.media.first();

        const mediaBox = await firstMedia.boundingBox();
        await editor.page.mouse.click(
          mediaBox!.x + mediaBox!.width + offset,
          mediaBox!.y + offset,
        );
        await editor.waitForEditorStable();
        await editor.keyboard.type('lol');

        await expect(editor).toMatchDocument(
          doc(
            table()(
              tr.any,
              tr(
                td({
                  colwidth: [382],
                })(
                  mediaSingle({
                    layout: 'wrap-left',
                    width: 15,
                  }).any,
                  p('lol'),
                  mediaSingle().any,
                  p(''),
                ),
                td({
                  colwidth: [122],
                }).any,
                td({
                  colwidth: [253],
                }).any,
              ),
              tr.any,
            ),
          ),
        );
      });
    });
  });
});
