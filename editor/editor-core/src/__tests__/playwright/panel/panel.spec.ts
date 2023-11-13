import {
  EditorPanelModel,
  EditorMainToolbarModel,
  EditorFloatingToolbarModel,
  EditorNodeContainerModel,
  EditorMentionModel,
  editorTestCase as test,
  expect,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  strong,
  em,
  mention,
  panel,
  table,
  tr,
  th,
  a,
  p,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { infoPanelADF } from './panel.spec.ts-fixtures';

test.describe('panel', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowPanel: true,
    },
  });

  test.describe('with panel', () => {
    test.use({
      adf: infoPanelADF,
    });

    test("doesn't select panel node if click and drag before releasing mouse", async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);

      await nodes.paragraph.first().hover();
      await editor.page.mouse.down();
      await nodes.panel.first().hover();

      await expect(editor).not.toHaveSelection({
        type: 'node',
        anchor: 0,
      });
    });

    test('selection.ts: Writing inside the panel, selecting panel and typing should drop text in panel', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const firstPanel = nodes.panel.first();
      const panelModel = EditorPanelModel.from(firstPanel);

      await panelModel.icon.click();

      await editor.keyboard.type('this text should be in doc root');

      await expect(editor).toHaveDocument(
        doc(p('this text should be in doc root')),
      );
    });
  });

  test('change-type.ts: Change the type of panel to Error', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const firstPanel = nodes.panel.first();
    const panelModel = EditorPanelModel.from(firstPanel);
    const floatingToolbar = EditorFloatingToolbarModel.from(editor, panelModel);

    await editor.typeAhead.search('Info');
    await editor.keyboard.press('Enter');
    await editor.keyboard.type('this text should be in the panel');

    await firstPanel.click();

    await floatingToolbar.errorIcon.click();

    await expect(editor).toHaveDocument(
      doc(panel({ panelType: 'error' })(p('this text should be in the panel'))),
    );
  });

  test('insert-link.ts: Insert link in panel by typing Markdown', async ({
    editor,
  }) => {
    await editor.typeAhead.search('Info');
    await editor.keyboard.press('Enter');

    await editor.keyboard.type('[Atlassian](https://www.atlassian.com/)');
    await expect(editor).toHaveDocument(
      doc(
        panel({ panelType: 'info' })(
          p(
            a({
              href: 'https://www.atlassian.com/',
            })('Atlassian'),
          ),
        ),
      ),
    );
  });

  test('insert-toolbar-menu.ts: Insert panel via toolbar menu', async ({
    editor,
  }) => {
    const toolbar = EditorMainToolbarModel.from(editor);

    await toolbar.clickAt('Info panel');

    await editor.keyboard.type('this text should be in the panel');
    await expect(editor).toHaveDocument(
      doc(
        panel({
          panelType: 'info',
        })(p('this text should be in the panel')),
      ),
    );
  });

  test('mention.ts: Can insert mention inside panel using click', async ({
    editor,
  }) => {
    const mentionModel = EditorMentionModel.from(editor);

    await editor.typeAhead.search('Info');
    await editor.keyboard.press('Enter');

    await mentionModel.search('Carolyn');
    await mentionModel.mentionsListItems.first().click();

    await expect(editor).toHaveDocument(
      doc(
        panel({
          panelType: 'info',
        })(p(mention({ id: '0', text: '@Carolyn', accessLevel: '' })(), ' ')),
      ),
    );
  });

  test('quick-insert.ts: Insert panel via quick insert', async ({ editor }) => {
    await editor.typeAhead.search('Info');
    await editor.keyboard.press('Enter');
    await editor.keyboard.type('this text should be in the panel');

    await expect(editor).toHaveDocument(
      doc(panel({ panelType: 'info' })(p('this text should be in the panel'))),
    );
  });

  test.describe('inside table', () => {
    test.use({
      editorProps: {
        appearance: 'full-page',

        allowTables: {
          advanced: true,
        },
        allowPanel: true,
      },
    });

    test('inside-table.ts: Insert panel into table, add text, change panel type', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const firstPanel = nodes.panel.first();
      const panelModel = EditorPanelModel.from(firstPanel);
      const floatingToolbar = EditorFloatingToolbarModel.from(
        editor,
        panelModel,
      );

      await editor.typeAhead.search('Table');
      await editor.keyboard.press('Enter');
      await editor.waitForEditorStable();

      await editor.typeAhead.search('Info');
      await editor.keyboard.press('Enter');

      await firstPanel.click();

      await floatingToolbar.errorIcon.click();
      await editor.keyboard.type('this text should be in the panel');

      await expect(editor).toMatchDocument(
        doc(
          table()(
            tr(
              th()(
                panel({ panelType: 'error' })(
                  p('this text should be in the panel'),
                ),
              ),
              th().any,
              th().any,
            ),
            tr.any,
            tr.any,
          ),
        ),
      );
    });
  });

  test.describe('paste stuff', () => {
    test('paste-plain-text.ts: Paste plain text into panel', async ({
      editor,
    }) => {
      const text =
        'this is a link http://www.google.com more elements with some **format** some addition *formatting*';
      await editor.typeAhead.search('Info');
      await editor.keyboard.press('Enter');

      await editor.simulatePasteEvent({
        pasteAs: 'text/plain',
        text,
      });

      await expect(editor).toHaveDocument(
        doc(
          panel({ panelType: 'info' })(
            p(
              'this is a link ',
              a({
                href: 'http://www.google.com',
              })('http://www.google.com'),
              ' more elements with some ',
              strong('format'),
              ' some addition ',
              em('formatting'),
            ),
          ),
        ),
      );
    });

    test('paste-rich-text.ts: Paste rich text into panel', async ({
      editor,
    }) => {
      const html =
        '<p>this is a link <a href="http://www.google.com">www.google.com</a></p><p>more elements with some <strong>format</strong></p><p>some addition<em> formatting</em></p>';
      await editor.typeAhead.search('Info');
      await editor.keyboard.press('Enter');

      await editor.simulatePasteEvent({
        pasteAs: 'text/html',
        html,
      });

      await expect(editor).toHaveDocument(
        doc(
          panel({ panelType: 'info' })(
            p(
              'this is a link ',
              a({
                href: 'http://www.google.com',
              })('www.google.com'),
            ),
            p('more elements with some ', strong('format')),
            p('some addition', em(' formatting')),
          ),
        ),
      );
    });
  });

  test.describe('custom panel', () => {
    test.use({
      editorProps: {
        appearance: 'full-page',

        allowPanel: {
          allowCustomPanel: true,
          allowCustomPanelEdit: true,
        },
      },
    });
    test('quick-insert.ts: Insert custom panel via quick insert', async ({
      editor,
    }) => {
      await editor.typeAhead.search('Custom');
      await editor.keyboard.press('Enter');
      await editor.keyboard.type('this text should be in the panel');

      await expect(editor).toHaveDocument(
        doc(
          panel({
            panelType: 'custom',
            panelIcon: ':rainbow:',
            panelIconId: '1f308',
            panelIconText: '🌈',
            panelColor: '#E6FCFF',
          })(p('this text should be in the panel')),
        ),
      );
    });

    test('change-selected-type.ts: Select panel and then change type', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const firstPanel = nodes.panel.first();
      const panelModel = EditorPanelModel.from(firstPanel);
      const floatingToolbar = EditorFloatingToolbarModel.from(
        editor,
        panelModel,
      );

      await editor.typeAhead.search('Info');
      await editor.keyboard.press('Enter');
      await editor.keyboard.type('this text should be in the panel');

      await firstPanel.click();

      await floatingToolbar.errorIcon.click();

      await expect(editor).toHaveDocument(
        doc(
          panel({ panelType: 'error' })(p('this text should be in the panel')),
        ),
      );
    });

    test('change-selected-type.ts: Select panel and then change background color when allowCustomPanelEdit is true', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const firstPanel = nodes.panel.first();
      const panelModel = EditorPanelModel.from(firstPanel);
      const floatingToolbar = EditorFloatingToolbarModel.from(
        editor,
        panelModel,
      );

      await editor.typeAhead.search('Info');
      await editor.keyboard.press('Enter');
      await editor.keyboard.type('this text should be in the panel');

      await firstPanel.click();
      await floatingToolbar.backgroundColorButton.click();

      const menu = await floatingToolbar.backgroundColorMenu();

      await expect(menu.colorPickerPopup).toBeVisible();

      await menu.colorLightPurpleButton.click();

      await expect(editor).toHaveDocument(
        doc(
          panel({
            panelType: 'custom',
            panelColor: '#EAE6FF',
            panelIcon: ':info:',
            panelIconId: 'atlassian-info',
          })(p('this text should be in the panel')),
        ),
      );
    });

    test('change-selected-type.ts: Select panel and then change Icon when allowCustomPanelEdit is true', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const firstPanel = nodes.panel.first();
      const panelModel = EditorPanelModel.from(firstPanel);
      const floatingToolbar = EditorFloatingToolbarModel.from(
        editor,
        panelModel,
      );

      await editor.typeAhead.search('Info');
      await editor.keyboard.press('Enter');
      await editor.keyboard.type('this text should be in the panel');

      await firstPanel.click();
      await floatingToolbar.emojiButton.click();

      const emojiPicker = await floatingToolbar.emojiPicker();

      await expect(emojiPicker.emojiMenuPopUp).toBeVisible();
      await emojiPicker.searchAndInsertEmoji('smile');

      await expect(editor).toHaveDocument(
        doc(
          panel({
            panelType: 'custom',
            panelIcon: ':smile:',
            panelIconId: '1f604',
            panelIconText: '😄',
            panelColor: '#DEEBFF',
          })(p('this text should be in the panel')),
        ),
      );
    });

    test('Should be able to undo the emoji icon using keyboard shortcut', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const firstPanel = nodes.panel.first();
      const panelModel = EditorPanelModel.from(firstPanel);
      const floatingToolbar = EditorFloatingToolbarModel.from(
        editor,
        panelModel,
      );

      await editor.typeAhead.search('Info');
      await editor.keyboard.press('Enter');
      await editor.keyboard.type('this text should be in the panel');

      await firstPanel.click();
      await floatingToolbar.emojiButton.click();

      const emojiPicker = await floatingToolbar.emojiPicker();

      await expect(emojiPicker.emojiMenuPopUp).toBeVisible();
      await emojiPicker.searchAndInsertEmoji('smile');

      await editor.undo();

      await expect(editor).toHaveDocument(
        doc(
          panel({ panelType: 'info' })(p('this text should be in the panel')),
        ),
      );
    });

    test.describe(' when icon short name is incorrect when allowCustomPanelEdit is true', () => {
      const adf = {
        version: 1,
        type: 'doc',
        content: [
          {
            type: 'panel',
            attrs: {
              panelType: 'custom',
              panelIcon: ':winkk:',
              panelIconText: '😉',
            },
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: 'custom - only emoji',
                  },
                ],
              },
            ],
          },
        ],
      };

      test.use({
        adf,
      });

      test('should render panel with icon using fallback text', async ({
        editor,
      }) => {
        const nodes = EditorNodeContainerModel.from(editor);
        const firstPanel = nodes.panel.first();
        const panelModel = EditorPanelModel.from(firstPanel);

        const fallbackLocator = await panelModel.emojiIconFallbackLocator(`😉`);

        await expect(fallbackLocator).toBeVisible();
      });
    });
  });
});
