// eslint-disable-next-line import/no-extraneous-dependencies
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  code,
  doc,
  li,
  ol,
  p,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { formatPlainText } from '../../../util/format-handlers';
import { getDefaultPlainTextPluginState } from '../_testHelpers';

describe('formatPlainText', () => {
  describe('when pasting a markdown list in an empty doc', () => {
    it('should convert as plaintext & set the selection inside the last list item', () => {
      const state = createEditorState(
        doc('{<}', ol()(li(p('One')), li(p('Two')), li(p('Three{>}')))),
      );
      const plaintext = `1. One
2. Two
3. Three`;
      let pluginState = getDefaultPlainTextPluginState();
      pluginState.plaintext = plaintext;
      pluginState.pasteStartPos = state.selection.from;
      pluginState.pasteEndPos = state.selection.to;

      const tr = formatPlainText(state.tr, pluginState);
      expect(tr).toEqualDocumentAndSelection(
        doc(
          p(`1. One
2. Two
3. Three{<>}`),
        ),
      );
    });
  });
  describe('when pasting a markdown list in between paragraphs', () => {
    it('should convert as plaintext & set the selection inside the last list item', () => {
      const state = createEditorState(
        doc(
          p('Hello World'),
          p(code('{<}1. One')),
          p(code('2. Two')),
          p(code('3. Three{>}')),
          p('End'),
        ),
      );
      const plaintext = `1. One
2. Two
3. Three`;
      let pluginState = getDefaultPlainTextPluginState();
      pluginState.plaintext = plaintext;
      pluginState.pasteStartPos = state.selection.from;
      pluginState.pasteEndPos = state.selection.to;

      const tr = formatPlainText(state.tr, pluginState);
      expect(tr).toEqualDocumentAndSelection(
        doc(
          p('Hello World'),
          p(`1. One
2. Two
3. Three{<>}`),
          p('End'),
        ),
      );
    });
  });
});
