// eslint-disable-next-line import/no-extraneous-dependencies
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  br,
  code_block,
  doc,
  p,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { formatMarkdown } from '../../../util/format-handlers';
import { getDefaultMarkdownPluginState } from '../_testHelpers';

describe('when pasting a code_block inside an empty paragraph', () => {
  it('should set the selection inside the code_block', () => {
    const state = createEditorState(
      doc(
        p(`Hello World`),
        p(`{<}    some text with four spaces in the beginning{>}`),
        p('end'),
      ),
    );

    const plaintext = `    some text with four spaces in the beginning`;
    let pluginState = getDefaultMarkdownPluginState();
    pluginState.plaintext = plaintext;
    pluginState.pasteStartPos = state.selection.from;
    pluginState.pasteEndPos = state.selection.to;
    const tr = formatMarkdown(state.tr, pluginState);

    expect(tr).toEqualDocumentAndSelection(
      doc(
        p('Hello World'),
        code_block()(`some text with four spaces in the beginning{<>}`),
        p('end'),
      ),
    );
  });
});

describe('when pasting a code_block in an existing paragraph', () => {
  it('should set the selection inside the code_block', () => {
    const state = createEditorState(
      doc(p('{<}    some text with four spaces in the beginning{>}')),
    );

    const plaintext = `    some text with four spaces in the beginning`;
    let pluginState = getDefaultMarkdownPluginState();
    pluginState.plaintext = plaintext;
    pluginState.pasteStartPos = state.selection.from;
    pluginState.pasteEndPos = state.selection.to;
    const tr = formatMarkdown(state.tr, pluginState);

    expect(tr).toEqualDocumentAndSelection(
      doc(code_block()(`some text with four spaces in the beginning{<>}`)),
    );
  });
});

describe('when converting a multi-line code_block to markdown', () => {
  it('should convert to plaintext', () => {
    const state = createEditorState(
      doc(
        p('lorem ipsum'),
        code_block()('{<}line with some text another line with some text'),
        p('{>}'),
      ),
    );

    const plaintext = `line with some text
another line with some text`;

    let pluginState = getDefaultMarkdownPluginState();
    pluginState.plaintext = plaintext;
    pluginState.pasteStartPos = state.selection.from;
    pluginState.pasteEndPos = state.selection.to;
    const tr = formatMarkdown(state.tr, pluginState);

    expect(tr).toEqualDocumentAndSelection(
      doc(
        p('lorem ipsum'),
        p(`line with some text`, br(), `another line with some text`),
      ),
    );
  });
});
