import {
  EditorMultiBodiedExtensionModel,
  EditorNodeContainerModel,
  expect,
  editorTestCase as test,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  date,
  doc,
  emoji,
  extensionFrame,
  mention,
  multiBodiedExtension,
  p,
  status,
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
      allowDate: true,
      allowStatus: true,
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
    test('paste plaintext from MBE', async ({ editor }) => {
      // Paste at doc end
      const copiedMBE = `<meta charset='utf-8'><p data-pm-slice="1 1 [&quot;multiBodiedExtension&quot;,{&quot;extensionKey&quot;:&quot;fake_tabs.com:fakeTabNode&quot;,&quot;extensionType&quot;:&quot;com.atlassian.confluence.&quot;,&quot;maxFrames&quot;:5,&quot;parameters&quot;:{&quot;extensionTitle&quot;:&quot;Fake Tabs&quot;,&quot;activeTabIndex&quot;:0,&quot;macroParams&quot;:{},&quot;macroMetadata&quot;:{&quot;placeholder&quot;:[{&quot;data&quot;:{&quot;url&quot;:&quot;&quot;},&quot;type&quot;:&quot;icon&quot;}]}},&quot;text&quot;:null,&quot;layout&quot;:&quot;default&quot;,&quot;localId&quot;:&quot;2609285d-5d28-44c6-ba51-08336041006f&quot;},&quot;extensionFrame&quot;,null]">LOL TAB1</p>`;
      await editor.selection.set({ anchor: 52, head: 52 });
      await editor.simulatePasteEvent({
        pasteAs: 'text/html',
        html: copiedMBE,
      });
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
    test('paste plaintext to MBE', async ({ editor }) => {
      const copiedMBE = `<meta charset='utf-8'><p data-pm-slice="1 1 []">after</p>`;
      // Paste at first tab
      await editor.selection.set({ anchor: 19, head: 19 });
      await editor.simulatePasteEvent({
        pasteAs: 'text/html',
        html: copiedMBE,
      });
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
    test('paste complete node', async ({ editor }) => {
      // Paste at doc end
      const copiedMBE = `<meta charset='utf-8'><div data-node-type="multi-bodied-extension" data-extension-type="com.atlassian.confluence." data-extension-key="fake_tabs.com:fakeTabNode" data-parameters="{&quot;extensionTitle&quot;:&quot;Fake Tabs&quot;,&quot;activeTabIndex&quot;:0,&quot;macroParams&quot;:{},&quot;macroMetadata&quot;:{&quot;placeholder&quot;:[{&quot;data&quot;:{&quot;url&quot;:&quot;&quot;},&quot;type&quot;:&quot;icon&quot;}]}}" data-layout="default" data-local-id:="2609285d-5d28-44c6-ba51-08336041006f" data-pm-slice="0 0 []"><div data-extension-frame="true"><p>LOL TAB1</p></div><div data-extension-frame="true"><p>LOL TAB2</p></div><div data-extension-frame="true"><p>LOL TAB3</p></div></div>`;
      await editor.selection.set({ anchor: 52, head: 52 });
      await editor.simulatePasteEvent({
        pasteAs: 'text/html',
        html: copiedMBE,
      });
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
            localId: expect.any(String),
            maxFrames: 5,
            parameters: {
              activeTabIndex: 0,
              extensionTitle: 'Fake Tabs',
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
    test('paste plaintext within MBE', async ({ editor }) => {
      // Select second tab
      const nodes = EditorNodeContainerModel.from(editor);
      const model = EditorMultiBodiedExtensionModel.from(
        nodes.multiBodiedExtension.first(),
      );
      await model.tabButtons.nth(1).click();
      // Paste in the second tab
      const copiedMBE = `<meta charset='utf-8'><p data-pm-slice="1 1 [&quot;multiBodiedExtension&quot;,{&quot;extensionKey&quot;:&quot;fake_tabs.com:fakeTabNode&quot;,&quot;extensionType&quot;:&quot;com.atlassian.confluence.&quot;,&quot;maxFrames&quot;:5,&quot;parameters&quot;:{&quot;extensionTitle&quot;:&quot;Fake Tabs&quot;,&quot;activeTabIndex&quot;:0,&quot;macroParams&quot;:{},&quot;macroMetadata&quot;:{&quot;placeholder&quot;:[{&quot;data&quot;:{&quot;url&quot;:&quot;&quot;},&quot;type&quot;:&quot;icon&quot;}]}},&quot;text&quot;:null,&quot;layout&quot;:&quot;default&quot;,&quot;localId&quot;:&quot;2609285d-5d28-44c6-ba51-08336041006f&quot;},&quot;extensionFrame&quot;,null]">LOL TAB1</p>`;
      await editor.selection.set({ anchor: 31, head: 31 });
      await editor.simulatePasteEvent({
        pasteAs: 'text/html',
        html: copiedMBE,
      });
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
    test('paste plaintext within MBE', async ({ editor }) => {
      // Paste in the same tab
      const copiedMBE = `<meta charset='utf-8'><p data-pm-slice="1 1 [&quot;multiBodiedExtension&quot;,{&quot;extensionKey&quot;:&quot;fake_tabs.com:fakeTabNode&quot;,&quot;extensionType&quot;:&quot;com.atlassian.confluence.&quot;,&quot;maxFrames&quot;:5,&quot;parameters&quot;:{&quot;extensionTitle&quot;:&quot;Fake Tabs&quot;,&quot;activeTabIndex&quot;:0,&quot;macroParams&quot;:{},&quot;macroMetadata&quot;:{&quot;placeholder&quot;:[{&quot;data&quot;:{&quot;url&quot;:&quot;&quot;},&quot;type&quot;:&quot;icon&quot;}]}},&quot;text&quot;:null,&quot;layout&quot;:&quot;default&quot;,&quot;localId&quot;:&quot;2609285d-5d28-44c6-ba51-08336041006f&quot;},&quot;extensionFrame&quot;,null]">LOL TAB1</p>`;
      await editor.selection.set({ anchor: 19, head: 19 });
      await editor.simulatePasteEvent({
        pasteAs: 'text/html',
        html: copiedMBE,
      });
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

  test.describe('when copying pasting multiple nodes from another tab in MBE', () => {
    test('paste multiple nodes within MBE', async ({ editor }) => {
      // Paste in the first tab
      const copiedMBE = `<meta charset='utf-8'><div data-extension-frame="true" data-pm-slice="2 2 [&quot;multiBodiedExtension&quot;,{&quot;extensionKey&quot;:&quot;fake_tabs.com:fakeTabNode&quot;,&quot;extensionType&quot;:&quot;com.atlassian.confluence.&quot;,&quot;maxFrames&quot;:5,&quot;parameters&quot;:{&quot;extensionTitle&quot;:&quot;Fake Tabs&quot;,&quot;activeTabIndex&quot;:0,&quot;macroParams&quot;:{},&quot;macroMetadata&quot;:{&quot;placeholder&quot;:[{&quot;data&quot;:{&quot;url&quot;:&quot;&quot;},&quot;type&quot;:&quot;icon&quot;}]}},&quot;text&quot;:null,&quot;layout&quot;:&quot;default&quot;,&quot;localId&quot;:&quot;2609285d-5d28-44c6-ba51-08336041006f&quot;}]"><p>LOL <span data-mention-id="0" data-access-level="" contenteditable="false">@Carolyn</span>  TAB1</p><p><span data-mention-id="0" data-access-level="" contenteditable="false">@Carolyn</span> </p><p>TAB1 </p><p><span data-mention-id="0" data-access-level="" contenteditable="false">@Carolyn</span> </p><p><span data-node-type="date" data-timestamp="1707091200000"></span> </p><p><span data-emoji-short-name=":smile:" data-emoji-id="1f604" data-emoji-text="😄" contenteditable="false">😄</span> </p><p><span data-node-type="status" data-color="neutral" data-local-id="b2c20d89-402e-4559-827b-65a960cc07e1" data-style="" contenteditable="false">adsasd</span> </p></div>`;
      await editor.selection.set({ anchor: 19, head: 19 });
      await editor.simulatePasteEvent({
        pasteAs: 'text/html',
        html: copiedMBE,
      });
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
            extensionFrame()(
              p(
                'LOL TAB1LOL ',
                mention({ id: '0', text: '@Carolyn', accessLevel: '' })(),
                '  TAB1',
              ),
              p(mention({ id: '0', text: '@Carolyn', accessLevel: '' })(), ' '),
              p('TAB1 '),
              p(mention({ id: '0', text: '@Carolyn', accessLevel: '' })(), ' '),
              p(date({ timestamp: '1707091200000' }), ' '),
              p(
                emoji({ shortName: ':smile:', id: '1f604', text: '😄' })(),
                ' ',
              ),
              p(
                status({
                  text: 'adsasd',
                  color: 'neutral',
                  localId: expect.any(String),
                }),
                ' ',
              ),
            ),
            extensionFrame()(p('LOL TAB2')),
            extensionFrame()(p('LOL TAB3')),
          ),
          p('after'),
        ),
      );
    });
  });
});
