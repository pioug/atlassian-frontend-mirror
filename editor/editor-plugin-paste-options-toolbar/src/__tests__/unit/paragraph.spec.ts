import { Fragment, Slice } from '@atlaskit/editor-prosemirror/model';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  br,
  code,
  code_block,
  doc,
  h1,
  p,
  strong,
} from '@atlaskit/editor-test-helpers/doc-builder';

import {
  formatMarkdown,
  formatPlainText,
  formatRichText,
  getRichTextSlice,
} from '../../util/format-handlers';

describe('formatMarkdown', () => {
  describe('when pasting a paragraph inside an empty paragraph', () => {
    it('should set the selection inside the paragraph', () => {
      const state = createEditorState(
        doc(
          p('Hello World'),
          p(
            code('{<}I really like using Markdown.'),
            br(),
            br(),
            code(
              "I think I'll use it to format all of my documents from now on.{>}",
            ),
          ),
          p('end'),
        ),
      );
      const plaintext = `I really like using Markdown.

I think I'll use it to format all of my documents from now on.`;

      const tr = formatMarkdown(state, state.selection.from, plaintext);

      expect(tr).toEqualDocumentAndSelection(
        doc(
          // prettier-ignore
          p('Hello World'),
          p('I really like using Markdown.'),
          p(
            "I think I'll use it to format all of my documents from now on.{<>}",
          ),
          p('end'),
        ),
      );
    });
  });

  describe('when pasting a singleline paragraph in an existing paragraph', () => {
    it('should set the selection inside the paragraph', () => {
      const state = createEditorState(
        doc(p('Hello{<}', code('I really like using Markdown.'), '{>}World')),
      );

      const plaintext = `I really like using Markdown.`;

      const tr = formatMarkdown(state, state.selection.from, plaintext);

      expect(tr).toEqualDocumentAndSelection(
        doc(
          // prettier-ignore
          p('HelloI really like using Markdown.{<>}World'),
        ),
      );
    });
  });

  describe('when pasting a multiline paragraph in an existing paragraph', () => {
    it('should set the selection inside the paragraph', () => {
      const state = createEditorState(
        doc(
          p('Hello World{<}', code('I really like using Markdown.')),
          p(
            code(
              "I think I'll use it to format all of my documents from now on.{>}",
            ),
          ),
          p('end'),
        ),
      );

      const plaintext = `I really like using Markdown.

I think I'll use it to format all of my documents from now on.`;

      const tr = formatMarkdown(state, state.selection.from, plaintext);

      expect(tr).toEqualDocumentAndSelection(
        doc(
          // prettier-ignore
          p('Hello WorldI really like using Markdown.'),
          p(
            "I think I'll use it to format all of my documents from now on.{<>}",
          ),
          p('end'),
        ),
      );
    });
  });

  describe('when pasting a paragraph in empty doc', () => {
    it('should set the selection inside the paragraph', () => {
      const state = createEditorState(
        doc(
          p('{<}', code('I really like using Markdown.')),
          p(
            code(
              "I think I'll use it to format all of my documents from now on.{>}",
            ),
          ),
        ),
      );

      const plaintext = `I really like using Markdown.

I think I'll use it to format all of my documents from now on.`;

      const tr = formatMarkdown(state, state.selection.from, plaintext);

      expect(tr).toEqualDocumentAndSelection(
        doc(
          // prettier-ignore
          p('I really like using Markdown.'),
          p(
            "I think I'll use it to format all of my documents from now on.{<>}",
          ),
        ),
      );
    });
  });

  describe('empty text inside a new paragraph in-between existing paras', () => {
    it('should set the selection at correct position', () => {
      const state = createEditorState(
        doc(p('Hello World'), p('{<>}'), p('end')),
      );
      const plaintext = ``;

      const tr = formatMarkdown(state, state.selection.from, plaintext);

      expect(tr).toEqualDocumentAndSelection(
        doc(
          // prettier-ignore
          p('Hello World'),
          p('end'),
        ),
      );
    });
  });
});

describe('format markdown: marks', () => {
  it('should insert md-formatted text at cursor position', () => {
    const state = createEditorState(
      // prettier-ignore
      doc(
        p(code('Code mark example.')),
        p('work{<>}'),
      ),
    );

    const pasteStartPos = state.selection.from;
    const tr = formatMarkdown(state, pasteStartPos, 'some **bold** text');

    expect(tr).toEqualDocumentAndSelection(
      // prettier-ignore
      doc(
        p(code('Code mark example.')),
        p('worksome ', strong('bold'), ' text'),
      ),
    );
  });

  it('should replace with md-formatted text', () => {
    const state = createEditorState(
      // prettier-ignore
      doc(
        p(code('Code mark example.')),
        p('work{<>}'),
      ),
    );

    const pasteStartPos = 0; //insert md in beginning of doc
    const tr = formatMarkdown(state, pasteStartPos, 'some **bold** text');

    expect(tr).toEqualDocumentAndSelection(
      // prettier-ignore
      doc(
        p('some ', strong('bold'), ' text'),
      ),
    );
  });

  it('should not do anything if start position is invalid', () => {
    const state = createEditorState(
      // prettier-ignore
      doc(
        p(code('Code mark example.')),
        p('work{<>}'),
      ),
    );

    const pasteStartPos = -1; //invalid start pos
    const tr = formatMarkdown(state, pasteStartPos, 'some **bold** text');

    expect(tr).toEqualDocumentAndSelection(
      // prettier-ignore
      doc(
        p(code('Code mark example.')),
        p('work{<>}'),
      ),
    );
  });

  it('should not do anything if md is empty', () => {
    const state = createEditorState(
      // prettier-ignore
      doc(
        p(code('Code mark example.')),
        p('work{<>}'),
      ),
    );

    const pasteStartPos = -1; //invalid start pos
    const tr = formatMarkdown(state, pasteStartPos, '');

    expect(tr).toEqualDocumentAndSelection(
      // prettier-ignore
      doc(
        p(code('Code mark example.')),
        p('work{<>}'),
      ),
    );
  });

  it('should not render markdown list if escape character is preceeding', () => {
    const state = createEditorState(
      // prettier-ignore
      doc(
        p('{<>}'),
      ),
    );

    const tr = formatMarkdown(
      state,
      1,
      '\\* Without the backslash, this would be a bullet in an unordered list.',
    );

    expect(tr).toEqualDocumentAndSelection(
      // prettier-ignore
      doc(
        p('\\* Without the backslash, this would be a bullet in an unordered list.{<>}'),
      ),
    );
  });
});

describe('formatPlainText', () => {
  describe('when pasting a paragraph inside an empty paragraph', () => {
    it('should set the selection inside the paragraph', () => {
      const state = createEditorState(
        doc(
          p('Hello World'),
          p(
            code('{<}I really like using RichText.'),
            br(),
            br(),
            code(
              "I think I'll use it to format all of my documents from now on.{>}",
            ),
          ),
          p('end'),
        ),
      );
      const plaintext = `I really like using RichText.

I think I'll use it to format all of my documents from now on.`;

      const tr = formatPlainText(state, state.selection.from, plaintext);

      expect(tr).toEqualDocumentAndSelection(
        doc(
          // prettier-ignore
          p('Hello World'),
          p(`I really like using RichText.

I think I'll use it to format all of my documents from now on.{<>}`),
          p('end'),
        ),
      );
    });
  });

  describe('when pasting a singleline paragraph in an existing paragraph', () => {
    it('should set the selection inside the paragraph', () => {
      const state = createEditorState(
        doc(p('Hello{<}', code('I really like using RichText.'), '{>}World')),
      );

      const plaintext = `I really like using RichText.`;

      const tr = formatPlainText(state, state.selection.from, plaintext);

      expect(tr).toEqualDocumentAndSelection(
        doc(
          // prettier-ignore
          p('HelloI really like using RichText.{<>}World'),
        ),
      );
    });
  });

  describe('when pasting a multiline paragraph in an existing paragraph', () => {
    it('should set the selection inside the paragraph', () => {
      const state = createEditorState(
        doc(
          p('Hello World{<}', code('I really like using RichText.')),
          p(
            code(
              "I think I'll use it to format all of my documents from now on.{>}",
            ),
          ),
          p('end'),
        ),
      );

      const plaintext = `I really like using RichText.

I think I'll use it to format all of my documents from now on.`;

      const tr = formatPlainText(state, state.selection.from, plaintext);

      expect(tr).toEqualDocumentAndSelection(
        doc(
          // prettier-ignore
          p(`Hello WorldI really like using RichText.

I think I'll use it to format all of my documents from now on.{<>}`,
          ),
          p('end'),
        ),
      );
    });
  });

  describe('when pasting a paragraph in empty doc', () => {
    it('should set the selection inside the paragraph', () => {
      const state = createEditorState(
        doc(
          p('{<}', code('I really like using RichText.')),
          p(
            code(
              "I think I'll use it to format all of my documents from now on.{>}",
            ),
          ),
        ),
      );

      const plaintext = `I really like using RichText.

I think I'll use it to format all of my documents from now on.`;

      const tr = formatPlainText(state, state.selection.from, plaintext);

      expect(tr).toEqualDocumentAndSelection(
        doc(
          // prettier-ignore
          p(`I really like using RichText.

I think I'll use it to format all of my documents from now on.{<>}`,
          ),
        ),
      );
    });
  });

  describe('empty text inside a new paragraph in-between existing paras', () => {
    it('should set the selection at correct position', () => {
      const state = createEditorState(
        doc(p('Hello World'), p('{<>}'), p('end')),
      );
      const plaintext = ``;

      const tr = formatPlainText(state, state.selection.from, plaintext);

      expect(tr).toEqualDocumentAndSelection(
        doc(
          // prettier-ignore
          p('Hello World'),
          p('{<>}'),
          p('end'),
        ),
      );
    });
  });
});

describe('format plain text: cursor positioning', () => {
  it('should paste text at given position', () => {
    const state = createEditorState(
      // prettier-ignore
      doc(
        p('{<>}Type something'),
      ),
    );

    const tr = formatPlainText(
      state,
      state.selection.from,
      'Some pasted text.',
    );

    expect(tr).toEqualDocumentAndSelection(
      // prettier-ignore
      doc(
        p('Some pasted text.{<>}Type something'),
      ),
    );
  });

  it('should not do anything when start position is invalid', () => {
    const state = createEditorState(
      // prettier-ignore
      doc(
        p('{<>}Type something'),
      ),
    );

    // pass -1 as start position
    const tr = formatPlainText(state, -1, 'Some pasted text.');
    expect(tr).toEqualDocumentAndSelection(
      // prettier-ignore
      doc(
        p('{<>}Type something'),
      ),
    );
  });

  it('should not do anything when pasting empty text', () => {
    const state = createEditorState(
      // prettier-ignore
      doc(
        p('{<>}Type something'),
      ),
    );

    const tr = formatPlainText(state, 0, '');
    expect(tr).toEqualDocumentAndSelection(
      // prettier-ignore
      doc(
        p('{<>}Type something'),
      ),
    );
  });

  it('should replace rich text with input plain text', () => {
    const state = createEditorState(
      // prettier-ignore
      doc(
        p(code('Type something{<>}')),
      ),
    );

    const tr = formatPlainText(state, 1, 'Pasted plain text.');
    expect(tr).toEqualDocumentAndSelection(
      // prettier-ignore
      doc(
        p('Pasted plain text.{<>}'),
      ),
    );
  });

  it('should replace existing text with the input single character', () => {
    const state = createEditorState(
      // prettier-ignore
      doc(
        p('Lorem ipsum dolor sit amet.{<>}'),
      ),
    );

    const tr = formatPlainText(state, 1, 'I');
    expect(tr).toEqualDocumentAndSelection(
      // prettier-ignore
      doc(
        p('I{<>}'),
      ),
    );
  });
});

describe('format rich text: paragraph', () => {
  describe('when pasting a paragraph in empty doc', () => {
    it('should convert to paragraph with code mark', () => {
      const plaintext = 'test paragraph';
      const state = createEditorState(doc('{<}', p('test paragraph'), '{>}'));
      const schema = state.schema;
      const richTextSlice = new Slice(
        Fragment.from(schema.text(plaintext, [schema.marks.code.create()])),
        0,
        0,
      );
      let tr = formatRichText(state, state.selection.from, richTextSlice);
      expect(tr).toEqualDocumentAndSelection(doc(p(code(`${plaintext}{<>}`))));
    });

    it('should convert paragraph with multiple lines into a codeblock', () => {
      const plaintext = `test paragraph line 1
test paragraph line 2`;
      const state = createEditorState(
        doc(
          '{<}',
          p('test paragraph line 1'),
          p('test paragraph line 2'),
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
      let tr = formatRichText(state, state.selection.from, richTextSlice);
      expect(tr).toEqualDocumentAndSelection(
        doc(code_block({})(plaintext), p('{<>}')),
      );
    });
  });

  describe('when pasting a paragraph inside a paragraph', () => {
    it('should convert to paragraph with code mark', () => {
      const plaintext = 'test paragraph';
      const state = createEditorState(
        doc(
          p('Some text'),
          '{<}',
          p('test paragraph'),
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
      let tr = formatRichText(state, state.selection.from, richTextSlice);
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
          '{<}',
          p('test paragraph line 1'),
          p('test paragraph line 2'),
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
      let tr = formatRichText(state, state.selection.from, richTextSlice);
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
        doc(
          p('Some text'),
          '{<}',
          p('test paragraph'),
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
      let tr = formatRichText(state, state.selection.from, richTextSlice);
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
          '{<}',
          p('test paragraph line 1'),
          p('test paragraph line 2'),
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
      let tr = formatRichText(state, state.selection.from, richTextSlice);
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

describe('get rich text slice', () => {
  it('should correctly get rich text at given position', () => {
    const state = createEditorState(
      // prettier-ignore
      doc(
        p(code('Code mark example.')),
        p('work{<>}'),
      ),
    );

    const richTextSlice = getRichTextSlice(state, 0);
    expect(richTextSlice.openStart).toEqual(0);
    expect(richTextSlice.openEnd).toEqual(1);

    const content = richTextSlice.content;
    expect(content.size).toEqual(26);

    expect(content.child(0).toString()).toEqual(
      'paragraph(code("Code mark example."))',
    );

    expect(content.child(1).toString()).toEqual('paragraph("work")');
  });

  it('should correctly replace rich text at given position', () => {
    const state = createEditorState(
      // prettier-ignore
      doc(
        p(code('Code mark example.')),
        p('work{<>}'),
      ),
    );

    const richTextSlice = getRichTextSlice(state, 0);
    const pasteStartPos = 0; //insert in the beginning
    const tr = formatRichText(state, pasteStartPos, richTextSlice);

    expect(tr).toEqualDocumentAndSelection(
      // prettier-ignore
      doc(
        p(code('Code mark example.')),
        p('work{<>}'),
      ),
    );
  });
});

describe('format rich text: positions', () => {
  it('should not do anything if start position is invalid', () => {
    const state = createEditorState(
      // prettier-ignore
      doc(
        p(code('Code mark example.')),
        p('work{<>}'),
      ),
    );

    const richTextSlice = getRichTextSlice(state, 0);
    const pasteStartPos = -1; //invalid
    const tr = formatRichText(state, pasteStartPos, richTextSlice);

    expect(tr).toEqualDocumentAndSelection(
      // prettier-ignore
      doc(
        p(code('Code mark example.')),
        p('work{<>}'),
      ),
    );
  });

  it('should correctly insert rich text at given position', () => {
    const state = createEditorState(
      // prettier-ignore
      doc(
        p(code('Code mark example.')),
        p('work{<>}'),
      ),
    );

    const richTextSlice = getRichTextSlice(state, 1);
    const pasteStartPos = state.tr.selection.$to.pos;
    const tr = formatRichText(state, pasteStartPos, richTextSlice);

    expect(tr).toEqualDocumentAndSelection(
      // prettier-ignore
      doc(
        p(code('Code mark example.')),
        p('work', code('Code mark example.')),
        p('work{<>}'),
      ),
    );
  });
});

describe('format rich text: heading', () => {
  describe('when pasting a heading in empty doc', () => {
    it('should convert the heading into paragraph with code mark', () => {
      const plaintext = '# Heading level 1';
      const state = createEditorState(
        doc('{<}', h1('Heading level 1{>}'), '{>}'),
      );
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

  describe('when pasting a heading in an existing paragraph', () => {
    it('should convert the heading into paragraph with code mark', () => {
      const plaintext = '# Heading level 1';
      const state = createEditorState(
        doc(
          p('Some text'),
          '{<}',
          h1('Heading level 1'),
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
      let tr = formatRichText(state, state.selection.from, richTextSlice);
      expect(tr).toEqualDocumentAndSelection(
        doc(p('Some text'), p(code(`${plaintext}{<>}`)), p('another text')),
      );
    });
  });

  describe('when pasting a heading between two pargraph', () => {
    it('should convert the heading into paragraph with code mark', () => {
      const plaintext = '# Heading level 1';
      const state = createEditorState(
        doc(
          p('Some text'),
          '{<}',
          h1('Heading level 1'),
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
      let tr = formatRichText(state, state.selection.from, richTextSlice);
      expect(tr).toEqualDocumentAndSelection(
        doc(p('Some text'), p(code(`${plaintext}{<>}`)), p('another text')),
      );
    });
  });
});

describe('when pasting a heading inside an empty paragraph', () => {
  it('should set the selection at the end of heading', () => {
    const state = createEditorState(
      doc(p('Hello World{<}', code('# heading'), '{>}end')),
    );

    const plaintext = `# heading`;
    const tr = formatMarkdown(state, state.selection.from, plaintext);

    expect(tr).toEqualDocumentAndSelection(
      doc(
        // prettier-ignore
        p('Hello World'),
        h1('heading{<>}'),
        p('end'),
      ),
    );
  });
});

describe('when pasting a heading inside an empty doc', () => {
  it('should set the selection at the end of heading', () => {
    const state = createEditorState(doc(p('{<}', code('# heading'), '{>}')));

    const plaintext = `# heading`;
    const tr = formatMarkdown(state, state.selection.from, plaintext);

    expect(tr).toEqualDocumentAndSelection(
      doc(
        // prettier-ignore
        h1('heading{<>}'),
      ),
    );
  });
});

describe('when pasting a heading on a line containing heading', () => {
  it('should set the selection at the end of heading', () => {
    const state = createEditorState(
      doc(h1('Hello World{<}', code('# heading'), '{>}end')),
    );

    const plaintext = `# heading`;
    const tr = formatMarkdown(state, state.selection.from, plaintext);

    expect(tr).toEqualDocumentAndSelection(
      doc(
        // prettier-ignore
        h1('Hello Worldheading{<>}end'),
      ),
    );
  });
});

describe('formatPlainText', () => {
  describe('converting to plaintext - when selection is inside heading', () => {
    it('should render as plaintext', () => {
      const state = createEditorState(doc(h1('{<>}')));
      const plaintext = `# text`;

      const tr = formatPlainText(state, state.selection.from, plaintext);
      expect(tr).toEqualDocumentAndSelection(
        doc(
          // prettier-ignore
          p('# text{<>}'),
        ),
      );
    });
  });

  describe('when pasting a heading in an existing paragraph', () => {
    it('should set the selection inside the paragraph', () => {
      const state = createEditorState(
        doc(p('Hello World'), h1('{<}# Heading{>}'), p('end')),
      );
      const plaintext = `# Heading`;

      const tr = formatPlainText(state, state.selection.from, plaintext);
      expect(tr).toEqualDocumentAndSelection(
        doc(p('Hello World'), p('# Heading{<>}'), p('end')),
      );
    });
  });

  describe('when pasting rich text inside a paragraph', () => {
    it('should set the selection inside the paragraph', () => {
      const state = createEditorState(
        doc(p('Hello World', code('{<}# Heading{>}'), 'end')),
      );
      const plaintext = `# Heading`;

      const tr = formatPlainText(state, state.selection.from, plaintext);
      expect(tr).toEqualDocumentAndSelection(
        doc(p('Hello World', '# Heading{<>}', 'end')),
      );
    });
  });

  describe('when pasting a heading in an empty doc', () => {
    it('should set the selection inside the paragraph', () => {
      const state = createEditorState(doc(h1('{<}# Heading{>}')));
      const plaintext = `# Heading`;

      const tr = formatPlainText(state, state.selection.from, plaintext);
      expect(tr).toEqualDocumentAndSelection(doc(p('# Heading{<>}')));
    });
  });
});
