import {
  EditorFloatingToolbarModel,
  EditorMediaSingleNextModel,
  EditorMediaVideoModel,
  EditorNodeContainerModel,
  expect,
  editorTestCase as test,
} from '@af/editor-libra';

const videoMediaAdf = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'mediaSingle',
      attrs: {
        layout: 'center',
      },
      content: [
        {
          type: 'media',
          attrs: {
            id: '0c3c64b9-65ad-4592-89d0-f838beebd81e',
            type: 'file',
            collection: 'MediaServicesSample',
            width: 640,
            height: 360,
          },
        },
      ],
    },
  ],
};

test.describe('media single', () => {
  test.use({
    adf: videoMediaAdf,
    editorProps: {
      appearance: 'full-page',
      media: {
        allowMediaSingle: true,
        allowMediaGroup: true,
        allowAltTextOnImages: true,
      },
    },
  });

  test('should be able to increase the video speed', async ({ editor }) => {
    const { mediaSingle } = EditorNodeContainerModel.from(editor);
    const videoModel = EditorMediaVideoModel.from(mediaSingle);
    await videoModel.setSpeed('1.25x');
    await expect(videoModel.speedToggleButton).toHaveText('1.25x');
  });

  test('should be able to decrease the video speed', async ({ editor }) => {
    const { mediaSingle } = EditorNodeContainerModel.from(editor);
    const videoModel = EditorMediaVideoModel.from(mediaSingle);
    await videoModel.setSpeed('0.75x');
    await expect(videoModel.speedToggleButton).toHaveText('0.75x');
  });

  test('should be able to mute the video', async ({ editor }) => {
    const { mediaSingle } = EditorNodeContainerModel.from(editor);
    const videoModel = EditorMediaVideoModel.from(mediaSingle);
    await expect(videoModel.volumeControlButton).toHaveCSS(
      'color',
      'rgb(199, 209, 219)',
    );
    await videoModel.volumeControlButton.click();

    // Muted control colour
    await expect(videoModel.volumeControlButton).toHaveCSS(
      'color',
      'rgb(239, 92, 72)',
    );
  });

  test('should be in danger on hover', async ({ editor }) => {
    const { mediaSingle } = EditorNodeContainerModel.from(editor);

    const mediaSingleModel = EditorMediaSingleNextModel.from(mediaSingle);
    const floatingToolbar = EditorFloatingToolbarModel.from(
      editor,
      mediaSingleModel,
    );
    const removeIcon = floatingToolbar.itemAt('Remove');
    await removeIcon.hover();
    await expect(mediaSingle).toHaveClass(/danger/);
  });
});
