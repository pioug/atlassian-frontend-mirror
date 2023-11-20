// eslint-disable-next-line import/no-extraneous-dependencies
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  code,
  doc,
  p,
  strong,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { formatMarkdown } from '../../../util/format-handlers';
import { getDefaultMarkdownPluginState } from '../_testHelpers';

describe('format markdown: marks', () => {
  it('should insert md-formatted text at cursor position', () => {
    const state = createEditorState(
      doc(p(code('Code mark example.')), p('work{<>}')),
    );

    let pluginState = getDefaultMarkdownPluginState();
    pluginState.plaintext = 'some **bold** text';
    pluginState.pasteStartPos = state.selection.from;
    pluginState.pasteEndPos = state.selection.to;
    const tr = formatMarkdown(state.tr, pluginState);

    expect(tr).toEqualDocumentAndSelection(
      doc(
        p(code('Code mark example.')),
        p('worksome ', strong('bold'), ' text'),
      ),
    );
  });

  it('should replace with md-formatted text', () => {
    const state = createEditorState(
      doc(p(code('Code mark example.')), p('work{<>}')),
    );

    let pluginState = getDefaultMarkdownPluginState();
    pluginState.plaintext = 'some **bold** text';
    pluginState.pasteStartPos = 0;
    pluginState.pasteEndPos = state.selection.to;

    const tr = formatMarkdown(state.tr, pluginState);

    expect(tr).toEqualDocumentAndSelection(
      doc(p('some ', strong('bold'), ' text')),
    );
  });

  it('should not do anything if start position is invalid', () => {
    const state = createEditorState(
      doc(p(code('Code mark example.')), p('work{<>}')),
    );

    let pluginState = getDefaultMarkdownPluginState();
    pluginState.plaintext = 'some **bold** text';
    pluginState.pasteStartPos = -1;
    pluginState.pasteEndPos = state.selection.to;

    const tr = formatMarkdown(state.tr, pluginState);

    expect(tr).toEqualDocumentAndSelection(
      doc(p(code('Code mark example.')), p('work{<>}')),
    );
  });

  it('should not do anything if md is empty', () => {
    const state = createEditorState(
      doc(p(code('Code mark example.')), p('work{<>}')),
    );

    let pluginState = getDefaultMarkdownPluginState();
    pluginState.plaintext = '';
    pluginState.pasteStartPos = state.selection.from;
    pluginState.pasteEndPos = state.selection.to;

    const tr = formatMarkdown(state.tr, pluginState);

    expect(tr).toEqualDocumentAndSelection(
      doc(p(code('Code mark example.')), p('work{<>}')),
    );
  });

  it('should not render markdown list if escape character is preceeding', () => {
    const state = createEditorState(doc(p('{<>}')));

    let pluginState = getDefaultMarkdownPluginState();
    pluginState.plaintext =
      '\\* Without the backslash, this would be a bullet in an unordered list.';
    pluginState.pasteStartPos = 1;
    pluginState.pasteEndPos = state.selection.to;

    const tr = formatMarkdown(state.tr, pluginState);
    expect(tr).toEqualDocumentAndSelection(
      doc(
        p(
          '\\* Without the backslash, this would be a bullet in an unordered list.{<>}',
        ),
      ),
    );
  });
});
