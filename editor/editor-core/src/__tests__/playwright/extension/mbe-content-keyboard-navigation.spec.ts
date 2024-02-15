import {
  BROWSERS,
  expect,
  fixTest,
  editorTestCase as test,
} from '@af/editor-libra';
import {
  code_block,
  doc,
  extensionFrame,
  multiBodiedExtension,
  p,
  panel,
  table,
  tdEmpty,
  thEmpty,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';

import {
  mbeAdfWithACodeBlock,
  mbeAdfWithAnInnerPanel,
  mbeAdfWithAnInnerTable,
  mbeAdfWithTextBeforeAfterAndWithACodeBlock,
  mbeAdfWithTextBeforeAfterAndWithAnInnerPanel,
  mbeAdfWithTextBeforeAfterAndWithAnInnerTable,
} from './mbe-delete-inner-macros.spec.ts-fixtures';

test.describe('MultiBodiedExtensions: frames keyboard navigation', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowExtension: {
        allowBreakout: true,
      },
      allowTables: {
        advanced: true,
      },
      allowPanel: true,
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
  test.describe('left-right navigation', () => {
    test.describe('from inside the table', () => {
      test.use({ adf: mbeAdfWithAnInnerTable });
      test('Pressing LeftArrow should move to Left Gap cursor and able to add text before the table', async ({
        editor,
      }) => {
        fixTest({
          jiraIssueId: 'ED-20526',
          reason: 'selection issue on firefox',
          browsers: [BROWSERS.firefox],
        });
        // Set the position at the table header's top cell
        await editor.selection.set({ anchor: 6, head: 6 });
        await editor.keyboard.press('ArrowLeft');

        // At this point, the table is selected and highlighted
        await editor.keyboard.press('ArrowLeft');
        await expect(editor).toHaveSelection({
          pos: 2,
          side: 'left',
          type: 'gapcursor',
        });
        // Insert some text before the gap cursor
        await editor.keyboard.press('Enter');
        await editor.keyboard.type('Hello');
        await editor.waitForEditorStable();

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
                p('Hello'),
                table()(
                  tr(thEmpty, thEmpty, thEmpty),
                  tr(tdEmpty, tdEmpty, tdEmpty),
                  tr(tdEmpty, tdEmpty, tdEmpty),
                ),
              ),
            ),
          ),
        );
        await expect(editor).toHaveSelection({
          head: 8,
          anchor: 8,
          type: 'text',
        });

        // Let's navigate back to the table
        await editor.keyboard.press('ArrowRight');
        await expect(editor).toHaveSelection({
          pos: 9,
          side: 'left',
          type: 'gapcursor',
        });
        await editor.keyboard.press('ArrowRight');
        // At this point, the table is selected and highlighted
        await editor.keyboard.press('ArrowRight');
        await expect(editor).toHaveSelection({
          anchor: 13,
          head: 13,
          type: 'text',
        });
      });
      test('Pressing RightArrow should move to Right Gap cursor and able to add text after the table', async ({
        editor,
      }) => {
        fixTest({
          jiraIssueId: 'ED-20526',
          reason: 'selection issue on firefox',
          browsers: [BROWSERS.firefox],
        });
        // Set the position at the table header's top cell
        await editor.selection.set({ anchor: 42, head: 42 });
        await editor.keyboard.press('ArrowRight');
        // At this point, the table is selected and highlighted
        await editor.keyboard.press('ArrowRight');
        await expect(editor).toHaveSelection({
          pos: 46,
          side: 'right',
          type: 'gapcursor',
        });
        // Insert some text before the gap cursor
        await editor.keyboard.press('Enter');
        await editor.keyboard.type('Hello');
        await editor.waitForEditorStable();

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
                table()(
                  tr(thEmpty, thEmpty, thEmpty),
                  tr(tdEmpty, tdEmpty, tdEmpty),
                  tr(tdEmpty, tdEmpty, tdEmpty),
                ),
                p('Hello'),
              ),
            ),
          ),
        );
        await expect(editor).toHaveSelection({
          head: 52,
          anchor: 52,
          type: 'text',
        });

        // Let's navigate back to the table by pressing LeftArrow
        await editor.keyboard.press('ArrowLeft');
        await editor.keyboard.press('ArrowLeft');
        await editor.keyboard.press('ArrowLeft');
        await editor.keyboard.press('ArrowLeft');
        await editor.keyboard.press('ArrowLeft');
        // Now at the start of the line with Hello
        await editor.keyboard.press('ArrowLeft');
        // Cursor should now be at the right gap cursor of the table
        await expect(editor).toHaveSelection({
          pos: 46,
          side: 'right',
          type: 'gapcursor',
        });
        await editor.keyboard.press('ArrowLeft');
        // At this point, the table is selected and highlighted
        await editor.keyboard.press('ArrowLeft');
        await expect(editor).toHaveSelection({
          anchor: 42,
          head: 42,
          type: 'text',
        });
      });
    });

    test.describe('from inside the panel', () => {
      test.use({ adf: mbeAdfWithAnInnerPanel });
      test('Pressing LeftArrow should move to Left Gap cursor and able to add text before the panel', async ({
        editor,
      }) => {
        fixTest({
          jiraIssueId: 'ED-20526',
          reason: 'selection issue on firefox',
          browsers: [BROWSERS.firefox],
        });
        // Set the position at the panel content start
        await editor.selection.set({ anchor: 4, head: 4 });
        await editor.keyboard.press('ArrowLeft');

        // At this point, the panel is selected and highlighted
        await editor.keyboard.press('ArrowLeft');
        await expect(editor).toHaveSelection({
          pos: 2,
          side: 'left',
          type: 'gapcursor',
        });
        // Insert some text before the gap cursor
        await editor.keyboard.press('Enter');
        await editor.keyboard.type('Hello');
        await editor.waitForEditorStable();

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
            })(extensionFrame()(p('Hello'), panel()(p()))),
          ),
        );
        await expect(editor).toHaveSelection({
          head: 8,
          anchor: 8,
          type: 'text',
        });

        // Let's navigate back to the panel
        await editor.keyboard.press('ArrowRight');
        await expect(editor).toHaveSelection({
          pos: 9,
          side: 'left',
          type: 'gapcursor',
        });
        await editor.keyboard.press('ArrowRight');
        // At this point, the panel is selected and highlighted
        await editor.keyboard.press('ArrowRight');
        await expect(editor).toHaveSelection({
          anchor: 11,
          head: 11,
          type: 'text',
        });
      });
      test('Pressing RightArrow should move to Right Gap cursor and able to add text after the panel', async ({
        editor,
      }) => {
        fixTest({
          jiraIssueId: 'ED-20526',
          reason: 'selection issue on firefox',
          browsers: [BROWSERS.firefox],
        });
        // Set the position at the panel content end (since it's empty it's the same as start)
        await editor.selection.set({ anchor: 4, head: 4 });
        await editor.keyboard.press('ArrowRight');
        // At this point, the panel is selected and highlighted
        await editor.keyboard.press('ArrowRight');
        await expect(editor).toHaveSelection({
          pos: 6,
          side: 'right',
          type: 'gapcursor',
        });
        // Insert some text before the gap cursor
        await editor.keyboard.press('Enter');
        await editor.keyboard.type('Hello');
        await editor.waitForEditorStable();

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
            })(extensionFrame()(panel()(p()), p('Hello'))),
          ),
        );
        await expect(editor).toHaveSelection({
          head: 12,
          anchor: 12,
          type: 'text',
        });

        // Let's navigate back to the panel by pressing LeftArrow
        await editor.keyboard.press('ArrowLeft');
        await editor.keyboard.press('ArrowLeft');
        await editor.keyboard.press('ArrowLeft');
        await editor.keyboard.press('ArrowLeft');
        await editor.keyboard.press('ArrowLeft');
        // Now at the start of the line with Hello
        await editor.keyboard.press('ArrowLeft');
        // Cursor should now be at the right gap cursor of the panel
        await expect(editor).toHaveSelection({
          pos: 6,
          side: 'right',
          type: 'gapcursor',
        });
        await editor.keyboard.press('ArrowLeft');
        // At this point, the panel is selected and highlighted
        await editor.keyboard.press('ArrowLeft');
        await expect(editor).toHaveSelection({
          anchor: 4,
          head: 4,
          type: 'text',
        });
      });
    });

    test.describe('from inside the code_block', () => {
      test.use({ adf: mbeAdfWithACodeBlock });
      test('Pressing LeftArrow should move to Left Gap cursor and able to add text before the code_block', async ({
        editor,
      }) => {
        fixTest({
          jiraIssueId: 'ED-20526',
          reason: 'selection issue on firefox',
          browsers: [BROWSERS.firefox],
        });
        // Set the position at the code_block content start
        await editor.selection.set({ anchor: 3, head: 3 });
        await editor.keyboard.press('ArrowLeft');

        // At this point, the code_block is selected and highlighted
        await editor.keyboard.press('ArrowLeft');
        await expect(editor).toHaveSelection({
          pos: 2,
          side: 'left',
          type: 'gapcursor',
        });
        // Insert some text before the gap cursor
        await editor.keyboard.press('Enter');
        await editor.keyboard.type('Hello');
        await editor.waitForEditorStable();

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
            })(extensionFrame()(p('Hello'), code_block()())),
          ),
        );
        await expect(editor).toHaveSelection({
          head: 8,
          anchor: 8,
          type: 'text',
        });

        // Let's navigate back to the code_block
        await editor.keyboard.press('ArrowRight');
        await expect(editor).toHaveSelection({
          pos: 9,
          side: 'left',
          type: 'gapcursor',
        });
        await editor.keyboard.press('ArrowRight');
        // At this point, the code_block is selected and highlighted
        await editor.keyboard.press('ArrowRight');
        await expect(editor).toHaveSelection({
          anchor: 10,
          head: 10,
          type: 'text',
        });
      });
      test('Pressing RightArrow should move to Right Gap cursor and able to add text after the code_block', async ({
        editor,
      }) => {
        fixTest({
          jiraIssueId: 'ED-20526',
          reason: 'selection issue on firefox',
          browsers: [BROWSERS.firefox],
        });
        // Set the position at the code_block content end (since it's empty it's the same as start)
        await editor.selection.set({ anchor: 3, head: 3 });
        await editor.keyboard.press('ArrowRight');
        // At this point, the code_block is selected and highlighted
        await editor.keyboard.press('ArrowRight');
        await expect(editor).toHaveSelection({
          pos: 4,
          side: 'right',
          type: 'gapcursor',
        });
        // Insert some text before the gap cursor
        await editor.keyboard.press('Enter');
        await editor.keyboard.type('Hello');
        await editor.waitForEditorStable();

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
            })(extensionFrame()(code_block()(), p('Hello'))),
          ),
        );
        await expect(editor).toHaveSelection({
          head: 10,
          anchor: 10,
          type: 'text',
        });

        // Let's navigate back to the code_block by pressing LeftArrow
        await editor.keyboard.press('ArrowLeft');
        await editor.keyboard.press('ArrowLeft');
        await editor.keyboard.press('ArrowLeft');
        await editor.keyboard.press('ArrowLeft');
        await editor.keyboard.press('ArrowLeft');
        // Now at the start of the line with Hello
        await editor.keyboard.press('ArrowLeft');
        // Cursor should now be at the right gap cursor of the code_block
        await expect(editor).toHaveSelection({
          pos: 4,
          side: 'right',
          type: 'gapcursor',
        });
        await editor.keyboard.press('ArrowLeft');
        // At this point, the code_block is selected and highlighted
        await editor.keyboard.press('ArrowLeft');
        await expect(editor).toHaveSelection({
          anchor: 3,
          head: 3,
          type: 'text',
        });
      });
    });
  });

  test.describe('up-down navigation', () => {
    test.describe('from inside the table', () => {
      test.use({ adf: mbeAdfWithTextBeforeAfterAndWithAnInnerTable });
      test('Pressing UpArrow should move to the content above the MBE', async ({
        editor,
      }) => {
        fixTest({
          jiraIssueId: 'ED-20526',
          reason: 'selection issue on firefox',
          browsers: [BROWSERS.firefox],
        });
        // Set the position at the table top left-most cell
        await editor.selection.set({ anchor: 14, head: 14 });
        await editor.keyboard.press('ArrowUp');
        await expect(editor).toHaveSelection({
          head: 7,
          anchor: 7,
          type: 'text',
        });

        // Let's navigate back to the table
        await editor.keyboard.press('ArrowDown');
        await expect(editor).toHaveSelection({
          anchor: 14,
          head: 14,
          type: 'text',
        });
      });
      test('Pressing DownArrow should move to the content below the MBE', async ({
        editor,
      }) => {
        fixTest({
          jiraIssueId: 'ED-20526',
          reason: 'selection issue on firefox',
          browsers: [BROWSERS.firefox],
        });
        // Set the position at the table bottom left-most cell
        await editor.selection.set({ anchor: 42, head: 42 });
        await editor.keyboard.press('ArrowDown');
        await expect(editor).toHaveSelection({
          head: 57,
          anchor: 57,
          type: 'text',
        });

        // Let's navigate back to the table by pressing UpArrow
        await editor.keyboard.press('ArrowUp');
        // Navigation will take to the bottom right-most cell
        await expect(editor).toHaveSelection({
          anchor: 50,
          head: 50,
          type: 'text',
        });
      });
    });

    test.describe('from inside the panel', () => {
      test.use({ adf: mbeAdfWithTextBeforeAfterAndWithAnInnerPanel });
      test('Pressing UpArrow should move to the content above the MBE', async ({
        editor,
      }) => {
        fixTest({
          jiraIssueId: 'ED-20526',
          reason: 'selection issue on firefox',
          browsers: [BROWSERS.firefox],
        });
        // Set the position at the panel content start
        await editor.selection.set({ anchor: 12, head: 12 });
        await editor.keyboard.press('ArrowUp');
        await expect(editor).toHaveSelection({
          head: 7,
          anchor: 7,
          type: 'text',
        });

        // Let's navigate back to the panel
        await editor.keyboard.press('ArrowDown');
        await expect(editor).toHaveSelection({
          anchor: 12,
          head: 12,
          type: 'text',
        });
      });
      test('Pressing DownArrow should move to the content below the MBE', async ({
        editor,
      }) => {
        fixTest({
          jiraIssueId: 'ED-20526',
          reason: 'selection issue on firefox',
          browsers: [BROWSERS.firefox],
        });
        // Set the position at the panel content end (since it's empty it's the same as start)
        await editor.selection.set({ anchor: 12, head: 12 });
        await editor.keyboard.press('ArrowDown');
        await expect(editor).toHaveSelection({
          head: 22,
          anchor: 22,
          type: 'text',
        });

        // Let's navigate back to the panel by pressing UpArrow
        await editor.keyboard.press('ArrowUp');
        await expect(editor).toHaveSelection({
          anchor: 12,
          head: 12,
          type: 'text',
        });
      });
    });

    test.describe('from inside the code_block', () => {
      test.use({ adf: mbeAdfWithTextBeforeAfterAndWithACodeBlock });
      test('Pressing UpArrow should move to the content above the MBE', async ({
        editor,
      }) => {
        fixTest({
          jiraIssueId: 'ED-20526',
          reason: 'selection issue on firefox',
          browsers: [BROWSERS.firefox],
        });
        // Set the position at the panel content start
        await editor.selection.set({ anchor: 11, head: 11 });
        await editor.keyboard.press('ArrowUp');
        await expect(editor).toHaveSelection({
          head: 7,
          anchor: 7,
          type: 'text',
        });

        // Let's navigate back to the panel
        await editor.keyboard.press('ArrowDown');
        await expect(editor).toHaveSelection({
          anchor: 11,
          head: 11,
          type: 'text',
        });
      });
      test('Pressing DownArrow should move to the content below the MBE', async ({
        editor,
      }) => {
        fixTest({
          jiraIssueId: 'ED-20526',
          reason: 'selection issue on firefox',
          browsers: [BROWSERS.firefox],
        });
        // Set the position at the code_block content end (since it's empty it's the same as start)
        await editor.selection.set({ anchor: 11, head: 11 });
        await editor.keyboard.press('ArrowDown');
        await expect(editor).toHaveSelection({
          head: 20,
          anchor: 20,
          type: 'text',
        });

        // Let's navigate back to the code_block by pressing UpArrow
        await editor.keyboard.press('ArrowUp');
        await expect(editor).toHaveSelection({
          anchor: 11,
          head: 11,
          type: 'text',
        });
      });
    });
  });
});
