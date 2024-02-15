import {
  EditorExtensionModel,
  EditorFloatingToolbarModel,
  EditorNodeContainerModel,
  EditorTableModel,
  expect,
  editorTestCase as test,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  extensionFrame,
  multiBodiedExtension,
  p,
} from '@atlaskit/editor-test-helpers/doc-builder';

import {
  mbeAdfWithACodeBlock,
  mbeAdfWithAnInnerPanel,
  mbeAdfWithAnInnerTable,
  mbeAdfWithBodiedExtension,
} from './mbe-delete-inner-macros.spec.ts-fixtures';

test.describe('Inner Macros MBE', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowPanel: true,
      allowRule: true,
      media: {
        allowMediaSingle: true,
        allowMediaGroup: true,
      },
      allowExtension: {
        allowBreakout: true,
        allowAutoSave: true,
        allowExtendFloatingToolbars: true,
      },
      allowFragmentMark: true,
      insertMenuItems: [],
      allowTables: true,
      allowTextAlignment: true,
      smartLinks: {
        allowBlockCards: true,
        allowEmbeds: true,
      },
    },
    editorMountOptions: {
      withConfluenceMacrosExtensionProvider: true,
    },
    platformFeatureFlags: {
      'platform.editor.multi-bodied-extension_0rygg': true,
    },
  });

  test.describe('on deleting a table', () => {
    test.use({ adf: mbeAdfWithAnInnerTable });
    test('should be deleted', async ({ editor }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);

      await tableModel.selectTable();
      await tableModel.isSelected();
      await editor.keyboard.press('Backspace');

      await expect(editor).toMatchDocument(
        doc(
          multiBodiedExtension({
            extensionKey: 'fake_tabs.com:fakeTabNode',
            extensionType: 'com.atlassian.confluence.',
            layout: 'default',
            localId: expect.any(String),
            maxFrames: 5,
            parameters: {
              activeTabIndex: 0,
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
          })(extensionFrame()(p())),
        ),
      );
    });
  });

  test.describe('on deleting a panel', () => {
    test.use({ adf: mbeAdfWithAnInnerPanel });
    test('should be deleted', async ({ editor }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      await nodes.panel.first().hover();
      await nodes.panel.first().click();
      await editor.keyboard.press('Backspace');

      await expect(editor).toMatchDocument(
        doc(
          multiBodiedExtension({
            extensionKey: 'fake_tabs.com:fakeTabNode',
            extensionType: 'com.atlassian.confluence.',
            layout: 'default',
            localId: expect.any(String),
            maxFrames: 5,
            parameters: {
              activeTabIndex: 0,
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
          })(extensionFrame()(p())),
        ),
      );
    });
  });

  test.describe('on deleting a code-block', () => {
    test.use({ adf: mbeAdfWithACodeBlock });
    test('should be deleted', async ({ editor }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      await nodes.codeBlock.first().hover();
      await nodes.codeBlock.first().click();
      await editor.keyboard.press('Backspace');

      await expect(editor).toMatchDocument(
        doc(
          multiBodiedExtension({
            extensionKey: 'fake_tabs.com:fakeTabNode',
            extensionType: 'com.atlassian.confluence.',
            layout: 'default',
            localId: expect.any(String),
            maxFrames: 5,
            parameters: {
              activeTabIndex: 0,
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
          })(extensionFrame()(p())),
        ),
      );
    });
  });

  test.describe('on deleting a bodiedExtension', () => {
    test.use({ adf: mbeAdfWithBodiedExtension });
    test('should be deleted', async ({ editor }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const bodiedExtension = EditorExtensionModel.from(
        nodes.bodiedExtension.first(),
      );

      const bodiedExtensionToolbar = EditorFloatingToolbarModel.from(
        editor,
        bodiedExtension,
      );
      await editor.waitForEditorStable();
      await bodiedExtension.waitForStable();
      await bodiedExtension.clickTitle();
      await editor.waitForEditorStable();

      await bodiedExtensionToolbar.isVisible();

      await bodiedExtensionToolbar.remove();

      await expect(editor).toMatchDocument(
        doc(
          multiBodiedExtension({
            extensionKey: 'fake_tabs.com:fakeTabNode',
            extensionType: 'com.atlassian.confluence.',
            layout: 'default',
            localId: expect.any(String),
            maxFrames: 5,
            parameters: {
              activeTabIndex: 0,
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
          })(extensionFrame()(p())),
        ),
      );
    });
  });
});
