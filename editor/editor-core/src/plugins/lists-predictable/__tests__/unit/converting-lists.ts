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
} from '@atlaskit/editor-test-helpers/schema-builder';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import listPredictablePlugin from '../..';
import textFormattingPlugin from '../../../text-formatting';
import panelPlugin from '../../../panel';
import tablePlugin from '../../../table';
import { toggleOrderedList, toggleBulletList } from '../../commands';

describe('lists plugin -> converting lists', () => {
  const createEditor = createProsemirrorEditorFactory();

  const editor = (doc: any) => {
    const preset = new Preset<LightEditorPlugin>()
      .add(listPredictablePlugin)
      .add(textFormattingPlugin)
      .add(panelPlugin)
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

  // to be done in https://product-fabric.atlassian.net/browse/ED-10675
  it.skip('should convert selection to a list when the selection starts with a paragraph and ends inside a list', () => {
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

  // to be done in https://product-fabric.atlassian.net/browse/ED-10675
  it.skip('should convert selection to a list when the selection contains a list but starts and end with paragraphs', () => {
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

  // to be done in https://product-fabric.atlassian.net/browse/ED-10675
  it.skip('should convert selection to a list when the selection starts inside a list and ends with a paragraph', () => {
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
      doc(table()(tr(td()(p('')), td()(ol(li(p('One{<>}'))))))),
    );
  });
});
