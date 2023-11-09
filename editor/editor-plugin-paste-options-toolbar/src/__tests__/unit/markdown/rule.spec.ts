// eslint-disable-next-line import/no-extraneous-dependencies
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
// eslint-disable-next-line import/no-extraneous-dependencies
import { code, doc, hr, p } from '@atlaskit/editor-test-helpers/doc-builder';

import { formatMarkdown } from '../../../util/format-handlers';
import { getDefaultMarkdownPluginState } from '../_testHelpers';

describe('formatMarkdown', () => {
  describe('when pasting a rule inside an empty paragraph', () => {
    it('should set the selection inside the rule', () => {
      const state = createEditorState(
        doc(p(`Hello World`), p('{<}', code('***'), '{>}'), p('end')),
      );
      const plaintext = `***`;

      let pluginState = getDefaultMarkdownPluginState();
      pluginState.plaintext = plaintext;
      pluginState.pasteStartPos = state.selection.from;
      pluginState.pasteEndPos = state.selection.to;
      const tr = formatMarkdown(state.tr, pluginState);
      expect(tr).toEqualDocumentAndSelection(
        doc(
          // prettier-ignore
          p('Hello World'),
          '{<node>}',
          hr(),
          p('end'),
        ),
      );
    });
  });

  describe('when pasting a rule with text before', () => {
    it('should set the node selection at rule', () => {
      const state = createEditorState(
        doc(p('Hello', code('{<}***{>}'), 'World')),
      );
      const plaintext = `
one
***`;

      let pluginState = getDefaultMarkdownPluginState();
      pluginState.plaintext = plaintext;
      pluginState.pasteStartPos = state.selection.from;
      pluginState.pasteEndPos = state.selection.to;
      const tr = formatMarkdown(state.tr, pluginState);
      expect(tr).toEqualDocumentAndSelection(
        doc(
          // prettier-ignore
          p('Helloone'),
          '{<node>}',
          hr(),
          p('World'),
        ),
      );
    });
  });

  describe('when pasting a rule in an existing paragraph', () => {
    it('should set the node selection at rule', () => {
      const state = createEditorState(
        doc(p('Hello', code('{<}***{>}'), 'World')),
      );
      const plaintext = `***`;

      let pluginState = getDefaultMarkdownPluginState();
      pluginState.plaintext = plaintext;
      pluginState.pasteStartPos = state.selection.from;
      pluginState.pasteEndPos = state.selection.to;
      const tr = formatMarkdown(state.tr, pluginState);
      expect(tr).toEqualDocumentAndSelection(
        doc(
          // prettier-ignore
          p('Hello'),
          '{<node>}',
          hr(),
          p('World'),
        ),
      );
    });
  });

  describe('when pasting a rule in empty doc', () => {
    it('should set the selection inside the rule', () => {
      const state = createEditorState(doc(p('{<}', code('***'), '{>}')));

      const plaintext = `***`;

      let pluginState = getDefaultMarkdownPluginState();
      pluginState.plaintext = plaintext;
      pluginState.pasteStartPos = state.selection.from;
      pluginState.pasteEndPos = state.selection.to;
      const tr = formatMarkdown(state.tr, pluginState);

      expect(tr).toEqualDocumentAndSelection(
        doc(
          '{<node>}',
          // prettier-ignore
          hr(),
        ),
      );
    });
  });
});
