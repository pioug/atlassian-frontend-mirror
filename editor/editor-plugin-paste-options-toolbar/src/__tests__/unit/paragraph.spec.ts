// eslint-disable-next-line import/no-extraneous-dependencies
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
// eslint-disable-next-line import/no-extraneous-dependencies
import { code, doc, p } from '@atlaskit/editor-test-helpers/doc-builder';

import { formatPlainText } from '../../util/format-handlers';

import { getDefaultPlainTextPluginState } from './_testHelpers';

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
