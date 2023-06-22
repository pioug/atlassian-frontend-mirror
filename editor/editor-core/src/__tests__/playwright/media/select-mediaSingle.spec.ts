import {
  editorTestCase as test,
  expect,
  EditorNodeContainerModel,
  EditorMediaSingleModel,
} from '@af/editor-libra';
import { threeImages, oneImage } from './__fixtures__/adf-documents';
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

    expect(await mediaSingleModel.isSelected()).toBe(true);
  });

  test('should select the media while using arrow left/right', async ({
    editor,
  }) => {
    const { mediaSingle } = EditorNodeContainerModel.from(editor);

    await test.step('make sure there is only one image in the document', async () => {
      expect(await mediaSingle.count()).toBe(1);
    });

    await mediaSingle.first().click();
    await editor.keyboard.press('ArrowLeft');

    // In the gap cursor
    const mediaSingleModelGap = EditorMediaSingleModel.from(mediaSingle);
    expect(await mediaSingleModelGap.isSelected()).toBe(false);

    await editor.keyboard.press('ArrowRight');

    const mediaSingleModel = EditorMediaSingleModel.from(mediaSingle);
    expect(await mediaSingleModel.isSelected()).toBe(true);
  });
});

test.describe('media single', () => {
  test.use({
    adf: threeImages,
  });

  test('should highlight the media on text selection', async ({ editor }) => {
    const { mediaSingle } = EditorNodeContainerModel.from(editor);

    await test.step('make sure there are 3 images in the document', async () => {
      expect(await mediaSingle.count()).toBe(3);
    });

    await editor.selection.set({ anchor: 0, head: 5 });

    const firstImageModel = EditorMediaSingleModel.from(mediaSingle.first());
    expect(await firstImageModel.isSelected()).toBe(true);

    const secondImageModel = EditorMediaSingleModel.from(mediaSingle.nth(1));
    expect(await secondImageModel.isSelected()).toBe(true);

    const thirdImageModel = EditorMediaSingleModel.from(mediaSingle.nth(2));
    expect(await thirdImageModel.isSelected()).toBe(false);
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
    expect(await firstImageModel.isSelected()).toBe(true);
  });
});
