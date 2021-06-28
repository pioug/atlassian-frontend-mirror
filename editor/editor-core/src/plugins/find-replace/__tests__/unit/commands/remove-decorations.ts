import { EditorView, Decoration } from 'prosemirror-view';
import { doc, p, DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import { addDecorations, removeDecorations } from '../../../commands';
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

describe('find/replace commands: removeDecorations', () => {
  let editorView: EditorView;

  const initEditor = (doc: DocBuilder) => {
    ({ editorView } = editor(doc));
  };

  beforeEach(() => {
    initEditor(doc(p('{<>}this is a document')));
  });

  describe('removing all decorations', () => {
    it('removes single decoration from set', () => {
      addDecorations([aquaDec])(editorView.state, editorView.dispatch);
      removeDecorations([aquaDec])(editorView.state, editorView.dispatch);

      const { decorationSet } = getPluginState(editorView.state);
      expect(decorationSet.find()).toEqual([]);
    });

    it('removes multiple decorations from set', () => {
      addDecorations([aquaDec, tealDec, oliveDec])(
        editorView.state,
        editorView.dispatch,
      );
      removeDecorations([aquaDec, tealDec, oliveDec])(
        editorView.state,
        editorView.dispatch,
      );

      const { decorationSet } = getPluginState(editorView.state);
      expect(decorationSet.find()).toEqual([]);
    });
  });

  describe('removing some decorations', () => {
    it('removes single decoration from set', () => {
      addDecorations([aquaDec, tealDec, oliveDec])(
        editorView.state,
        editorView.dispatch,
      );
      removeDecorations([aquaDec])(editorView.state, editorView.dispatch);

      const { decorationSet } = getPluginState(editorView.state);
      expect(decorationSet.find()).toEqual([tealDec, oliveDec]);
    });

    it('removes multiple decorations from set', () => {
      addDecorations([aquaDec, tealDec, oliveDec])(
        editorView.state,
        editorView.dispatch,
      );
      removeDecorations([aquaDec, oliveDec])(
        editorView.state,
        editorView.dispatch,
      );

      const { decorationSet } = getPluginState(editorView.state);
      expect(decorationSet.find()).toEqual([tealDec]);
    });
  });

  // this makes sure we are coping with an issue within ProseMirror where
  // it can delete more decorations than it should when there are multiple
  // nested 'children' arrays in the decoration set
  describe('when there are multiple levels of nested children arrays in decoration set', () => {
    beforeEach(() => {
      // add a few lines/decorations to get the data structure we need
      const numLines = 10;

      const document = doc(...Array(numLines).fill(p('this is a document')));
      initEditor(document);

      let decorations: Decoration[] = [];
      for (let i = 0; i < numLines; i++) {
        decorations = [
          ...decorations,
          ...[aquaDec, tealDec, oliveDec].map((decoration: Decoration) => {
            const copiedDecoration = (decoration as any).copy();
            copiedDecoration.from = decoration.from + i * 15;
            copiedDecoration.to = decoration.to + i * 15;
            return copiedDecoration;
          }),
        ];
      }
      addDecorations(decorations)(editorView.state, editorView.dispatch);
    });

    it('removes single decoration from set', () => {
      let { decorationSet } = getPluginState(editorView.state);
      const decorationToRemove = decorationSet.find(1, 4);
      const expected = decorationSet
        .find()
        .filter((decoration) => decoration.from !== 1);

      removeDecorations(decorationToRemove)(
        editorView.state,
        editorView.dispatch,
      );

      ({ decorationSet } = getPluginState(editorView.state));
      expect(decorationSet.find()).toEqual(expected);
    });

    it('remove multiple decorations from set', () => {
      let { decorationSet } = getPluginState(editorView.state);
      const [firstDecorationToRemove] = decorationSet.find(1, 4);
      const [secondDecorationToRemove] = decorationSet.find(31, 34);
      const [thirdDecorationToRemove] = decorationSet.find(61, 64);
      const expected = decorationSet
        .find()
        .filter((decoration) => [1, 31, 61].indexOf(decoration.from) === -1);

      removeDecorations([
        firstDecorationToRemove,
        secondDecorationToRemove,
        thirdDecorationToRemove,
      ])(editorView.state, editorView.dispatch);

      ({ decorationSet } = getPluginState(editorView.state));
      expect(decorationSet.find()).toEqual(expected);
    });
  });
});
