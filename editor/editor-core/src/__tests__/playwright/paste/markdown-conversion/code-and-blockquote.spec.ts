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
  code_block,
  blockquote,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { multiLineTextDocument } from '../__fixtures__/adf-document';

test.use({
  editorProps: {
    appearance: 'full-page',
  },
  platformFeatureFlags: {
    'platform.editor.paste-options-toolbar': true,
  },
});

test.describe('code', () => {
  test.use({
    adf: multiLineTextDocument,
  });

  const codeText = '``Use `code` in your Markdown file.``';
  const codeTextWithSpaces = '    Use spaces in your Markdown file';
  const codeWithoutTicks = 'Use `code` in your Markdown file.';
  const html =
    '<meta charset=\'utf-8\'><span style="color: rgb(33, 37, 41); font-family: SFMono-Regular, Menlo, Monaco, Consolas, &quot;liberation mono&quot;, &quot;courier new&quot;, monospace; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">``Use `code` in your Markdown file.``</span>';
  const htmlForSpaces =
    '<meta charset=\'utf-8\'><pre class="highlight" style="box-sizing: border-box; font-family: SFMono-Regular, Menlo, Monaco, Consolas, &quot;liberation mono&quot;, &quot;courier new&quot;, monospace; font-size: 14px; margin-top: 0px; margin-bottom: 20px; overflow: auto; display: block; color: rgb(33, 37, 41); padding: 10px 10px 1px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><code style="box-sizing: border-box; font-family: SFMono-Regular, Menlo, Monaco, Consolas, &quot;liberation mono&quot;, &quot;courier new&quot;, monospace; font-size: inherit; color: inherit; overflow-wrap: break-word; word-break: normal;">    Use spaces in your Markdown file</code></pre>';

  test('new code with backticks at the end of line: toggle rich-text > markdown > plaintext -> rich-text', async ({
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
      text: codeText,
      html: html,
    });

    await expect(editor).toMatchDocument(
      doc(
        p('Lorem ipsum dolor sit amet.'),
        p(),
        p('consectetur adipiscing elit.', code(codeText)),
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
        p('consectetur adipiscing elit.', code(codeText)),
      ),
    );

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: initialAnchor + codeText.length,
      head: initialHead + codeText.length,
    });

    // Rich Text to Markdown
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsMarkdown();
    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: initialAnchor + codeWithoutTicks.length,
      head: initialAnchor + codeWithoutTicks.length,
    });

    await expect(editor).toMatchDocument(
      doc(
        p('Lorem ipsum dolor sit amet.'),
        p(),
        p('consectetur adipiscing elit.', code(codeWithoutTicks)),
      ),
    );

    // Markdown to Plain Text
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsPlainText();

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: initialAnchor + codeText.length,
      head: initialAnchor + codeText.length,
    });

    await expect(editor).toMatchDocument(
      doc(
        p('Lorem ipsum dolor sit amet.'),
        p(),
        p('consectetur adipiscing elit.', codeText),
      ),
    );

    // Plain Text to Rich Text
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsRichText();

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: initialAnchor + codeText.length,
      head: initialAnchor + codeText.length,
    });
    await expect(editor).toMatchDocument(
      doc(
        p('Lorem ipsum dolor sit amet.'),
        p(),
        p('consectetur adipiscing elit.', code(codeText)),
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
      text: codeText,
      html: html,
    });

    await expect(editor).toMatchDocument(
      doc(
        p('Lorem ipsum dolor sit amet.'),
        p(code(codeText)),
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
        p(code(codeText)),
        p('consectetur adipiscing elit.', '{<>}'),
      ),
    );

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: initialAnchor + codeText.length,
      head: initialHead + codeText.length,
    });

    // Rich Text to Markdown
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsMarkdown();

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: initialAnchor + codeWithoutTicks.length,
      head: initialAnchor + codeWithoutTicks.length,
    });

    await expect(editor).toMatchDocument(
      doc(
        p('Lorem ipsum dolor sit amet.'),
        p(code(codeWithoutTicks)),
        p('consectetur adipiscing elit.'),
      ),
    );

    // Markdown to Plain Text
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsPlainText();

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: initialAnchor + codeText.length,
      head: initialAnchor + codeText.length,
    });

    await expect(editor).toMatchDocument(
      doc(
        p('Lorem ipsum dolor sit amet.'),
        p(codeText),
        p('consectetur adipiscing elit.'),
      ),
    );

    // Plain Text to Rich Text
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsRichText();

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: initialAnchor + codeText.length,
      head: initialAnchor + codeText.length,
    });

    await expect(editor).toMatchDocument(
      doc(
        p('Lorem ipsum dolor sit amet.'),
        p(code(codeText)),
        p('consectetur adipiscing elit.'),
      ),
    );
  });

  test('new code with spaces in-between two lines: toggle rich-text > markdown', async ({
    editor,
    browserName,
  }) => {
    //end of line/doc
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
      text: codeTextWithSpaces,
      html: htmlForSpaces,
    });
    await expect(editor).toMatchDocument(
      doc(
        p('Lorem ipsum dolor sit amet.'),
        p(code(codeTextWithSpaces)),
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
        p(code(codeTextWithSpaces)),
        p('consectetur adipiscing elit.'),
      ),
    );

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: initialAnchor + codeTextWithSpaces.length,
      head: initialHead + codeTextWithSpaces.length,
    });

    // Rich Text to Markdown
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsMarkdown();

    await expect(editor).toMatchDocument(
      doc(
        p('Lorem ipsum dolor sit amet.'),
        code_block()('Use spaces in your Markdown file'),
        p('consectetur adipiscing elit.'),
      ),
    );
  });
});

test.describe('blockquote', () => {
  test.use({
    adf: multiLineTextDocument,
  });

  const blockquoteContent =
    '> Dorothy followed her through many of the beautiful rooms in her castle.';
  const blockquoteText =
    'Dorothy followed her through many of the beautiful rooms in her castle.';
  const html = `<meta charset="utf-8"><pre class="highlight" style="box-sizing: border-box; font-family: SFMono-Regular, Menlo, Monaco, Consolas, &quot;Liberation Mono&quot;, &quot;Courier New&quot;, monospace; font-size: 14px; margin-top: 0px; margin-bottom: 20px; overflow: auto; display: block; color: rgb(33, 37, 41); background: rgb(248, 248, 248); padding: 10px 10px 1px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><code style="box-sizing: border-box; font-family: SFMono-Regular, Menlo, Monaco, Consolas, &quot;Liberation Mono&quot;, &quot;Courier New&quot;, monospace; font-size: inherit; color: inherit; overflow-wrap: break-word; word-break: normal;">&gt; Dorothy followed her through many of the beautiful rooms in her castle.</code></pre>`;

  test('Toggling between rich-text > plain text > richtext > markdown in between lines', async ({
    editor,
    browserName,
  }) => {
    await editor.selection.set({ anchor: 30, head: 30 });

    await editor.simulatePasteEvent({
      pasteAs: 'text/html',
      text: blockquoteContent,
      html: html,
    });

    // Initialise the floating toolbar model for Paste options toolbar
    const editorPasteModel = EditorPasteModel.from(editor);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      editorPasteModel,
    );

    // Click to parse as Rich Text (needed for libra)
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsRichText();

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 103,
      head: 103,
    });

    await expect(editor).toMatchDocument(
      doc(
        p('Lorem ipsum dolor sit amet.'),
        p(code(blockquoteContent)),
        p('consectetur adipiscing elit.'),
      ),
    );

    // Rich Text to Plain Text
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsPlainText();

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 103,
      head: 103,
    });

    await expect(editor).toMatchDocument(
      doc(
        p('Lorem ipsum dolor sit amet.'),
        p(blockquoteContent),
        p('consectetur adipiscing elit.'),
      ),
    );

    // Plain Text to Rich Text
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsRichText();

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 103,
      head: 103,
    });
    await expect(editor).toMatchDocument(
      doc(
        p('Lorem ipsum dolor sit amet.'),
        p(code(blockquoteContent)),
        p('consectetur adipiscing elit.'),
      ),
    );

    // Rich Text to Markdown
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsMarkdown();

    await expect(editor).toMatchDocument(
      doc(
        p('Lorem ipsum dolor sit amet.'),
        blockquote(p(blockquoteText)),
        p('consectetur adipiscing elit.'),
      ),
    );

    const isToolbarVisible = await floatingToolbarModel.isVisible();
    expect(isToolbarVisible).toBe(true);
  });

  test('Toggling between rich-text > plain text > richtext > markdown in an existing line', async ({
    editor,
    browserName,
  }) => {
    await editor.selection.set({ anchor: 10, head: 10 });

    await editor.simulatePasteEvent({
      pasteAs: 'text/html',
      text: blockquoteContent,
      html: html,
    });

    // Initialise the floating toolbar model for Paste options toolbar
    const editorPasteModel = EditorPasteModel.from(editor);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      editorPasteModel,
    );

    // Click to parse as Rich Text (needed for libra)
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
        p('Lorem ips', code(blockquoteContent), 'um dolor sit amet.'),
        p(),
        p('consectetur adipiscing elit.'),
      ),
    );

    // Rich Text to Plain text
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsPlainText();

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 83,
      head: 83,
    });
    await expect(editor).toMatchDocument(
      doc(
        p('Lorem ips', blockquoteContent, 'um dolor sit amet.'),
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
      anchor: 83,
      head: 83,
    });

    await expect(editor).toMatchDocument(
      doc(
        p('Lorem ips', code(blockquoteContent), 'um dolor sit amet.'),
        p(),
        p('consectetur adipiscing elit.'),
      ),
    );

    // Rich Text to markdown
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toggleOptionsButton();
    await floatingToolbarModel.clickAsMarkdown();

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 84,
      head: 84,
    });
    await expect(editor).toMatchDocument(
      doc(
        p('Lorem ips'),
        blockquote(
          p(
            'Dorothy followed her through many of the beautiful rooms in her castle.',
          ),
        ),
        p('um dolor sit amet.'),
        p(),
        p('consectetur adipiscing elit.'),
      ),
    );

    // Hide the toolbar
    const isToolbarVisible = await floatingToolbarModel.isVisible();
    expect(isToolbarVisible).toBe(true);
  });
});
