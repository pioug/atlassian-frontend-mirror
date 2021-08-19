import { NodeSelection } from 'prosemirror-state';

import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  doc,
  p,
  hr,
  table,
  tr,
  td,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { insertText } from '@atlaskit/editor-test-helpers/transactions';

import {
  setGapCursorSelection,
  setCellSelection,
} from '../../../utils/selection';
import { Side as GapCursorSide } from '../../../plugins/selection/gap-cursor-selection';
import rulePlugin from '../../../plugins/rule';
import tablePlugin from '../../../plugins/table';

const TABLE_LOCAL_ID = 'test-table-local-id';

describe('toEqualDocumentAndSelection matches', () => {
  const createEditor = createProsemirrorEditorFactory();
  const preset = new Preset<LightEditorPlugin>()
    .add(rulePlugin)
    .add(tablePlugin);

  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      preset,
    });

  it('cursor positions', () => {
    const { editorView } = editor(doc(p('Hello{<>}World')));
    expect(editorView.state).toEqualDocumentAndSelection(
      doc(p('Hello{<>}World')),
    );
  });

  it('moved cursor positions', () => {
    const { editorView } = editor(doc(p('Hello{<>}')));
    insertText(editorView, 'World');
    expect(editorView.state).toEqualDocumentAndSelection(
      doc(p('HelloWorld{<>}')),
    );
  });

  it('text selections', () => {
    const { editorView } = editor(doc(p('Hello{<}World{>}')));
    expect(editorView.state).toEqualDocumentAndSelection(
      doc(p('Hello{<}World{>}')),
    );
  });

  it('node selections', () => {
    const { editorView, refs } = editor(
      doc(p('HelloWorld{<>}'), '{nextPos}', hr()),
    );
    const { state, dispatch } = editorView;
    dispatch(
      state.tr.setSelection(NodeSelection.create(state.doc, refs.nextPos)),
    );
    expect(editorView.state).toEqualDocumentAndSelection(
      doc(p('HelloWorld'), '{<node>}', hr()),
    );
  });

  it('gap cursor selections', () => {
    const { editorView, refs } = editor(
      doc(p('HelloWorld'), hr(), '{nextPos}'),
    );
    setGapCursorSelection(editorView, refs.nextPos, GapCursorSide.RIGHT);

    expect(editorView.state).toEqualDocumentAndSelection(
      doc(p('HelloWorld'), hr(), '{<|gap>}'),
    );
  });

  it('cell selections', () => {
    const { editorView, refs } = editor(
      doc(
        table({ localId: TABLE_LOCAL_ID })(
          tr('{firstCell}', td()(p('1{<>}')), td()(p('2')), td()(p('3'))),
          tr(td()(p('4')), td()(p('5')), '{lastCell}', td()(p('6'))),
        ),
      ),
    );
    setCellSelection(editorView, refs.firstCell, refs.lastCell);

    expect(editorView.state).toEqualDocumentAndSelection(
      doc(
        table({ localId: TABLE_LOCAL_ID })(
          tr(td()(p('{<cell}1')), td()(p('2')), td()(p('3'))),
          tr(td()(p('4')), td()(p('5')), td()(p('6{cell>}'))),
        ),
      ),
    );
  });
});
