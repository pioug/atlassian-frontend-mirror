import {
  EditorMainToolbarModel,
  EditorMediaSingleNextModel,
  EditorNodeContainerModel,
  EditorUploadMediaModel,
  expect,
  FileResourcesAvailable,
  editorTestCase as test,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  code_block,
  doc,
  media,
  mediaGroup,
  mediaSingle,
  p,
  panel,
  taskItem,
  taskList,
} from '@atlaskit/editor-test-helpers/doc-builder';

import {
  infoPanelADF,
  infoPanelADFWithContentsAbove,
} from './panel.spec.ts-fixtures';

test.describe('Enable Media, action, code-block, rule and decision inside panel', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowPanel: true,
    },
    platformFeatureFlags: {
      'platform.editor.allow-extended-panel': true,
    },
    adf: infoPanelADF,
  });

  test('should insert action inside a panel', async ({ editor }) => {
    await editor.selection.set({ anchor: 2, head: 2 });

    const toolbar = EditorMainToolbarModel.from(editor);
    await toolbar.clickAt('Action item');

    await editor.keyboard.type('action item');

    await expect(editor).toMatchDocument(
      doc(
        panel({ panelType: 'info' })(
          taskList({})(taskItem({ state: 'TODO' })('action item')),
        ),
      ),
    );
  });

  test('should insert code snippet inside a panel', async ({ editor }) => {
    await editor.selection.set({ anchor: 2, head: 2 });
    await editor.keyboard.type('/Code');
    await editor.keyboard.press('Enter');

    await expect(editor).toMatchDocument(
      doc(panel({ panelType: 'info' })(code_block({})())),
    );
  });
});

test.describe('Insering media into an empty panel', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowPanel: true,
      media: {
        allowMediaSingle: true,
        allowMediaGroup: true,
      },
    },
    platformFeatureFlags: {
      'platform.editor.allow-extended-panel': true,
    },
    adf: infoPanelADF,
  });

  test('should insert a media single into an empty panel without replacing the panel', async ({
    editor,
  }) => {
    await editor.selection.set({ anchor: 2, head: 2 });

    const uploadModel = EditorUploadMediaModel.from(editor);
    await uploadModel.upload({
      actionToTriggerUpload: async () => {
        await editor.typeAhead.searchAndInsert('Image');
      },
      fileToUpload: FileResourcesAvailable.SMALL_IMAGE_9_KB,
    });

    expect(editor).toMatchDocument(
      doc(
        panel({ panelType: 'info' })(
          p(),
          mediaSingle()(
            media({
              __contextId: 'DUMMY-OBJECT-ID',
              __fileMimeType: 'image/jpeg',
              __fileName: 'test-image-9kb.jpg',
              __fileSize: 8751,
              width: 860,
              height: 359,
              id: expect.any(String),
              alt: 'test-image-9kb.jpg',
              collection: 'MediaServicesSample',
              type: 'file',
            })(),
          ),
          p(),
        ),
      ),
    );
  });

  test('should render the media group node as block node inside the panel', async ({
    editor,
  }) => {
    await editor.selection.set({ anchor: 2, head: 2 });

    const uploadModel = EditorUploadMediaModel.from(editor);
    await uploadModel.upload({
      actionToTriggerUpload: async () => {
        await editor.typeAhead.searchAndInsert('Image');
      },
      fileToUpload: FileResourcesAvailable.PDF_FILE,
    });
    expect(editor).toMatchDocument(
      doc(
        panel({ panelType: 'info' })(
          mediaGroup(
            media({
              __contextId: 'DUMMY-OBJECT-ID',
              __fileMimeType: expect.any(String),
              __fileName: 'test.pdf',
              __fileSize: expect.any(Number),
              id: expect.any(String),
              collection: 'MediaServicesSample',
              type: 'file',
            })(),
          ),
          p(),
        ),
      ),
    );
  });
});

test.describe('Resizing media inside and outside panel', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowPanel: true,
      media: {
        allowMediaSingle: true,
        allowMediaGroup: true,
      },
    },
    platformFeatureFlags: {
      'platform.editor.allow-extended-panel': true,
    },
    adf: infoPanelADF,
  });

  test('should not show grid lines if image is resized inside a panel', async ({
    editor,
  }) => {
    await editor.selection.set({ anchor: 2, head: 2 });
    await editor.keyboard.type('Insert image in panel ');

    const uploadModel = EditorUploadMediaModel.from(editor);
    await uploadModel.upload({
      actionToTriggerUpload: async () => {
        await editor.typeAhead.searchAndInsert('Image');
      },
      fileToUpload: FileResourcesAvailable.SMALL_IMAGE_9_KB,
    });

    const nodes = EditorNodeContainerModel.from(editor);
    const firstMedia = nodes.mediaSingle.first();
    const mediaSingleModel = EditorMediaSingleNextModel.from(firstMedia);
    await mediaSingleModel.waitForReady();

    await mediaSingleModel.leftResizeHandleClicker.hover();
    await editor.page.mouse.down();

    await expect(editor.page.locator('.gridLine').first()).toBeHidden();

    await editor.page.mouse.up();
  });

  test('should show grid lines if image is resized inside outside panel', async ({
    editor,
  }) => {
    await editor.selection.set({ anchor: 2, head: 2 });
    await editor.keyboard.press('Enter');

    const uploadModel = EditorUploadMediaModel.from(editor);
    await uploadModel.upload({
      actionToTriggerUpload: async () => {
        await editor.typeAhead.searchAndInsert('Image');
      },
      fileToUpload: FileResourcesAvailable.SMALL_IMAGE_9_KB,
    });

    const nodes = EditorNodeContainerModel.from(editor);
    const firstMedia = nodes.mediaSingle.first();
    const mediaSingleModel = EditorMediaSingleNextModel.from(firstMedia);
    await mediaSingleModel.waitForReady();

    await mediaSingleModel.leftResizeHandleClicker.hover();
    await editor.page.mouse.down();

    await expect(editor.page.locator('.gridLine').first()).toBeVisible();

    await editor.page.mouse.up();
  });
});

test.describe('Inserting codeblock inside a panel with other contents above', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowPanel: true,
    },
    platformFeatureFlags: {
      'platform.editor.allow-extended-panel': true,
    },
    adf: infoPanelADFWithContentsAbove,
  });

  test('should insert code snippet inside a panel with selection check', async ({
    editor,
  }) => {
    await editor.selection.set({ anchor: 10, head: 10 });
    await editor.keyboard.type('/Code');
    await editor.keyboard.press('Enter');

    await expect(editor).toMatchDocument(
      doc(p('para 1'), panel({ panelType: 'info' })(code_block({})())),
    );
    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 10,
      head: 10,
    });
  });
});

test.describe('coping action from inside a panel and pasting into an empty panel', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowPanel: true,
    },
    platformFeatureFlags: {
      'platform.editor.allow-extended-panel': true,
      'platform.editor.handle-paste-for-action-in-panel': true,
    },
    adf: infoPanelADF,
  });

  test('should not replace the panel', async ({ editor }) => {
    await editor.selection.set({ anchor: 2, head: 2 });
    await editor.simulatePasteEvent({
      pasteAs: 'text/html',
      html: `<meta charset='utf-8'><div data-node-type="actionList" data-task-list-local-id="test-id-1" style="list-style: none; padding-left: 0" data-pm-slice="2 2 [&quot;panel&quot;,{&quot;panelType&quot;:&quot;info&quot;,&quot;panelIcon&quot;:null,&quot;panelIconId&quot;:null,&quot;panelIconText&quot;:null,&quot;panelColor&quot;:null}]"><div data-task-local-id="test-id-2" data-task-state="TODO">a</div><div data-task-local-id="test-id-3" data-task-state="TODO">b</div></div>`,
    });

    await expect(editor).toMatchDocument(
      doc(
        panel()(
          taskList({ localId: 'test-id-1' })(
            taskItem({ localId: 'test-id-2' })('a'),
            taskItem({ localId: 'test-id-3' })('b'),
          ),
        ),
      ),
    );
    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 7,
      head: 7,
    });
  });
});
