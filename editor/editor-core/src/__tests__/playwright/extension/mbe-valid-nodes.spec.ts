import {
  EditorMainToolbarModel,
  EditorUploadMediaModel,
  expect,
  FileResourcesAvailable,
  editorTestCase as test,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  blockquote,
  bodiedExtension,
  code_block,
  decisionItem,
  decisionList,
  doc,
  extension,
  extensionFrame,
  h1,
  hr,
  li,
  media,
  mediaGroup,
  mediaSingle,
  multiBodiedExtension,
  ol,
  p,
  panel,
  table,
  taskItem,
  taskList,
  tdEmpty,
  thEmpty,
  tr,
  ul,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { adfWithSingleTab } from './multi-bodied-extensions.spec.ts-fixtures';

test.describe('Add valid nodes to MBE through quickinsert/keyboard', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowPanel: true,
      allowRule: true,
      media: {
        allowMediaSingle: false,
        allowMediaGroup: true,
      },
      allowExtension: {
        allowBreakout: true,
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

  test.use({ adf: adfWithSingleTab });

  test('Add a panel', async ({ editor }) => {
    await editor.selection.set({ anchor: 3, head: 7 });
    await editor.typeAhead.searchAndInsert('Infopanel', 'Info panel');
    await editor.keyboard.type('Test');
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
        })(extensionFrame()(panel({ type: 'info' })(p('Test')))),
      ),
    );
  });

  test('Add a paragraph', async ({ editor }) => {
    await editor.selection.set({ anchor: 3, head: 7 });
    await editor.keyboard.type('Test');
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
        })(extensionFrame()(p('Test'))),
      ),
    );
  });

  test('Add a block quote', async ({ editor }) => {
    await editor.selection.set({ anchor: 3, head: 7 });
    await editor.keyboard.type('> Test');
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
        })(extensionFrame()(blockquote(p('Test')))),
      ),
    );
  });

  test('Add an ordered list', async ({ editor }) => {
    await editor.selection.set({ anchor: 3, head: 7 });
    await editor.typeAhead.searchAndInsert('Numbered list');
    await editor.keyboard.type('Test 1');
    await editor.keyboard.press('Enter');
    await editor.keyboard.type('Test 2');
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
        })(
          extensionFrame()(ol({ order: 1 })(li(p('Test 1')), li(p('Test 2')))),
        ),
      ),
    );
  });

  test('Add an unordered list', async ({ editor }) => {
    await editor.selection.set({ anchor: 3, head: 7 });
    await editor.typeAhead.search('Bullet list');
    await editor.keyboard.press('Enter');
    await editor.keyboard.type('Test 1');
    await editor.keyboard.press('Enter');
    await editor.keyboard.type('Test 2');
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
        })(extensionFrame()(ul(li(p('Test 1')), li(p('Test 2'))))),
      ),
    );
  });

  test('Add a rule', async ({ editor }) => {
    await editor.selection.set({ anchor: 3, head: 7 });
    await editor.typeAhead.searchAndInsert('Divider');
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
        })(extensionFrame()(hr())),
      ),
    );
  });

  test('Add a heading', async ({ editor }) => {
    await editor.selection.set({ anchor: 3, head: 7 });
    await editor.typeAhead.search('Heading 1');
    await editor.keyboard.press('Enter');
    await editor.keyboard.type('Test');
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
        })(extensionFrame()(h1('Test'))),
      ),
    );
  });

  test('Add a codeblock', async ({ editor }) => {
    await editor.selection.set({ anchor: 3, head: 7 });
    await editor.typeAhead.searchAndInsert('Codesnippet', 'Code snippet');
    await editor.keyboard.type('Test');
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
        })(extensionFrame()(code_block()('Test'))),
      ),
    );
  });

  test('Add a mediaGroup', async ({ editor }) => {
    await editor.selection.set({ anchor: 3, head: 7 });
    const uploadModel = EditorUploadMediaModel.from(editor);
    await uploadModel.upload({
      actionToTriggerUpload: async () => {
        await editor.typeAhead.searchAndInsert('Image,');
      },
      fileToUpload: FileResourcesAvailable.PDF_FILE,
    });
    await expect(editor).toMatchDocument(
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
        })(
          extensionFrame()(
            mediaGroup(
              media({
                __contextId: 'DUMMY-OBJECT-ID',
                __fileMimeType: 'application/pdf',
                __fileName: 'test.pdf',
                __fileSize: expect.any(Number),
                id: expect.any(String),
                alt: '',
                collection: 'MediaServicesSample',
                type: 'file',
              })(),
            ),
            p(''),
          ),
        ),
      ),
    );
  });
});

test.describe('MultiBodiedExtensions: test for valid nodes', () => {
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

  test.use({ adf: adfWithSingleTab });

  test('Add media single', async ({ editor }) => {
    await editor.selection.set({ anchor: 3, head: 7 });

    const uploadModel = EditorUploadMediaModel.from(editor);
    await uploadModel.upload({
      actionToTriggerUpload: async () => {
        await editor.typeAhead.searchAndInsert('Image');
      },
      fileToUpload: FileResourcesAvailable.SMALL_IMAGE_9_KB,
    });

    await expect(editor).toMatchDocument(
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
        })(
          extensionFrame()(
            mediaSingle()(
              media({
                __contextId: 'DUMMY-OBJECT-ID',
                __fileMimeType: expect.any(String),
                __fileName: 'test-image-9kb.jpg',
                __fileSize: expect.any(Number),
                width: expect.any(Number),
                height: expect.any(Number),
                id: expect.any(String),
                alt: 'test-image-9kb.jpg',
                collection: 'MediaServicesSample',
                type: 'file',
              })(),
            ),
            p(),
          ),
        ),
      ),
    );
  });

  test('Add decision list', async ({ editor }) => {
    await editor.selection.set({ anchor: 3, head: 7 });
    await editor.keyboard.insertText('<> ');
    await editor.keyboard.insertText('test');
    await expect(editor).toMatchDocument(
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
        })(
          extensionFrame()(
            decisionList({ localId: 'test-decision-list' })(
              decisionItem({ localId: 'test-decision-1' })('test'),
            ),
          ),
        ),
      ),
    );
  });

  test('Add task list', async ({ editor }) => {
    await editor.selection.set({ anchor: 3, head: 7 });
    await editor.keyboard.insertText('[] ');
    await editor.keyboard.insertText('test');
    await expect(editor).toMatchDocument(
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
        })(
          extensionFrame()(
            taskList({ localId: 'test-decision-list' })(
              taskItem({ localId: 'test-decision-1' })('test'),
            ),
          ),
        ),
      ),
    );
  });

  test('Add table', async ({ editor }) => {
    await editor.selection.set({ anchor: 3, head: 7 });
    const toolbar = EditorMainToolbarModel.from(editor);
    await toolbar.clickAt('Table');

    await expect(editor).toMatchDocument(
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
        })(
          extensionFrame()(
            p('Test'),
            table()(
              tr(thEmpty, thEmpty, thEmpty),
              tr(tdEmpty, tdEmpty, tdEmpty),
              tr(tdEmpty, tdEmpty, tdEmpty),
            ),
          ),
        ),
      ),
    );
  });

  test('Add bodied extension', async ({ editor }) => {
    await editor.selection.set({ anchor: 3, head: 7 });
    // const toolbar = EditorMainToolbarModel.from(editor);
    // await toolbar.clickAt('Bodied extension');
    await editor.typeAhead.searchAndInsert(
      'Bodiedextension',
      'Bodied extension',
    );
    await editor.keyboard.insertText('Test');

    await expect(editor).toMatchDocument(
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
        })(
          extensionFrame()(
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
            })(p('Test')),
          ),
        ),
      ),
    );
  });

  test('Add extension', async ({ editor }) => {
    await editor.selection.set({ anchor: 3, head: 7 });
    await editor.typeAhead.searchAndInsert(
      'extension',
      'new extension without config',
    );
    await expect(editor).toMatchDocument(
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
        })(
          extensionFrame()(
            extension({
              extensionKey: 'test-key-123',
              extensionType: 'com.atlassian.extensions.update',
              parameters: { count: 0 },
              layout: 'default',
              localId: 'testId2',
            })(),
          ),
        ),
      ),
    );
  });
});
