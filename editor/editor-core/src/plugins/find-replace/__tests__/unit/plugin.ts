import { EditorView, Decoration, DecorationSet } from 'prosemirror-view';
import { PluginKey } from 'prosemirror-state';
import createStub from 'raf-stub';
import { doc, p, DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import {
  insertText,
  deleteText,
} from '@atlaskit/editor-test-helpers/transactions';
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
import dispatchPasteEvent from '@atlaskit/editor-test-helpers/dispatch-paste-event';
import { find, findPrevious, replace, replaceAll } from '../../commands';
import {
  createEditor,
  getContainerElement,
  getFindReplacePreset,
} from './_utils';
import { getPluginState } from '../../plugin';
import blockTypePlugin from '../../../block-type';
import { flushPromises } from '../../../../__tests__/__helpers/utils';

describe('find/replace plugin', () => {
  const containerElement = getContainerElement();
  let editorView: EditorView;
  let refs: { [name: string]: number };
  let rafStub: {
    add: (cb: Function) => number;
    step: (steps?: number) => void;
    flush: () => void;
  };
  let rafSpy: jest.SpyInstance;
  let prevDecorations: Decoration[];

  const findCommand = async (keyword?: string) => {
    const maxPos = editorView.state.doc.nodeSize;
    jest
      .spyOn(editorView, 'posAtCoords')
      .mockReturnValueOnce({ pos: 1, inside: 1 })
      .mockReturnValueOnce({ pos: maxPos, inside: maxPos });

    find(
      editorView,
      containerElement,
      keyword,
    )(editorView.state, editorView.dispatch);

    // decorations are applied async using promises & raf's so we wait for them
    await flushPromises();
    rafStub.flush();

    prevDecorations = getPluginState(editorView.state).decorationSet.find();
  };

  const positionMap = (increment = 0) => (decoration: Decoration) => ({
    from: decoration.from += increment,
    to: decoration.to += increment,
  });

  const initEditor = (doc: DocBuilder) => {
    // blockTypePlugin includes the keyboard shortcut for undo which we need
    const preset = getFindReplacePreset().add(blockTypePlugin);
    ({ editorView, refs } = createEditor<boolean, PluginKey>({
      doc,
      preset,
    }));
  };

  beforeAll(() => {
    rafStub = createStub();
    rafSpy = jest
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation(rafStub.add);
  });

  beforeEach(() => {
    prevDecorations = [];
    initEditor(
      doc(
        p('{docStart}{<>}'),
        p('{firstMatchStart}this{firstMatchEnd} is a document'),
        p('{secondMatchStart}this{secondMatchEnd} is a document'),
        p('{thirdMatchStart}this{thirdMatchEnd} is a document{docEnd}'),
      ),
    );
  });

  afterAll(() => {
    rafSpy.mockRestore();
  });

  describe('when document is updated', () => {
    describe('and find/replace not active', () => {
      it('nothing happens', () => {
        const pluginState = getPluginState(editorView.state);
        insertText(editorView, 'hello');
        expect(getPluginState(editorView.state)).toBe(pluginState);
      });
    });

    describe('when find/replace is active', () => {
      beforeEach(async () => {
        await findCommand('this');
      });

      describe('and matches remain the same', () => {
        describe('after typing a new word', () => {
          it('maps decorations', () => {
            const expected = getPluginState(editorView.state)
              .decorationSet.find()
              .map(positionMap(5));
            insertText(editorView, 'hello');

            const decorations = getPluginState(
              editorView.state,
            ).decorationSet.find();
            expect(decorations).toHaveLength(3);
            expect(decorations.map(positionMap())).toEqual(expected);
          });
        });

        describe('after replacing all with a word that contains the search query', () => {
          it('maps decorations', () => {
            const expected = getPluginState(editorView.state)
              .decorationSet.find()
              .map((decoration, idx) => positionMap(idx * 5)(decoration));
            replaceAll('this word')(editorView.state, editorView.dispatch);

            const decorations = getPluginState(
              editorView.state,
            ).decorationSet.find();
            expect(decorations).toHaveLength(expected.length);
            expect(decorations.map(positionMap())).toEqual(expected);
          });
        });

        describe('after replacing a single word with a word that contains the search query', () => {
          it('maps decorations', () => {
            const prevDecorations = getPluginState(
              editorView.state,
            ).decorationSet.find();
            const expected = [
              positionMap()(prevDecorations[0]),
              ...prevDecorations.slice(1).map(positionMap(5)),
            ];
            replace('this word')(editorView.state, editorView.dispatch);

            const decorations = getPluginState(
              editorView.state,
            ).decorationSet.find();
            expect(decorations).toHaveLength(expected.length);
            expect(decorations.map(positionMap())).toEqual(expected);
          });
        });
      });

      describe('and matches are added', () => {
        describe('by typing a new match', () => {
          beforeEach(async () => {
            insertText(editorView, 'this');
          });

          it('updates search results', () => {
            const pluginState = getPluginState(editorView.state);
            expect(pluginState.matches).toHaveLength(4);
            expect(pluginState.index).toBe(1);
          });

          it('adds decorations to new matches', () => {
            const pluginState = getPluginState(editorView.state);
            const decorations = pluginState.decorationSet.find();
            const expectedPositions = [
              { from: refs.firstMatchStart, to: refs.firstMatchEnd },
              ...prevDecorations.map(positionMap(4)),
            ];
            expect(decorations).toHaveLength(4);
            expect(decorations.map(positionMap())).toEqual(expectedPositions);
          });
        });

        describe('by typing a word that contains a new match', () => {
          beforeEach(async () => {
            insertText(editorView, "this'll");
          });

          it('updates search results', () => {
            const pluginState = getPluginState(editorView.state);
            expect(pluginState.matches).toHaveLength(4);
            expect(pluginState.index).toBe(1);
          });

          it('adds decorations to new matches', () => {
            const pluginState = getPluginState(editorView.state);
            const decorations = pluginState.decorationSet.find();
            const expectedPositions = [
              { from: refs.firstMatchStart, to: refs.firstMatchEnd },
              ...prevDecorations.map(positionMap(7)),
            ];
            expect(decorations).toHaveLength(4);
            expect(decorations.map(positionMap())).toEqual(expectedPositions);
          });
        });

        describe('by pasting text with multiple matches', () => {
          beforeEach(() => {
            dispatchPasteEvent(editorView, {
              plain: 'this is new match and so is this and this and this',
            });
          });

          it('updates search results', () => {
            const pluginState = getPluginState(editorView.state);
            expect(pluginState.matches).toHaveLength(7);
            expect(pluginState.index).toBe(4);
          });

          it('adds decorations to new matches', () => {
            const pluginState = getPluginState(editorView.state);
            const decorations = pluginState.decorationSet.find();
            const expectedPositions = [
              { from: 3, to: 7 },
              { from: 31, to: 35 },
              { from: 40, to: 44 },
              { from: 49, to: 53 },
              ...prevDecorations.map(positionMap(50)),
            ];
            expect(decorations).toHaveLength(7);
            expect(decorations.map(positionMap())).toEqual(expectedPositions);
          });
        });

        describe('by undoing a replace', () => {
          beforeEach(async () => {
            prevDecorations = getPluginState(
              editorView.state,
            ).decorationSet.find();
            replace('something')(editorView.state, editorView.dispatch);
            sendKeyToPm(editorView, 'Mod-z');
          });

          it('updates search results', () => {
            const pluginState = getPluginState(editorView.state);
            expect(pluginState.matches).toHaveLength(3);
            expect(pluginState.index).toBe(1);
          });

          it('adds decorations to new matches', () => {
            const decorations = getPluginState(
              editorView.state,
            ).decorationSet.find();
            const expectedPositions = prevDecorations.map(positionMap());
            expect(decorations).toHaveLength(3);
            expect(decorations.map(positionMap())).toEqual(expectedPositions);
          });
        });

        describe('by undoing a replace all', () => {
          beforeEach(async () => {
            prevDecorations = getPluginState(
              editorView.state,
            ).decorationSet.find();
            replaceAll('something')(editorView.state, editorView.dispatch);
            sendKeyToPm(editorView, 'Mod-z');
          });

          it('updates search results', () => {
            const pluginState = getPluginState(editorView.state);
            expect(pluginState.matches).toHaveLength(3);
            expect(pluginState.index).toBe(0);
          });

          it('adds decorations to new matches', () => {
            const decorations = getPluginState(
              editorView.state,
            ).decorationSet.find();
            const expectedPositions = prevDecorations.map(positionMap());
            expect(decorations).toHaveLength(3);
            expect(decorations.map(positionMap())).toEqual(expectedPositions);
          });
        });
      });

      describe('and matches are deleted', () => {
        describe('by manually deleting a match', () => {
          beforeEach(() => {
            deleteText(editorView, refs.secondMatchStart, refs.secondMatchEnd);
          });

          it('updates search results', async () => {
            const pluginState = getPluginState(editorView.state);
            expect(pluginState.matches).toHaveLength(2);
            expect(pluginState.index).toBe(0);
          });

          it('deletes decorations from matches which no longer exist', () => {
            const decorations = getPluginState(
              editorView.state,
            ).decorationSet.find();
            const expectedPositions = [
              positionMap()(prevDecorations[0]),
              positionMap(-4)(prevDecorations[2]),
            ];
            expect(decorations).toHaveLength(2);
            expect(decorations.map(positionMap())).toEqual(expectedPositions);
          });
        });

        describe('by manually deleting the current selected match', () => {
          beforeEach(() => {
            // find prev to get a more interesting selected index
            findPrevious()(editorView.state, editorView.dispatch);
            deleteText(editorView, refs.firstMatchStart, refs.firstMatchEnd);
          });

          it('updates search results', async () => {
            const pluginState = getPluginState(editorView.state);
            expect(pluginState.matches).toHaveLength(2);
            expect(pluginState.index).toBe(1);
          });

          it('updates decorations whose positions have changed or were for matches that no longer exist', () => {
            const decorations = getPluginState(
              editorView.state,
            ).decorationSet.find();
            const expectedPositions = prevDecorations
              .slice(1, 4)
              .map(positionMap(-4));
            expect(decorations).toHaveLength(2);
            expect(decorations.map(positionMap())).toEqual(expectedPositions);
          });
        });

        describe('by typing a letter inside a match', () => {
          beforeEach(() => {
            insertText(editorView, 'a', refs.firstMatchStart + 1);
          });

          it('updates search results', async () => {
            const pluginState = getPluginState(editorView.state);
            expect(pluginState.matches).toHaveLength(2);
            expect(pluginState.index).toBe(0);
          });

          it('deletes decorations from matches which no longer exist', () => {
            const decorations = getPluginState(
              editorView.state,
            ).decorationSet.find();
            const expectedPositions = prevDecorations
              .slice(1, 4)
              .map(positionMap(1));
            expect(decorations).toHaveLength(2);
            expect(decorations.map(positionMap())).toEqual(expectedPositions);
          });
        });

        describe('by deleting the whole document', () => {
          beforeEach(() => {
            deleteText(editorView, refs.docStart, refs.docEnd);
          });

          it('updates search results', async () => {
            const pluginState = getPluginState(editorView.state);
            expect(pluginState.matches).toHaveLength(0);
            expect(pluginState.index).toBe(0);
          });

          it('deletes decorations from matches which no longer exist', () => {
            expect(getPluginState(editorView.state).decorationSet).toEqual(
              DecorationSet.empty,
            );
          });
        });
      });

      describe('and matches are both added and removed', () => {
        beforeEach(async () => {
          // select over two of the results and add one new one
          editorView.dispatch(
            editorView.state.tr.insertText(
              'a new match here: this',
              refs.firstMatchStart,
              refs.secondMatchEnd,
            ),
          );
        });

        it('updates search results', () => {
          const pluginState = getPluginState(editorView.state);
          expect(pluginState.matches).toHaveLength(2);
          expect(pluginState.index).toBe(0);
        });

        it('updates decorations', () => {
          const pluginState = getPluginState(editorView.state);
          const decorations = pluginState.decorationSet.find();
          const expectedPositions = [
            { from: 21, to: 25 },
            positionMap(-2)(prevDecorations[2]),
          ];
          expect(decorations).toHaveLength(2);
          expect(decorations.map(positionMap())).toEqual(expectedPositions);
        });
      });
    });
  });
});
