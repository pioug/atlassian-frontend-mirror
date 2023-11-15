// eslint-disable-next-line import/no-extraneous-dependencies
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  br,
  code,
  doc,
  h1,
  p,
  strong,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { formatMarkdown, formatPlainText } from '../../util/format-handlers';

import {
  getDefaultMarkdownPluginState,
  getDefaultPlainTextPluginState,
} from './_testHelpers';

describe('format markdown: marks', () => {
  it('should insert md-formatted text at cursor position', () => {
    const state = createEditorState(
      // prettier-ignore
      doc(
        p(code('Code mark example.')),
        p('work{<>}'),
      ),
    );

    let pluginState = getDefaultMarkdownPluginState();
    pluginState.plaintext = 'some **bold** text';
    pluginState.pasteStartPos = state.selection.from;
    pluginState.pasteEndPos = state.selection.to;
    const tr = formatMarkdown(state.tr, pluginState); // );

    expect(tr).toEqualDocumentAndSelection(
      // prettier-ignore
      doc(
        p(code('Code mark example.')),
        p('worksome ', strong('bold'), ' text'),
      ),
    );
  });

  it('should replace with md-formatted text', () => {
    const state = createEditorState(
      // prettier-ignore
      doc(
        p(code('Code mark example.')),
        p('work{<>}'),
      ),
    );

    let pluginState = getDefaultMarkdownPluginState();
    pluginState.plaintext = 'some **bold** text';
    pluginState.pasteStartPos = 0;
    pluginState.pasteEndPos = state.selection.to;

    const tr = formatMarkdown(state.tr, pluginState);

    expect(tr).toEqualDocumentAndSelection(
      // prettier-ignore
      doc(
        p('some ', strong('bold'), ' text'),
      ),
    );
  });

  it('should not do anything if start position is invalid', () => {
    const state = createEditorState(
      // prettier-ignore
      doc(
        p(code('Code mark example.')),
        p('work{<>}'),
      ),
    );

    let pluginState = getDefaultMarkdownPluginState();
    pluginState.plaintext = 'some **bold** text';
    pluginState.pasteStartPos = -1;
    pluginState.pasteEndPos = state.selection.to;

    const tr = formatMarkdown(state.tr, pluginState);

    expect(tr).toEqualDocumentAndSelection(
      // prettier-ignore
      doc(
        p(code('Code mark example.')),
        p('work{<>}'),
      ),
    );
  });

  it('should not do anything if md is empty', () => {
    const state = createEditorState(
      // prettier-ignore
      doc(
        p(code('Code mark example.')),
        p('work{<>}'),
      ),
    );

    let pluginState = getDefaultMarkdownPluginState();
    pluginState.plaintext = '';
    pluginState.pasteStartPos = state.selection.from;
    pluginState.pasteEndPos = state.selection.to;

    const tr = formatMarkdown(state.tr, pluginState);

    expect(tr).toEqualDocumentAndSelection(
      // prettier-ignore
      doc(
        p(code('Code mark example.')),
        p('work{<>}'),
      ),
    );
  });

  it('should not render markdown list if escape character is preceeding', () => {
    const state = createEditorState(
      // prettier-ignore
      doc(
        p('{<>}'),
      ),
    );

    let pluginState = getDefaultMarkdownPluginState();
    pluginState.plaintext =
      '\\* Without the backslash, this would be a bullet in an unordered list.';
    pluginState.pasteStartPos = 1;
    pluginState.pasteEndPos = state.selection.to;

    const tr = formatMarkdown(state.tr, pluginState);
    expect(tr).toEqualDocumentAndSelection(
      // prettier-ignore
      doc(
        p('\\* Without the backslash, this would be a bullet in an unordered list.{<>}'),
      ),
    );
  });
});

describe('formatPlainText', () => {
  describe('when pasting a paragraph inside an empty paragraph', () => {
    it('should set the selection inside the paragraph', () => {
      const state = createEditorState(
        doc(
          p('Hello World'),
          p(
            code('{<}I really like using RichText.'),
            br(),
            br(),
            code(
              "I think I'll use it to format all of my documents from now on.{>}",
            ),
          ),
          p('end'),
        ),
      );
      const plaintext = `I really like using RichText.

I think I'll use it to format all of my documents from now on.`;

      let pluginState = getDefaultPlainTextPluginState();
      pluginState.plaintext = plaintext;
      pluginState.pasteStartPos = state.selection.from;
      pluginState.pasteEndPos = state.selection.to;

      const tr = formatPlainText(state.tr, pluginState);
      expect(tr).toEqualDocumentAndSelection(
        doc(
          // prettier-ignore
          p('Hello World'),
          p(`I really like using RichText.

I think I'll use it to format all of my documents from now on.{<>}`),
          p('end'),
        ),
      );
    });
  });

  describe('when pasting a singleline paragraph in an existing paragraph', () => {
    it('should set the selection inside the paragraph', () => {
      const state = createEditorState(
        doc(p('Hello{<}', code('I really like using RichText.'), '{>}World')),
      );

      const plaintext = `I really like using RichText.`;

      let pluginState = getDefaultPlainTextPluginState();
      pluginState.plaintext = plaintext;
      pluginState.pasteStartPos = state.selection.from;
      pluginState.pasteEndPos = state.selection.to;

      const tr = formatPlainText(state.tr, pluginState);

      expect(tr).toEqualDocumentAndSelection(
        doc(
          // prettier-ignore
          p('HelloI really like using RichText.{<>}World'),
        ),
      );
    });
  });

  describe('when pasting a multiline paragraph in an existing paragraph', () => {
    it('should set the selection inside the paragraph', () => {
      const state = createEditorState(
        doc(
          p('Hello World{<}', code('I really like using RichText.')),
          p(
            code(
              "I think I'll use it to format all of my documents from now on.{>}",
            ),
          ),
          p('end'),
        ),
      );

      const plaintext = `I really like using RichText.

I think I'll use it to format all of my documents from now on.`;

      let pluginState = getDefaultPlainTextPluginState();
      pluginState.plaintext = plaintext;
      pluginState.pasteStartPos = state.selection.from;
      pluginState.pasteEndPos = state.selection.to;

      const tr = formatPlainText(state.tr, pluginState);

      expect(tr).toEqualDocumentAndSelection(
        doc(
          // prettier-ignore
          p(`Hello WorldI really like using RichText.

I think I'll use it to format all of my documents from now on.{<>}`,
          ),
          p('end'),
        ),
      );
    });
  });

  describe('when pasting a paragraph in empty doc', () => {
    it('should set the selection inside the paragraph', () => {
      const state = createEditorState(
        doc(
          p('{<}', code('I really like using RichText.')),
          p(
            code(
              "I think I'll use it to format all of my documents from now on.{>}",
            ),
          ),
        ),
      );

      const plaintext = `I really like using RichText.

I think I'll use it to format all of my documents from now on.`;

      let pluginState = getDefaultPlainTextPluginState();
      pluginState.plaintext = plaintext;
      pluginState.pasteStartPos = state.selection.from;
      pluginState.pasteEndPos = state.selection.to;

      const tr = formatPlainText(state.tr, pluginState);

      expect(tr).toEqualDocumentAndSelection(
        doc(
          // prettier-ignore
          p(`I really like using RichText.

I think I'll use it to format all of my documents from now on.{<>}`,
          ),
        ),
      );
    });
  });

  describe('empty text inside a new paragraph in-between existing paras', () => {
    it('should set the selection at correct position', () => {
      const state = createEditorState(
        doc(p('Hello World'), p('{<>}'), p('end')),
      );
      const plaintext = ``;

      let pluginState = getDefaultPlainTextPluginState();
      pluginState.plaintext = plaintext;
      pluginState.pasteStartPos = state.selection.from;
      pluginState.pasteEndPos = state.selection.to;

      const tr = formatPlainText(state.tr, pluginState);

      expect(tr).toEqualDocumentAndSelection(
        doc(
          // prettier-ignore
          p('Hello World'),
          p('{<>}'),
          p('end'),
        ),
      );
    });
  });
});

describe('format plain text: cursor positioning', () => {
  it('should paste text at given position', () => {
    const state = createEditorState(
      // prettier-ignore
      doc(
        p('{<>}Type something'),
      ),
    );

    let pluginState = getDefaultPlainTextPluginState();
    pluginState.plaintext = 'Some pasted text.';
    pluginState.pasteStartPos = state.selection.from;
    pluginState.pasteEndPos = state.selection.to;

    const tr = formatPlainText(state.tr, pluginState);

    expect(tr).toEqualDocumentAndSelection(
      // prettier-ignore
      doc(
        p('Some pasted text.{<>}Type something'),
      ),
    );
  });

  it('should not do anything when start position is invalid', () => {
    const state = createEditorState(
      // prettier-ignore
      doc(
        p('{<>}Type something'),
      ),
    );

    // pass -1 as start position
    let pluginState = getDefaultPlainTextPluginState();
    pluginState.plaintext = 'Some pasted text.';
    pluginState.pasteStartPos = -1;
    pluginState.pasteEndPos = state.selection.to;

    const tr = formatPlainText(state.tr, pluginState);

    expect(tr).toEqualDocumentAndSelection(
      // prettier-ignore
      doc(
        p('{<>}Type something'),
      ),
    );
  });

  it('should not do anything when pasting empty text', () => {
    const state = createEditorState(
      // prettier-ignore
      doc(
        p('{<>}Type something'),
      ),
    );

    let pluginState = getDefaultPlainTextPluginState();
    pluginState.plaintext = '';
    pluginState.pasteStartPos = state.selection.from;
    pluginState.pasteEndPos = state.selection.to;

    const tr = formatPlainText(state.tr, pluginState);

    expect(tr).toEqualDocumentAndSelection(
      // prettier-ignore
      doc(
        p('{<>}Type something'),
      ),
    );
  });

  it('should replace rich text with input plain text', () => {
    const state = createEditorState(
      // prettier-ignore
      doc(
        p(code('Type something{<>}')),
      ),
    );

    let pluginState = getDefaultPlainTextPluginState();
    pluginState.plaintext = 'Pasted plain text.';
    pluginState.pasteStartPos = 1;
    pluginState.pasteEndPos = state.selection.to;

    const tr = formatPlainText(state.tr, pluginState);
    expect(tr).toEqualDocumentAndSelection(
      // prettier-ignore
      doc(
        p('Pasted plain text.{<>}'),
      ),
    );
  });

  it('should replace existing text with the input single character', () => {
    const state = createEditorState(
      // prettier-ignore
      doc(
        p('Lorem ipsum dolor sit amet.{<>}'),
      ),
    );

    let pluginState = getDefaultPlainTextPluginState();
    pluginState.plaintext = 'I';
    pluginState.pasteStartPos = 1;
    pluginState.pasteEndPos = state.selection.to;

    const tr = formatPlainText(state.tr, pluginState);
    expect(tr).toEqualDocumentAndSelection(
      // prettier-ignore
      doc(
        p('I{<>}'),
      ),
    );
  });
});

describe('formatPlainText', () => {
  describe('converting to plaintext - when selection is inside heading', () => {
    it('should render as plaintext', () => {
      const state = createEditorState(doc(h1('{<>}')));
      const plaintext = `# text`;

      let pluginState = getDefaultPlainTextPluginState();
      pluginState.plaintext = plaintext;
      pluginState.pasteStartPos = state.selection.from;
      pluginState.pasteEndPos = state.selection.to;

      const tr = formatPlainText(state.tr, pluginState);
      expect(tr).toEqualDocumentAndSelection(
        doc(
          // prettier-ignore
          p('# text{<>}'),
        ),
      );
    });
  });

  describe('when pasting a heading in an existing paragraph', () => {
    it('should set the selection inside the paragraph', () => {
      const state = createEditorState(
        doc(p('Hello World'), h1('{<}# Heading{>}'), p('end')),
      );
      const plaintext = `# Heading`;

      let pluginState = getDefaultPlainTextPluginState();
      pluginState.plaintext = plaintext;
      pluginState.pasteStartPos = state.selection.from;
      pluginState.pasteEndPos = state.selection.to;

      const tr = formatPlainText(state.tr, pluginState);
      expect(tr).toEqualDocumentAndSelection(
        doc(p('Hello World'), p('# Heading{<>}'), p('end')),
      );
    });
  });

  describe('when pasting rich text inside a paragraph', () => {
    it('should set the selection inside the paragraph', () => {
      const state = createEditorState(
        doc(p('Hello World', code('{<}# Heading{>}'), 'end')),
      );
      const plaintext = `# Heading`;

      let pluginState = getDefaultPlainTextPluginState();
      pluginState.plaintext = plaintext;
      pluginState.pasteStartPos = state.selection.from;
      pluginState.pasteEndPos = state.selection.to;

      const tr = formatPlainText(state.tr, pluginState);
      expect(tr).toEqualDocumentAndSelection(
        doc(p('Hello World', '# Heading{<>}', 'end')),
      );
    });
  });

  describe('when pasting a heading in an empty doc', () => {
    it('should set the selection inside the paragraph', () => {
      const state = createEditorState(doc(h1('{<}# Heading{>}')));
      const plaintext = `# Heading`;

      let pluginState = getDefaultPlainTextPluginState();
      pluginState.plaintext = plaintext;
      pluginState.pasteStartPos = state.selection.from;
      pluginState.pasteEndPos = state.selection.to;

      const tr = formatPlainText(state.tr, pluginState);
      expect(tr).toEqualDocumentAndSelection(doc(p('# Heading{<>}')));
    });
  });
});
