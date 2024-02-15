import {
  EditorMultiBodiedExtensionModel,
  EditorNodeContainerModel,
  expect,
  editorTestCase as test,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  extensionFrame,
  layoutColumn,
  layoutSection,
  multiBodiedExtension,
  p,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { adfWithSingleTab } from './multi-bodied-extensions.spec.ts-fixtures';

test.describe('Layout nodes should not be allowed inside the MBE', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowExtension: {
        allowBreakout: true,
      },
      allowFragmentMark: true,
      insertMenuItems: [],
      allowLayouts: true,
      allowNewInsertionBehaviour: true,
    },
    editorMountOptions: {
      withConfluenceMacrosExtensionProvider: true,
      extensionHandlers: true,
    },
    platformFeatureFlags: {
      'platform.editor.multi-bodied-extension_0rygg': true,
    },
  });
  test.use({ adf: adfWithSingleTab });

  test('layout node inside the extension should be safely inserted below the MBE node via toolbar', async ({
    editor,
  }) => {
    await editor.selection.set({ anchor: 3, head: 7 });
    await editor.typeAhead.searchAndInsert('layout');
    await expect(editor).toHaveDocument(
      doc(
        multiBodiedExtension({
          extensionKey: 'fake_tabs.com:fakeTabNode',
          extensionType: 'com.atlassian.confluence.',
          layout: 'default',
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
        })(extensionFrame()(p(''))),
        layoutSection(
          layoutColumn({ width: 50 })(p('')),
          layoutColumn({ width: 50 })(p('')),
        ),
      ),
    );
  });

  test.describe('When copying pasting the layout node from outside MBE inside the editor', () => {
    test.fixme(
      'copy/paste layout node inside the extension should be safely inserted below the MBE node',
      async ({ editor }) => {
        await editor.selection.setCursor({ position: 1 });
        await editor.keyboard.press('ArrowUp');
        await editor.keyboard.press('Enter');
        await editor.typeAhead.searchAndInsert('Layouts');
        await editor.selection.set({ anchor: 0, head: 11 });
        await editor.keyboard.press('Meta+c');

        const nodes = EditorNodeContainerModel.from(editor);
        const MBEmodel = EditorMultiBodiedExtensionModel.from(
          nodes.multiBodiedExtension.first(),
        );
        await MBEmodel.tabButtons.nth(0).click();
        await editor.selection.set({ anchor: 12, head: 19 });
        await editor.keyboard.press('Meta+v');
        await expect(editor).toHaveDocument(
          doc(
            layoutSection(
              layoutColumn({ width: 50 })(p('')),
              layoutColumn({ width: 50 })(p('')),
            ),
            multiBodiedExtension({
              extensionKey: 'fake_tabs.com:fakeTabNode',
              extensionType: 'com.atlassian.confluence.',
              layout: 'default',
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
            })(extensionFrame()(p('Test'))),
            layoutSection(
              layoutColumn({ width: 50 })(p('')),
              layoutColumn({ width: 50 })(p('')),
            ),
          ),
        );
      },
    );
  });
});
