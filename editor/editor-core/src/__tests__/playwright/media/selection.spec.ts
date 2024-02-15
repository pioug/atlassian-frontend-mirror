import { expect, editorTestCase as test } from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  media,
  mediaSingle,
  p,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { paragraphMediaAdf } from './selection.spec.ts-fixtures';

test.describe('feature name: libra test', () => {
  test.use({
    adf: paragraphMediaAdf,
    editorProps: {
      appearance: 'full-page',
      media: {
        allowMediaSingle: true,
        allowCaptions: true,
      },
    },
  });

  test('selection: arrow right selection continues past media node', async ({
    editor,
  }) => {
    await editor.selection.set({ anchor: 3, head: 3 });

    // First: goes after the second L on LOL
    // Second: goes before media node as a gap cursor
    // Third: goes as node selection at the media node
    // Last: should go as gap cursor after the media node
    await editor.keyboard.press('ArrowRight');
    await editor.keyboard.press('ArrowRight');
    await editor.keyboard.press('ArrowRight');
    await editor.keyboard.press('ArrowRight');

    await editor.keyboard.type('hello');

    await expect(editor).toHaveDocument(
      doc(
        p('LOL'),
        mediaSingle()(
          media({
            id: 'a559980d-cd47-43e2-8377-27359fcb905f',
            type: 'file',
            collection: 'MediaServicesSample',
            __contextId: 'DUMMY-OBJECT-ID',
            __fileMimeType: 'image/jpeg',
            __fileName: 'tall_image.jpeg',
            __fileSize: 58705,
            alt: 'test',
            width: 500,
            height: 374,
          })(),
        ),
        p('hello'),
        p('END'),
      ),
    );
  });

  test('selection: arrow left selection continues past media node', async ({
    editor,
  }) => {
    await editor.selection.set({ anchor: 11, head: 11 });
    // First: goes after the E on END
    // Second: goes before the E on END
    // Third: goes before media node as a gap cursor
    // Fourth: goes as node selection at the media node
    // Fifth: should go as gap cursor before the media node
    await editor.keyboard.press('ArrowLeft');
    await editor.keyboard.press('ArrowLeft');
    await editor.keyboard.press('ArrowLeft');
    await editor.keyboard.press('ArrowLeft');
    await editor.keyboard.press('ArrowLeft');

    await editor.keyboard.type('hello');

    await expect(editor).toHaveDocument(
      doc(
        p('LOL'),
        p('hello'),
        mediaSingle()(
          media({
            id: 'a559980d-cd47-43e2-8377-27359fcb905f',
            type: 'file',
            collection: 'MediaServicesSample',
            __contextId: 'DUMMY-OBJECT-ID',
            __fileMimeType: 'image/jpeg',
            __fileName: 'tall_image.jpeg',
            __fileSize: 58705,
            alt: 'test',
            width: 500,
            height: 374,
          })(),
        ),
        p('END'),
      ),
    );
  });
});
