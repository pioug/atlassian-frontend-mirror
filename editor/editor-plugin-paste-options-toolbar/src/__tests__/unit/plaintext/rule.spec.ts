// eslint-disable-next-line import/no-extraneous-dependencies
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
// eslint-disable-next-line import/no-extraneous-dependencies
import { code, doc, hr, p } from '@atlaskit/editor-test-helpers/doc-builder';

import { formatPlainText } from '../../../util/format-handlers';
import { getDefaultPlainTextPluginState } from '../_testHelpers';

describe('formatPlainText: rule', () => {
  describe('when pasting a rule inside an empty doc', () => {
    it('should convert rule into plaintext & set the selection at the end of converted plaintext', () => {
      const state = createEditorState(doc(p('{<>}')));
      const plaintext = `***`;
      let pluginState = getDefaultPlainTextPluginState();
      pluginState.plaintext = plaintext;
      pluginState.pasteStartPos = state.selection.from;
      pluginState.pasteEndPos = state.selection.to;
      const tr = formatPlainText(state.tr, pluginState);
      expect(tr).toEqualDocumentAndSelection(
        doc(
          // prettier-ignore
          p('***{<>}'),
        ),
      );
    });
  });

  describe('when pasting a rule inside an doc with a rule selected', () => {
    it('should convert rule into plaintext & set the selection at the end of converted plaintext', () => {
      const state = createEditorState(doc('{<}', hr(), '{>}'));
      const plaintext = `***`;
      let pluginState = getDefaultPlainTextPluginState();
      pluginState.plaintext = plaintext;
      pluginState.pasteStartPos = state.selection.from;
      pluginState.pasteEndPos = state.selection.to;
      const tr = formatPlainText(state.tr, pluginState);
      expect(tr).toEqualDocumentAndSelection(
        doc(
          // prettier-ignore
          p('***{<>}'),
        ),
      );
    });
  });

  describe('when pasting a rule inside an doc with node selection at the rule', () => {
    it('should convert rule into plaintext & set the selection at the end of converted plaintext', () => {
      const state = createEditorState(doc('{<node>}', hr()));
      const plaintext = `***`;
      let pluginState = getDefaultPlainTextPluginState();
      pluginState.plaintext = plaintext;
      pluginState.pasteStartPos = state.selection.from;
      pluginState.pasteEndPos = state.selection.to;
      const tr = formatPlainText(state.tr, pluginState);
      expect(tr).toEqualDocumentAndSelection(
        doc(
          // prettier-ignore
          p('***{<>}'),
        ),
      );
    });
  });

  describe('when pasting a rule in between paragraphs', () => {
    it('should convert rule into plaintext & set the selection at the end of converted plaintext', () => {
      const state = createEditorState(
        doc(p(`Hello World`), p('{<}', code('***'), '{>}'), p('end')),
      );
      const plaintext = `***`;
      let pluginState = getDefaultPlainTextPluginState();
      pluginState.plaintext = plaintext;
      pluginState.pasteStartPos = state.selection.from;
      pluginState.pasteEndPos = state.selection.to;
      const tr = formatPlainText(state.tr, pluginState);
      expect(tr).toEqualDocumentAndSelection(
        doc(
          // prettier-ignore
          p('Hello World'),
          p('***{<>}'),
          p('end'),
        ),
      );
    });
  });
});
