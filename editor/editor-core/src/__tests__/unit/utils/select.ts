import { NodeSelection } from 'prosemirror-state';
import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';
import { doc, p, hr } from '@atlaskit/editor-test-helpers/schema-builder';
import { insertText } from '@atlaskit/editor-test-helpers/transactions';
import { GapCursorSide } from '../../..';
import { setGapCursorSelection } from '../../../utils';

describe('toEqualDocumentAndSelection matches', () => {
  const createEditor = createEditorFactory();
  const editor = (doc: any) =>
    createEditor({
      doc,
      editorProps: {
        allowRule: true,
      },
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
});
