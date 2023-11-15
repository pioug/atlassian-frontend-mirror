// eslint-disable-next-line import/no-extraneous-dependencies
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
// eslint-disable-next-line import/no-extraneous-dependencies
import { code, doc, h1, p } from '@atlaskit/editor-test-helpers/doc-builder';

import { formatMarkdown } from '../../../util/format-handlers';
import { getDefaultMarkdownPluginState } from '../_testHelpers';

describe('when pasting a heading inside an empty paragraph', () => {
  it('should set the selection at the end of heading', () => {
    const state = createEditorState(
      doc(p('Hello World{<}', code('# heading'), '{>}end')),
    );

    const plaintext = `# heading`;
    let pluginState = getDefaultMarkdownPluginState();
    pluginState.plaintext = plaintext;
    pluginState.pasteStartPos = state.selection.from;
    pluginState.pasteEndPos = state.selection.to;
    const tr = formatMarkdown(state.tr, pluginState);

    expect(tr).toEqualDocumentAndSelection(
      doc(p('Hello World'), h1('heading{<>}'), p('end')),
    );
  });
});

describe('when pasting a heading inside an empty doc', () => {
  it('should set the selection at the end of heading', () => {
    const state = createEditorState(doc(p('{<}', code('# heading'), '{>}')));

    const plaintext = `# heading`;
    let pluginState = getDefaultMarkdownPluginState();
    pluginState.plaintext = plaintext;
    pluginState.pasteStartPos = state.selection.from;
    pluginState.pasteEndPos = state.selection.to;
    const tr = formatMarkdown(state.tr, pluginState);

    expect(tr).toEqualDocumentAndSelection(doc(h1('heading{<>}')));
  });
});

describe('when pasting a heading on a line containing heading', () => {
  it('should set the selection at the end of heading', () => {
    const state = createEditorState(
      doc(h1('Hello World{<}', code('# heading'), '{>}end')),
    );

    const plaintext = `# heading`;
    let pluginState = getDefaultMarkdownPluginState();
    pluginState.plaintext = plaintext;
    pluginState.pasteStartPos = state.selection.from;
    pluginState.pasteEndPos = state.selection.to;
    const tr = formatMarkdown(state.tr, pluginState);

    expect(tr).toEqualDocumentAndSelection(
      doc(h1('Hello Worldheading{<>}end')),
    );
  });
});
