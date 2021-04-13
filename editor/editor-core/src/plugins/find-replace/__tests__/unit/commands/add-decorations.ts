import { EditorView, Decoration } from 'prosemirror-view';
import { doc, p, DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import { addDecorations } from '../../../commands';
import { editor } from '../_utils';
import { getPluginState } from '../../../plugin';

const aquaDec = Decoration.inline(1, 4, {
  style: 'background-color: aquamarine',
});
const tealDec = Decoration.inline(5, 10, {
  style: 'background-color: teal',
});
const oliveDec = Decoration.inline(11, 14, {
  style: 'background-color: olive',
});

describe('find/replace commands: addDecorations', () => {
  let editorView: EditorView;

  const initEditor = (doc: DocBuilder) => {
    ({ editorView } = editor(doc));
  };

  beforeEach(() => {
    initEditor(doc(p('{<>}this is a document')));
  });

  it('adds single decoration to empty set', () => {
    addDecorations([aquaDec])(editorView.state, editorView.dispatch);

    const { decorationSet } = getPluginState(editorView.state);
    expect(decorationSet.find()).toEqual([aquaDec]);
  });

  it('adds single decoration to existing set', () => {
    addDecorations([aquaDec])(editorView.state, editorView.dispatch);
    addDecorations([tealDec])(editorView.state, editorView.dispatch);

    const { decorationSet } = getPluginState(editorView.state);
    expect(decorationSet.find()).toEqual([aquaDec, tealDec]);
  });

  it('adds multiple decorations to empty set', () => {
    addDecorations([aquaDec, tealDec])(editorView.state, editorView.dispatch);

    const { decorationSet } = getPluginState(editorView.state);
    expect(decorationSet.find()).toEqual([aquaDec, tealDec]);
  });

  it('adds multiple decorations to existing set', () => {
    addDecorations([aquaDec])(editorView.state, editorView.dispatch);
    addDecorations([tealDec, oliveDec])(editorView.state, editorView.dispatch);

    const { decorationSet } = getPluginState(editorView.state);
    expect(decorationSet.find()).toEqual([aquaDec, tealDec, oliveDec]);
  });
});
