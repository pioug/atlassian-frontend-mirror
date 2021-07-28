import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  p,
  panel,
  ol,
  ul,
  li,
  doc,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import listPlugin from '../../..';
import panelPlugin from '../../../../panel';
import { pluginKey as listPluginKey } from '../../../pm-plugins/main';

describe('fix-invalid-list-children', () => {
  const createEditor = createProsemirrorEditorFactory();
  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>().add(listPlugin).add(panelPlugin),
      pluginKey: listPluginKey,
    });

  const case0: [string, DocBuilder, DocBuilder] = [
    'should join two sibling lists',
    // Scenario
    // prettier-ignore
    doc(
      ul(
        li(
          p('A{<>}'),
          ul(li(p('A1'))),
          ul(li(p('A2'))),
        ),
      ),
    ),
    // Expected Result
    // prettier-ignore
    doc(
      ul(
        li(
          p('AX{<>}'),
          ul(
            li(p('A1')),
            li(p('A2')),
          ),
        ),
      ),
    ),
  ];

  const case1: [string, DocBuilder, DocBuilder] = [
    'lol1',
    // Scenario
    // prettier-ignore
    doc(
      ul(
        li(p('A{<>}')),
      ),
      ul(
        li(p('B')),
      ),
    ),
    // Expected Result
    // prettier-ignore
    doc(
      ul(
        li(p('AX{<>}')),
        li(p('B')),
      ),
    ),
  ];

  const case2: [string, DocBuilder, DocBuilder] = [
    'should not join two sibling lists of different types when it is not nested',
    // Scenario
    // prettier-ignore
    doc(
      ul(
        li(p('A{<>}')),
      ),
      ol(
        li(p('B')),
      ),
    ),
    // Expected Result
    // prettier-ignore
    doc(
      ul(
        li(p('AX{<>}')),
      ),
      ol(
        li(p('B')),
      ),
    ),
  ];

  const case3: [string, DocBuilder, DocBuilder] = [
    'should not join two sibling lists of different types when it is nested inside of a panel',
    // Scenario
    // prettier-ignore
    doc(
      panel()(
        ul(
          li(p('A{<>}')),
        ),
        ol(
          li(p('B')),
        ),
      ),
    ),
    // Expected Result
    // prettier-ignore
    doc(
      panel()(
        ul(
          li(p('AX{<>}')),
        ),
        ol(
          li(p('B')),
        ),
      )
    ),
  ];

  const case4: [string, DocBuilder, DocBuilder] = [
    'should join two sibling lists of same type when it is nested inside of a panel',
    // Scenario
    // prettier-ignore
    doc(
      panel()(
        ul(
          li(p('A{<>}')),
        ),
        ul(
          li(p('B')),
        ),
      ),
    ),
    // Expected Result
    // prettier-ignore
    doc(
      panel()(
        ul(
          li(p('AX{<>}')),
          li(p('B')),
        ),
      )
    ),
  ];

  const case5: [string, DocBuilder, DocBuilder] = [
    'with selection outside of the list - should not join lists',
    // Scenario
    // prettier-ignore
    doc(
      p('A{<>}'),
      ul(
        li(
          p('B'),
          ul(li(p('A1'))),
          ul(li(p('A2'))),
        ),
      ),
    ),
    // Expected Result
    // prettier-ignore
    doc(
      p('AX{<>}'),
      ul(
        li(
          p('B'),
          ul(li(p('A1'))),
          ul(li(p('A2'))),
        ),
      ),
    ),
  ];

  describe.each<[string, DocBuilder, DocBuilder]>([
    // prettier-ignore
    case0,
    case1,
    case2,
    case3,
    case4,
    case5,
  ])('[case%#] when %s', (_scenario, previousDocument, expectedDocument) => {
    it('should match the expected document and keep the selection', () => {
      const { editorView } = editor(previousDocument);

      const {
        state: { tr },
      } = editorView;
      tr.insertText('X');
      editorView.dispatch(tr);
      expect(editorView.state.tr).toEqualDocumentAndSelection(expectedDocument);
    });
  });

  it('when there is no selection change should not update list', () => {
    const document = doc(
      p('A'),
      ul(li(p('B'), ul(li(p('A1'))), ul(li(p('A2'))))),
    );
    const expectedDocument = doc(
      p('A'),
      ul(li(p('B'), ul(li(p('A1'))), ul(li(p('A2'))))),
    );
    const { editorView } = editor(document);
    const {
      state: { tr },
    } = editorView;
    editorView.dispatch(tr);
    expect(editorView.state.tr).toEqualDocumentAndSelection(expectedDocument);
  });
});
