import {
  EditorLinkFloatingToolbarModel,
  EditorMainToolbarModel,
  EditorMediaSingleModel,
  EditorNodeContainerModel,
  expect,
  editorTestCase as test,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  a,
  caption,
  doc,
  media,
  mediaSingle,
  p,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { imageWithCaption, oneImage } from './caption.spec.ts-fixtures';

test.describe('Caption', () => {
  test.describe('inserting.ts', () => {
    test.use({
      adf: oneImage,
      editorProps: {
        appearance: 'full-page',
        media: {
          allowMediaSingle: true,
          allowCaptions: true,
        },
      },
    });

    test('Inserts caption on click of placeholder', async ({ editor }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const mediaSingleModel = EditorMediaSingleModel.from(nodes.mediaSingle);

      // Add caption
      await mediaSingleModel.waitForReady();
      await mediaSingleModel.placeholderCaption.hover();
      await mediaSingleModel.placeholderCaption.click();
      await editor.keyboard.type('hello');

      await expect(editor).toMatchDocument(
        doc(
          mediaSingle({
            layout: 'wrap-left',
            width: 66.67,
          })(
            media({
              id: 'a559980d-cd47-43e2-8377-27359fcb905f',
              type: 'file',
              collection: 'MediaServicesSample',
              width: 500,
              height: 374,
              alt: 'test',
              __contextId: 'DUMMY-OBJECT-ID',
              __fileMimeType: 'image/jpeg',
              __fileName: 'tall_image.jpeg',
              __fileSize: 58705,
            })(),
            caption('hello'),
          ),
          p(),
        ),
      );
    });
  });

  test.describe('selection.ts', () => {
    test.use({
      adf: imageWithCaption,
      editorProps: {
        appearance: 'full-page',
        media: {
          allowMediaSingle: true,
          allowCaptions: true,
        },
      },
    });

    test('Press up below a caption will place cursor inside caption', async ({
      editor,
    }) => {
      await editor.selection.set({ anchor: 20, head: 20 });

      const nodes = EditorNodeContainerModel.from(editor);
      const mediaSingleModel = EditorMediaSingleModel.from(nodes.mediaSingle);

      await mediaSingleModel.waitForReady();
      await editor.keyboard.press('ArrowUp');
      await editor.keyboard.type('hello ');

      await expect(editor).toMatchDocument(
        doc(
          p(),
          mediaSingle()(
            media({
              id: 'a559980d-cd47-43e2-8377-27359fcb905f',
              type: 'file',
              collection: 'MediaServicesSample',
              width: 500,
              height: 374,
              alt: 'test',
              __contextId: 'DUMMY-OBJECT-ID',
              __fileMimeType: 'image/jpeg',
              __fileName: 'tall_image.jpeg',
              __fileSize: 58705,
            }).any,
            caption('hello world'),
          ),
          p('last paragraph'),
        ),
      );
    });
  });

  test.describe('adds link', () => {
    test.use({
      adf: oneImage,
      editorProps: {
        appearance: 'full-page',
        media: {
          allowMediaSingle: true,
          allowCaptions: true,
        },
        featureFlags: { 'lp-link-picker': true },
      },
    });

    test('should be able to add a link on a caption', async ({ editor }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const mediaSingleModel = EditorMediaSingleModel.from(nodes.mediaSingle);
      const toolbar = EditorMainToolbarModel.from(editor);
      const linkModel = EditorLinkFloatingToolbarModel.from(editor);

      // Add caption
      await mediaSingleModel.waitForReady();
      await mediaSingleModel.placeholderCaption.hover();
      await mediaSingleModel.placeholderCaption.click();
      await editor.keyboard.type('hello');

      // Should be able to add a link to the caption
      await editor.selection.set({ anchor: 3, head: 8 });
      await toolbar.clickAt('Link');
      await linkModel.isOpen();
      await editor.keyboard.type('http://atlassian.com');
      await editor.keyboard.press('Enter');

      // Document as expected
      await expect(editor).toHaveDocument(
        doc(
          mediaSingle({
            layout: 'wrap-left',
            width: 66.67,
          })(
            media({
              id: 'a559980d-cd47-43e2-8377-27359fcb905f',
              type: 'file',
              collection: 'MediaServicesSample',
              width: 500,
              height: 374,
              alt: 'test',
              __contextId: 'DUMMY-OBJECT-ID',
              __fileMimeType: 'image/jpeg',
              __fileName: 'tall_image.jpeg',
              __fileSize: 58705,
            }).any,
            caption(a({ href: 'http://atlassian.com' })('hello')),
          ),
          p(),
        ),
      );
    });
  });
});
