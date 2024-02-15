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
  multiBodiedExtension,
  p,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { adfMBEWithTextBeforeAndAfter } from './multi-bodied-extensions.spec.ts-fixtures';

test.describe('MultiBodiedExtensions: copy paste', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowExtension: {
        allowBreakout: true,
      },
      allowTables: {
        advanced: true,
      },
      allowFragmentMark: true,
      insertMenuItems: [],
    },
    editorMountOptions: {
      withConfluenceMacrosExtensionProvider: true,
    },
    platformFeatureFlags: {
      'platform.editor.multi-bodied-extension_0rygg': true,
    },
  });

  test.use({ adf: adfMBEWithTextBeforeAndAfter });

  test.describe('when copying pasting text from tab to outside editor', () => {
    test('select, copy and paste plaintext from MBE', async ({ editor }) => {
      // Copy selection from the first tab
      await editor.selection.set({ anchor: 11, head: 19 });
      await editor.copy();
      // Paste at doc end
      await editor.selection.set({ anchor: 52, head: 52 });
      await editor.paste();
      await expect(editor).toHaveDocument(
        doc(
          p('before'),
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
          })(
            extensionFrame()(p('LOL TAB1')),
            extensionFrame()(p('LOL TAB2')),
            extensionFrame()(p('LOL TAB3')),
          ),
          p('afterLOL TAB1'),
        ),
      );
    });
  });

  test.describe('when copying pasting text from outside editor to MBE', () => {
    test('select, copy and paste plaintext to MBE', async ({ editor }) => {
      // Copy selection from outside
      await editor.selection.set({ anchor: 47, head: 52 });
      await editor.copy();
      // Paste at first tab
      await editor.selection.set({ anchor: 19, head: 19 });
      await editor.paste();
      await expect(editor).toHaveDocument(
        doc(
          p('before'),
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
          })(
            extensionFrame()(p('LOL TAB1after')),
            extensionFrame()(p('LOL TAB2')),
            extensionFrame()(p('LOL TAB3')),
          ),
          p('after'),
        ),
      );
    });
  });

  test.describe('when copying pasting whole MBE node', () => {
    test('select, copy and paste complete node', async ({ editor }) => {
      // Copy whole MBE
      await editor.selection.set({ anchor: 8, head: 46 });
      await editor.copy();
      // Paste at doc end
      await editor.selection.set({ anchor: 52, head: 52 });
      await editor.paste();
      await expect(editor).toMatchDocument(
        doc(
          p('before'),
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
          })(
            extensionFrame()(p('LOL TAB1')),
            extensionFrame()(p('LOL TAB2')),
            extensionFrame()(p('LOL TAB3')),
          ),
          p('after'),
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
          })(
            extensionFrame()(p('LOL TAB1')),
            extensionFrame()(p('LOL TAB2')),
            extensionFrame()(p('LOL TAB3')),
          ),
        ),
      );
    });
  });

  test.describe('when copying pasting text from tab to tab in MBE', () => {
    test('select, copy and paste plaintext within MBE', async ({ editor }) => {
      // Copy selection from first tab
      await editor.selection.set({ anchor: 11, head: 19 });
      await editor.copy();
      // Select second tab
      const nodes = EditorNodeContainerModel.from(editor);
      const model = EditorMultiBodiedExtensionModel.from(
        nodes.multiBodiedExtension.first(),
      );
      await model.tabButtons.nth(1).click();
      // Paste in the second tab
      await editor.selection.set({ anchor: 31, head: 31 });
      await editor.paste();
      await expect(editor).toMatchDocument(
        doc(
          p('before'),
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
          })(
            extensionFrame()(p('LOL TAB1')),
            extensionFrame()(p('LOL TAB2LOL TAB1')),
            extensionFrame()(p('LOL TAB3')),
          ),
          p('after'),
        ),
      );
    });
  });

  test.describe('when copying pasting text within same tab in MBE', () => {
    test('select, copy and paste plaintext within MBE', async ({ editor }) => {
      // Copy selection from first tab
      await editor.selection.set({ anchor: 11, head: 19 });
      await editor.copy();
      // Paste in the same tab
      await editor.selection.set({ anchor: 19, head: 19 });
      await editor.paste();
      await expect(editor).toMatchDocument(
        doc(
          p('before'),
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
          })(
            extensionFrame()(p('LOL TAB1LOL TAB1')),
            extensionFrame()(p('LOL TAB2')),
            extensionFrame()(p('LOL TAB3')),
          ),
          p('after'),
        ),
      );
    });
  });
});
