import { TextSelection } from 'prosemirror-state';
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
import {
  doc,
  table,
  p,
  tr,
  tdEmpty,
  tdCursor,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { isTextInput } from '../../is-text-input';

describe('#isTextInput', () => {
  it('should return true for typing transactions', () => {
    const editorState = createEditorState(doc(p('{}')));
    const { tr: transaction, selection } = editorState;
    transaction.insertText('a', selection.from);
    expect(isTextInput(transaction)).toBe(true);
  });

  it('should return false for transactions that only change selection', () => {
    const editorState = createEditorState(
      doc(table()(tr(tdEmpty, tdCursor), tr(tdEmpty, tdEmpty))),
    );
    const { tr: transaction } = editorState;
    transaction.setSelection(new TextSelection(editorState.doc.resolve(4)));
    expect(isTextInput(transaction)).toBe(false);
  });

  it('should return false for transactions that insert a node', () => {
    const editorState = createEditorState(doc(p('{}')));
    const { tr: transaction, selection } = editorState;
    transaction.insert(selection.from, editorState.schema.text('hello'));
    expect(isTextInput(transaction)).toBe(false);
  });

  it('should return false for transactions that delete a node', () => {
    const editorState = createEditorState(doc(p('text')));
    const { tr: transaction } = editorState;
    transaction.delete(1, 5);
    expect(isTextInput(transaction)).toBe(false);
  });

  it(`should return false for transactions that don't do anything`, () => {
    const editorState = createEditorState(doc(p('text')));
    expect(isTextInput(editorState.tr)).toBe(false);
  });
});
