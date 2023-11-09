import { Fragment, Slice } from '@atlaskit/editor-prosemirror/model';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
// eslint-disable-next-line import/no-extraneous-dependencies
import { code, doc, h1, p } from '@atlaskit/editor-test-helpers/doc-builder';

import { formatRichText } from '../../../util/format-handlers';
import { getDefaultRichTextPluginState } from '../_testHelpers';

describe('format rich text: heading', () => {
  describe('when pasting a heading in empty doc', () => {
    it('should convert the heading into paragraph with code mark', () => {
      const plaintext = '# Heading level 1';
      const state = createEditorState(doc(h1('{<}Heading level 1{>}')));
      const schema = state.schema;
      const richTextSlice = new Slice(
        Fragment.from(schema.text(plaintext, [schema.marks.code.create()])),
        0,
        0,
      );

      let pluginState = getDefaultRichTextPluginState();
      pluginState.richTextSlice = richTextSlice;
      pluginState.plaintext = plaintext;
      pluginState.pasteStartPos = state.selection.from;
      pluginState.pasteEndPos = state.selection.to;

      const tr = formatRichText(state.tr, pluginState);
      expect(tr).toEqualDocumentAndSelection(doc(p(code(`${plaintext}{<>}`))));
    });
  });

  describe('when pasting a heading in an existing paragraph', () => {
    it('should convert the heading into paragraph with code mark', () => {
      const plaintext = '# Heading level 1';
      const state = createEditorState(
        doc(p('Some text'), h1('{<}Heading level 1{>}'), p('another text')),
      );
      const schema = state.schema;
      const richTextSlice = new Slice(
        Fragment.from(schema.text(plaintext, [schema.marks.code.create()])),
        0,
        0,
      );

      let pluginState = getDefaultRichTextPluginState();
      pluginState.richTextSlice = richTextSlice;
      pluginState.plaintext = plaintext;
      pluginState.pasteStartPos = state.selection.from;
      pluginState.pasteEndPos = state.selection.to;

      const tr = formatRichText(state.tr, pluginState);
      expect(tr).toEqualDocumentAndSelection(
        doc(p('Some text'), p(code(`${plaintext}{<>}`)), p('another text')),
      );
    });
  });

  describe('when pasting a heading between two pargraph', () => {
    it('should convert the heading into paragraph with code mark', () => {
      const plaintext = '# Heading level 1';
      const state = createEditorState(
        doc(p('Some text'), h1('{<}Heading level 1{>}'), p('another text')),
      );
      const schema = state.schema;
      const richTextSlice = new Slice(
        Fragment.from(schema.text(plaintext, [schema.marks.code.create()])),
        0,
        0,
      );

      let pluginState = getDefaultRichTextPluginState();
      pluginState.richTextSlice = richTextSlice;
      pluginState.plaintext = plaintext;
      pluginState.pasteStartPos = state.selection.from;
      pluginState.pasteEndPos = state.selection.to;

      const tr = formatRichText(state.tr, pluginState);
      expect(tr).toEqualDocumentAndSelection(
        doc(p('Some text'), p(code(`${plaintext}{<>}`)), p('another text')),
      );
    });
  });
});
