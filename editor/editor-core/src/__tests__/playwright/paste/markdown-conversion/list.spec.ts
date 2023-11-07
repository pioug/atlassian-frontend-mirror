import {
  EditorFloatingToolbarModel,
  EditorPasteModel,
  editorTestCase as test,
  expect,
} from '@af/editor-libra';

// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  p,
  code,
  code_block,
  ul,
  li,
  ol,
  br,
} from '@atlaskit/editor-test-helpers/doc-builder';

import {
  emptyDocument,
  multiLineTextDocument,
} from '../__fixtures__/adf-document';

test.use({
  editorProps: {
    appearance: 'full-page',
  },
  platformFeatureFlags: {
    'platform.editor.paste-options-toolbar': true,
  },
});

test.describe('paste bullet list in empty doc', () => {
  test.use({
    adf: emptyDocument,
  });

  test('toggle rich-text > markdown > plaintext > rich-text', async ({
    editor,
    browserName,
  }) => {
    const bulletListText = `
- First item
- Second item
- Third item
- Fourth item
`;
    const html = `<meta charset="utf-8"><span style="color: rgb(33, 37, 41); font-family: SFMono-Regular, Menlo, Monaco, Consolas, &quot;liberation mono&quot;, &quot;courier new&quot;, monospace; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">- First item</span><br style="box-sizing: border-box; color: rgb(33, 37, 41); font-family: SFMono-Regular, Menlo, Monaco, Consolas, &quot;liberation mono&quot;, &quot;courier new&quot;, monospace; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><span style="color: rgb(33, 37, 41); font-family: SFMono-Regular, Menlo, Monaco, Consolas, &quot;liberation mono&quot;, &quot;courier new&quot;, monospace; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">- Second item</span><br style="box-sizing: border-box; color: rgb(33, 37, 41); font-family: SFMono-Regular, Menlo, Monaco, Consolas, &quot;liberation mono&quot;, &quot;courier new&quot;, monospace; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><span style="color: rgb(33, 37, 41); font-family: SFMono-Regular, Menlo, Monaco, Consolas, &quot;liberation mono&quot;, &quot;courier new&quot;, monospace; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">- Third item</span><br style="box-sizing: border-box; color: rgb(33, 37, 41); font-family: SFMono-Regular, Menlo, Monaco, Consolas, &quot;liberation mono&quot;, &quot;courier new&quot;, monospace; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><span style="color: rgb(33, 37, 41); font-family: SFMono-Regular, Menlo, Monaco, Consolas, &quot;liberation mono&quot;, &quot;courier new&quot;, monospace; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">- Fourth item</span>`;

    const initialAnchor = 1;
    const initialHead = 1;

    //setting selection from the beginning to the end
    await editor.selection.set({ anchor: initialAnchor, head: initialHead });
    await editor.simulatePasteEvent({
      pasteAs: 'text/html',
      text: bulletListText,
      html: html,
    });

    await expect(editor).toMatchDocument(
      doc(
        p(
          code('- First item'),
          br(),
          code('- Second item'),
          br(),
          code('- Third item'),
          br(),
          code('- Fourth item'),
        ),
      ),
    );

    const editorPasteModel = EditorPasteModel.from(editor);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      editorPasteModel,
    );

    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();

    await floatingToolbarModel.clickAsRichText();
    await expect(editor).toMatchDocument(
      doc(
        p(
          code('- First item'),
          br(),
          code('- Second item'),
          br(),
          code('- Third item'),
          br(),
          code('- Fourth item'),
        ),
      ),
    );

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 54,
      head: 54,
    });

    // Rich Text to Markdown
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsMarkdown();

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 57,
      head: 57,
    });

    await expect(editor).toMatchDocument(
      doc(
        ul(
          li(p('First item')),
          li(p('Second item')),
          li(p('Third item')),
          li(p('Fourth item')),
        ),
      ),
    );

    // Markdown to Plain Text
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();

    await floatingToolbarModel.clickAsPlainText();

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 56,
      head: 56,
    });

    await expect(editor).toMatchDocument(doc(p(bulletListText)));

    // Plain Text to Rich Text
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsRichText();

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 54,
      head: 54,
    });

    await expect(editor).toMatchDocument(
      doc(
        p(
          code('- First item'),
          br(),
          code('- Second item'),
          br(),
          code('- Third item'),
          br(),
          code('- Fourth item'),
        ),
      ),
    );
  });
});

test.describe('paste bullet list in-between two lines', () => {
  test.use({
    adf: multiLineTextDocument,
  });

  test('toggle rich-text > markdown > plaintext > rich-text', async ({
    editor,
    browserName,
  }) => {
    const bulletListText = `
- First item
- Second item
- Third item
- Fourth item
`;
    const html = `<meta charset="utf-8"><span style="color: rgb(33, 37, 41); font-family: SFMono-Regular, Menlo, Monaco, Consolas, &quot;liberation mono&quot;, &quot;courier new&quot;, monospace; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">- First item</span><br style="box-sizing: border-box; color: rgb(33, 37, 41); font-family: SFMono-Regular, Menlo, Monaco, Consolas, &quot;liberation mono&quot;, &quot;courier new&quot;, monospace; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><span style="color: rgb(33, 37, 41); font-family: SFMono-Regular, Menlo, Monaco, Consolas, &quot;liberation mono&quot;, &quot;courier new&quot;, monospace; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">- Second item</span><br style="box-sizing: border-box; color: rgb(33, 37, 41); font-family: SFMono-Regular, Menlo, Monaco, Consolas, &quot;liberation mono&quot;, &quot;courier new&quot;, monospace; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><span style="color: rgb(33, 37, 41); font-family: SFMono-Regular, Menlo, Monaco, Consolas, &quot;liberation mono&quot;, &quot;courier new&quot;, monospace; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">- Third item</span><br style="box-sizing: border-box; color: rgb(33, 37, 41); font-family: SFMono-Regular, Menlo, Monaco, Consolas, &quot;liberation mono&quot;, &quot;courier new&quot;, monospace; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><span style="color: rgb(33, 37, 41); font-family: SFMono-Regular, Menlo, Monaco, Consolas, &quot;liberation mono&quot;, &quot;courier new&quot;, monospace; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">- Fourth item</span>`;

    const initialAnchor = 30;
    const initialHead = 30;

    //setting selection from the beginning to the end
    await editor.selection.set({ anchor: initialAnchor, head: initialHead });
    await editor.simulatePasteEvent({
      pasteAs: 'text/html',
      text: bulletListText,
      html: html,
    });

    await expect(editor).toMatchDocument(
      doc(
        p('Lorem ipsum dolor sit amet.'),
        p(
          code('- First item'),
          br(),
          code('- Second item'),
          br(),
          code('- Third item'),
          br(),
          code('- Fourth item'),
        ),
        p('consectetur adipiscing elit.'),
      ),
    );

    const editorPasteModel = EditorPasteModel.from(editor);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      editorPasteModel,
    );

    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();

    await floatingToolbarModel.clickAsRichText();
    await expect(editor).toMatchDocument(
      doc(
        p('Lorem ipsum dolor sit amet.'),
        p(
          code('- First item'),
          br(),
          code('- Second item'),
          br(),
          code('- Third item'),
          br(),
          code('- Fourth item'),
        ),
        p('consectetur adipiscing elit.'),
      ),
    );

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 83,
      head: 83,
    });

    // Rich Text to Markdown
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsMarkdown();

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 86,
      head: 86,
    });

    await expect(editor).toMatchDocument(
      doc(
        p('Lorem ipsum dolor sit amet.'),
        ul(
          li(p('First item')),
          li(p('Second item')),
          li(p('Third item')),
          li(p('Fourth item')),
        ),
        p('consectetur adipiscing elit.'),
      ),
    );

    // Markdown to Plain Text
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();

    await floatingToolbarModel.clickAsPlainText();

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 85,
      head: 85,
    });

    await expect(editor).toMatchDocument(
      doc(
        p('Lorem ipsum dolor sit amet.'),
        p(bulletListText),
        p('consectetur adipiscing elit.'),
      ),
    );

    // Plain Text to Rich Text
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsRichText();

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 83,
      head: 83,
    });

    await expect(editor).toMatchDocument(
      doc(
        p('Lorem ipsum dolor sit amet.'),
        p(
          code('- First item'),
          br(),
          code('- Second item'),
          br(),
          code('- Third item'),
          br(),
          code('- Fourth item'),
        ),
        p('consectetur adipiscing elit.'),
      ),
    );
  });
});

test.describe('paste bullet list in-between characters on same line', () => {
  test.use({
    adf: multiLineTextDocument,
  });

  test('toggle rich-text > markdown > plaintext > rich-text', async ({
    editor,
    browserName,
  }) => {
    const bulletListText = `
- First item
- Second item
- Third item
- Fourth item
`;
    const html = `<meta charset="utf-8"><span style="color: rgb(33, 37, 41); font-family: SFMono-Regular, Menlo, Monaco, Consolas, &quot;liberation mono&quot;, &quot;courier new&quot;, monospace; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">- First item</span><br style="box-sizing: border-box; color: rgb(33, 37, 41); font-family: SFMono-Regular, Menlo, Monaco, Consolas, &quot;liberation mono&quot;, &quot;courier new&quot;, monospace; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><span style="color: rgb(33, 37, 41); font-family: SFMono-Regular, Menlo, Monaco, Consolas, &quot;liberation mono&quot;, &quot;courier new&quot;, monospace; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">- Second item</span><br style="box-sizing: border-box; color: rgb(33, 37, 41); font-family: SFMono-Regular, Menlo, Monaco, Consolas, &quot;liberation mono&quot;, &quot;courier new&quot;, monospace; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><span style="color: rgb(33, 37, 41); font-family: SFMono-Regular, Menlo, Monaco, Consolas, &quot;liberation mono&quot;, &quot;courier new&quot;, monospace; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">- Third item</span><br style="box-sizing: border-box; color: rgb(33, 37, 41); font-family: SFMono-Regular, Menlo, Monaco, Consolas, &quot;liberation mono&quot;, &quot;courier new&quot;, monospace; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><span style="color: rgb(33, 37, 41); font-family: SFMono-Regular, Menlo, Monaco, Consolas, &quot;liberation mono&quot;, &quot;courier new&quot;, monospace; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">- Fourth item</span>`;

    const initialAnchor = 6;
    const initialHead = 6;

    //setting selection from the beginning to the end
    await editor.selection.set({ anchor: initialAnchor, head: initialHead });
    await editor.simulatePasteEvent({
      pasteAs: 'text/html',
      text: bulletListText,
      html: html,
    });

    await expect(editor).toMatchDocument(
      doc(
        p(
          'Lorem',
          code('- First item'),
          br(),
          code('- Second item'),
          br(),
          code('- Third item'),
          br(),
          code('- Fourth item'),
          ' ipsum dolor sit amet.',
        ),
        p(),
        p('consectetur adipiscing elit.'),
      ),
    );

    const editorPasteModel = EditorPasteModel.from(editor);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      editorPasteModel,
    );

    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();

    await floatingToolbarModel.clickAsRichText();
    await expect(editor).toMatchDocument(
      doc(
        p(
          'Lorem',
          code('- First item'),
          br(),
          code('- Second item'),
          br(),
          code('- Third item'),
          br(),
          code('- Fourth item'),
          ' ipsum dolor sit amet.',
        ),
        p(),
        p('consectetur adipiscing elit.'),
      ),
    );

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 59,
      head: 59,
    });

    // Rich Text to Markdown
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsMarkdown();

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 64,
      head: 64,
    });

    await expect(editor).toMatchDocument(
      doc(
        p('Lorem'),
        ul(
          li(p('First item')),
          li(p('Second item')),
          li(p('Third item')),
          li(p('Fourth item')),
        ),
        p(' ipsum dolor sit amet.'),
        p(),
        p('consectetur adipiscing elit.'),
      ),
    );

    // Markdown to Plain Text
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();

    await floatingToolbarModel.clickAsPlainText();

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 61,
      head: 61,
    });

    await expect(editor).toMatchDocument(
      doc(
        p(`Lorem
- First item
- Second item
- Third item
- Fourth item
 ipsum dolor sit amet.`),
        p(),
        p('consectetur adipiscing elit.'),
      ),
    );

    // Plain Text to Rich Text
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsRichText();

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 59,
      head: 59,
    });

    await expect(editor).toMatchDocument(
      doc(
        p(
          'Lorem',
          code('- First item'),
          br(),
          code('- Second item'),
          br(),
          code('- Third item'),
          br(),
          code('- Fourth item'),
          ' ipsum dolor sit amet.',
        ),
        p(),
        p('consectetur adipiscing elit.'),
      ),
    );
  });
});

test.describe('paste bullet list with text up and below in new line', () => {
  test.use({
    adf: multiLineTextDocument,
  });

  test('toggle rich-text > markdown > plaintext > rich-text', async ({
    editor,
    browserName,
  }) => {
    const bulletListText = `
some initial text

- First item
- Second item
- Third item
- Fourth item

some final text
`;
    const html = `<meta charset="utf-8"><div style="color: #cccccc;background-color: #1f1f1f;font-family: Menlo, Monaco, 'Courier New', monospace;font-weight: normal;font-size: 12px;line-height: 18px;white-space: pre;"><div><span style="color: #ce9178;">some initial text</span></div><br><div><span style="color: #ce9178;">- First item</span></div><div><span style="color: #ce9178;">- Second item</span></div><div><span style="color: #ce9178;">- Third item</span></div><div><span style="color: #ce9178;">- Fourth item</span></div><br><div><span style="color: #ce9178;">some final text</span></div></div>`;

    const initialAnchor = 30;
    const initialHead = 30;

    //setting selection from the beginning to the end
    await editor.selection.set({ anchor: initialAnchor, head: initialHead });
    await editor.simulatePasteEvent({
      pasteAs: 'text/html',
      text: bulletListText,
      html: html,
    });

    await expect(editor).toMatchDocument(
      doc(
        p('Lorem ipsum dolor sit amet.'),
        code_block()(`some initial text

- First item
- Second item
- Third item
- Fourth item

some final text`),
        p(),
        p('consectetur adipiscing elit.'),
      ),
    );

    const editorPasteModel = EditorPasteModel.from(editor);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      editorPasteModel,
    );

    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();

    await floatingToolbarModel.clickAsRichText();

    await expect(editor).toMatchDocument(
      doc(
        p('Lorem ipsum dolor sit amet.'),
        code_block()(`some initial text

- First item
- Second item
- Third item
- Fourth item

some final text`),
        p(),
        p('consectetur adipiscing elit.'),
      ),
    );

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 121,
      head: 121,
    });

    // Rich Text to Markdown
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsMarkdown();

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 124,
      head: 124,
    });

    await expect(editor).toMatchDocument(
      doc(
        p('Lorem ipsum dolor sit amet.'),
        p('some initial text'),
        ul(
          li(p('First item')),
          li(p('Second item')),
          li(p('Third item')),
          li(p('Fourth item')),
        ),
        p('some final text'),
        p('consectetur adipiscing elit.'),
      ),
    );

    // Markdown to Plain Text
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();

    await floatingToolbarModel.clickAsPlainText();

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 121,
      head: 121,
    });

    await expect(editor).toMatchDocument(
      doc(
        p('Lorem ipsum dolor sit amet.'),
        p(`
some initial text

- First item
- Second item
- Third item
- Fourth item

some final text
`),
        p('consectetur adipiscing elit.'),
      ),
    );

    // Plain Text to Rich Text
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsRichText();

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 121,
      head: 121,
    });

    await expect(editor).toMatchDocument(
      doc(
        p('Lorem ipsum dolor sit amet.'),
        code_block()(`some initial text

- First item
- Second item
- Third item
- Fourth item

some final text`),
        p(),
        p('consectetur adipiscing elit.'),
      ),
    );
  });
});

test.describe('paste ordered list in empty doc', () => {
  test.use({
    adf: emptyDocument,
  });

  test('toggle rich-text > markdown > plaintext > rich-text', async ({
    editor,
    browserName,
  }) => {
    const orderedListText = `
1. First item
2. Second item
3. Third item
4. Fourth item
`;
    const html = `<meta charset="utf-8"><span style="color: rgb(33, 37, 41); font-family: SFMono-Regular, Menlo, Monaco, Consolas, &quot;liberation mono&quot;, &quot;courier new&quot;, monospace; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">1. First item</span><br style="box-sizing: border-box; color: rgb(33, 37, 41); font-family: SFMono-Regular, Menlo, Monaco, Consolas, &quot;liberation mono&quot;, &quot;courier new&quot;, monospace; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><span style="color: rgb(33, 37, 41); font-family: SFMono-Regular, Menlo, Monaco, Consolas, &quot;liberation mono&quot;, &quot;courier new&quot;, monospace; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">2. Second item</span><br style="box-sizing: border-box; color: rgb(33, 37, 41); font-family: SFMono-Regular, Menlo, Monaco, Consolas, &quot;liberation mono&quot;, &quot;courier new&quot;, monospace; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><span style="color: rgb(33, 37, 41); font-family: SFMono-Regular, Menlo, Monaco, Consolas, &quot;liberation mono&quot;, &quot;courier new&quot;, monospace; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">3. Third item</span><br style="box-sizing: border-box; color: rgb(33, 37, 41); font-family: SFMono-Regular, Menlo, Monaco, Consolas, &quot;liberation mono&quot;, &quot;courier new&quot;, monospace; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><span style="color: rgb(33, 37, 41); font-family: SFMono-Regular, Menlo, Monaco, Consolas, &quot;liberation mono&quot;, &quot;courier new&quot;, monospace; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">4. Fourth item</span>`;

    const initialAnchor = 1;
    const initialHead = 1;

    //setting selection from the beginning to the end
    await editor.selection.set({ anchor: initialAnchor, head: initialHead });
    await editor.simulatePasteEvent({
      pasteAs: 'text/html',
      text: orderedListText,
      html: html,
    });

    await expect(editor).toMatchDocument(
      doc(
        p(
          code('1. First item'),
          br(),
          code('2. Second item'),
          br(),
          code('3. Third item'),
          br(),
          code('4. Fourth item'),
        ),
      ),
    );

    const editorPasteModel = EditorPasteModel.from(editor);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      editorPasteModel,
    );

    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();

    await floatingToolbarModel.clickAsRichText();
    await expect(editor).toMatchDocument(
      doc(
        p(
          code('1. First item'),
          br(),
          code('2. Second item'),
          br(),
          code('3. Third item'),
          br(),
          code('4. Fourth item'),
        ),
      ),
    );

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 58,
      head: 58,
    });

    // Rich Text to Markdown
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsMarkdown();

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 57,
      head: 57,
    });

    await expect(editor).toMatchDocument(
      doc(
        ol({ order: 1 })(
          li(p('First item')),
          li(p('Second item')),
          li(p('Third item')),
          li(p('Fourth item')),
        ),
      ),
    );

    // Markdown to Plain Text
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();

    await floatingToolbarModel.clickAsPlainText();

    //CAUTION: List is dropping one line down in chromium
    //This is not happening in Chrome
    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 60, //this is 58 in Chrome
      head: 60, //this is 58 in Chrome
    });

    await expect(editor).toMatchDocument(doc(p(orderedListText)));

    // Plain Text to Rich Text
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsRichText();

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 58,
      head: 58,
    });

    await expect(editor).toMatchDocument(
      doc(
        p(
          code('1. First item'),
          br(),
          code('2. Second item'),
          br(),
          code('3. Third item'),
          br(),
          code('4. Fourth item'),
        ),
      ),
    );
  });
});

test.describe('paste ordered list in-between two lines', () => {
  test.use({
    adf: multiLineTextDocument,
  });

  test('toggle rich-text > markdown > plaintext > rich-text', async ({
    editor,
    browserName,
  }) => {
    const orderedListText = `
1. First item
2. Second item
3. Third item
4. Fourth item
`;
    const html = `<meta charset="utf-8"><span style="color: rgb(33, 37, 41); font-family: SFMono-Regular, Menlo, Monaco, Consolas, &quot;liberation mono&quot;, &quot;courier new&quot;, monospace; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">1. First item</span><br style="box-sizing: border-box; color: rgb(33, 37, 41); font-family: SFMono-Regular, Menlo, Monaco, Consolas, &quot;liberation mono&quot;, &quot;courier new&quot;, monospace; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><span style="color: rgb(33, 37, 41); font-family: SFMono-Regular, Menlo, Monaco, Consolas, &quot;liberation mono&quot;, &quot;courier new&quot;, monospace; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">2. Second item</span><br style="box-sizing: border-box; color: rgb(33, 37, 41); font-family: SFMono-Regular, Menlo, Monaco, Consolas, &quot;liberation mono&quot;, &quot;courier new&quot;, monospace; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><span style="color: rgb(33, 37, 41); font-family: SFMono-Regular, Menlo, Monaco, Consolas, &quot;liberation mono&quot;, &quot;courier new&quot;, monospace; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">3. Third item</span><br style="box-sizing: border-box; color: rgb(33, 37, 41); font-family: SFMono-Regular, Menlo, Monaco, Consolas, &quot;liberation mono&quot;, &quot;courier new&quot;, monospace; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><span style="color: rgb(33, 37, 41); font-family: SFMono-Regular, Menlo, Monaco, Consolas, &quot;liberation mono&quot;, &quot;courier new&quot;, monospace; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">4. Fourth item</span>`;

    const initialAnchor = 30;
    const initialHead = 30;

    //setting selection from the beginning to the end
    await editor.selection.set({ anchor: initialAnchor, head: initialHead });
    await editor.simulatePasteEvent({
      pasteAs: 'text/html',
      text: orderedListText,
      html: html,
    });

    await expect(editor).toMatchDocument(
      doc(
        p('Lorem ipsum dolor sit amet.'),
        p(
          code('1. First item'),
          br(),
          code('2. Second item'),
          br(),
          code('3. Third item'),
          br(),
          code('4. Fourth item'),
        ),
        p('consectetur adipiscing elit.'),
      ),
    );

    const editorPasteModel = EditorPasteModel.from(editor);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      editorPasteModel,
    );

    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();

    await floatingToolbarModel.clickAsRichText();
    await expect(editor).toMatchDocument(
      doc(
        p('Lorem ipsum dolor sit amet.'),
        p(
          code('1. First item'),
          br(),
          code('2. Second item'),
          br(),
          code('3. Third item'),
          br(),
          code('4. Fourth item'),
        ),
        p('consectetur adipiscing elit.'),
      ),
    );

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 87,
      head: 87,
    });

    // Rich Text to Markdown
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsMarkdown();

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 86,
      head: 86,
    });

    await expect(editor).toMatchDocument(
      doc(
        p('Lorem ipsum dolor sit amet.'),
        ol({ order: 1 })(
          li(p('First item')),
          li(p('Second item')),
          li(p('Third item')),
          li(p('Fourth item')),
        ),
        p('consectetur adipiscing elit.'),
      ),
    );

    // Markdown to Plain Text
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();

    await floatingToolbarModel.clickAsPlainText();

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 89,
      head: 89,
    });

    await expect(editor).toMatchDocument(
      doc(
        p('Lorem ipsum dolor sit amet.'),
        p(orderedListText),
        p('consectetur adipiscing elit.'),
      ),
    );

    // Plain Text to Rich Text
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsRichText();

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 87,
      head: 87,
    });

    await expect(editor).toMatchDocument(
      doc(
        p('Lorem ipsum dolor sit amet.'),
        p(
          code('1. First item'),
          br(),
          code('2. Second item'),
          br(),
          code('3. Third item'),
          br(),
          code('4. Fourth item'),
        ),
        p('consectetur adipiscing elit.'),
      ),
    );
  });
});

test.describe('paste ordered list in-between characters on same line', () => {
  test.use({
    adf: multiLineTextDocument,
  });

  test('toggle rich-text > markdown > plaintext > rich-text', async ({
    editor,
    browserName,
  }) => {
    const orderedListText = `
1. First item
2. Second item
3. Third item
4. Fourth item
`;
    const html = `<meta charset="utf-8"><span style="color: rgb(33, 37, 41); font-family: SFMono-Regular, Menlo, Monaco, Consolas, &quot;liberation mono&quot;, &quot;courier new&quot;, monospace; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">1. First item</span><br style="box-sizing: border-box; color: rgb(33, 37, 41); font-family: SFMono-Regular, Menlo, Monaco, Consolas, &quot;liberation mono&quot;, &quot;courier new&quot;, monospace; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><span style="color: rgb(33, 37, 41); font-family: SFMono-Regular, Menlo, Monaco, Consolas, &quot;liberation mono&quot;, &quot;courier new&quot;, monospace; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">2. Second item</span><br style="box-sizing: border-box; color: rgb(33, 37, 41); font-family: SFMono-Regular, Menlo, Monaco, Consolas, &quot;liberation mono&quot;, &quot;courier new&quot;, monospace; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><span style="color: rgb(33, 37, 41); font-family: SFMono-Regular, Menlo, Monaco, Consolas, &quot;liberation mono&quot;, &quot;courier new&quot;, monospace; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">3. Third item</span><br style="box-sizing: border-box; color: rgb(33, 37, 41); font-family: SFMono-Regular, Menlo, Monaco, Consolas, &quot;liberation mono&quot;, &quot;courier new&quot;, monospace; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><span style="color: rgb(33, 37, 41); font-family: SFMono-Regular, Menlo, Monaco, Consolas, &quot;liberation mono&quot;, &quot;courier new&quot;, monospace; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">4. Fourth item</span>`;

    const initialAnchor = 6;
    const initialHead = 6;

    //setting selection from the beginning to the end
    await editor.selection.set({ anchor: initialAnchor, head: initialHead });
    await editor.simulatePasteEvent({
      pasteAs: 'text/html',
      text: orderedListText,
      html: html,
    });

    await expect(editor).toMatchDocument(
      doc(
        p(
          'Lorem',
          code('1. First item'),
          br(),
          code('2. Second item'),
          br(),
          code('3. Third item'),
          br(),
          code('4. Fourth item'),
          ' ipsum dolor sit amet.',
        ),
        p(),
        p('consectetur adipiscing elit.'),
      ),
    );

    const editorPasteModel = EditorPasteModel.from(editor);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      editorPasteModel,
    );

    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();

    await floatingToolbarModel.clickAsRichText();
    await expect(editor).toMatchDocument(
      doc(
        p(
          'Lorem',
          code('1. First item'),
          br(),
          code('2. Second item'),
          br(),
          code('3. Third item'),
          br(),
          code('4. Fourth item'),
          ' ipsum dolor sit amet.',
        ),
        p(),
        p('consectetur adipiscing elit.'),
      ),
    );

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 63,
      head: 63,
    });

    // Rich Text to Markdown
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsMarkdown();

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 64,
      head: 64,
    });

    await expect(editor).toMatchDocument(
      doc(
        p('Lorem'),
        ol({ order: 1 })(
          li(p('First item')),
          li(p('Second item')),
          li(p('Third item')),
          li(p('Fourth item')),
        ),
        p(' ipsum dolor sit amet.'),
        p(),
        p('consectetur adipiscing elit.'),
      ),
    );

    // Markdown to Plain Text
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();

    await floatingToolbarModel.clickAsPlainText();

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 65,
      head: 65,
    });

    await expect(editor).toMatchDocument(
      doc(
        p(`Lorem
1. First item
2. Second item
3. Third item
4. Fourth item
 ipsum dolor sit amet.`),
        p(),
        p('consectetur adipiscing elit.'),
      ),
    );

    // Plain Text to Rich Text
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsRichText();

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 63,
      head: 63,
    });

    await expect(editor).toMatchDocument(
      doc(
        p(
          'Lorem',
          code('1. First item'),
          br(),
          code('2. Second item'),
          br(),
          code('3. Third item'),
          br(),
          code('4. Fourth item'),
          ' ipsum dolor sit amet.',
        ),
        p(),
        p('consectetur adipiscing elit.'),
      ),
    );
  });
});
