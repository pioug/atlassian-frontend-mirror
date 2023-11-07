import {
  EditorFloatingToolbarModel,
  EditorPasteModel,
  editorTestCase as test,
  expect,
} from '@af/editor-libra';

// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  a,
  p,
  doc,
  code,
  h1,
  mediaSingle,
  media,
  strong,
} from '@atlaskit/editor-test-helpers/doc-builder';

import {
  adfWithHeading,
  adfWithHeadingAndNewline,
  adfWithRichTextHeading,
  emptyDocument,
  gapCursorIssueDocument,
  multiLineTextDocument,
  singleLineTextDocument,
} from './../__fixtures__/adf-document';

test.use({
  editorProps: {
    appearance: 'full-page',
    media: {
      allowMediaSingle: true,
    },
  },
  platformFeatureFlags: {
    'platform.editor.paste-options-toolbar': true,
  },
});

test.describe('paragraph', () => {
  /*
   * Lorem ipsum dolor sit amet.
   *
   * consectetur adipiscing elit.
   */
  test.use({
    adf: multiLineTextDocument,
  });

  const paragraphText = 'Some new rich text to be inserted.';
  const html = `<meta charset="utf-8"><div style="color: #cccccc;background-color: #1f1f1f;font-family: Menlo, Monaco, 'Courier New', monospace;font-weight: normal;font-size: 12px;line-height: 18px;white-space: pre;"><div><span style="color: #ce9178;">Some new rich text to be inserted.</span></div></div>`;

  test('new para at the end of line: toggle rich-text > markdown > plaintext -> rich-text', async ({
    editor,
    browserName,
  }) => {
    //end of line/doc
    const initialAnchor = 60;
    const initialHead = 60;

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
        p(),
        p('consectetur adipiscing elit.', code(paragraphText)),
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
        p(),
        p('consectetur adipiscing elit.', code(paragraphText)),
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
    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: initialAnchor + paragraphText.length,
      head: initialAnchor + paragraphText.length,
    });

    await expect(editor).toMatchDocument(
      doc(
        p('Lorem ipsum dolor sit amet.'),
        p(),
        p('consectetur adipiscing elit.', paragraphText),
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
        p(),
        p('consectetur adipiscing elit.', paragraphText),
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
        p(),
        p('consectetur adipiscing elit.', code(paragraphText)),
      ),
    );
  });

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
        p(code(paragraphText)),
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

  test('overwriting paragraph with another text: toggle markdown -> plaintext -> markdown', async ({
    editor,
    browserName,
  }) => {
    await expect(editor).toMatchDocument(
      doc(
        p('Lorem ipsum dolor sit amet.'),
        p(),
        p('consectetur adipiscing elit.'),
      ),
    );

    //setting cursor from start to end,
    // similar to cmd + A
    const initialAnchor = 1;
    const initialHead = 60;
    await editor.selection.set({ anchor: initialAnchor, head: initialHead });

    await editor.simulatePasteEvent({
      pasteAs: 'text/plain',
      text: paragraphText,
    });

    await expect(editor).toMatchDocument(doc(p(paragraphText)));

    const editorPasteModel = EditorPasteModel.from(editor);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      editorPasteModel,
    );

    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();

    expect(await floatingToolbarModel.richTextOption.isHidden()).toEqual(true);

    await floatingToolbarModel.clickAsMarkdown();
    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: paragraphText.length + 1,
      head: paragraphText.length + 1,
    });

    await expect(editor).toMatchDocument(doc(p(paragraphText)));

    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsPlainText();

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: paragraphText.length + 1,
      head: paragraphText.length + 1,
    });

    await expect(editor).toMatchDocument(doc(p(paragraphText)));

    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();

    await floatingToolbarModel.clickAsMarkdown();
    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: paragraphText.length + 1,
      head: paragraphText.length + 1,
    });

    await expect(editor).toMatchDocument(doc(p(paragraphText)));
  });

  test('overwriting paragraph with single character: toggle markdown -> plaintext -> markdown', async ({
    editor,
    browserName,
  }) => {
    await expect(editor).toMatchDocument(
      doc(
        p('Lorem ipsum dolor sit amet.'),
        p(),
        p('consectetur adipiscing elit.'),
      ),
    );

    //setting cursor from start to end,
    // similar to cmd + A
    const initialAnchor = 1;
    const initialHead = 60;
    await editor.selection.set({ anchor: initialAnchor, head: initialHead });

    const singleCharacter = 'a';
    await editor.simulatePasteEvent({
      pasteAs: 'text/plain',
      text: singleCharacter, //single character
    });

    await expect(editor).toMatchDocument(doc(p('a')));

    const editorPasteModel = EditorPasteModel.from(editor);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      editorPasteModel,
    );

    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();

    expect(await floatingToolbarModel.richTextOption.isHidden()).toEqual(true);

    await floatingToolbarModel.clickAsMarkdown();
    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 2,
      head: 2,
    });

    await expect(editor).toMatchDocument(doc(p(singleCharacter)));

    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsPlainText();

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 2,
      head: 2,
    });

    await expect(editor).toMatchDocument(doc(p(singleCharacter)));

    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();

    await floatingToolbarModel.clickAsMarkdown();
    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 2,
      head: 2,
    });

    await expect(editor).toMatchDocument(doc(p(singleCharacter)));
  });
});

test.describe('Cursor position tests: Overwriting a paragraph with single character plain text', () => {
  test.use({
    adf: singleLineTextDocument,
  });

  test('Cursor position should be correct', async ({ editor }) => {
    await editor.selection.set({ anchor: 28, head: 1 });
    await editor.simulatePasteEvent({
      pasteAs: 'text/plain',
      text: 'I',
    });
    // Initialise the floating toolbar model for Paste options toolbar
    const editorPasteModel = EditorPasteModel.from(editor);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      editorPasteModel,
    );
    // Select to paste as PlainText
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsPlainText();
    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 2,
      head: 2,
    });
    await expect(editor).toMatchDocument(doc(p('I')));

    // PlainText > Markdown
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsMarkdown();
    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 2,
      head: 2,
    });
    await expect(editor).toMatchDocument(doc(p('I')));

    // Markdown > PlainText
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsPlainText();
    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 2,
      head: 2,
    });
    await expect(editor).toMatchDocument(doc(p('I')));
  });
});

test.describe('Cursor position tests: paste at gapcursor', () => {
  const plainText = 'I';
  test.use({
    adf: gapCursorIssueDocument,
  });

  test('Paste Toolbar should not be visible', async ({ editor }) => {
    await editor.waitForEditorStable();
    await editor.selection.set({ anchor: 29, head: 29 });
    await editor.simulatePasteEvent({
      pasteAs: 'text/plain',
      text: plainText,
    });
    const editorPasteModel = EditorPasteModel.from(editor);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      editorPasteModel,
    );
    expect(await floatingToolbarModel.isVisible()).toEqual(true);
  });
});

test.describe('On empty-page paste: ', () => {
  test.use({
    adf: emptyDocument,
  });
  test('cursor position to be at the end of the pasted text', async ({
    editor,
  }) => {
    await editor.waitForEditorStable();
    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 1,
      head: 1,
    });

    // Paste some text
    await editor.simulatePasteEvent({
      pasteAs: 'text/plain',
      text: 'test',
    });

    // Select all text available in the editor (Simulate Cmd + A or Ctrl + A)
    await editor.selection.set({ anchor: 1, head: 5 });

    // Paste some text again to replace selection
    await editor.simulatePasteEvent({
      pasteAs: 'text/plain',
      text: 'test',
    });
    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 5,
      head: 5,
    });
  });
});

test.describe('On paste `plain-text` should not be garbled', () => {
  test.use({
    adf: emptyDocument,
  });
  test('content with only HTML anchor Tag wrapping', async ({ editor }) => {
    const testText = '<a href="https://example.com">Example</a>';

    await editor.simulatePasteEvent({
      pasteAs: 'text/plain',
      text: testText,
    });

    await expect(editor).toMatchDocument(
      doc(
        p(
          '<a href="',
          a({
            href: 'https://example.com',
          })('https://example.com'),
          '">Example</a>',
        ),
      ),
    );
  });

  test('HTML anchor Tag wrapping ASCII chars', async ({ editor }) => {
    const testText = '<a href="https://example.com">⚠️ 👍</a>';

    await editor.simulatePasteEvent({
      pasteAs: 'text/plain',
      text: testText,
    });

    await expect(editor).toMatchDocument(
      doc(
        p(
          '<a href="',
          a({
            href: 'https://example.com',
          })('https://example.com'),
          '">⚠️ 👍</a>',
        ),
      ),
    );
  });

  test('HTML anchor Tag with additional attributes and wrapped an image', async ({
    editor,
  }) => {
    const testText =
      '<a title="Image Title" href="https://www.example.com/File:file.jpg"><img width="512" alt="alt-text" src="https://www.example.com/thumb/image.jpg"></a>';

    await editor.simulatePasteEvent({
      pasteAs: 'text/plain',
      text: testText,
    });
    await expect(editor).toMatchDocument(
      doc(
        p(
          '<a title="Image Title" href="',
          a({
            href: 'https://www.example.com/File:file.jpg',
            title: 'Image Title',
          })('https://www.example.com/File:file.jpg'),
          '"><img width="512" alt="alt-text" src="',
          a({
            href: 'https://www.example.com/thumb/image.jpg',
          })('https://www.example.com/thumb/image.jpg'),
          '"></a>',
        ),
      ),
    );
  });

  test('HTML anchor tag in between text', async ({ editor }) => {
    const testText = 'Test <a href="https://example.com">Example</a> Test';

    await editor.simulatePasteEvent({
      pasteAs: 'text/plain',
      text: testText,
    });

    await expect(editor).toMatchDocument(
      doc(
        p(
          'Test <a href="',
          a({
            href: 'https://example.com',
          })('https://example.com'),
          '">Example</a> Test',
        ),
      ),
    );
  });

  test('HTML Document as text', async ({ editor }) => {
    const testText =
      '<!DOCTYPE html><html><head><title>Playwright Test Report</title></head><body></body>';

    await editor.simulatePasteEvent({
      pasteAs: 'text/plain',
      text: testText,
    });

    await expect(editor).toMatchDocument(
      doc(
        p(
          '<!DOCTYPE html><html><head><title>Playwright Test Report</title></head><body></body>',
        ),
      ),
    );
  });
});

test.describe('paste heading text over existing rich text', () => {
  test.use({
    adf: adfWithRichTextHeading,
  });

  test('paste heading text over existing heading text: toggle rich-text > markdown > plaintext > rich-text', async ({
    editor,
    browserName,
  }) => {
    const headingText = '# heading';
    const html = `<meta charset="utf-8"><div style="color: #cccccc;background-color: #1f1f1f;font-family: Menlo, Monaco, 'Courier New', monospace;font-weight: normal;font-size: 12px;line-height: 18px;white-space: pre;"><div><span style="color: #cccccc;"># </span><span style="color: #9cdcfe;">heading</span></div></div>`;

    const initialAnchor = 10;
    const initialHead = 1;

    //setting selection from the beginning to the end
    await editor.selection.set({ anchor: initialAnchor, head: initialHead });
    await expect(editor).toMatchDocument(doc(p(code(headingText))));

    await editor.simulatePasteEvent({
      pasteAs: 'text/html',
      text: headingText,
      html: html,
    });

    await expect(editor).toMatchDocument(doc(p(code(headingText))));

    const editorPasteModel = EditorPasteModel.from(editor);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      editorPasteModel,
    );

    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();

    await floatingToolbarModel.clickAsRichText();
    await expect(editor).toMatchDocument(doc(p(code(headingText))));

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: headingText.length + 1,
      head: headingText.length + 1,
    });

    // Rich Text to Markdown
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsMarkdown();

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: headingText.length - 1,
      head: headingText.length - 1,
    });

    await expect(editor).toMatchDocument(doc(h1('heading')));

    // Markdown to Plain Text
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsPlainText();

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: headingText.length + 1,
      head: headingText.length + 1,
    });

    await expect(editor).toMatchDocument(doc(p(headingText)));

    // Plain Text to Rich Text
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsRichText();

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: headingText.length + 1,
      head: headingText.length + 1,
    });

    await expect(editor).toMatchDocument(doc(p(code(headingText))));
  });

  test('paste heading text at the end of existing rich text: toggle rich-text > markdown > plaintext > rich-text', async ({
    editor,
    browserName,
  }) => {
    const headingText = '# heading';
    const html = `<meta charset="utf-8"><div style="color: #cccccc;background-color: #1f1f1f;font-family: Menlo, Monaco, 'Courier New', monospace;font-weight: normal;font-size: 12px;line-height: 18px;white-space: pre;"><div><span style="color: #cccccc;"># </span><span style="color: #9cdcfe;">heading</span></div></div>`;

    const initialAnchor = 10;
    const initialHead = 10;

    //setting selection at the end
    await editor.selection.set({ anchor: initialAnchor, head: initialHead });
    await expect(editor).toMatchDocument(doc(p(code(headingText))));

    await editor.simulatePasteEvent({
      pasteAs: 'text/html',
      text: headingText,
      html: html,
    });

    await expect(editor).toMatchDocument(
      doc(p(code(headingText), code(headingText))),
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
      doc(p(code(headingText), code(headingText))),
    );

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: initialAnchor + headingText.length,
      head: initialHead + headingText.length,
    });

    // Rich Text to Markdown
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsMarkdown();
    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: initialAnchor + headingText.length,
      head: initialHead + headingText.length,
    });

    await expect(editor).toMatchDocument(
      doc(p(code(headingText)), h1('heading')),
    );

    // Markdown to Plain Text
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsPlainText();

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: initialAnchor + headingText.length,
      head: initialHead + headingText.length,
    });

    await expect(editor).toMatchDocument(
      doc(p(code(headingText), headingText)),
    );

    // Plain Text to Rich Text
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsRichText();

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: initialAnchor + headingText.length,
      head: initialHead + headingText.length,
    });

    await expect(editor).toMatchDocument(
      doc(p(code(headingText), code(headingText))),
    );
  });
});

test.describe('paste heading text over existing heading', () => {
  test.use({
    adf: adfWithHeading,
  });

  test('paste heading text at the end of existing heading: toggle rich-text > markdown > plaintext > rich-text', async ({
    editor,
    browserName,
  }) => {
    const headingText = '# heading';
    const html = `<meta charset="utf-8"><div style="color: #cccccc;background-color: #1f1f1f;font-family: Menlo, Monaco, 'Courier New', monospace;font-weight: normal;font-size: 12px;line-height: 18px;white-space: pre;"><div><span style="color: #cccccc;"># </span><span style="color: #9cdcfe;">heading</span></div></div>`;

    const initialAnchor = 8;
    const initialHead = 8;

    //setting selection at the end
    await editor.selection.set({ anchor: initialAnchor, head: initialHead });
    await expect(editor).toMatchDocument(doc(h1('heading')));

    await editor.simulatePasteEvent({
      pasteAs: 'text/html',
      text: headingText,
      html: html,
    });

    await expect(editor).toMatchDocument(doc(h1('heading', code(headingText))));

    const editorPasteModel = EditorPasteModel.from(editor);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      editorPasteModel,
    );

    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();

    await floatingToolbarModel.clickAsRichText();
    await expect(editor).toMatchDocument(doc(h1('heading', code(headingText))));

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: initialAnchor + headingText.length,
      head: initialHead + headingText.length,
    });

    // Rich Text to Markdown
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsMarkdown();
    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: initialAnchor + headingText.length - 2,
      head: initialHead + headingText.length - 2,
    });

    await expect(editor).toMatchDocument(doc(h1('heading', 'heading')));

    // Markdown to Plain Text
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsPlainText();

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: initialAnchor + headingText.length,
      head: initialHead + headingText.length,
    });

    await expect(editor).toMatchDocument(doc(h1('heading# heading')));

    // Plain Text to Rich Text
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsRichText();

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: initialAnchor + headingText.length,
      head: initialHead + headingText.length,
    });

    await expect(editor).toMatchDocument(doc(h1('heading', code(headingText))));
  });

  test('paste heading text at the beginning of existing heading: toggle rich-text > markdown > plaintext > rich-text', async ({
    editor,
    browserName,
  }) => {
    const headingText = '# heading';
    const html = `<meta charset="utf-8"><div style="color: #cccccc;background-color: #1f1f1f;font-family: Menlo, Monaco, 'Courier New', monospace;font-weight: normal;font-size: 12px;line-height: 18px;white-space: pre;"><div><span style="color: #cccccc;"># </span><span style="color: #9cdcfe;">heading</span></div></div>`;

    const initialAnchor = 1;
    const initialHead = 1;

    //setting selection at the beginning
    await editor.selection.set({ anchor: initialAnchor, head: initialHead });
    await expect(editor).toMatchDocument(doc(h1('heading')));

    await editor.simulatePasteEvent({
      pasteAs: 'text/html',
      text: headingText,
      html: html,
    });

    await expect(editor).toMatchDocument(doc(h1(code(headingText), 'heading')));

    const editorPasteModel = EditorPasteModel.from(editor);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      editorPasteModel,
    );

    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();

    await floatingToolbarModel.clickAsRichText();
    await expect(editor).toMatchDocument(doc(h1(code(headingText), 'heading')));

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: headingText.length + 1,
      head: headingText.length + 1,
    });

    // Rich Text to Markdown
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsMarkdown();
    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: headingText.length - 1,
      head: headingText.length - 1,
    });

    await expect(editor).toMatchDocument(doc(h1('heading', 'heading')));

    // Markdown to Plain Text
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsPlainText();

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: headingText.length + 1,
      head: headingText.length + 1,
    });

    await expect(editor).toMatchDocument(doc(p('# heading', 'heading')));

    // Plain Text to Rich Text
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsRichText();

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: initialAnchor + headingText.length,
      head: initialHead + headingText.length,
    });

    await expect(editor).toMatchDocument(doc(p(code(headingText), 'heading')));
  });
});

test.describe('paste text in newline after heading', () => {
  test.use({
    adf: adfWithHeadingAndNewline,
  });

  test('paste normal text in next line of heading: toggle rich-text > markdown > plaintext > rich-text', async ({
    editor,
    browserName,
  }) => {
    const headingText = '# heading';
    const html = `<meta charset="utf-8"><div style="color: #cccccc;background-color: #1f1f1f;font-family: Menlo, Monaco, 'Courier New', monospace;font-weight: normal;font-size: 12px;line-height: 18px;white-space: pre;"><div><span style="color: #cccccc;"># </span><span style="color: #9cdcfe;">heading</span></div></div>`;

    const initialAnchor = 10;
    const initialHead = 10;

    //beginning of second line
    await editor.selection.set({ anchor: initialAnchor, head: initialHead });
    await expect(editor).toMatchDocument(doc(h1('heading'), p()));

    await editor.simulatePasteEvent({
      pasteAs: 'text/html',
      text: headingText,
      html: html,
    });

    await expect(editor).toMatchDocument(
      doc(h1('heading'), p(code(headingText))),
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
      doc(h1('heading'), p(code(headingText))),
    );

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: initialAnchor + headingText.length,
      head: initialHead + headingText.length,
    });

    // Rich Text to Markdown
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsMarkdown();
    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: initialAnchor + headingText.length - 2,
      head: initialHead + headingText.length - 2,
    });

    await expect(editor).toMatchDocument(doc(h1('heading'), h1('heading')));

    // Markdown to Plain Text
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsPlainText();

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: initialAnchor + headingText.length,
      head: initialHead + headingText.length,
    });

    await expect(editor).toMatchDocument(doc(h1('heading'), p(headingText)));

    // Plain Text to Rich Text
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsRichText();

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: initialAnchor + headingText.length,
      head: initialHead + headingText.length,
    });

    await expect(editor).toMatchDocument(
      doc(h1('heading'), p(code(headingText))),
    );
  });

  test('paste heading text in next line of heading: toggle rich-text > markdown > plaintext > rich-text', async ({
    editor,
    browserName,
  }) => {
    const headingText = '# heading';

    const initialAnchor = 10;
    const initialHead = 10;

    //setting selection at the beginning
    await editor.selection.set({ anchor: initialAnchor, head: initialHead });
    await expect(editor).toMatchDocument(doc(h1('heading'), p()));

    await editor.simulatePasteEvent({
      pasteAs: 'text/plain',
      text: headingText,
    });

    await expect(editor).toMatchDocument(doc(h1('heading'), h1('heading')));

    const editorPasteModel = EditorPasteModel.from(editor);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      editorPasteModel,
    );

    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();

    expect(await floatingToolbarModel.richTextOption.isHidden()).toEqual(true);
    await floatingToolbarModel.clickAsMarkdown();
    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: initialAnchor + headingText.length - 2,
      head: initialHead + headingText.length - 2,
    });

    await expect(editor).toMatchDocument(doc(h1('heading'), h1('heading')));

    // Markdown to Plain Text
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsPlainText();

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: initialAnchor + headingText.length,
      head: initialHead + headingText.length,
    });

    await expect(editor).toMatchDocument(doc(h1('heading'), p(headingText)));
  });
});

test.describe('Cursor position tests: Paste heading text over existing heading text', () => {
  const plainText = 'This **word** is bold. This <em>word</em> is italic.';
  const htmlText =
    '<meta charset="utf-8"><pre class="highlight" style="box-sizing: border-box; font-family: SFMono-Regular, Menlo, Monaco, Consolas, &quot;Liberation Mono&quot;, &quot;Courier New&quot;, monospace; font-size: 14px; margin-top: 0px; margin-bottom: 20px; overflow: auto; display: block; color: rgb(33, 37, 41); background: rgb(248, 248, 248); padding: 10px 10px 1px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><code style="box-sizing: border-box; font-family: SFMono-Regular, Menlo, Monaco, Consolas, &quot;Liberation Mono&quot;, &quot;Courier New&quot;, monospace; font-size: inherit; color: inherit; overflow-wrap: break-word; word-break: normal;">This **word** is bold. This &lt;em&gt;word&lt;/em&gt; is italic.</code></pre>';

  test.use({
    adf: emptyDocument,
  });

  test('Cursor position should be correct', async ({ editor }) => {
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
    // <em> tag for markdown seems to be not supported in Editor's markdown
    await expect(editor).toMatchDocument(
      doc(
        p('This ', strong('word'), ' is bold. This <em>word</em> is italic.'),
      ),
    );

    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsPlainText();
    await expect(editor).toMatchDocument(
      doc(p('This **word** is bold. This <em>word</em> is italic.')),
    );
  });
});

test.describe('image', () => {
  test.use({
    adf: singleLineTextDocument,
  });

  const plainText = '![alt-text-1](image1.png) ![alt-text-2](image2.png)';
  const html = `<meta charset="utf-8"><div style="color: #cccccc;background-color: #1f1f1f;font-family: Menlo, Monaco, 'Courier New', monospace;font-weight: normal;font-size: 12px;line-height: 18px;white-space: pre;"><div><span style="color: #ce9178;">![alt-text-1](image1.png) ![alt-text-2](image2.png)</span></div></div>`;

  test('toggle rich-text > markdown', async ({ editor, browserName }) => {
    await editor.selection.set({ anchor: 6, head: 6 });

    await editor.simulatePasteEvent({
      pasteAs: 'text/html',
      text: plainText,
      html: html,
    });

    await expect(editor).toMatchDocument(
      doc(p('Lorem', code(plainText), ' ipsum dolor sit amet.')),
    );

    const editorPasteModel = EditorPasteModel.from(editor);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      editorPasteModel,
    );

    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();

    await floatingToolbarModel.clickAsMarkdown();

    // eslint-disable-next-line playwright/no-page-pause
    await editor.page.pause();
    await expect(editor).toMatchDocument(
      doc(
        p('Lorem'),
        mediaSingle()(
          media({
            collection: '',
            id: '',
            type: 'external',
            url: 'image1.png',
          })(),
        ),
        p(' '),
        mediaSingle()(
          media({
            collection: '',
            id: '',
            type: 'external',
            url: 'image2.png',
          })(),
        ),
        p(' ipsum dolor sit amet.'),
      ),
    );

    await expect(editor).toHaveSelection({
      type: 'node',
      anchor: 13,
    });
  });
});

test.describe('image', () => {
  const plainText = 'Welcome to [Atlassian](https://www.atlassian.com)';
  const html = `<meta charset="utf-8"><div style="color: #cccccc;background-color: #1f1f1f;font-family: Menlo, Monaco, 'Courier New', monospace;font-weight: normal;font-size: 12px;line-height: 18px;white-space: pre;"><div><span style="color: #ce9178;">Welcome to [Atlassian](https://www.atlassian.com)</span></div></div>`;

  test('toggle rich-text > markdown > plaintext -> rich-text', async ({
    editor,
    browserName,
  }) => {
    await editor.simulatePasteEvent({
      pasteAs: 'text/html',
      text: plainText,
      html: html,
    });

    await expect(editor).toMatchDocument(doc(p(code(plainText))));

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
        p('Welcome to ', a({ href: 'https://www.atlassian.com' })('Atlassian')),
      ),
    );
    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 21,
      head: 21,
    });

    // Markdown to Plain Text
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsPlainText();

    await expect(editor).toMatchDocument(doc(p(plainText)));
    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: plainText.length + 1,
      head: plainText.length + 1,
    });

    // Plain Text to Rich Text
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsRichText();

    await expect(editor).toMatchDocument(doc(p(code(plainText))));

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: plainText.length + 1,
      head: plainText.length + 1,
    });
  });
});
