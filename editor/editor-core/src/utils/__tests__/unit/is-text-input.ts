import { TextSelection } from 'prosemirror-state';
import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  table,
  p,
  tr,
  tdEmpty,
  tdCursor,
} from '@atlaskit/editor-test-helpers/schema-builder';
import { isTextInput } from '../../is-text-input';
import { pluginKey } from '../../../plugins/table/pm-plugins/plugin-factory';

describe('#isTextInput', () => {
  const createEditor = createEditorFactory();
  const editor = (doc: any) =>
    createEditor({
      doc,
      editorProps: { allowTables: true },
      pluginKey,
    });

  it('should return true for typing transactions', () => {
    const { editorView, refs } = editor(doc(p('{pos}')));
    const { tr: transaction } = editorView.state;
    transaction.insertText('a', refs.pos);
    expect(isTextInput(transaction)).toBe(true);
  });

  it('should return false for transactions that only change selection', () => {
    const { editorView } = editor(
      doc(table()(tr(tdEmpty, tdCursor), tr(tdEmpty, tdEmpty))),
    );
    const { tr: transaction } = editorView.state;
    transaction.setSelection(
      new TextSelection(editorView.state.doc.resolve(4)),
    );
    expect(isTextInput(transaction)).toBe(false);
  });

  it('should return false for transactions that insert a node', () => {
    const { editorView, refs } = editor(doc(p('{pos}')));
    const { tr: transaction } = editorView.state;
    transaction.insert(refs.pos, editorView.state.schema.text('hello'));
    expect(isTextInput(transaction)).toBe(false);
  });

  it('should return false for transactions that delete a node', () => {
    const { editorView } = editor(doc(p('text')));
    const { tr: transaction } = editorView.state;
    transaction.delete(1, 5);
    expect(isTextInput(transaction)).toBe(false);
  });

  it(`should return false for transactions that don't do anything`, () => {
    const { editorView } = editor(doc(p('text')));
    expect(isTextInput(editorView.state.tr)).toBe(false);
  });
});
