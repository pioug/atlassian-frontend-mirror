import {
  EditorExtensionModel,
  EditorNodeContainerModel,
  EditorUploadMediaModel,
  EditorInsertMenuModel,
  FileResourcesAvailable,
  EditorMainToolbarModel,
  editorTestCase as test,
  expect,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  mediaSingle,
  media,
  p,
  bodiedExtension,
  inlineExtension,
} from '@atlaskit/editor-test-helpers/doc-builder';

test.describe('extension', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowExtension: {
        allowBreakout: true,
      },
      allowLayouts: true,
      media: {
        allowMediaSingle: true,
      },
    },
  });

  test(`insert-extension.ts: Extension: Insert Inline extension`, async ({
    editor,
  }) => {
    // insert bodied macro
    const toolbar = EditorMainToolbarModel.from(editor);
    await toolbar.openInsertMenu();
    const insertMenu = EditorInsertMenuModel.from(editor);
    await insertMenu.clickAt('Inline macro (EH)');

    // match document
    await editor.waitForEditorStable();
    await expect(editor).toMatchDocument(
      doc(
        p(
          inlineExtension({
            extensionKey: 'inline-eh',
            extensionType: 'com.atlassian.confluence.macro.core',
            localId: 'testId',
            parameters: {
              macroMetadata: {
                placeholder: [
                  {
                    data: {
                      url: '',
                    },
                    type: 'icon',
                  },
                ],
              },
              macroParams: {},
            },
            text: 'Inline extension demo',
          })(),
        ),
      ),
    );
  });

  test(`insert-extension.ts: Extension: Insert Block extension`, async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const extensionModel = EditorExtensionModel.from(nodes.bodiedExtension);

    // insert bodied macro
    const toolbar = EditorMainToolbarModel.from(editor);
    await toolbar.openInsertMenu();
    const insertMenu = EditorInsertMenuModel.from(editor);
    await insertMenu.clickAt('Bodied macro (EH)');
    await extensionModel.waitForStable();

    // match document
    await editor.waitForEditorStable();
    await expect(editor).toMatchDocument(
      doc(
        bodiedExtension({
          extensionType: 'com.atlassian.confluence.macro.core',
          extensionKey: 'bodied-eh',
          layout: 'default',
          localId: 'testId',
          parameters: {
            macroMetadata: {
              placeholder: [
                {
                  data: {
                    url: '',
                  },
                  type: 'icon',
                },
              ],
            },
            macroParams: {},
          },
        })(p()),
      ),
    );
  });

  test(`quick-insert.ts: Extension: Quick Insert`, async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const extensionModel = EditorExtensionModel.from(nodes.bodiedExtension);

    await editor.typeAhead.searchAndInsert('Bodied macro (EH)');
    await extensionModel.waitForStable();

    // match document
    await editor.waitForEditorStable();
    await expect(editor).toMatchDocument(
      doc(
        bodiedExtension({
          extensionType: 'com.atlassian.confluence.macro.core',
          extensionKey: 'bodied-eh',
          layout: 'default',
          localId: 'testId',
          parameters: {
            macroMetadata: {
              placeholder: [
                {
                  data: {
                    url: '',
                  },
                  type: 'icon',
                },
              ],
            },
            macroParams: {},
          },
        })(p()),
      ),
    );
  });

  test(`bodied-insert-media.ts: Bodied Extension: Insert Media`, async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const extensionModel = EditorExtensionModel.from(nodes.bodiedExtension);
    const toolbar = EditorMainToolbarModel.from(editor);
    const uploadModel = EditorUploadMediaModel.from(editor);

    // insert bodied macro
    await toolbar.openInsertMenu();
    const insertMenu = EditorInsertMenuModel.from(editor);
    await insertMenu.clickAt('Bodied macro (EH)');
    await extensionModel.waitForStable();

    // upload media
    await uploadModel.upload({
      actionToTriggerUpload: async () => {
        await editor.typeAhead.searchAndInsert('File');
      },
      fileToUpload: FileResourcesAvailable.SMALL_IMAGE_9_KB,
    });

    // match document
    await editor.waitForEditorStable();
    await expect(editor).toMatchDocument(
      doc(
        bodiedExtension({
          extensionType: 'com.atlassian.confluence.macro.core',
          extensionKey: 'bodied-eh',
          layout: 'default',
          localId: 'testId',
          parameters: {
            macroMetadata: {
              placeholder: [
                {
                  data: {
                    url: '',
                  },
                  type: 'icon',
                },
              ],
            },
            macroParams: {},
          },
        })(
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
              alt: '',
            })(),
          ),
          p(),
        ),
      ),
    );
  });

  test('layouts.ts: Extension: changes layout', async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const extensionModel = EditorExtensionModel.from(nodes.bodiedExtension);
    const extensionLayoutModel = await extensionModel.layout(editor);

    // insert bodied macro
    const toolbar = EditorMainToolbarModel.from(editor);
    await toolbar.openInsertMenu();
    const insertMenu = EditorInsertMenuModel.from(editor);
    await insertMenu.clickAt('Bodied macro (EH)');
    await extensionModel.waitForStable();

    await test.step('change layout to wide', async () => {
      await extensionLayoutModel.toWide();
      await editor.waitForEditorStable();
      await expect(editor).toMatchDocument(
        doc(
          bodiedExtension({
            extensionType: 'com.atlassian.confluence.macro.core',
            extensionKey: 'bodied-eh',
            layout: 'wide',
            localId: 'testId',
            parameters: {
              macroMetadata: {
                placeholder: [
                  {
                    data: {
                      url: '',
                    },
                    type: 'icon',
                  },
                ],
              },
              macroParams: {},
            },
          })(p()),
        ),
      );
    });

    await test.step('change layout to full width', async () => {
      await extensionLayoutModel.toFullWidth();
      await editor.waitForEditorStable();
      await expect(editor).toMatchDocument(
        doc(
          bodiedExtension({
            extensionType: 'com.atlassian.confluence.macro.core',
            extensionKey: 'bodied-eh',
            layout: 'full-width',
            localId: 'testId',
            parameters: {
              macroMetadata: {
                placeholder: [
                  {
                    data: {
                      url: '',
                    },
                    type: 'icon',
                  },
                ],
              },
              macroParams: {},
            },
          })(p()),
        ),
      );
    });

    await test.step('change layout to center', async () => {
      await extensionLayoutModel.toCenter();
      await editor.waitForEditorStable();
      await expect(editor).toMatchDocument(
        doc(
          bodiedExtension({
            extensionType: 'com.atlassian.confluence.macro.core',
            extensionKey: 'bodied-eh',
            layout: 'default',
            localId: 'testId',
            parameters: {
              macroMetadata: {
                placeholder: [
                  {
                    data: {
                      url: '',
                    },
                    type: 'icon',
                  },
                ],
              },
              macroParams: {},
            },
          })(p()),
        ),
      );
    });
  });
});
