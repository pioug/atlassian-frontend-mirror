import {
  doc,
  ol,
  ul,
  li,
  p,
  panel,
  underline,
  table,
  tr,
  td,
  strong,
  status,
  th,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { uuid } from '@atlaskit/adf-schema';
import listPlugin from '../..';
import textFormattingPlugin from '../../../text-formatting';
import panelPlugin from '../../../panel';
import tablePlugin from '../../../table';
import statusInlineBlockTypePlugin from '../../../status';
import { toggleOrderedList, toggleBulletList } from '../../commands';

const TABLE_LOCAL_ID = 'test-table-local-id';

describe('lists plugin -> converting lists', () => {
  beforeAll(() => {
    uuid.setStatic(TABLE_LOCAL_ID);
  });

  afterAll(() => {
    uuid.setStatic(false);
  });

  const createEditor = createProsemirrorEditorFactory();

  const editor = (doc: DocBuilder) => {
    const preset = new Preset<LightEditorPlugin>()
      .add(listPlugin)
      .add(textFormattingPlugin)
      .add(panelPlugin)
      .add([statusInlineBlockTypePlugin, { menuDisabled: false }])
      .add(tablePlugin);

    return createEditor({
      doc,
      preset,
    });
  };

  it('should convert selection inside panel to list', () => {
    const expectedOutput = doc(panel()(ul(li(p('text')))));
    const { editorView } = editor(doc(panel()(p('te{<>}xt'))));

    toggleBulletList(editorView);
    expect(editorView.state.doc).toEqualDocument(expectedOutput);
  });

  it('should convert selection to a list when the selection starts with a paragraph and ends inside a list', () => {
    // prettier-ignore
    const expectedOutput = doc(
      ol(
        li(p('One')),
        li(p('Two')),
        li(p('Three')),
        li(p('Four'))
      ),
    );
    // prettier-ignore
    const { editorView } = editor(
      doc(
        p('{<}One'),
        ol(
          li(p('Two{>}')),
          li(p('Three')),
          li(p('Four'))
        )
      ),
    );

    toggleOrderedList(editorView);
    expect(editorView.state.doc).toEqualDocument(expectedOutput);
  });

  it('should convert selection to a list when the selection contains a list but starts and end with paragraphs', () => {
    // prettier-ignore
    const expectedOutput = doc(
      ol(
        li(p('One')),
        li(p('Two')),
        li(p('Three')),
        li(p('Four'))
      ),
    );
    // prettier-ignore
    const { editorView } = editor(
      doc(
        p('{<}One'),
        ol(
          li(p('Two')),
          li(p('Three'))
        ),
        p('Four{>}')
      ),
    );

    toggleOrderedList(editorView);
    expect(editorView.state.doc).toEqualDocument(expectedOutput);
  });

  it('should convert selection to a list when the selection starts inside a list and ends with a paragraph', () => {
    // prettier-ignore
    const expectedOutput = doc(
      ol(
        li(p('One')),
        li(p('Two')),
        li(p('Three')),
        li(p('Four'))
      ),
    );
    // prettier-ignore
    const { editorView } = editor(
      doc(
        ol(
          li(p('One')),
          li(p('{<}Two')),
          li(p('Three'))
        ),
        p('Four{>}')),
    );

    toggleOrderedList(editorView);
    expect(editorView.state.doc).toEqualDocument(expectedOutput);
  });

  it('should convert selection to a list when the selection contains a list but starts in the middle of text in multiple paragraphs', () => {
    // prettier-ignore
    const expectedOutput = doc(
      p('One'),
      ol(
        li(p('Two')),
        li(p('Three')),
        li(p('Four')),
        li(p('Five')),
      ),
    );
    // prettier-ignore
    const { editorView } = editor(
      doc(
        p('One'),
        p('Tw{<}o'),
        p('Three'),
        ol(
          li(p('Four')),
          li(p('Five{>}'))
        ),
      ),
    );

    toggleOrderedList(editorView);
    expect(editorView.state.doc).toEqualDocument(expectedOutput);
  });

  it('should convert selection to a list when the selection starts inside a list and ends in the middle of text in multiple paragraph', () => {
    // prettier-ignore
    const expectedOutput = doc(
      ol(
        li(p('One')),
        li(p('Two')),
        li(p('Three')),
        li(p('Four')),
        li(p('Five')),
      ),
      p('Six'),
    );
    // prettier-ignore
    const { editorView } = editor(
      doc(
        ol(
          li(p('One')),
          li(p('{<}Two')),
          li(p('Three')),
        ),
        p('Four'),
        p('Fi{>}ve'),
        p('Six'),
      )
    );

    toggleOrderedList(editorView);
    expect(editorView.state.doc).toEqualDocument(expectedOutput);
  });

  it('should convert selection to a list when the selection starts with a status node and ends inside a list', () => {
    // prettier-ignore
    const expectedOutput = doc(
      ol(
        li(p('{<}', status({ text: 'test', color: '#FFF', localId: 'a' }))),
        li(p('One{>}')),
        li(p('Two')),
        li(p('Three')),
      ),
    );
    // prettier-ignore
    const { editorView } = editor(
      doc(
        p('{<}', status({ text: 'test', color: '#FFF', localId: 'a' })),
        ul(
          li(p('One{>}')),
          li(p('Two')),
          li(p('Three'))
        )
      ),
    );

    toggleOrderedList(editorView);
    expect(editorView.state.doc).toEqualDocument(expectedOutput);
  });

  it('should convert selection to a list when the selection starts inside a list and ends with a status node', () => {
    // prettier-ignore
    const expectedOutput = doc(
      ol(
        li(p('One{<}')),
        li(p('Two')),
        li(p('Three')),
        li(p(status({ text: 'test', color: '#FFF', localId: 'a' }), '{>}')),
      ),
    );
    // prettier-ignore
    const { editorView } = editor(
      doc(
        ul(
          li(p('One{<}')),
          li(p('Two')),
          li(p('Three')),
        ),
        p(status({ text: 'test', color: '#FFF', localId: 'a' }), '{>}'),
      ),
    );

    toggleOrderedList(editorView);
    expect(editorView.state.doc).toEqualDocument(expectedOutput);
  });

  it('should convert selection to a list when the selection starts with multiple text nodes in a paragraph and ends inside a list', () => {
    // prettier-ignore
    const expectedOutput = doc(
      ol(
        li(p('{<}', strong('hello'), 'world')),
        li(p('One{>}')),
        li(p('Two')),
        li(p('Three')),
      ),
    );
    // prettier-ignore
    const { editorView } = editor(
      doc(
        p('{<}', strong('hello'), 'world'),
        ul(
          li(p('One{>}')),
          li(p('Two')),
          li(p('Three'))
        )
      ),
    );

    toggleOrderedList(editorView);
    expect(editorView.state.doc).toEqualDocument(expectedOutput);
  });

  it('should convert selection to a list when the selection starts inside a list and ends with multiple text nodes in a paragraph', () => {
    // prettier-ignore
    const expectedOutput = doc(
      ol(
        li(p('One{<}')),
        li(p('Two')),
        li(p('Three')),
        li(p(strong('hello'), 'world', '{>}'))
      ),
    );
    // prettier-ignore
    const { editorView } = editor(
      doc(
        ul(
          li(p('One{<}')),
          li(p('Two')),
          li(p('Three')),
        ),
        p(strong('hello'), 'world', '{>}'),
      ),
    );

    toggleOrderedList(editorView);
    expect(editorView.state.doc).toEqualDocument(expectedOutput);
  });

  it('should convert selection to a list when the selection starts with multiple paragraphs and ends inside a list', () => {
    // prettier-ignore
    const expectedOutput = doc(
      ol(
        li(p('{<}', 'p1')),
        li(p('p2')),
        li(p('p3')),
        li(p('One{>}')),
        li(p('Two')),
        li(p('Three')),
      ),
    );
    // prettier-ignore
    const { editorView } = editor(
      doc(
        p('{<}', 'p1'),
        p('p2'),
        p('p3'),
        ul(
          li(p('One{>}')),
          li(p('Two')),
          li(p('Three'))
        )
      ),
    );

    toggleOrderedList(editorView);
    expect(editorView.state.doc).toEqualDocument(expectedOutput);
  });

  it('should convert selection to a list when the selection starts inside a list and ends with multiple paragraphs', () => {
    // prettier-ignore
    const expectedOutput = doc(
      ol(
        li(p('One{<}')),
        li(p('Two')),
        li(p('Three')),
        li(p('p1')),
        li(p('p2')),
        li(p('p3', '{>}')),
      ),
    );
    // prettier-ignore
    const { editorView } = editor(
      doc(
        ul(
          li(p('One{<}')),
          li(p('Two')),
          li(p('Three')),
        ),
        p('p1'),
        p('p2'),
        p('p3', '{>}'),
      ),
    );

    toggleOrderedList(editorView);
    expect(editorView.state.doc).toEqualDocument(expectedOutput);
  });

  it('should convert selection to a list when the selection starts with multiple paragraphs including a status node and ends inside a list', () => {
    // prettier-ignore
    const expectedOutput = doc(
      ol(
        li(p('{<}', status({ text: 'test', color: '#FFF', localId: 'a' }), 'p1')),
        li(p('p2')),
        li(p('p3')),
        li(p('One{>}')),
        li(p('Two')),
        li(p('Three')),
      ),
    );
    // prettier-ignore
    const { editorView } = editor(
      doc(
        p('{<}', status({ text: 'test', color: '#FFF', localId: 'a' }), 'p1'),
        p('p2'),
        p('p3'),
        ul(
          li(p('One{>}')),
          li(p('Two')),
          li(p('Three'))
        )
      ),
    );

    toggleOrderedList(editorView);
    expect(editorView.state.doc).toEqualDocument(expectedOutput);
  });

  it('should convert selection to a list when the selection starts inside a list and ends with multiple paragraphs including a status node', () => {
    // prettier-ignore
    const expectedOutput = doc(
      ol(
        li(p('One{<}')),
        li(p('Two')),
        li(p('Three')),
        li(p('p1')),
        li(p('p2')),
        li(p(status({ text: 'test', color: '#FFF', localId: 'a' }), 'p3', '{>}')),
      ),
    );
    // prettier-ignore
    const { editorView } = editor(
      doc(
        ul(
          li(p('One{<}')),
          li(p('Two')),
          li(p('Three')),
        ),
        p('p1'),
        p('p2'),
        p(status({ text: 'test', color: '#FFF', localId: 'a' }), 'p3', '{>}'),
      ),
    );

    toggleOrderedList(editorView);
    expect(editorView.state.doc).toEqualDocument(expectedOutput);
  });

  it('should NOT convert the list when the selection starts with a panel node and ends inside a list', () => {
    // prettier-ignore
    const expectedOutput = doc(
      panel()(p('{<}text')),
      ul(
        li(p('One{>}')),
        li(p('Two')),
        li(p('Three'))
      )
    );
    // prettier-ignore
    const { editorView } = editor(
      doc(
        panel()(p('{<}text')),
        ul(
          li(p('One{>}')),
          li(p('Two')),
          li(p('Three'))
        )
      ),
    );

    toggleOrderedList(editorView);
    expect(editorView.state.doc).toEqualDocument(expectedOutput);
  });

  it('should NOT convert the list when the selection starts inside a list and ends with a panel node', () => {
    // prettier-ignore
    const expectedOutput = doc(
      ul(
        li(p('One{<}')),
        li(p('Two')),
        li(p('Three'))
      ),
      panel()(p('text{>}')),
    );
    // prettier-ignore
    const { editorView } = editor(
      doc(
        ul(
          li(p('One{<}')),
          li(p('Two')),
          li(p('Three'))
        ),
        panel()(p('text{>}')),
      ),
    );

    toggleOrderedList(editorView);
    expect(editorView.state.doc).toEqualDocument(expectedOutput);
  });

  it('should NOT convert the list when the selection starts with multiple paragraphs with a panel in between and ends inside a list', () => {
    // prettier-ignore
    const expectedOutput = doc(
      p('{<}p1'),
      panel()(p('panel')),
      p('p2'),
      ul(
        li(p('One{>}')),
        li(p('Two')),
        li(p('Three'))
      )
    );
    // prettier-ignore
    const { editorView } = editor(
      doc(
        p('{<}p1'),
        panel()(p('panel')),
        p('p2'),
        ul(
          li(p('One{>}')),
          li(p('Two')),
          li(p('Three'))
        )
      ),
    );

    toggleOrderedList(editorView);
    expect(editorView.state.doc).toEqualDocument(expectedOutput);
  });

  it('should NOT convert the list when the selection starts inside a list and ends with multiple paragraphs with a panel in between', () => {
    // prettier-ignore
    const expectedOutput = doc(
      ul(
        li(p('One{<}')),
        li(p('Two')),
        li(p('Three')),
      ),
      p('p1'),
      panel()(p('panel')),
      p('p2{>}'),
    );
    // prettier-ignore
    const { editorView } = editor(
      doc(
        ul(
          li(p('One{<}')),
          li(p('Two')),
          li(p('Three')),
        ),
        p('p1'),
        panel()(p('panel')),
        p('p2{>}'),
      ),
    );

    toggleOrderedList(editorView);
    expect(editorView.state.doc).toEqualDocument(expectedOutput);
  });

  it('should NOT convert the list when the selection starts inside a pargraph, has a list in betwene, and ends with multiple paragraphs with a panel in between', () => {
    // prettier-ignore
    const expectedOutput = doc(
      p("{<}p1"),
      p("p2"),
      p("p3"),
      ol(li(p("A")), li(p("B")), li(p("C"))),
      p("p4"),
      panel({ panelType: "info" })(p("test")),
      p("p5{>}")
    );
    // prettier-ignore
    const { editorView } = editor(
      doc(
        p("{<}p1"),
        p("p2"),
        p("p3"),
        ol(li(p("A")), li(p("B")), li(p("C"))),
        p("p4"),
        panel({ panelType: "info" })(p("test")),
        p("p5{>}")
      ),
    );

    toggleOrderedList(editorView);
    expect(editorView.state.doc).toEqualDocument(expectedOutput);
  });

  it('should convert selection to a list when the selection is inside a table and contains a list but starts and end with paragraphs', () => {
    // prettier-ignore
    const expectedOutput = doc(
      table({ isNumberColumnEnabled: false, layout: "default", localId: TABLE_LOCAL_ID })(
        tr(th({})(p()), th({})(p()), th({})(p())),
        tr(
          td({})(
            ol(
              li(p("paragraph")),
              li(p("A")),
              li(p("B")),
              li(p("C")),
              li(p("paragraph"))
            )
          ),
          td({})(p()),
          td({})(p())
        ),
        tr(td({})(p()), td({})(p()), td({})(p()))
      )
    );
    // prettier-ignore
    const { editorView } = editor(
      doc(
        table({ isNumberColumnEnabled: false, layout: "default" })(
          tr(th({})(p()), th({})(p()), th({})(p())),
          tr(
            td({})(
              p("{<}paragraph"),
              ul(li(p("A")), li(p("B")), li(p("C"))),
              p("paragraph{>}")
            ),
            td({})(p()),
            td({})(p())
          ),
          tr(td({})(p()), td({})(p()), td({})(p()))
        )
      ),
    );

    toggleOrderedList(editorView);
    expect(editorView.state.doc).toEqualDocument(expectedOutput);
  });

  it('should convert selection to a list and keep empty paragraphs', () => {
    // prettier-ignore
    const expectedOutput = doc(
      ul(
        li(p('One')),
        li(p('Two')),
        li(p()),
        li(p('Three'))
      ),
    );
    // prettier-ignore
    const { editorView } = editor(
      doc(
        ol(
          li(p('{<}One')),
          li(p('Two')),
          li(p()),
          li(p('Three{>}'))
        )
      ),
    );

    toggleBulletList(editorView);
    expect(editorView.state.doc).toEqualDocument(expectedOutput);
  });

  it('should convert selection to a list except empty paragraphs at the beginning or end of selection', () => {
    // prettier-ignore
    const expectedOutput = doc(
      p(),
      p(),
      p(),
      ul(
        li(p("p1")),
        li(p("p2")),
        li(p("p3 ")),
        li(p("A")),
        li(p("B")),
        li(p("C")),
        li(p("p4")),
        li(p("p5"))
      ),
      p(),
      p(),
      p(),
    );

    // prettier-ignore
    const { editorView } = editor(
      doc(
        p('{<}'),
        p(),
        p(),
        p("p1"),
        p("p2"),
        p("p3 "),
        ol(
          li(p("A")),
          li(p("B")),
          li(p("C"))),
        p("p4"),
        p("p5"),
        p(),
        p(),
        p('{>}'),
      ),
    );

    toggleBulletList(editorView);
    expect(editorView.state.doc).toEqualDocument(expectedOutput);
  });

  it('should convert selection to list when there is an empty paragraph between non empty two', () => {
    // prettier-ignore
    const expectedOutput = doc(
      ul(
        li(p('One')),
        li(p()),
        li(p('Three'))
      )
    );
    // prettier-ignore
    const { editorView } = editor(
      doc(
        p('{<}One'),
        p(),
        p('Three{>}')
      )
    );

    toggleBulletList(editorView);
    expect(editorView.state.doc).toEqualDocument(expectedOutput);
  });

  it('should convert selection to a list when it is a paragraph with supported marks', () => {
    // prettier-ignore
    const expectedOutput = doc(
      ul(
        li(p('One')),
        li(p(underline('Two'))),
        li(p('Three'))
      ),
    );
    // prettier-ignore
    const { editorView } = editor(
      doc(
        p('{<}One'),
        p(underline('Two')),
        p('Three{>}')
      ),
    );

    toggleBulletList(editorView);
    expect(editorView.state.doc).toEqualDocument(expectedOutput);
  });

  it('should toggle list item in the last column of a table cell', () => {
    const { editorView } = editor(
      doc(table()(tr(td()(p('')), td()(p('One{<>}'))))),
    );

    toggleOrderedList(editorView);
    expect(editorView.state.doc).toEqualDocument(
      doc(
        table({ localId: TABLE_LOCAL_ID })(
          tr(td()(p('')), td()(ol(li(p('One{<>}'))))),
        ),
      ),
    );
  });
});
