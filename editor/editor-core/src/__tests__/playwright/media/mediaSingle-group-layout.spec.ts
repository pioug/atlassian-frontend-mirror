import {
  editorTestCase as test,
  expect,
  EditorNodeContainerModel,
  EditorMediaSingleNextModel,
  EditorFloatingToolbarModel,
} from '@af/editor-libra';
import { oneImage } from './__fixtures__/adf-documents';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  mediaSingle as mediaSingleNode,
  media,
  p,
} from '@atlaskit/editor-test-helpers/doc-builder';

test.use({
  editorProps: {
    appearance: 'full-page',
    media: {
      allowMediaSingle: true,
    },
  },
});

test.describe('Media floating toolbar with grouped layout experience', () => {
  test.use({
    adf: oneImage,
    platformFeatureFlags: {
      'platform.editor.media.grouped-layout': true,
    },
  });

  test('Grouped layout works as expected with mouse', async ({ editor }) => {
    const { mediaSingle } = EditorNodeContainerModel.from(editor);

    const mediaSingleModel = EditorMediaSingleNextModel.from(mediaSingle);
    await mediaSingle.first().click();
    const floatingToolbar = EditorFloatingToolbarModel.from(
      editor,
      mediaSingleModel,
    );

    const trigger = floatingToolbar.layoutDropdownTriggerButton;
    const dropdown = floatingToolbar.layoutDropdown;

    await test.step('it triggers dropdown upon click', async () => {
      await expect(trigger).toBeVisible();

      await trigger.click();
      await expect(dropdown).toBeVisible();
    });

    await test.step('each dropdown items update alignment upon click', async () => {
      const alignLeftButton = dropdown.locator(
        'button[aria-label="Align left"]',
      );
      await alignLeftButton.click();

      await expect(editor).toMatchDocument(
        doc(
          mediaSingleNode({
            layout: 'align-start',
            width: 50,
          })(
            media({
              id: 'a559980d-cd47-43e2-8377-27359fcb905f',
              type: 'file',
              collection: 'MediaServicesSample',
              width: 2378,
              height: 628,
              __contextId: 'DUMMY-OBJECT-ID',
              __fileMimeType: expect.any(String),
              __fileName: expect.any(String),
              __fileSize: expect.any(Number),
            })(),
          ),
          p(),
        ),
      );
    });
  });

  test('Grouped layout works as expected with keyboard', async ({ editor }) => {
    const { mediaSingle } = EditorNodeContainerModel.from(editor);

    const mediaSingleModel = EditorMediaSingleNextModel.from(mediaSingle);
    await mediaSingle.first().click();
    const floatingToolbar = EditorFloatingToolbarModel.from(
      editor,
      mediaSingleModel,
    );

    const trigger = floatingToolbar.layoutDropdownTriggerButton;
    const dropdown = floatingToolbar.layoutDropdown;

    await test.step('it triggers dropdown upon Enter', async () => {
      await expect(trigger).toBeVisible();

      await trigger.press('Enter');
      await expect(dropdown).toBeVisible();
    });

    await test.step('each dropdown items update alignment upon click', async () => {
      const wrapRightButton = dropdown.locator(
        'button[aria-label="Wrap right"]',
      );
      await wrapRightButton.press('Enter');

      await expect(editor).toMatchDocument(
        doc(
          mediaSingleNode({
            layout: 'wrap-right',
            width: 50,
          })(
            media({
              id: 'a559980d-cd47-43e2-8377-27359fcb905f',
              type: 'file',
              collection: 'MediaServicesSample',
              width: 2378,
              height: 628,
              __contextId: 'DUMMY-OBJECT-ID',
              __fileMimeType: expect.any(String),
              __fileName: expect.any(String),
              __fileSize: expect.any(Number),
            })(),
          ),
          p(),
        ),
      );
    });
  });
});
