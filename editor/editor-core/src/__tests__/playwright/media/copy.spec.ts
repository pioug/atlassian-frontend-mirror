import {
  editorTestCase as test,
  EditorNodeContainerModel,
  expect,
} from '@af/editor-libra';
import {
  simpleMediaGroup,
  simpleMediaSingleWithAltText,
} from './insert-media.spec.ts-fixtures';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  mediaSingle,
  media,
  mediaGroup,
} from '@atlaskit/editor-test-helpers/doc-builder';

test.describe('media: copy', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      media: {
        allowMediaSingle: true,
        allowMediaGroup: true,
        allowAltTextOnImages: true,
      },
    },
  });

  test.describe('media group', () => {
    test.use({
      adf: simpleMediaGroup,
    });

    test('copy-mediaGroup.ts: Copies and pastes mediaGroup file card on fullpage', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);

      await expect(nodes.media.first()).toBeVisible();

      await nodes.media.first().click();

      await editor.copy();

      await editor.keyboard.press('ArrowDown');

      await editor.paste();

      await expect(editor).toMatchDocument(
        doc(
          mediaGroup(
            media({
              __contextId: expect.any(String),
              id: expect.any(String),
              collection: 'MediaServicesSample',
              type: 'file',
            })(),
          ),
          mediaGroup(
            media({
              __mediaTraceId: expect.any(String),
              __contextId: expect.any(String),
              id: expect.any(String),
              collection: 'MediaServicesSample',
              type: 'file',
            })(),
          ),
        ),
      );
    });
  });

  test.describe('media single with alt text', () => {
    test.use({
      adf: simpleMediaSingleWithAltText,
    });

    test('Copy paste a media single with alt text properly', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);

      await expect(nodes.media.first()).toBeVisible();

      await nodes.media.first().click();

      await editor.copy();

      await editor.keyboard.press('ArrowDown');

      await editor.paste();

      await expect(editor).toMatchDocument(
        doc(
          mediaSingle()(
            media({
              __contextId: 'DUMMY-OBJECT-ID',
              __fileMimeType: expect.any(String),
              __fileName: 'tall_image.jpeg',
              __fileSize: expect.any(Number),
              width: expect.any(Number),
              height: expect.any(Number),
              id: expect.any(String),
              collection: 'MediaServicesSample',
              type: 'file',
              alt: 'test',
            })(),
          ),
          mediaSingle()(
            media({
              __mediaTraceId: expect.any(String),
              __contextId: 'DUMMY-OBJECT-ID',
              __fileMimeType: expect.any(String),
              __fileName: 'tall_image.jpeg',
              __fileSize: expect.any(Number),
              width: expect.any(Number),
              height: expect.any(Number),
              id: expect.any(String),
              collection: 'MediaServicesSample',
              type: 'file',
              alt: 'test',
            })(),
          ),
        ),
      );
    });
  });
});
