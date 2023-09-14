import {
  FileResourcesAvailable,
  editorTestCase as test,
  EditorUploadMediaModel,
  expect,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  mediaGroup,
  media,
  p,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { emptyDocument } from './__fixtures__/adf-documents';

test.use({
  editorProps: {
    appearance: 'full-page',
    media: {
      allowMediaSingle: true,
      allowMediaGroup: true,
    },
    allowPanel: true,
    allowNewInsertionBehaviour: true,
  },
});

test.describe('media-group', () => {
  test.use({
    adf: emptyDocument,
  });

  test.describe('should be able to insert media group', () => {
    test('inserting single non-image media', async ({ editor }) => {
      await editor.keyboard.type('Hello');
      await editor.keyboard.press('Enter');

      await EditorUploadMediaModel.from(editor).upload({
        actionToTriggerUpload: async () => {
          await editor.typeAhead.searchAndInsert('File');
        },
        fileToUpload: FileResourcesAvailable.TEXT_FILE,
      });
      await expect(editor).toMatchDocument(
        doc(
          p('Hello'),
          mediaGroup(
            media({
              __contextId: 'DUMMY-OBJECT-ID',
              __fileMimeType: 'text/plain',
              __fileName: 'test.txt',
              __fileSize: 3541,
              id: expect.any(String),
              collection: 'MediaServicesSample',
              type: 'file',
            })(),
          ),
          p(''),
        ),
      );
    });
    test('inserting multiple non-image media', async ({ editor }) => {
      await editor.keyboard.type('Hello');
      await editor.keyboard.press('Enter');

      await EditorUploadMediaModel.from(editor).upload({
        actionToTriggerUpload: async () => {
          await editor.typeAhead.searchAndInsert('File');
        },
        fileToUpload: FileResourcesAvailable.TEXT_FILE,
      });

      await EditorUploadMediaModel.from(editor).upload({
        actionToTriggerUpload: async () => {
          await editor.typeAhead.searchAndInsert('Image');
        },
        fileToUpload: FileResourcesAvailable.PDF_FILE,
      });

      await EditorUploadMediaModel.from(editor).upload({
        actionToTriggerUpload: async () => {
          await editor.typeAhead.searchAndInsert('Image');
        },
        fileToUpload: FileResourcesAvailable.EXCEL_FILE,
      });
      await expect(editor).toMatchDocument(
        doc(
          p('Hello'),
          mediaGroup(
            media({
              __contextId: 'DUMMY-OBJECT-ID',
              __fileMimeType: 'application/vnd.ms-excel',
              __fileName: 'test.xls',
              __fileSize: 20480,
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
            media({
              __contextId: 'DUMMY-OBJECT-ID',
              __fileMimeType: 'text/plain',
              __fileName: 'test.txt',
              __fileSize: 3541,
              id: expect.any(String),
              collection: 'MediaServicesSample',
              type: 'file',
            })(),
          ),
          p(''),
        ),
      );
    });
  });
});
