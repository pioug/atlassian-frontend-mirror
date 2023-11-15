import {
  EditorFloatingToolbarModel,
  EditorPasteModel,
  editorTestCase as test,
  expect,
} from '@af/editor-libra';

// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  p,
  doc,
  code,
  strong,
  em,
} from '@atlaskit/editor-test-helpers/doc-builder';

import {
  emptyDocument,
  multiLineTextDocument,
} from './../__fixtures__/adf-document';

test.use({
  editorProps: {
    appearance: 'full-page',
  },
  platformFeatureFlags: {
    'platform.editor.paste-options-toolbar': true,
  },
});

test.describe('Emphasis - bold', () => {
  /*
   * Lorem ipsum dolor sit amet.
   *
   * consectetur adipiscing elit.
   */
  test.use({
    adf: multiLineTextDocument,
  });

  const paragraphText = 'Some new **rich text** to be inserted.';
  const html = `<meta charset="utf-8"><div style="color: #cccccc;background-color: #1f1f1f;font-family: Menlo, Monaco, 'Courier New', monospace;font-weight: normal;font-size: 12px;line-height: 18px;white-space: pre;"><div><span style="color: #ce9178;">Some new **rich text** to be inserted.</span></div></div>`;

  test('in-between two lines: toggle rich-text > markdown > plaintext -> rich-text', async ({
    editor,
    browserName,
  }) => {
    //beginning of second line
    const initialAnchor = 30;
    const initialHead = 30;

    await editor.selection.set({ anchor: initialAnchor, head: initialHead });
    await expect(editor).toMatchDocument(
      doc(
        p('Lorem ipsum dolor sit amet.'),
        p(),
        p('consectetur adipiscing elit.'),
      ),
    );

    await editor.simulatePasteEvent({
      pasteAs: 'text/html',
      text: paragraphText,
      html: html,
    });

    await expect(editor).toMatchDocument(
      doc(
        p('Lorem ipsum dolor sit amet.'),
        p(code('Some new **rich text** to be inserted.')),
        p('consectetur adipiscing elit.', '{<>}'),
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
        p(code(paragraphText)),
        p('consectetur adipiscing elit.', '{<>}'),
      ),
    );

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: initialAnchor + paragraphText.length,
      head: initialHead + paragraphText.length,
    });

    // Rich Text to Markdown
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsMarkdown();

    // the conversion would be -4 in size since it would not include markdown
    // syntax for bold on either ends.
    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: initialAnchor + paragraphText.length - 4,
      head: initialAnchor + paragraphText.length - 4,
    });

    await expect(editor).toMatchDocument(
      doc(
        p('Lorem ipsum dolor sit amet.'),
        p('Some new ', strong('rich text'), ' to be inserted.'),
        p('consectetur adipiscing elit.'),
      ),
    );

    // Markdown to Plain Text
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsPlainText();

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: initialAnchor + paragraphText.length,
      head: initialAnchor + paragraphText.length,
    });

    await expect(editor).toMatchDocument(
      doc(
        p('Lorem ipsum dolor sit amet.'),
        p(paragraphText),
        p('consectetur adipiscing elit.'),
      ),
    );

    // Plain Text to Rich Text
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsRichText();

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: initialAnchor + paragraphText.length,
      head: initialAnchor + paragraphText.length,
    });

    await expect(editor).toMatchDocument(
      doc(
        p('Lorem ipsum dolor sit amet.'),
        p(code(paragraphText)),
        p('consectetur adipiscing elit.'),
      ),
    );
  });

  test('in-between two words on a single line: toggle rich-text > markdown > plaintext > rich-text', async ({
    editor,
    browserName,
  }) => {
    //setting cursor at the end of word `Lorem`
    const initialAnchor = 6;
    const initialHead = 6;

    await editor.selection.set({ anchor: initialAnchor, head: initialHead });
    await expect(editor).toMatchDocument(
      doc(
        p('Lorem ipsum dolor sit amet.'),
        p(),
        p('consectetur adipiscing elit.'),
      ),
    );

    await editor.simulatePasteEvent({
      pasteAs: 'text/html',
      text: paragraphText,
      html: html,
    });

    await expect(editor).toMatchDocument(
      doc(
        p('Lorem', code(paragraphText), ' ipsum dolor sit amet.'),
        p(),
        p('consectetur adipiscing elit.', '{<>}'),
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
        p('Lorem', code(paragraphText), ' ipsum dolor sit amet.'),
        p(),
        p('consectetur adipiscing elit.', '{<>}'),
      ),
    );

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: initialAnchor + paragraphText.length,
      head: initialHead + paragraphText.length,
    });

    // Rich Text to Markdown
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsMarkdown();

    // the conversion would be -4 in size since it would not include markdown
    // syntax for bold on either ends.
    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: initialAnchor + paragraphText.length - 4,
      head: initialAnchor + paragraphText.length - 4,
    });

    await expect(editor).toMatchDocument(
      doc(
        p(
          'LoremSome new ',
          strong('rich text'),
          ' to be inserted. ipsum dolor sit amet.',
        ),
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
      anchor: initialAnchor + paragraphText.length,
      head: initialAnchor + paragraphText.length,
    });

    await expect(editor).toMatchDocument(
      doc(
        p('Lorem', paragraphText, ' ipsum dolor sit amet.'),
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
      anchor: initialAnchor + paragraphText.length,
      head: initialAnchor + paragraphText.length,
    });

    await expect(editor).toMatchDocument(
      doc(
        p('Lorem', code(paragraphText), ' ipsum dolor sit amet.'),
        p(),
        p('consectetur adipiscing elit.', '{<>}'),
      ),
    );
  });
});

test.describe('Emphasis - italics', () => {
  /*
   * Lorem ipsum dolor sit amet.
   *
   * consectetur adipiscing elit.
   */
  test.use({
    adf: multiLineTextDocument,
  });

  const paragraphText = 'Some new *rich text* to be inserted.';
  const html = `<meta charset="utf-8"><div style="color: #cccccc;background-color: #1f1f1f;font-family: Menlo, Monaco, 'Courier New', monospace;font-weight: normal;font-size: 12px;line-height: 18px;white-space: pre;"><div><span style="color: #ce9178;">Some new *rich text* to be inserted.</span></div></div>`;

  test('in-between two lines: toggle rich-text > markdown > plaintext -> rich-text', async ({
    editor,
    browserName,
  }) => {
    //beginning of second line
    const initialAnchor = 30;
    const initialHead = 30;

    await editor.selection.set({ anchor: initialAnchor, head: initialHead });
    await expect(editor).toMatchDocument(
      doc(
        p('Lorem ipsum dolor sit amet.'),
        p(),
        p('consectetur adipiscing elit.'),
      ),
    );

    await editor.simulatePasteEvent({
      pasteAs: 'text/html',
      text: paragraphText,
      html: html,
    });

    await expect(editor).toMatchDocument(
      doc(
        p('Lorem ipsum dolor sit amet.'),
        p(code('Some new *rich text* to be inserted.')),
        p('consectetur adipiscing elit.', '{<>}'),
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
        p(code(paragraphText)),
        p('consectetur adipiscing elit.', '{<>}'),
      ),
    );

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: initialAnchor + paragraphText.length,
      head: initialHead + paragraphText.length,
    });

    // Rich Text to Markdown
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsMarkdown();

    // the conversion would be -2 in size since it would not include markdown
    // syntax for italics on either ends.
    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: initialAnchor + paragraphText.length - 2,
      head: initialAnchor + paragraphText.length - 2,
    });

    await expect(editor).toMatchDocument(
      doc(
        p('Lorem ipsum dolor sit amet.'),
        p('Some new ', em('rich text'), ' to be inserted.'),
        p('consectetur adipiscing elit.'),
      ),
    );

    // Markdown to Plain Text
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsPlainText();

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: initialAnchor + paragraphText.length,
      head: initialAnchor + paragraphText.length,
    });

    await expect(editor).toMatchDocument(
      doc(
        p('Lorem ipsum dolor sit amet.'),
        p(paragraphText),
        p('consectetur adipiscing elit.'),
      ),
    );

    // Plain Text to Rich Text
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsRichText();

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: initialAnchor + paragraphText.length,
      head: initialAnchor + paragraphText.length,
    });

    await expect(editor).toMatchDocument(
      doc(
        p('Lorem ipsum dolor sit amet.'),
        p(code(paragraphText)),
        p('consectetur adipiscing elit.'),
      ),
    );
  });

  test('in-between two words on a single line: toggle rich-text > markdown > plaintext > rich-text', async ({
    editor,
    browserName,
  }) => {
    //setting cursor at the end of word `Lorem`
    const initialAnchor = 6;
    const initialHead = 6;

    await editor.selection.set({ anchor: initialAnchor, head: initialHead });
    await expect(editor).toMatchDocument(
      doc(
        p('Lorem ipsum dolor sit amet.'),
        p(),
        p('consectetur adipiscing elit.'),
      ),
    );

    await editor.simulatePasteEvent({
      pasteAs: 'text/html',
      text: paragraphText,
      html: html,
    });

    await expect(editor).toMatchDocument(
      doc(
        p('Lorem', code(paragraphText), ' ipsum dolor sit amet.'),
        p(),
        p('consectetur adipiscing elit.', '{<>}'),
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
        p('Lorem', code(paragraphText), ' ipsum dolor sit amet.'),
        p(),
        p('consectetur adipiscing elit.', '{<>}'),
      ),
    );

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: initialAnchor + paragraphText.length,
      head: initialHead + paragraphText.length,
    });

    // Rich Text to Markdown
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsMarkdown();

    // the conversion would be -4 in size since it would not include markdown
    // syntax for italics on either ends.
    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: initialAnchor + paragraphText.length - 2,
      head: initialAnchor + paragraphText.length - 2,
    });

    await expect(editor).toMatchDocument(
      doc(
        p(
          'LoremSome new ',
          em('rich text'),
          ' to be inserted. ipsum dolor sit amet.',
        ),
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
      anchor: initialAnchor + paragraphText.length,
      head: initialAnchor + paragraphText.length,
    });

    await expect(editor).toMatchDocument(
      doc(
        p('Lorem', paragraphText, ' ipsum dolor sit amet.'),
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
      anchor: initialAnchor + paragraphText.length,
      head: initialAnchor + paragraphText.length,
    });

    await expect(editor).toMatchDocument(
      doc(
        p('Lorem', code(paragraphText), ' ipsum dolor sit amet.'),
        p(),
        p('consectetur adipiscing elit.', '{<>}'),
      ),
    );
  });
});

test.describe('Emphasis - bold & italics', () => {
  /*
   * Lorem ipsum dolor sit amet.
   *
   * consectetur adipiscing elit.
   */
  test.use({
    adf: multiLineTextDocument,
  });

  const paragraphText = '***Some*** new *rich text* to be **inserted.**';
  const html = `<meta charset="utf-8"><div style="color: #cccccc;background-color: #1f1f1f;font-family: Menlo, Monaco, 'Courier New', monospace;font-weight: normal;font-size: 12px;line-height: 18px;white-space: pre;"><div><span style="color: #ce9178;">***Some*** new *rich text* to be **inserted.**</span></div></div>`;

  test('in-between two lines: toggle rich-text > markdown > plaintext -> rich-text', async ({
    editor,
    browserName,
  }) => {
    //beginning of second line
    const initialAnchor = 30;
    const initialHead = 30;

    await editor.selection.set({ anchor: initialAnchor, head: initialHead });
    await expect(editor).toMatchDocument(
      doc(
        p('Lorem ipsum dolor sit amet.'),
        p(),
        p('consectetur adipiscing elit.'),
      ),
    );

    await editor.simulatePasteEvent({
      pasteAs: 'text/html',
      text: paragraphText,
      html: html,
    });

    await expect(editor).toMatchDocument(
      doc(
        p('Lorem ipsum dolor sit amet.'),
        p(code('***Some*** new *rich text* to be **inserted.**')),
        p('consectetur adipiscing elit.', '{<>}'),
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
        p(code(paragraphText)),
        p('consectetur adipiscing elit.', '{<>}'),
      ),
    );

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: initialAnchor + paragraphText.length,
      head: initialHead + paragraphText.length,
    });

    // Rich Text to Markdown
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsMarkdown();

    // the conversion would be -12 in size since it would not include markdown
    // syntax for bold & italics on either ends.
    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: initialAnchor + paragraphText.length - 12,
      head: initialAnchor + paragraphText.length - 12,
    });

    await expect(editor).toMatchDocument(
      doc(
        p('Lorem ipsum dolor sit amet.'),
        p(
          em(strong('Some')),
          ' new ',
          em('rich text'),
          ' to be ',
          strong('inserted.'),
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
      anchor: initialAnchor + paragraphText.length,
      head: initialAnchor + paragraphText.length,
    });

    await expect(editor).toMatchDocument(
      doc(
        p('Lorem ipsum dolor sit amet.'),
        p(paragraphText),
        p('consectetur adipiscing elit.'),
      ),
    );

    // Plain Text to Rich Text
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsRichText();

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: initialAnchor + paragraphText.length,
      head: initialAnchor + paragraphText.length,
    });

    await expect(editor).toMatchDocument(
      doc(
        p('Lorem ipsum dolor sit amet.'),
        p(code(paragraphText)),
        p('consectetur adipiscing elit.'),
      ),
    );
  });

  test('in-between two words on a single line: toggle rich-text > markdown > plaintext > rich-text', async ({
    editor,
    browserName,
  }) => {
    //setting cursor at the end of word `Lorem`
    const initialAnchor = 6;
    const initialHead = 6;

    await editor.selection.set({ anchor: initialAnchor, head: initialHead });
    await expect(editor).toMatchDocument(
      doc(
        p('Lorem ipsum dolor sit amet.'),
        p(),
        p('consectetur adipiscing elit.'),
      ),
    );

    await editor.simulatePasteEvent({
      pasteAs: 'text/html',
      text: paragraphText,
      html: html,
    });

    await expect(editor).toMatchDocument(
      doc(
        p('Lorem', code(paragraphText), ' ipsum dolor sit amet.'),
        p(),
        p('consectetur adipiscing elit.', '{<>}'),
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
        p('Lorem', code(paragraphText), ' ipsum dolor sit amet.'),
        p(),
        p('consectetur adipiscing elit.', '{<>}'),
      ),
    );

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: initialAnchor + paragraphText.length,
      head: initialHead + paragraphText.length,
    });

    // Rich Text to Markdown
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsMarkdown();

    // the conversion would be -6 in size since it would not include markdown
    // syntax for bold & italics on either ends.
    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: initialAnchor + paragraphText.length - 12,
      head: initialAnchor + paragraphText.length - 12,
    });

    await expect(editor).toMatchDocument(
      doc(
        p(
          'Lorem',
          em(strong('Some')),
          ' new ',
          em('rich text'),
          ' to be ',
          strong('inserted.'),
          ' ipsum dolor sit amet.',
        ),
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
      anchor: initialAnchor + paragraphText.length,
      head: initialAnchor + paragraphText.length,
    });

    await expect(editor).toMatchDocument(
      doc(
        p('Lorem', paragraphText, ' ipsum dolor sit amet.'),
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
      anchor: initialAnchor + paragraphText.length,
      head: initialAnchor + paragraphText.length,
    });

    await expect(editor).toMatchDocument(
      doc(
        p('Lorem', code(paragraphText), ' ipsum dolor sit amet.'),
        p(),
        p('consectetur adipiscing elit.', '{<>}'),
      ),
    );
  });
});

test.describe('Cursor position tests: pasting basic markdown between paragraphs', () => {
  test.use({
    adf: multiLineTextDocument,
  });
  const markDownText = '*Italic*, **bold**, and `monospace`';
  const markDownHtml = `<meta charset="utf-8"><div style="color: #c5c8c6;background-color: #1e1e1e;font-family: Menlo, Monaco, 'Courier New', monospace;font-weight: normal;font-size: 12px;line-height: 18px;white-space: pre;"><div><span style="color: #9aa83a;">*Italic*, **bold**, and \`monospace\`</span></div></div>`;
  test('On pasting markdown content as plain text', async ({ editor }) => {
    await editor.selection.set({ anchor: 30, head: 30 });
    await editor.simulatePasteEvent({
      pasteAs: 'text/plain',
      text: markDownText,
    });
    // Initialise the floating toolbar model for Paste options toolbar
    const editorPasteModel = EditorPasteModel.from(editor);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      editorPasteModel,
    );

    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsPlainText();

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 65,
      head: 65,
    });
  });

  test('On pasting markdown content as plain text and changing to Markdown', async ({
    editor,
  }) => {
    await editor.selection.set({ anchor: 30, head: 30 });
    await editor.simulatePasteEvent({
      pasteAs: 'text/plain',
      text: markDownText,
    });
    // Initialise the floating toolbar model for Paste options toolbar
    const editorPasteModel = EditorPasteModel.from(editor);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      editorPasteModel,
    );

    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsMarkdown();

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 57,
      head: 57,
    });
  });

  test('On pasting markdown content as rich text', async ({ editor }) => {
    await editor.selection.set({ anchor: 30, head: 30 });
    await editor.simulatePasteEvent({
      pasteAs: 'text/html',
      text: markDownText,
      html: markDownHtml,
    });

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 65,
      head: 65,
    });
  });

  test('On pasting markdown content as rich text and changing to Markdown', async ({
    editor,
    browserName,
  }) => {
    await editor.selection.set({ anchor: 30, head: 30 });
    await editor.simulatePasteEvent({
      pasteAs: 'text/html',
      text: markDownText,
      html: markDownHtml,
    });
    // Initialise the floating toolbar model for Paste options toolbar
    const editorPasteModel = EditorPasteModel.from(editor);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      editorPasteModel,
    );

    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsMarkdown();

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 57,
      head: 57,
    });
  });

  test('On pasting markdown content as rich text and changing to PlainText', async ({
    editor,
  }) => {
    await editor.selection.set({ anchor: 30, head: 30 });
    await editor.simulatePasteEvent({
      pasteAs: 'text/html',
      text: markDownText,
      html: markDownHtml,
    });
    // Initialise the floating toolbar model for Paste options toolbar
    const editorPasteModel = EditorPasteModel.from(editor);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      editorPasteModel,
    );

    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsPlainText();

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 65,
      head: 65,
    });
  });
});

test.describe('Cursor position tests: Paste markdown text with escape characters', () => {
  const plainText =
    '\\* Without the backslash, this would be a bullet in an unordered list.';
  const htmlText =
    '<meta charset="utf-8"><pre class="highlight" style="box-sizing: border-box; font-family: SFMono-Regular, Menlo, Monaco, Consolas, &quot;Liberation Mono&quot;, &quot;Courier New&quot;, monospace; font-size: 14px; margin-top: 0px; margin-bottom: 20px; overflow: auto; display: block; color: rgb(33, 37, 41); background: rgb(248, 248, 248); padding: 10px 10px 1px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><code style="box-sizing: border-box; font-family: SFMono-Regular, Menlo, Monaco, Consolas, &quot;Liberation Mono&quot;, &quot;Courier New&quot;, monospace; font-size: inherit; color: inherit; overflow-wrap: break-word; word-break: normal;">* Without the backslash, this would be a bullet in an unordered list.</code></pre>';

  test.use({
    adf: emptyDocument,
  });

  test('Text should be rendered as plain text', async ({ editor }) => {
    await editor.simulatePasteEvent({
      pasteAs: 'text/plain',
      text: plainText,
      html: htmlText,
    });
    const editorPasteModel = EditorPasteModel.from(editor);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      editorPasteModel,
    );

    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsMarkdown();
    await expect(editor).toMatchDocument(
      doc(
        p(
          '\\* Without the backslash, this would be a bullet in an unordered list.',
        ),
      ),
    );

    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsPlainText();
    await expect(editor).toMatchDocument(
      doc(
        p(
          '\\* Without the backslash, this would be a bullet in an unordered list.',
        ),
      ),
    );
  });
});

test.describe('On Paste: ', () => {
  test.use({
    adf: emptyDocument,
  });

  const markDownText = '*Italic*, **bold**, and `monospace`';
  const markDownHtml = `<meta charset="utf-8"><div style="color: #c5c8c6;background-color: #1e1e1e;font-family: Menlo, Monaco, 'Courier New', monospace;font-weight: normal;font-size: 12px;line-height: 18px;white-space: pre;"><div><span style="color: #9aa83a;">*Italic*, **bold**, and \`monospace\`</span></div></div>`;

  test(`pasting text should show the toolbar`, async ({ editor }) => {
    await editor.simulatePasteEvent({
      pasteAs: 'text/plain',
      text: 'simple text',
    });

    // Initialise the floating toolbar model for Paste options toolbar
    const editorPasteModel = EditorPasteModel.from(editor);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      editorPasteModel,
    );

    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.waitForStable();

    // Validate available popup menu options
    await expect(floatingToolbarModel.optionsPopup).toBeVisible();
    await expect(floatingToolbarModel.textHighlight).toBeVisible();
    await expect(floatingToolbarModel.markDownOption).toBeVisible();
    await expect(floatingToolbarModel.richTextOption).toBeHidden();
    await expect(floatingToolbarModel.plainTextOption).toBeVisible();
  });

  test(`pasting plain-text, then convert to plain-text should work`, async ({
    editor,
    browserName,
  }) => {
    await editor.simulatePasteEvent({
      pasteAs: 'text/plain',
      text: markDownText,
    });

    // Initialise the floating toolbar model for Paste options toolbar
    const editorPasteModel = EditorPasteModel.from(editor);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      editorPasteModel,
    );

    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsPlainText();

    await expect(floatingToolbarModel.textHighlight).toBeVisible();

    await expect(editor).toMatchDocument(
      doc(p('*Italic*, **bold**, and `monospace`')),
    );
  });

  test(`pasting plain-text, then convert to markdown should work`, async ({
    editor,
    browserName,
  }) => {
    await editor.simulatePasteEvent({
      pasteAs: 'text/plain',
      text: markDownText,
    });

    // Initialise the floating toolbar model for Paste options toolbar
    const editorPasteModel = EditorPasteModel.from(editor);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      editorPasteModel,
    );

    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();

    await floatingToolbarModel.clickAsMarkdown();
    await expect(editor).toMatchDocument(
      doc(p(em('Italic'), ', ', strong('bold'), ', and ', code('monospace'))),
    );
  });

  // Tests for the cases when Clipboard content is HTML Text
  test(`pasting html text should show the toolbar`, async ({ editor }) => {
    await editor.simulatePasteEvent({
      pasteAs: 'text/html',
      text: markDownText,
      html: markDownHtml,
    });

    // Initialise the floating toolbar model for Paste options toolbar
    const editorPasteModel = EditorPasteModel.from(editor);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      editorPasteModel,
    );

    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();

    // Validate available popup menu options
    await expect(floatingToolbarModel.optionsPopup).toBeVisible();
    await expect(floatingToolbarModel.richTextOption).toBeVisible();
    await expect(floatingToolbarModel.markDownOption).toBeVisible();
    await expect(floatingToolbarModel.plainTextOption).toBeVisible();
  });

  test(`pasting html text, then convert to plain text should work`, async ({
    editor,
    browserName,
  }) => {
    await editor.simulatePasteEvent({
      pasteAs: 'text/html',
      text: markDownText,
      html: markDownHtml,
    });

    // Initialise the floating toolbar model for Paste options toolbar
    const editorPasteModel = EditorPasteModel.from(editor);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      editorPasteModel,
    );

    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsPlainText();

    //since plaintext(text/plain) is empty,
    //content of editor stays unchanged
    await expect(editor).toMatchDocument(doc(p(markDownText)));
  });

  test(`pasting html text, then convert to markdown should work`, async ({
    editor,
    browserName,
  }) => {
    await editor.simulatePasteEvent({
      pasteAs: 'text/html',
      text: markDownText,
      html: markDownHtml,
    });

    const editorPasteModel = EditorPasteModel.from(editor);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      editorPasteModel,
    );

    await floatingToolbarModel.waitForStable();

    await expect(editor).toMatchDocument(doc(p(code(markDownText))));

    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsMarkdown();

    await expect(editor).toMatchDocument(
      doc(p(em('Italic'), ', ', strong('bold'), ', and ', code('monospace'))),
    );
  });

  test(`pasting html should auto-format to rich-text`, async ({
    editor,
    browserName,
  }) => {
    await editor.simulatePasteEvent({
      pasteAs: 'text/html',
      text: `Initialise`,
      html: `<meta charset="utf-8"><div style="color: #cccccc;background-color: #1f1f1f;font-family: Menlo, Monaco, 'Courier New', monospace;font-weight: normal;font-size: 12px;line-height: 18px;white-space: pre;"><div><span style="color: #6a9955;">Initialise</span></div></div>`,
    });

    const editorPasteModel = EditorPasteModel.from(editor);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      editorPasteModel,
    );

    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();

    await expect(editor).toMatchDocument(doc(p(code('Initialise'))));
  });

  test(`pasting plain-text, then mouse click outside should dismiss the toolbar`, async ({
    editor,
  }) => {
    await editor.simulatePasteEvent({
      pasteAs: 'text/plain',
      text: markDownText,
    });

    const editorPasteModel = EditorPasteModel.from(editor);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      editorPasteModel,
    );

    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.optionsPopup.waitFor({ state: 'visible' });

    expect(await floatingToolbarModel.optionsPopup.isVisible()).toEqual(true);
    await editor.page.mouse.move(0, 0); //move cursor to outside of toolbar
    await editor.page.mouse.down();

    await floatingToolbarModel.optionsPopup.waitFor({ state: 'hidden' });
    expect(await floatingToolbarModel.optionsPopup.isVisible()).toEqual(false);
  });

  test(`pasting plain-text, then key press should dismiss the toolbar`, async ({
    editor,
  }) => {
    await editor.simulatePasteEvent({
      pasteAs: 'text/plain',
      text: markDownText,
    });

    // Initialise the floating toolbar model for Paste options toolbar
    const editorPasteModel = EditorPasteModel.from(editor);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      editorPasteModel,
    );

    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();

    await expect(floatingToolbarModel.optionsPopup).toBeVisible();
    await editor.keyboard.press('Space');
    await expect(floatingToolbarModel.optionsPopup).toBeHidden();
  });
});
