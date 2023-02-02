import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
import { TextSelection } from 'prosemirror-state';
import { ReactNodeViewState, stateKey } from '../../react-nodeview';

describe('react-nodeview plugin', () => {
  it('should not trigger updates when selection matches previous selection', async () => {
    const createEditor = createEditorFactory();
    const { editorView } = createEditor({
      doc: doc(p()),
    });

    const reactNodeViewState = stateKey.getState(
      editorView.state,
    ) as ReactNodeViewState;
    const mock = jest.fn();
    reactNodeViewState.subscribe(mock);

    let pos = editorView.state.doc.resolve(0);
    let selection = new TextSelection(pos, pos);
    editorView.dispatch(editorView.state.tr.setSelection(selection));
    editorView.dispatch(editorView.state.tr.setSelection(selection));
    editorView.dispatch(editorView.state.tr.setSelection(selection));

    expect(mock).toHaveBeenCalledTimes(1);
  });

  it('should trigger updates when selection changes', async () => {
    const createEditor = createEditorFactory();
    const { editorView } = createEditor({
      doc: doc(p()),
    });

    const reactNodeViewState = stateKey.getState(
      editorView.state,
    ) as ReactNodeViewState;
    const mock = jest.fn();
    reactNodeViewState.subscribe(mock);

    let pos = editorView.state.doc.resolve(0);
    let selection = new TextSelection(pos, pos);
    editorView.dispatch(editorView.state.tr.setSelection(selection));

    pos = editorView.state.doc.resolve(1);
    selection = new TextSelection(pos, pos);
    editorView.dispatch(editorView.state.tr.setSelection(selection));

    expect(mock).toHaveBeenCalledTimes(2);
  });
});
