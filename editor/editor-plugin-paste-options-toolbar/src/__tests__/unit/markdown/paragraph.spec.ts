// eslint-disable-next-line import/no-extraneous-dependencies
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
// eslint-disable-next-line import/no-extraneous-dependencies
import { br, code, doc, p } from '@atlaskit/editor-test-helpers/doc-builder';

import { formatMarkdown } from '../../../util/format-handlers';
import { getDefaultMarkdownPluginState } from '../_testHelpers';

describe('when pasting a paragraph inside an empty paragraph', () => {
  it('should set the selection inside the paragraph', () => {
    const state = createEditorState(
      doc(
        p('Hello World'),
        p(
          code('{<}I really like using Markdown.'),
          br(),
          br(),
          code(
            "I think I'll use it to format all of my documents from now on.{>}",
          ),
        ),
        p('end'),
      ),
    );
    const plaintext = `I really like using Markdown.

I think I'll use it to format all of my documents from now on.`;

    let pluginState = getDefaultMarkdownPluginState();
    pluginState.plaintext = plaintext;
    pluginState.pasteStartPos = state.selection.from;
    pluginState.pasteEndPos = state.selection.to;
    const tr = formatMarkdown(state.tr, pluginState);

    expect(tr).toEqualDocumentAndSelection(
      doc(
        // prettier-ignore
        p('Hello World'),
        p('I really like using Markdown.'),
        p("I think I'll use it to format all of my documents from now on.{<>}"),
        p('end'),
      ),
    );
  });
});

describe('when pasting a singleline paragraph in an existing paragraph', () => {
  it('should set the selection inside the paragraph', () => {
    const state = createEditorState(
      doc(p('Hello{<}', code('I really like using Markdown.'), '{>}World')),
    );

    const plaintext = `I really like using Markdown.`;

    let pluginState = getDefaultMarkdownPluginState();
    pluginState.plaintext = plaintext;
    pluginState.pasteStartPos = state.selection.from;
    pluginState.pasteEndPos = state.selection.to;
    const tr = formatMarkdown(state.tr, pluginState);

    expect(tr).toEqualDocumentAndSelection(
      doc(
        // prettier-ignore
        p('HelloI really like using Markdown.{<>}World'),
      ),
    );
  });
});

describe('when pasting a multiline paragraph in an existing paragraph', () => {
  it('should set the selection inside the paragraph', () => {
    const state = createEditorState(
      doc(
        p('Hello World{<}', code('I really like using Markdown.')),
        p(
          code(
            "I think I'll use it to format all of my documents from now on.{>}",
          ),
        ),
        p('end'),
      ),
    );

    const plaintext = `I really like using Markdown.

I think I'll use it to format all of my documents from now on.`;

    let pluginState = getDefaultMarkdownPluginState();
    pluginState.plaintext = plaintext;
    pluginState.pasteStartPos = state.selection.from;
    pluginState.pasteEndPos = state.selection.to;
    const tr = formatMarkdown(state.tr, pluginState);

    expect(tr).toEqualDocumentAndSelection(
      doc(
        // prettier-ignore
        p('Hello WorldI really like using Markdown.'),
        p("I think I'll use it to format all of my documents from now on.{<>}"),
        p('end'),
      ),
    );
  });
});

describe('when pasting a paragraph in empty doc', () => {
  it('should set the selection inside the paragraph', () => {
    const state = createEditorState(
      doc(
        p('{<}', code('I really like using Markdown.')),
        p(
          code(
            "I think I'll use it to format all of my documents from now on.{>}",
          ),
        ),
      ),
    );

    const plaintext = `I really like using Markdown.

I think I'll use it to format all of my documents from now on.`;

    let pluginState = getDefaultMarkdownPluginState();
    pluginState.plaintext = plaintext;
    pluginState.pasteStartPos = state.selection.from;
    pluginState.pasteEndPos = state.selection.to;
    const tr = formatMarkdown(state.tr, pluginState);

    expect(tr).toEqualDocumentAndSelection(
      doc(
        // prettier-ignore
        p('I really like using Markdown.'),
        p("I think I'll use it to format all of my documents from now on.{<>}"),
      ),
    );
  });
});
