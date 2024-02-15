import {
  EditorMediaSingleModel,
  EditorNodeContainerModel,
  expect,
  editorTestCase as test,
} from '@af/editor-libra';

import { oneImage, threeImages } from './__fixtures__/adf-documents';
import { table3x3MediaSingle } from './table-mediaSingle.spec.ts-fixtures/adf-table3x3-mediaSingle';

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

  test('should highlight the media on selection', async ({ editor }) => {
    const { mediaSingle } = EditorNodeContainerModel.from(editor);

    await test.step('make sure there is only one image in the document', async () => {
      expect(await mediaSingle.count()).toBe(1);
    });

    await mediaSingle.first().click();

    const mediaSingleModel = EditorMediaSingleModel.from(mediaSingle);

    await expect(mediaSingleModel.selected).toBeVisible();
  });

  test('should select the media while using arrow left/right', async ({
    editor,
  }) => {
    const { mediaSingle } = EditorNodeContainerModel.from(editor);
    const mediaSingleModel = EditorMediaSingleModel.from(mediaSingle);

    await test.step('make sure there is only one image in the document', async () => {
      expect(await mediaSingle.count()).toBe(1);
    });

    await mediaSingle.first().click();
    await editor.keyboard.press('ArrowLeft');

    await expect(mediaSingleModel.selected).toBeHidden();

    await editor.keyboard.press('ArrowRight');

    await expect(mediaSingleModel.selected).toBeVisible();
  });
});

test.describe('media single', () => {
  test.use({
    adf: threeImages,
  });

  test('should highlight the media on text selection', async ({ editor }) => {
    const { mediaSingle } = EditorNodeContainerModel.from(editor);
    const firstImageModel = EditorMediaSingleModel.from(mediaSingle.first());
    const secondImageModel = EditorMediaSingleModel.from(mediaSingle.nth(1));
    const thirdImageModel = EditorMediaSingleModel.from(mediaSingle.nth(2));

    await test.step('make sure there are 3 images in the document', async () => {
      expect(await mediaSingle.count()).toBe(3);
    });

    await editor.selection.set({ anchor: 0, head: 5 });

    await expect(firstImageModel.selected).toBeVisible();

    await expect(secondImageModel.selected).toBeVisible();

    await expect(thirdImageModel.selected).toBeHidden();
  });
});

test.describe('media single inside table', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      media: {
        allowMediaSingle: true,
      },
      allowTables: {
        advanced: true,
      },
    },
    adf: table3x3MediaSingle,
  });

  test('should highlight the media on selection', async ({ editor }) => {
    const { mediaSingle } = EditorNodeContainerModel.from(editor);

    await editor.selection.set({ anchor: 22, head: 22 });

    await editor.keyboard.press('Shift+ArrowRight');

    const firstImageModel = EditorMediaSingleModel.from(mediaSingle.first());
    await expect(firstImageModel.selected).toBeVisible();
  });
});
