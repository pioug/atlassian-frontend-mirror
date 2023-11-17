// eslint-disable-next-line import/no-extraneous-dependencies
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
// eslint-disable-next-line import/no-extraneous-dependencies
import { code, doc, h1, p } from '@atlaskit/editor-test-helpers/doc-builder';

import { formatPlainText } from '../../../util/format-handlers';
import { getDefaultPlainTextPluginState } from '../_testHelpers';

describe('converting to plaintext - when selection is inside heading', () => {
  it('should render as plaintext', () => {
    const state = createEditorState(doc(h1('{<>}')));
    const plaintext = `# text`;

    let pluginState = getDefaultPlainTextPluginState();
    pluginState.plaintext = plaintext;
    pluginState.pasteStartPos = state.selection.from;
    pluginState.pasteEndPos = state.selection.to;

    const tr = formatPlainText(state.tr, pluginState);
    expect(tr).toEqualDocumentAndSelection(doc(p('# text{<>}')));
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
