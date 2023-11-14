import { Fragment, Slice } from '@atlaskit/editor-prosemirror/model';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  code,
  code_block,
  doc,
  p,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { formatRichText } from '../../../util/format-handlers';
import { getDefaultRichTextPluginState } from '../_testHelpers';

describe('format rich text', () => {
  describe('when pasting a paragraph in empty doc', () => {
    it('should convert to paragraph with code mark', () => {
      const plaintext = 'test paragraph';
      const state = createEditorState(doc(p('{<}test paragraph{>}')));
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

    it('should convert paragraph with multiple lines into a codeblock', () => {
      const plaintext = `test paragraph line 1
  test paragraph line 2`;
      const state = createEditorState(
        doc(p('{<}test paragraph line 1'), p('test paragraph line 2{>}')),
      );
      const schema = state.schema;
      const richTextSlice = new Slice(
        Fragment.fromArray([
          schema.nodes.codeBlock.create(
            { language: null },
            schema.text(plaintext),
          ),
          schema.nodes.paragraph.create(),
        ]),
        1,
        1,
      );

      let pluginState = getDefaultRichTextPluginState();
      pluginState.richTextSlice = richTextSlice;
      pluginState.plaintext = plaintext;
      pluginState.pasteStartPos = state.selection.from;
      pluginState.pasteEndPos = state.selection.to;

      const tr = formatRichText(state.tr, pluginState);
      expect(tr).toEqualDocumentAndSelection(
        doc(code_block({})(plaintext), p('{<>}')),
      );
    });
  });

  describe('when pasting a paragraph inside a paragraph', () => {
    it('should convert to paragraph with code mark', () => {
      const plaintext = 'test paragraph';
      const state = createEditorState(
        doc(p('Some text'), p('{<}test paragraph{>}'), p('another text')),
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

    it('should convert paragraph with multiple lines into a codeblock', () => {
      const plaintext = `test paragraph line 1
  test paragraph line 2`;
      const state = createEditorState(
        doc(
          p('some text'),
          p('{<}test paragraph line 1'),
          p('test paragraph line 2{>}'),
          p('another text'),
        ),
      );
      const schema = state.schema;
      const richTextSlice = new Slice(
        Fragment.fromArray([
          schema.nodes.codeBlock.create(
            { language: null },
            schema.text(plaintext),
          ),
          schema.nodes.paragraph.create(),
        ]),
        1,
        1,
      );

      let pluginState = getDefaultRichTextPluginState();
      pluginState.richTextSlice = richTextSlice;
      pluginState.plaintext = plaintext;
      pluginState.pasteStartPos = state.selection.from;
      pluginState.pasteEndPos = state.selection.to;

      const tr = formatRichText(state.tr, pluginState);
      expect(tr).toEqualDocumentAndSelection(
        doc(
          p('some text'),
          code_block({})(plaintext),
          p('{<>}'),
          p('another text'),
        ),
      );
    });
  });

  describe('when pasting a paragraph between two paragraph', () => {
    it('should convert to paragraph with code mark', () => {
      const plaintext = 'test paragraph';
      const state = createEditorState(
        doc(p('Some text'), p('{<}test paragraph{>}'), p('another text')),
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

    it('should convert paragraph with multiple lines into a codeblock', () => {
      const plaintext = `test paragraph line 1
  test paragraph line 2`;
      const state = createEditorState(
        doc(
          p('some text'),
          p('{<}test paragraph line 1'),
          p('test paragraph line 2{>}'),
          p('another text'),
        ),
      );
      const schema = state.schema;
      const richTextSlice = new Slice(
        Fragment.fromArray([
          schema.nodes.codeBlock.create(
            { language: null },
            schema.text(plaintext),
          ),
          schema.nodes.paragraph.create(),
        ]),
        1,
        1,
      );

      let pluginState = getDefaultRichTextPluginState();
      pluginState.richTextSlice = richTextSlice;
      pluginState.plaintext = plaintext;
      pluginState.pasteStartPos = state.selection.from;
      pluginState.pasteEndPos = state.selection.to;

      const tr = formatRichText(state.tr, pluginState);
      expect(tr).toEqualDocumentAndSelection(
        doc(
          p('some text'),
          code_block({})(plaintext),
          p('{<>}'),
          p('another text'),
        ),
      );
    });
  });
});
