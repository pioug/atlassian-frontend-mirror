import {
  editorTestCase as test,
  expect,
  EditorNodeContainerModel,
  EditorMediaSingleNextModel,
  EditorFloatingToolbarModel,
} from '@af/editor-libra';
import {
  legacyExternalImage,
  threeExternalImages,
} from './__fixtures__/adf-documents';

test.use({
  editorProps: {
    appearance: 'full-page',
    media: {
      allowMediaSingle: true,
    },
  },
});

test.describe('media single with external media in extended resize experience', () => {
  test.describe('external media was created under legacy experience', () => {
    test.use({
      adf: legacyExternalImage,
      platformFeatureFlags: {
        'platform.editor.media.extended-resize-experience': true,
      },
    });

    test('should show the migration ui', async ({ editor }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const firstMedia = nodes.mediaSingle.first();
      const mediaSingleModel = EditorMediaSingleNextModel.from(firstMedia);
      await mediaSingleModel.waitForReady();
      await test.step('should show legacy notification', async () => {
        await expect(mediaSingleModel.legacyNotification).toBeVisible();
      });

      await firstMedia.click();
      const floatingToolbar = EditorFloatingToolbarModel.from(
        editor,
        mediaSingleModel,
      );

      await test.step('should show migration cta in floating toolbar', async () => {
        // first media has 600x400 dimensions external media
        await expect(floatingToolbar.migrationButton).toBeVisible();
      });
    });
  });

  test.describe('exterinal media with differnet dimensions', () => {
    test.use({
      adf: threeExternalImages,
      platformFeatureFlags: {
        'platform.editor.media.extended-resize-experience': true,
      },
    });

    test('should not show the migration ui', async ({ editor }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const firstMedia = nodes.mediaSingle.nth(0);
      const mediaSingleModel = EditorMediaSingleNextModel.from(firstMedia);
      await mediaSingleModel.waitForReady();
      await test.step('should not show legacy notification', async () => {
        await expect(mediaSingleModel.legacyNotification).toHaveCount(0);
      });

      await firstMedia.click();
      const floatingToolbar = EditorFloatingToolbarModel.from(
        editor,
        mediaSingleModel,
      );

      await test.step('should show correct media pixels in floating toolbar', async () => {
        // first media has 600x400 dimensions in media node
        // however, we default media single node width to 250, so the image will be shrinked.
        await expect(floatingToolbar.widthInputField).toHaveValue('250');
        await expect(floatingToolbar.heightInputField).toHaveValue('167');
      });
    });

    test('should render default size of media single node for large image', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const secondMedia = nodes.mediaSingle.nth(1);
      const mediaSingleModel = EditorMediaSingleNextModel.from(secondMedia);
      await mediaSingleModel.waitForReady();
      await secondMedia.click();
      const floatingToolbar = EditorFloatingToolbarModel.from(
        editor,
        mediaSingleModel,
      );

      await test.step('should show correct media pixels in floating toolbar', async () => {
        // second media has 1280x800 dimensions external media
        // however, we default media single node width to 250, so the image will be shrinked.
        await expect(floatingToolbar.widthInputField).toHaveValue('250');
        await expect(floatingToolbar.heightInputField).toHaveValue('156');
      });
    });

    test('should render default size of media single node for small image', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const thirdMedia = nodes.mediaSingle.nth(2);
      const mediaSingleModel = EditorMediaSingleNextModel.from(thirdMedia);
      await mediaSingleModel.waitForReady();
      await thirdMedia.click();
      const floatingToolbar = EditorFloatingToolbarModel.from(
        editor,
        mediaSingleModel,
      );

      await test.step('should show correct media pixels in floating toolbar', async () => {
        // third media have attr width 200 and height 150 already defined.
        // however, we default media single node width to 250, so the image will be enlarged.
        await expect(floatingToolbar.widthInputField).toHaveValue('250');
        await expect(floatingToolbar.heightInputField).toHaveValue('188');
      });
    });
  });
});
