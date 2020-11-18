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
} from '@atlaskit/editor-test-helpers/schema-builder';
import { DocumentType } from '@atlaskit/editor-test-helpers/create-editor-state';
import listPlugin from '../../..';
import panelPlugin from '../../../../panel';
import { pluginKey as listPluginKey } from '../../../pm-plugins/main';

describe('fix-invalid-list-children', () => {
  const createEditor = createProsemirrorEditorFactory();
  const editor = (doc: DocumentType) =>
    createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>().add(listPlugin).add(panelPlugin),
      pluginKey: listPluginKey,
    });

  const case0: [string, DocumentType, DocumentType] = [
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

  const case1: [string, DocumentType, DocumentType] = [
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

  const case2: [string, DocumentType, DocumentType] = [
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

  const case3: [string, DocumentType, DocumentType] = [
    'should not join two sibling lists of different types when it is not nested inside of a panel',
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

  const case4: [string, DocumentType, DocumentType] = [
    'should join two sibling lists of same type when it is not nested inside of a panel',
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

  describe.each<[string, DocumentType, DocumentType]>([
    // prettier-ignore
    case0,
    case1,
    case2,
    case3,
    case4,
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
});
