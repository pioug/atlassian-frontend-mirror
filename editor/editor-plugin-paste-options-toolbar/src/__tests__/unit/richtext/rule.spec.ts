import { Fragment, Slice } from '@atlaskit/editor-prosemirror/model';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
// eslint-disable-next-line import/no-extraneous-dependencies
import { code, doc, hr, p } from '@atlaskit/editor-test-helpers/doc-builder';

import { formatRichText } from '../../../util/format-handlers';

describe('format rich text: rule', () => {
  describe('when pasting a rule in empty doc', () => {
    it('should convert rule  to *** with code mark', () => {
      const plaintext = '***';
      const state = createEditorState(doc('{<}', hr(), '{>}'));
      const schema = state.schema;
      const richTextSlice = new Slice(
        Fragment.from(schema.text(plaintext, [schema.marks.code.create()])),
        0,
        0,
      );
      let tr = formatRichText(state, state.selection.from, richTextSlice);
      expect(tr).toEqualDocumentAndSelection(doc(p(code(`${plaintext}{<>}`))));
    });
  });

  describe('when pasting a rule inside a paragraph', () => {
    it('should convert rule  to *** with code mark', () => {
      const plaintext = '***';
      const state = createEditorState(
        doc(p('some text'), '{<}', hr(), '{>}', p('another text')),
      );
      const schema = state.schema;
      const richTextSlice = new Slice(
        Fragment.from(schema.text(plaintext, [schema.marks.code.create()])),
        0,
        0,
      );
      let tr = formatRichText(state, state.selection.from, richTextSlice);
      expect(tr).toEqualDocumentAndSelection(
        doc(p('some text'), p(code(`${plaintext}{<>}`)), p('another text')),
      );
    });
  });

  describe('when pasting a rule between two paragraphs', () => {
    it('should convert rule  to *** with code mark', () => {
      const plaintext = '***';
      const state = createEditorState(
        doc(p('some text'), '{<}', hr(), '{>}', p('another text')),
      );
      const schema = state.schema;
      const richTextSlice = new Slice(
        Fragment.from(schema.text(plaintext, [schema.marks.code.create()])),
        0,
        0,
      );
      let tr = formatRichText(state, state.selection.from, richTextSlice);
      expect(tr).toEqualDocumentAndSelection(
        doc(p('some text'), p(code(`${plaintext}{<>}`)), p('another text')),
      );
    });
  });
});
