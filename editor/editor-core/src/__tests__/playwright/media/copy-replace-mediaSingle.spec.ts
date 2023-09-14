import {
  editorTestCase as test,
  expect,
  EditorNodeContainerModel,
  EditorMediaSingleModel,
} from '@af/editor-libra';
import { threeImages, oneImage } from './__fixtures__/adf-documents';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p, mediaSingle } from '@atlaskit/editor-test-helpers/doc-builder';

test.use({
  editorProps: {
    appearance: 'full-page',
    media: {
      allowMediaSingle: true,
    },
  },
});

test.describe('media single', () => {
  test.use({
    adf: oneImage,
  });

  test('should copy and paste a media single', async ({ editor }) => {
    const { mediaSingle } = EditorNodeContainerModel.from(editor);

    await test.step('make sure there is only one image in the document', async () => {
      await expect(await mediaSingle.count()).toBe(1);
    });

    await mediaSingle.first().click();

    await editor.copy();

    await editor.selection.set({ anchor: 4, head: 4 });

    await editor.paste();

    await expect(await mediaSingle.count()).toBe(2);
  });

  test('should select the image on paste', async ({ editor }) => {
    const { mediaSingle } = EditorNodeContainerModel.from(editor);

    await test.step('make sure there is only one image in the document', async () => {
      await expect(await mediaSingle.count()).toBe(1);
    });

    await mediaSingle.first().click();

    await editor.copy();

    await editor.selection.set({ anchor: 4, head: 4 });

    await editor.paste();

    const secondImageModel = EditorMediaSingleModel.from(mediaSingle.nth(1));
    expect(await secondImageModel.isSelected()).toBe(true);
  });

  test.describe('when paste on top of other media single', () => {
    test.use({
      adf: threeImages,
    });

    test('should replace the media single selected', async ({ editor }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const secondMedia = nodes.mediaSingle.nth(1);
      const lastMedia = nodes.mediaSingle.nth(2);

      await secondMedia.click();
      await editor.copy();

      await lastMedia.click();
      await editor.paste();

      await expect(editor).toMatchDocument(
        doc(
          mediaSingle({
            width: 66.67,
            layout: 'wrap-left',
          }).any,
          mediaSingle({
            width: 66.67,
            layout: 'wrap-right',
          }).any,
          mediaSingle({
            width: 66.67,
            layout: 'wrap-right',
          }).any,
          p(''),
        ),
      );
    });
  });
});
