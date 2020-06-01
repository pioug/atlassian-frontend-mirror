import { createProseMirrorPlugin } from '../../mobile-selection-plugin';
import { findSelectionPos } from '../../find-selection-pos';
import { EditorView } from 'prosemirror-view';
import { EditorState } from 'prosemirror-state';
import { Node as PMNode, Schema } from 'prosemirror-model';
import { SelectionData } from '../../types';

describe('mobileSelection plugin', () => {
  const schema = new Schema({
    nodes: {
      doc: {
        content: 'block+',
      },
      text: {
        group: 'inline',
      },
      paragraph: {
        content: 'inline*',
        group: 'block',
        toDOM: () => ['p', 0],
      },
    },
  });

  const doc = PMNode.fromJSON(schema, {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [{ type: 'text', text: 'first' }],
      },
      {
        type: 'paragraph',
        content: [{ type: 'text', text: 'second' }],
      },
      {
        type: 'paragraph',
        content: [{ type: 'text', text: 'third' }],
      },
    ],
  });

  beforeEach(() => {
    document.body.innerHTML = '<div id="parent__container"></div>';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should change selection to match new selection position', () => {
    const mockfn = jest.fn();
    const plugin = createProseMirrorPlugin(mockfn);
    const target = document.getElementById('parent__container');

    const editorView = new EditorView(target!, {
      state: EditorState.create({
        plugins: [plugin],
        schema,
        doc,
      }),
    });

    const { tr } = editorView.state;
    tr.insertText('new text');
    editorView.dispatch(tr);

    const expectedResult = { type: 'text', anchor: 9, head: 9 };
    const result = editorView.state.selection.toJSON() as SelectionData;

    expect(result).toMatchObject(expectedResult);
  });

  it('return selection position', () => {
    const mockfn = jest.fn();
    const plugin = createProseMirrorPlugin(mockfn);
    const target = document.getElementById('parent__container');

    const editorView = new EditorView(target!, {
      state: EditorState.create({
        plugins: [plugin],
        schema,
        doc,
      }),
    });

    const returnedSelection = findSelectionPos(editorView.state.selection);

    if (!returnedSelection) {
      expect(returnedSelection).toBe(null);
    } else {
      const expectedResult = { pos: 1, depth: 1 };
      const result = {
        pos: returnedSelection.pos,
        depth: returnedSelection.depth,
      };

      expect(result).toMatchObject(expectedResult);
    }
  });
});
