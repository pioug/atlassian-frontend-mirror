import {
  editorTestCase as test,
  expect,
  EditorNodeContainerModel,
  EditorMediaSingleNextModel,
  EditorFloatingToolbarModel,
} from '@af/editor-libra';
import { oneImagesNext } from './__fixtures__/adf-documents';

test.use({
  editorProps: {
    appearance: 'full-page',
    media: {
      allowMediaSingle: true,
    },
  },
});

test.describe('media single in extended resize experience', () => {
  test.use({
    adf: oneImagesNext,
    platformFeatureFlags: {
      'platform.editor.media.extended-resize-experience': true,
    },
  });

  test('should highlight the node when hovering over delete button', async ({
    editor,
  }) => {
    const { mediaSingle } = EditorNodeContainerModel.from(editor);

    const mediaSingleModel = EditorMediaSingleNextModel.from(mediaSingle);
    await mediaSingle.first().click();
    const floatingToolbar = EditorFloatingToolbarModel.from(
      editor,
      mediaSingleModel,
    );

    await floatingToolbar.hoverDeleteButton();

    await test.step('validate highlight for the left thumb', async () => {
      await expect(mediaSingleModel.leftResizeHandleThumb).toHaveCSS(
        'background-color',
        'rgb(222, 53, 11)',
      );
    });
    await test.step('validate highlight for the right thumb', async () => {
      await expect(mediaSingleModel.rightResizeHandleThumb).toHaveCSS(
        'background-color',
        'rgb(222, 53, 11)',
      );
    });

    await test.step('validate highlight for the file wrapper', async () => {
      await expect(mediaSingleModel.newFileExperienceWrapper).toHaveCSS(
        'box-shadow',
        'rgb(222, 53, 11) 0px 0px 0px 1px',
      );
    });
  });

  test('should highlight the node when entering invalid value in width input', async ({
    editor,
  }) => {
    const { mediaSingle } = EditorNodeContainerModel.from(editor);

    const mediaSingleModel = EditorMediaSingleNextModel.from(mediaSingle);
    await mediaSingle.first().click();
    const floatingToolbar = EditorFloatingToolbarModel.from(
      editor,
      mediaSingleModel,
    );

    await floatingToolbar.setWidth('1');

    await test.step('validate highlight for the left thumb', async () => {
      await expect(mediaSingleModel.leftResizeHandleThumb).toHaveCSS(
        'background-color',
        'rgb(255, 139, 0)',
      );
    });
    await test.step('validate highlight for the right thumb', async () => {
      await expect(mediaSingleModel.rightResizeHandleThumb).toHaveCSS(
        'background-color',
        'rgb(255, 139, 0)',
      );
    });

    await test.step('validate highlight for the file wrapper', async () => {
      await expect(mediaSingleModel.newFileExperienceWrapper).toHaveCSS(
        'box-shadow',
        'rgb(255, 139, 0) 0px 0px 0px 1px',
      );
    });
  });

  test('should highlight the node when entering invalid value in height input', async ({
    editor,
  }) => {
    const { mediaSingle } = EditorNodeContainerModel.from(editor);

    const mediaSingleModel = EditorMediaSingleNextModel.from(mediaSingle);
    await mediaSingle.first().click();
    const floatingToolbar = EditorFloatingToolbarModel.from(
      editor,
      mediaSingleModel,
    );

    await floatingToolbar.setHeight('0');

    await test.step('validate highlight for the left thumb', async () => {
      await expect(mediaSingleModel.leftResizeHandleThumb).toHaveCSS(
        'background-color',
        'rgb(255, 139, 0)',
      );
    });
    await test.step('validate highlight for the right thumb', async () => {
      await expect(mediaSingleModel.rightResizeHandleThumb).toHaveCSS(
        'background-color',
        'rgb(255, 139, 0)',
      );
    });

    await test.step('validate highlight for the file wrapper', async () => {
      await expect(mediaSingleModel.newFileExperienceWrapper).toHaveCSS(
        'box-shadow',
        'rgb(255, 139, 0) 0px 0px 0px 1px',
      );
    });
  });
});
