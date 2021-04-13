import { EditorView, DecorationSet, Decoration } from 'prosemirror-view';
import createStub from 'raf-stub';
import { doc, p, DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import { find, replace } from '../../../commands';
import { replaceWithAnalytics } from '../../../commands-with-analytics';
import {
  editor,
  getFindReplaceTr,
  getSelectedWordDecorations,
  getContainerElement,
} from '../_utils';
import { getPluginState } from '../../../plugin';
import { TRIGGER_METHOD } from '../../../../analytics/types';
import { flushPromises } from '../../../../../__tests__/__helpers/utils';

const containerElement = getContainerElement();
const createAnalyticsEvent: CreateUIAnalyticsEvent = jest.fn(
  () => ({ fire: () => {} } as UIAnalyticsEvent),
);
let editorView: EditorView;
let refs: { [name: string]: number };
let rafStub: {
  add: (cb: Function) => number;
  step: (steps?: number) => void;
  flush: () => void;
};
let rafSpy: jest.SpyInstance;
let dispatchSpy: jest.SpyInstance;

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
};

const initEditor = async (doc: DocBuilder, query = 'quokka') => {
  ({ editorView, refs } = editor(doc, createAnalyticsEvent));
  dispatchSpy = jest.spyOn(editorView, 'dispatch');

  // need to do a find before we can do a replace
  await findCommand(query);
  dispatchSpy.mockClear();
};

describe('find/replace commands: replace', () => {
  let prevDecorations: Decoration[];

  beforeAll(() => {
    rafStub = createStub();
    rafSpy = jest
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation(rafStub.add);
  });

  afterEach(() => {
    dispatchSpy.mockClear();
  });

  afterAll(() => {
    rafSpy.mockRestore();
  });

  describe('and one search result on page', () => {
    beforeEach(async () => {
      await initEditor(doc(p('{<>}this is a {matchStart}quokka{matchEnd}')));
      replace('numbat')(editorView.state, editorView.dispatch);
    });

    it('replaces result in document', () => {
      expect(editorView.state.doc).toEqualDocument(doc(p('this is a numbat')));
    });

    it('updates search results', () => {
      expect(getPluginState(editorView.state)).toMatchObject({
        findText: 'quokka',
        replaceText: 'numbat',
        matches: [],
      });
    });

    it('leaves selection as is', () => {
      expect(editorView.state.selection.from).toBe(refs.matchStart);
    });

    it('scrolls replaced result into view', () => {
      expect(getFindReplaceTr(dispatchSpy).scrolledIntoView).toBe(true);
    });

    it('removes all decorations', () => {
      expect(getPluginState(editorView.state)).toMatchObject({
        decorationSet: DecorationSet.empty,
      });
    });
  });

  describe('and multiple search results on page', () => {
    beforeEach(async () => {
      await initEditor(
        doc(
          p('{<>}this is a {firstMatchStart}quokka{firstMatchEnd}'),
          p('this is a {secondMatchStart}quokka{secondMatchEnd}'),
          p('this is a {thirdMatchStart}quokka{thirdMatchEnd}'),
        ),
      );
      prevDecorations = getPluginState(editorView.state).decorationSet.find();
      replace('numbat')(editorView.state, editorView.dispatch);
    });

    it('replaces selected result in document', () => {
      expect(editorView.state.doc).toEqualDocument(
        doc(
          p('this is a numbat'),
          p('this is a quokka'),
          p('this is a quokka'),
        ),
      );
    });

    it('updates search results', () => {
      expect(getPluginState(editorView.state)).toMatchObject({
        findText: 'quokka',
        replaceText: 'numbat',
        matches: [
          { start: refs.secondMatchStart, end: refs.secondMatchEnd },
          { start: refs.thirdMatchStart, end: refs.thirdMatchEnd },
        ],
      });
    });

    it('sets index to next match', () => {
      expect(getPluginState(editorView.state)).toMatchObject({
        index: 0,
      });
    });

    it('sets selection to next match', () => {
      expect(editorView.state.selection.from).toBe(refs.secondMatchStart);
    });

    it('scrolls next result into view', () => {
      expect(getFindReplaceTr(dispatchSpy).scrolledIntoView).toBe(true);
    });

    it('decorates next match as the selected word', () => {
      const selectedWordDecorations = getSelectedWordDecorations(
        editorView.state,
      );
      expect(selectedWordDecorations).toHaveLength(1);
      expect(selectedWordDecorations[0].from).toEqual(refs.secondMatchStart);
      expect(selectedWordDecorations[0].to).toEqual(refs.secondMatchEnd);
    });

    it('removes one decoration', () => {
      expect(
        getPluginState(editorView.state).decorationSet.find(),
      ).toHaveLength(prevDecorations.length - 1);
    });

    describe('and current index is set to last result', () => {
      beforeEach(async () => {
        await initEditor(
          doc(
            p('this is a {firstMatchStart}quokka{firstMatchEnd}'),
            p('this is a {secondMatchStart}quokka{secondMatchEnd}'),
            p('{<>}this is a {thirdMatchStart}quokka{thirdMatchEnd}'),
          ),
        );
        prevDecorations = getPluginState(editorView.state).decorationSet.find();
        replace('numbat')(editorView.state, editorView.dispatch);
      });

      it('replaces selected result in document', () => {
        expect(editorView.state.doc).toEqualDocument(
          doc(
            p('this is a quokka'),
            p('this is a quokka'),
            p('this is a numbat'),
          ),
        );
      });

      it('updates search results', () => {
        expect(getPluginState(editorView.state)).toMatchObject({
          findText: 'quokka',
          replaceText: 'numbat',
          matches: [
            { start: refs.firstMatchStart, end: refs.firstMatchEnd },
            { start: refs.secondMatchStart, end: refs.secondMatchEnd },
          ],
        });
      });

      it('sets index to first match', () => {
        expect(getPluginState(editorView.state)).toMatchObject({
          index: 0,
        });
      });

      it('sets selection to first result', () => {
        expect(editorView.state.selection.from).toBe(refs.firstMatchStart);
      });

      it('scrolls first result into view', () => {
        expect(getFindReplaceTr(dispatchSpy).scrolledIntoView).toBe(true);
      });

      it('decorates first result as the selected word', () => {
        const selectedWordDecorations = getSelectedWordDecorations(
          editorView.state,
        );
        expect(selectedWordDecorations).toHaveLength(1);
        expect(selectedWordDecorations[0].from).toEqual(refs.firstMatchStart);
        expect(selectedWordDecorations[0].to).toEqual(refs.firstMatchEnd);
      });

      it('removes one decoration', () => {
        expect(
          getPluginState(editorView.state).decorationSet.find(),
        ).toHaveLength(prevDecorations.length - 1);
      });

      describe('and it is the first word in the last line', () => {
        beforeEach(async () => {
          await initEditor(
            doc(
              p('{firstMatchStart}this{firstMatchEnd} is a quokka'),
              p('{secondMatchStart}this{secondMatchEnd} is a quokka'),
              p('{<>}{thirdMatchStart}this{thirdMatchEnd} is a quokka'),
            ),
            'this',
          );
          prevDecorations = getPluginState(
            editorView.state,
          ).decorationSet.find();
          replace('numbat')(editorView.state, editorView.dispatch);
        });

        it('sets index to first match', () => {
          expect(getPluginState(editorView.state)).toMatchObject({
            index: 0,
          });
        });

        it('sets selection to first result', () => {
          expect(editorView.state.selection.from).toBe(refs.firstMatchStart);
        });

        it('decorates first result as the selected word', () => {
          const selectedWordDecorations = getSelectedWordDecorations(
            editorView.state,
          );
          expect(selectedWordDecorations).toHaveLength(1);
          expect(selectedWordDecorations[0].from).toEqual(refs.firstMatchStart);
          expect(selectedWordDecorations[0].to).toEqual(refs.firstMatchEnd);
        });

        it('removes one decoration', () => {
          expect(
            getPluginState(editorView.state).decorationSet.find(),
          ).toHaveLength(prevDecorations.length - 1);
        });
      });
    });

    describe('and current index is set to second result', () => {
      beforeEach(async () => {
        await initEditor(
          doc(
            p('this is a {firstMatchStart}quokka{firstMatchEnd}'),
            p('{<>}this is a {secondMatchStart}quokka{secondMatchEnd}'),
            p('this is a {thirdMatchStart}quokka{thirdMatchEnd}'),
          ),
        );
        prevDecorations = getPluginState(editorView.state).decorationSet.find();
        replace('numbat')(editorView.state, editorView.dispatch);
      });

      it('replaces selected result in document', () => {
        expect(editorView.state.doc).toEqualDocument(
          doc(
            p('this is a quokka'),
            p('this is a numbat'),
            p('this is a quokka'),
          ),
        );
      });

      it('updates search results', () => {
        expect(getPluginState(editorView.state)).toMatchObject({
          findText: 'quokka',
          replaceText: 'numbat',
          matches: [
            { start: refs.firstMatchStart, end: refs.firstMatchEnd },
            { start: refs.thirdMatchStart, end: refs.thirdMatchEnd },
          ],
        });
      });

      it('sets index to third match', () => {
        expect(getPluginState(editorView.state)).toMatchObject({
          index: 1,
        });
      });

      it('sets selection to third result', () => {
        expect(editorView.state.selection.from).toBe(refs.thirdMatchStart);
      });

      it('scrolls third result into view', () => {
        expect(getFindReplaceTr(dispatchSpy).scrolledIntoView).toBe(true);
      });

      it('decorates third result as the selected word', () => {
        const selectedWordDecorations = getSelectedWordDecorations(
          editorView.state,
        );
        expect(selectedWordDecorations).toHaveLength(1);
        expect(selectedWordDecorations[0].from).toEqual(refs.thirdMatchStart);
        expect(selectedWordDecorations[0].to).toEqual(refs.thirdMatchEnd);
      });

      it('removes one decoration', () => {
        expect(
          getPluginState(editorView.state).decorationSet.find(),
        ).toHaveLength(prevDecorations.length - 1);
      });

      describe('and it is the first word in the last line', () => {
        beforeEach(async () => {
          await initEditor(
            doc(
              p('{firstMatchStart}this{firstMatchEnd} is a quokka'),
              p('{secondMatchStart}this{secondMatchEnd} is a quokka'),
              p('{<>}{thirdMatchStart}this{thirdMatchEnd} is a quokka'),
            ),
            'this',
          );
          prevDecorations = getPluginState(
            editorView.state,
          ).decorationSet.find();
          replace('numbat')(editorView.state, editorView.dispatch);
        });

        it('sets index to first match', () => {
          expect(getPluginState(editorView.state)).toMatchObject({
            index: 0,
          });
        });

        it('sets selection to first result', () => {
          expect(editorView.state.selection.from).toBe(refs.firstMatchStart);
        });

        it('decorates first result as the selected word', () => {
          const selectedWordDecorations = getSelectedWordDecorations(
            editorView.state,
          );
          expect(selectedWordDecorations).toHaveLength(1);
          expect(selectedWordDecorations[0].from).toEqual(refs.firstMatchStart);
          expect(selectedWordDecorations[0].to).toEqual(refs.firstMatchEnd);
        });

        it('removes one decoration', () => {
          expect(
            getPluginState(editorView.state).decorationSet.find(),
          ).toHaveLength(prevDecorations.length - 1);
        });
      });
    });

    describe('and replace text is shorter in length than find text', () => {
      beforeEach(async () => {
        await initEditor(
          doc(
            p('{<>}this is a {firstMatchStart}quokka{firstMatchEnd}'),
            p('this is a {secondMatchStart}quokka{secondMatchEnd}'),
            p('this is a {thirdMatchStart}quokka{thirdMatchEnd}'),
          ),
        );
        prevDecorations = getPluginState(editorView.state).decorationSet.find();
        replace('quokk')(editorView.state, editorView.dispatch);
      });

      it('sets index to next match', () => {
        expect(getPluginState(editorView.state)).toMatchObject({
          index: 0,
        });
      });

      it('sets selection to next result', () => {
        expect(editorView.state.selection.from).toBe(refs.secondMatchStart - 1);
      });

      it('decorates next result as the selected word', () => {
        const selectedWordDecorations = getSelectedWordDecorations(
          editorView.state,
        );
        expect(selectedWordDecorations).toHaveLength(1);
        expect(selectedWordDecorations[0].from).toEqual(
          refs.secondMatchStart - 1,
        );
        expect(selectedWordDecorations[0].to).toEqual(refs.secondMatchEnd - 1);
      });

      it('removes one decoration', () => {
        expect(
          getPluginState(editorView.state).decorationSet.find(),
        ).toHaveLength(prevDecorations.length - 1);
      });
    });

    describe('and replace text contains the search query', () => {
      beforeEach(async () => {
        await initEditor(
          doc(
            p('{<>}this is a {firstMatchStart}quokka{firstMatchEnd}'),
            p('this is a {secondMatchStart}quokka{secondMatchEnd}'),
            p('this is a {thirdMatchStart}quokka{thirdMatchEnd}'),
          ),
        );
        prevDecorations = getPluginState(editorView.state).decorationSet.find();
        replace('quokkas')(editorView.state, editorView.dispatch);
      });

      it('sets index to next match', () => {
        expect(getPluginState(editorView.state)).toMatchObject({
          index: 1,
        });
      });

      it('sets selection to next result', () => {
        expect(editorView.state.selection.from).toBe(refs.secondMatchStart + 1);
      });

      it('decorates next result as the selected word', () => {
        const selectedWordDecorations = getSelectedWordDecorations(
          editorView.state,
        );
        expect(selectedWordDecorations).toHaveLength(1);
        expect(selectedWordDecorations[0].from).toEqual(
          refs.secondMatchStart + 1,
        );
        expect(selectedWordDecorations[0].to).toEqual(refs.secondMatchEnd + 1);
      });

      it('keeps all decorations', () => {
        expect(
          getPluginState(editorView.state).decorationSet.find(),
        ).toHaveLength(prevDecorations.length);
      });
    });

    describe('and replace text is the search query in a different case', () => {
      beforeEach(async () => {
        await initEditor(
          doc(
            p('{<>}this is a {firstMatchStart}quokka{firstMatchEnd}'),
            p('this is a {secondMatchStart}quokka{secondMatchEnd}'),
            p('this is a {thirdMatchStart}quokka{thirdMatchEnd}'),
          ),
        );
        prevDecorations = getPluginState(editorView.state).decorationSet.find();
        replace('QUOKKA')(editorView.state, editorView.dispatch);
      });

      it('sets index to next match', () => {
        expect(getPluginState(editorView.state)).toMatchObject({
          index: 1,
        });
      });

      it('sets selection to next result', () => {
        expect(editorView.state.selection.from).toBe(refs.secondMatchStart);
      });

      it('decorates next result as the selected word', () => {
        const selectedWordDecorations = getSelectedWordDecorations(
          editorView.state,
        );
        expect(selectedWordDecorations).toHaveLength(1);
        expect(selectedWordDecorations[0].from).toEqual(refs.secondMatchStart);
        expect(selectedWordDecorations[0].to).toEqual(refs.secondMatchEnd);
      });

      it('keeps all decorations', () => {
        expect(
          getPluginState(editorView.state).decorationSet.find(),
        ).toHaveLength(prevDecorations.length);
      });
    });
  });

  describe('and no search results on page', () => {
    beforeEach(async () => {
      await initEditor(doc(p('{<>}no results')));
      replace('numbat')(editorView.state, editorView.dispatch);
    });

    it('leaves document as is', () => {
      expect(editorView.state.doc).toEqualDocument(doc(p('no results')));
    });

    it('finds zero results', () => {
      expect(getPluginState(editorView.state)).toMatchObject({
        findText: 'quokka',
        replaceText: 'numbat',
        matches: [],
      });
    });

    it('leaves selection as is', () => {
      expect(editorView.state.selection.from).toBe(1);
    });
  });
});

describe('find/replace commands: replaceWithAnalytics', () => {
  it('should fire analytics event from button click', () => {
    initEditor(doc(p('{<>}this is a {matchStart}quokka{matchEnd}')));
    replaceWithAnalytics({
      triggerMethod: TRIGGER_METHOD.BUTTON,
      replaceText: 'numbat',
    })(editorView.state, editorView.dispatch);
    expect(createAnalyticsEvent).toBeCalledWith({
      eventType: 'track',
      action: 'replacedOne',
      actionSubject: 'text',
      attributes: expect.objectContaining({
        triggerMethod: 'button',
      }),
    });
  });

  it('should fire analytics event from pressing Enter', () => {
    initEditor(doc(p('{<>}this is a {matchStart}quokka{matchEnd}')));
    replaceWithAnalytics({
      triggerMethod: TRIGGER_METHOD.KEYBOARD,
      replaceText: 'numbat',
    })(editorView.state, editorView.dispatch);
    expect(createAnalyticsEvent).toBeCalledWith({
      eventType: 'track',
      action: 'replacedOne',
      actionSubject: 'text',
      attributes: expect.objectContaining({
        triggerMethod: 'keyboard',
      }),
    });
  });
});
