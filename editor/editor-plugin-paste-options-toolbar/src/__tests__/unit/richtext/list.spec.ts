import { Fragment, Slice } from '@atlaskit/editor-prosemirror/model';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  code,
  doc,
  br as hardBreak,
  li,
  ol,
  p,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { formatRichText } from '../../../util/format-handlers';
import { getDefaultRichTextPluginState } from '../_testHelpers';

describe('format rich text', () => {
  describe('when pasting a list in empty doc', () => {
    it('should place the cursor at the end of last list item when formatted to richText', () => {
      const state = createEditorState(
        doc('{<}', ol()(li(p('First item')), li(p('Second item'))), '{>}'),
      );
      const schema = state.schema;
      const richTextSlice = new Slice(
        Fragment.fromArray([
          schema.text('1. First item', [schema.marks.code.create()]),
          schema.nodes.hardBreak.create(),
          schema.text('2. Second item', [schema.marks.code.create()]),
        ]),
        0,
        0,
      );

      let pluginState = getDefaultRichTextPluginState();
      pluginState.richTextSlice = richTextSlice;
      pluginState.pasteStartPos = state.selection.from;
      pluginState.pasteEndPos = state.selection.to;

      const tr = formatRichText(state.tr, pluginState);
      expect(tr).toEqualDocumentAndSelection(
        doc(p(code('1. First item'), hardBreak(), code('2. Second item{<>}'))),
      );
    });
  });

  describe('when pasting a list inside an existing paragraph', () => {
    it('should place the cursor at the end of last list item when formatted to richText', () => {
      const state = createEditorState(
        doc(
          p('Some text'),
          '{<}',
          ol()(li(p('First item')), li(p('Second item'))),
          '{>}',
          p('another text'),
        ),
      );
      const schema = state.schema;
      const richTextSlice = new Slice(
        Fragment.fromArray([
          schema.text('1. First item', [schema.marks.code.create()]),
          schema.nodes.hardBreak.create(),
          schema.text('2. Second item', [schema.marks.code.create()]),
        ]),
        0,
        0,
      );

      let pluginState = getDefaultRichTextPluginState();
      pluginState.richTextSlice = richTextSlice;
      pluginState.pasteStartPos = state.selection.from;
      pluginState.pasteEndPos = state.selection.to;

      const tr = formatRichText(state.tr, pluginState);
      expect(tr).toEqualDocumentAndSelection(
        doc(
          p('Some text'),
          p(code('1. First item'), hardBreak(), code('2. Second item{<>}')),
          p('another text'),
        ),
      );
    });
  });

  describe('when pasting a list between two paragraphs', () => {
    it('should place the cursor at the end of last list item when formatted to richText', () => {
      const state = createEditorState(
        doc(
          p('Some text'),
          '{<}',
          ol()(li(p('First item')), li(p('Second item'))),
          '{>}',
          p('another text'),
        ),
      );
      const schema = state.schema;
      const richTextSlice = new Slice(
        Fragment.fromArray([
          schema.text('1. First item', [schema.marks.code.create()]),
          schema.nodes.hardBreak.create(),
          schema.text('2. Second item', [schema.marks.code.create()]),
        ]),
        0,
        0,
      );

      let pluginState = getDefaultRichTextPluginState();
      pluginState.richTextSlice = richTextSlice;
      pluginState.pasteStartPos = state.selection.from;
      pluginState.pasteEndPos = state.selection.to;

      const tr = formatRichText(state.tr, pluginState);
      expect(tr).toEqualDocumentAndSelection(
        doc(
          p('Some text'),
          p(code('1. First item'), hardBreak(), code('2. Second item{<>}')),
          p('another text'),
        ),
      );
    });
  });
});
