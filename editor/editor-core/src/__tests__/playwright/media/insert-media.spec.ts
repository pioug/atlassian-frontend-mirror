import {
  EditorMediaGroupModel,
  EditorNodeContainerModel,
  EditorUploadMediaModel,
  FileResourcesAvailable,
  editorTestCase as test,
  expect,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  mediaSingle,
  mediaGroup,
  media,
  p,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { simpleMediaGroup } from './insert-media.spec.ts-fixtures';

test.describe('media-group: inserting', () => {
  test.use({
    editorProps: {
      appearance: 'comment',

      media: {
        allowMediaSingle: false,
        allowMediaGroup: true,
      },
    },
  });

  test('insert-and-delete-mediaGroup.ts: Inserts and deletes media group on comment', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const uploadModel = EditorUploadMediaModel.from(editor);
    const mediaGroupModel = EditorMediaGroupModel.from(nodes.mediaGroup);
    const firstMedia = nodes.media.first();

    await editor.keyboard.type('some text ');

    await uploadModel.upload({
      actionToTriggerUpload: async () => {
        await editor.typeAhead.searchAndInsert('Image');
      },
      fileToUpload: FileResourcesAvailable.PDF_FILE,
    });

    await uploadModel.upload({
      actionToTriggerUpload: async () => {
        await editor.typeAhead.searchAndInsert('Image');
      },
      fileToUpload: FileResourcesAvailable.EXCEL_FILE,
    });

    await editor.waitForEditorStable();
    await firstMedia.click();
    await firstMedia.hover();
    const cardActions = await mediaGroupModel.cardActions(0);

    await cardActions.deleteAction.hover();
    await cardActions.deleteAction.click();

    await editor.waitForEditorStable();
    await expect(editor).toMatchDocument(
      doc(
        p('some text '),
        mediaGroup(
          media({
            __contextId: 'DUMMY-OBJECT-ID',
            __fileMimeType: 'application/pdf',
            __fileName: 'test.pdf',
            __fileSize: expect.any(Number),
            id: expect.any(String),
            collection: 'MediaServicesSample',
            type: 'file',
          })(),
        ),
        p(''),
      ),
    );

    await firstMedia.click();
    await firstMedia.hover();

    await cardActions.deleteAction.hover();
    await cardActions.deleteAction.click();

    await editor.waitForEditorStable();
    await expect(editor).toHaveDocument(doc(p('some text '), p('')));
  });

  test.describe('with media group', () => {
    test.use({
      adf: simpleMediaGroup,
    });

    test('Initialises correctly with a single media group on comment', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);

      await expect(nodes.media.first()).toBeVisible();

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
          p(),
        ),
      );
    });
  });

  test('insert-mediaGroup.ts: Inserts multiple media group with non-image files', async ({
    editor,
  }) => {
    const uploadModel = EditorUploadMediaModel.from(editor);

    await editor.keyboard.type('some text ');

    await uploadModel.upload({
      actionToTriggerUpload: async () => {
        await editor.typeAhead.searchAndInsert('File');
      },
      fileToUpload: FileResourcesAvailable.PDF_FILE,
    });

    await uploadModel.upload({
      actionToTriggerUpload: async () => {
        await editor.typeAhead.searchAndInsert('File');
      },
      fileToUpload: FileResourcesAvailable.EXCEL_FILE,
    });

    await uploadModel.upload({
      actionToTriggerUpload: async () => {
        await editor.typeAhead.searchAndInsert('File');
      },
      fileToUpload: FileResourcesAvailable.TEXT_FILE,
    });

    await editor.waitForEditorStable();

    await expect(editor).toMatchDocument(
      doc(
        p('some text '),
        mediaGroup(
          media({
            __contextId: 'DUMMY-OBJECT-ID',
            __fileMimeType: 'text/plain',
            __fileName: 'test.txt',
            __fileSize: expect.any(Number),
            id: expect.any(String),
            collection: 'MediaServicesSample',
            type: 'file',
          })(),
          media({
            __contextId: 'DUMMY-OBJECT-ID',
            __fileMimeType: 'application/vnd.ms-excel',
            __fileName: 'test.xls',
            __fileSize: expect.any(Number),
            id: expect.any(String),
            collection: 'MediaServicesSample',
            type: 'file',
          })(),
          media({
            __contextId: 'DUMMY-OBJECT-ID',
            __fileMimeType: 'application/pdf',
            __fileName: 'test.pdf',
            __fileSize: expect.any(Number),
            id: expect.any(String),
            collection: 'MediaServicesSample',
            type: 'file',
          })(),
        ),
        p(),
      ),
    );
  });

  test('insert-mediaGroup.ts: Inserts one media group with non-image files', async ({
    editor,
  }) => {
    const uploadModel = EditorUploadMediaModel.from(editor);

    await editor.keyboard.type('some text ');

    await uploadModel.upload({
      actionToTriggerUpload: async () => {
        await editor.typeAhead.searchAndInsert('File');
      },
      fileToUpload: FileResourcesAvailable.PDF_FILE,
    });
    await editor.waitForEditorStable();

    await expect(editor).toMatchDocument(
      doc(
        p('some text '),
        mediaGroup(
          media({
            __contextId: 'DUMMY-OBJECT-ID',
            __fileMimeType: 'application/pdf',
            __fileName: 'test.pdf',
            __fileSize: expect.any(Number),
            id: expect.any(String),
            collection: 'MediaServicesSample',
            type: 'file',
          })(),
        ),
        p(),
      ),
    );
  });
});

test.describe('media-single: inserting', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',

      media: {
        allowMediaSingle: true,
        allowMediaGroup: true,
      },
    },
  });

  test('insert-mediaSingle.ts: Inserts a media single on fullpage', async ({
    editor,
  }) => {
    const uploadModel = EditorUploadMediaModel.from(editor);

    await editor.keyboard.type('some text ');

    await uploadModel.upload({
      actionToTriggerUpload: async () => {
        await editor.typeAhead.searchAndInsert('Image');
      },
      fileToUpload: FileResourcesAvailable.SMALL_IMAGE_9_KB,
    });

    await expect(editor).toMatchDocument(
      doc(
        p('some text '),
        mediaSingle()(
          media({
            __contextId: 'DUMMY-OBJECT-ID',
            __fileMimeType: expect.any(String),
            __fileName: 'test-image-9kb.jpg',
            __fileSize: expect.any(Number),
            width: expect.any(Number),
            height: expect.any(Number),
            id: expect.any(String),
            collection: 'MediaServicesSample',
            type: 'file',
          })(),
        ),
      ),
    );
  });

  test.describe('when the alignLeftOnInsert prop is true', () => {
    test.use({
      editorProps: {
        appearance: 'full-page',

        media: {
          alignLeftOnInsert: true,
          allowMediaSingle: true,
          allowMediaGroup: true,
        },
      },
    });

    test('insert-mediaSingle.ts: Inserts media single on left', async ({
      editor,
    }) => {
      const uploadModel = EditorUploadMediaModel.from(editor);

      await editor.keyboard.type('some text ');

      await uploadModel.upload({
        actionToTriggerUpload: async () => {
          await editor.typeAhead.searchAndInsert('Image');
        },
        fileToUpload: FileResourcesAvailable.SMALL_IMAGE_9_KB,
      });

      await expect(editor).toMatchDocument(
        doc(p('some text '), mediaSingle({ layout: 'align-start' }).any),
      );
    });
  });

  test.describe('on comment', () => {
    test.use({
      editorProps: {
        appearance: 'comment',

        media: {
          allowMediaSingle: true,
          allowMediaGroup: true,
        },
      },
    });

    test('insert-mediaSingle.ts: Inserts a media single on comment', async ({
      editor,
    }) => {
      const uploadModel = EditorUploadMediaModel.from(editor);

      await editor.keyboard.type('some text ');

      await uploadModel.upload({
        actionToTriggerUpload: async () => {
          await editor.typeAhead.searchAndInsert('Image');
        },
        fileToUpload: FileResourcesAvailable.SMALL_IMAGE_9_KB,
      });

      await expect(editor).toMatchDocument(
        doc(
          p('some text '),
          mediaSingle({ layout: 'align-start' })(
            media({
              __contextId: 'DUMMY-OBJECT-ID',
              __fileMimeType: expect.any(String),
              __fileName: 'test-image-9kb.jpg',
              __fileSize: expect.any(Number),
              width: expect.any(Number),
              height: expect.any(Number),
              id: expect.any(String),
              collection: 'MediaServicesSample',
              type: 'file',
            })(),
          ),
          p(),
        ),
      );
    });
  });
});
