import { Fragment, Slice } from '@atlaskit/editor-prosemirror/model';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  code,
  code_block,
  doc,
  br as hardBreak,
  li,
  ol,
  p,
  ul,
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

describe('formatMarkdown', () => {
  describe('when pasting a markdown list', () => {
    it('set the selection inside the last list item', () => {
      const state = createEditorState(
        doc(
          p(
            `Hello World{<}`,
            code('1. First item'),
            hardBreak(code('')),
            code('2. Second item'),
            hardBreak(code('')),
            code('3. Third item'),
            hardBreak(code('')),
            code('4. Fourth item'),
            '{>}',
          ),
          p(),
        ),
      );
      const plaintext = `1. First item
2. Second item
3. Third item
4. Fourth item`;

      let pluginState = getDefaultMarkdownPluginState();
      pluginState.plaintext = plaintext;
      pluginState.pasteStartPos = state.selection.from;
      pluginState.pasteEndPos = state.selection.to;
      const tr = formatMarkdown(state.tr, pluginState);

      expect(tr).toEqualDocumentAndSelection(
        doc(
          // prettier-ignore
          p('Hello World'),
          ol()(
            li(p('First item')),
            li(p('Second item')),
            li(p('Third item')),
            li(p('Fourth item{<>}')),
          ),
          p(),
        ),
      );
    });
  });

  describe('when pasting a markdown list with paragrpah', () => {
    it('should set the selection inside the last list item', () => {
      const state = createEditorState(
        doc(
          code_block()(
            '{<}Starting paragraph. 1. First item 2. Second item 3. Third item 4. Fourth item Ending paragraph. With multiple lines.',
          ),
          p('{>}'),
        ),
      );

      const plaintext = `Starting paragraph.


1. First item
2. Second item
3. Third item
4. Fourth item


Ending paragraph.
With multiple lines.
`;

      let pluginState = getDefaultMarkdownPluginState();
      pluginState.plaintext = plaintext;
      pluginState.pasteStartPos = state.selection.from;
      pluginState.pasteEndPos = state.selection.to;
      const tr = formatMarkdown(state.tr, pluginState);

      expect(tr).toEqualDocumentAndSelection(
        doc(
          // prettier-ignore
          p('Starting paragraph.'),
          ol()(
            li(p('First item')),
            li(p('Second item')),
            li(p('Third item')),
            li(p('Fourth item{<>}')),
          ),
          p('Ending paragraph.', hardBreak(), 'With multiple lines.{<>}'),
        ),
      );
    });
  });

  describe('when pasting a bullet list with a paragrpah', () => {
    it('should set the selection inside the last list item', () => {
      const state = createEditorState(
        doc(
          p('Lorem ipsum dolor sit amet.'),
          code_block()(`{<}some initial text

            - First item
            - Second item
            - Third item
            - Fourth item

            some final text`),
          p('{>}'),
          p('consectetur adipiscing elit.'),
        ),
      );

      const plaintext = `
some initial text

- First item
- Second item
- Third item
- Fourth item

some final text
      `;

      let pluginState = getDefaultMarkdownPluginState();
      pluginState.plaintext = plaintext;
      pluginState.pasteStartPos = state.selection.from;
      pluginState.pasteEndPos = state.selection.to;
      const tr = formatMarkdown(state.tr, pluginState);

      expect(tr).toEqualDocumentAndSelection(
        doc(
          p('Lorem ipsum dolor sit amet.'),
          p('some initial text'),
          ul(
            li(p('First item')),
            li(p('Second item')),
            li(p('Third item')),
            li(p('Fourth item')),
          ),
          p('some final text'),
          p('consectetur adipiscing elit.'),
        ),
      );
    });
  });

  describe('when pasting a list inside a new paragraph', () => {
    // eslint-disable-next-line jest/no-focused-tests
    it('should match correct document and selection', () => {
      const state = createEditorState(
        doc(
          p(`Hello World`),
          p(
            '{<}',
            code('1. First item'),
            hardBreak(code('')),
            code('2. Second item'),
            hardBreak(code('')),
            code('3. Third item'),
            hardBreak(code('')),
            code('4. Fourth item'),
            '{>}',
          ),
          p(`Ending paragraph`),
        ),
      );

      const plaintext = `1. First item
2. Second item
3. Third item
4. Fourth item`;

      let pluginState = getDefaultMarkdownPluginState();
      pluginState.plaintext = plaintext;
      pluginState.pasteStartPos = state.selection.from;
      pluginState.pasteEndPos = state.selection.to;
      const tr = formatMarkdown(state.tr, pluginState);

      expect(tr).toEqualDocumentAndSelection(
        doc(
          // prettier-ignore
          p('Hello World'),
          ol()(
            li(p('First item')),
            li(p('Second item')),
            li(p('Third item')),
            li(p('Fourth item{<>}')),
          ),
          p(`Ending paragraph`),
        ),
      );
    });
  });
});

describe('formatPlainText', () => {
  describe('when pasting a markdown list in an empty doc', () => {
    it('should convert as plaintext & set the selection inside the last list item', () => {
      const state = createEditorState(
        doc(
          // prettier-ignore
          '{<}',
          ol()(li(p('One')), li(p('Two')), li(p('Three{>}'))),
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
          // prettier-ignore
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
          // prettier-ignore
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

describe('format rich text:list', () => {
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
