import { Fragment, Slice } from '@atlaskit/editor-prosemirror/model';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  blockquote,
  code,
  code_block,
  doc,
  p,
} from '@atlaskit/editor-test-helpers/doc-builder';

import {
  formatMarkdown,
  formatPlainText,
  formatRichText,
} from '../../util/format-handlers';

import {
  getDefaultMarkdownPluginState,
  getDefaultPlainTextPluginState,
  getDefaultRichTextPluginState,
} from './_testHelpers';

describe('formatPlainText: codeblock', () => {
  describe('when pasting a codeblock inside an empty paragraph', () => {
    it('should convert codeblock into plaintext & set the selection at the end of converted plaintext', () => {
      const state = createEditorState(
        doc(
          p(`Hello World`),
          '{<}',
          code_block()(
            '``` { "firstName": "John", "lastName": "Smith", "age": 25 } ```',
          ),
          p('{>}'),
          p('end'),
        ),
      );

      const ticks = '````';
      const plaintext = `${ticks}
{
  "firstName": "John",
  "lastName": "Smith",
  "age": 25
}
${ticks}`;
      let pluginState = getDefaultPlainTextPluginState();
      pluginState.plaintext = plaintext;
      pluginState.pasteStartPos = state.selection.from;
      pluginState.pasteEndPos = state.selection.to;
      const tr = formatPlainText(state.tr, pluginState);
      expect(tr).toEqualDocumentAndSelection(
        doc(
          // prettier-ignore
          p('Hello World'),
          p(`${ticks}
{
  "firstName": "John",
  "lastName": "Smith",
  "age": 25
}
${ticks}{<>}`),
          p('end'),
        ),
      );
    });
  });

  describe('when pasting a codeblock inside an empty doc', () => {
    it('should convert codeblock into plaintext & set the selection at the end of converted plaintext', () => {
      const state = createEditorState(doc(code_block()('{<}Hello world{>}')));
      const plaintext = `Hello world`;
      let pluginState = getDefaultMarkdownPluginState();
      pluginState.plaintext = plaintext;
      pluginState.pasteStartPos = state.selection.from;
      pluginState.pasteEndPos = state.selection.to;
      const tr = formatMarkdown(state.tr, pluginState);
      expect(tr).toEqualDocumentAndSelection(
        doc(
          // prettier-ignore
          p('Hello world{<>}'),
        ),
      );
    });
  });
});

describe('format rich text: blockquote', () => {
  describe('when pasting a blockquote in empty doc', () => {
    it('should convert blockquote to paragraph with code mark', () => {
      const plaintext = '> test blockquote';
      const state = createEditorState(
        doc('{<}', blockquote(p('test blockquote')), '{>}'),
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
      expect(tr).toEqualDocumentAndSelection(doc(p(code(`${plaintext}{<>}`))));
    });

    it('should convert blockquote with multiple lines into a codeblock', () => {
      const plaintext = `> test blockquote line 1
> test blockquote line 2`;
      const state = createEditorState(
        doc(
          '{<}',
          blockquote(p('test blockquote line 1'), p('test blockquote line 2')),
          '{>}',
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
        doc(code_block({})(plaintext), p('{<>}')),
      );
    });
  });

  describe('when pasting a blockquote inside a paragraph', () => {
    it('should convert blockquote to paragraph with code mark', () => {
      const plaintext = '> test blockquote';
      const state = createEditorState(
        doc(
          p('Some text'),
          '{<}',
          blockquote(p('test blockquote')),
          '{>}',
          p('another text'),
        ),
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

    it('should convert blockquote with multiple lines into a codeblock', () => {
      const plaintext = `> test blockquote line 1
> test blockquote line 2`;
      const state = createEditorState(
        doc(
          p('some text'),
          '{<}',
          blockquote(p('test blockquote line 1'), p('test blockquote line 2')),
          '{>}',
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

  describe('when pasting a blockquote between two paragraph', () => {
    it('should convert blockquote to paragraph with code mark', () => {
      const plaintext = '> test blockquote';
      const state = createEditorState(
        doc(
          p('Some text'),
          '{<}',
          blockquote(p('test blockquote')),
          '{>}',
          p('another text'),
        ),
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

    it('should convert blockquote with multiple lines into a codeblock', () => {
      const plaintext = `> test blockquote line 1
> test blockquote line 2`;
      const state = createEditorState(
        doc(
          p('some text'),
          '{<}',
          blockquote(p('test blockquote line 1'), p('test blockquote line 2')),
          '{>}',
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
