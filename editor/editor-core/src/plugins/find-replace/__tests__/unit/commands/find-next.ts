import { EditorView, Decoration } from 'prosemirror-view';
import createStub from 'raf-stub';
import { doc, p, DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import { find, findNext } from '../../../commands';
import { findNextWithAnalytics } from '../../../commands-with-analytics';
import {
  editor,
  getFindReplaceTr,
  getSelectedWordDecorations,
  getContainerElement,
  setSelection,
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

const initEditor = async (doc: DocBuilder, query = 'document') => {
  ({ editorView, refs } = editor(doc, createAnalyticsEvent));
  dispatchSpy = jest.spyOn(editorView, 'dispatch');

  // findNext is only called when a search is already active, so we do a
  // regular find first
  await findCommand(query);
  dispatchSpy.mockClear();
};

describe('find/replace commands: findNext', () => {
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
      await initEditor(doc(p('{<>}this is a {matchStart}document{matchEnd}')));
    });

    it('leaves state as is', () => {
      // DecorationSet will change so we manually check the individual Decorations
      const pluginStatePostFind = { ...getPluginState(editorView.state) };
      const decorationsPostFind = pluginStatePostFind.decorationSet.find();
      delete pluginStatePostFind.decorationSet;

      findNext()(editorView.state, editorView.dispatch);

      const pluginState = getPluginState(editorView.state);
      expect(pluginState).toMatchObject(pluginStatePostFind);
      expect(decorationsPostFind).toEqual(pluginState.decorationSet.find());
    });

    it('leaves selection at result', () => {
      findNext()(editorView.state, editorView.dispatch);
      expect(editorView.state.selection.from).toBe(refs.matchStart);
    });
  });

  describe('and multiple search results on page', () => {
    let prevDecorations: Decoration[];
    beforeEach(async () => {
      await initEditor(
        doc(
          p('{<>}this is a {firstMatchStart}document{firstMatchEnd}'),
          p('this is a {secondMatchStart}document{secondMatchEnd}'),
          p('this is a {thirdMatchStart}document{thirdMatchEnd}'),
        ),
      );
      prevDecorations = getPluginState(editorView.state).decorationSet.find();
      findNext()(editorView.state, editorView.dispatch);
    });

    it('sets index to next match', () => {
      expect(getPluginState(editorView.state)).toMatchObject({
        index: 1,
      });
    });

    it('sets selection to next result', () => {
      expect(editorView.state.selection.from).toBe(refs.secondMatchStart);
    });

    it('scrolls next result into view', () => {
      expect(getFindReplaceTr(dispatchSpy).scrolledIntoView).toBe(true);
    });

    it('decorates next result as the selected word', () => {
      const selectedWordDecorations = getSelectedWordDecorations(
        editorView.state,
      );
      expect(selectedWordDecorations).toHaveLength(1);
      expect(selectedWordDecorations[0].from).toEqual(refs.secondMatchStart);
      expect(selectedWordDecorations[0].to).toEqual(refs.secondMatchEnd);
    });

    it('keeps all other decorations', () => {
      expect(
        getPluginState(editorView.state).decorationSet.find(),
      ).toHaveLength(prevDecorations.length);
    });

    describe('and current index is set to last result', () => {
      beforeEach(async () => {
        await initEditor(
          doc(
            p('this is a {firstMatchStart}document{firstMatchEnd}'),
            p('this is a {secondMatchStart}document{secondMatchEnd}'),
            p('{<>}this is a {thirdMatchStart}document{thirdMatchEnd}'),
          ),
        );
        prevDecorations = getPluginState(editorView.state).decorationSet.find();
        findNext()(editorView.state, editorView.dispatch);
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

      it('keeps all other decorations', () => {
        expect(
          getPluginState(editorView.state).decorationSet.find(),
        ).toHaveLength(prevDecorations.length);
      });
    });

    describe('and user moves cursor to elsewhere in the document before finding next', () => {
      beforeEach(async () => {
        await initEditor(
          doc(
            p('this is a {firstMatchStart}document{firstMatchEnd}'),
            p('this is a {secondMatchStart}document{secondMatchEnd}'),
            p('{<>}this is a {thirdMatchStart}document{thirdMatchEnd}'),
          ),
        );
        setSelection(editorView, refs.secondMatchStart);
        findNext()(editorView.state, editorView.dispatch);
      });

      it('sets index to result following their cursor', () => {
        expect(getPluginState(editorView.state)).toMatchObject({
          index: 1,
        });
      });

      it('sets selection to result following their cursor', () => {
        expect(editorView.state.selection.from).toBe(refs.secondMatchStart);
      });

      it('decorates result following their cursor as the selected word', () => {
        const selectedWordDecorations = getSelectedWordDecorations(
          editorView.state,
        );
        expect(selectedWordDecorations).toHaveLength(1);
        expect(selectedWordDecorations[0].from).toEqual(refs.secondMatchStart);
        expect(selectedWordDecorations[0].to).toEqual(refs.secondMatchEnd);
      });
    });

    // these simulate situations where prosemirror would drop decorations
    describe('and there are lots of results', () => {
      let prevDecorations: Decoration[];
      beforeEach(async () => {
        await initEditor(
          doc(
            p(
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mi nisl, venenatis eget auctor vitae, venenatis quis something. Suspendisse maximus tortor vel dui tincidunt cursus. Vestibulum magna nibh, auctor non auctor id, finibus vitae orci. Nulla viverra ipsum et nunc fringilla ultricies. Pellentesque vitae felis molestie justo finibus accumsan. Suspendisse potenti. Nulla facilisi. Integer dignissim quis velit quis elementum. Sed sit amet varius ante. Duis vestibulum porta augue eu laoreet. Morbi id risus et augue sollicitudin aliquam. In et ligula dolor. Nam ac aliquet diam.',
            ),
          ),
          'e',
        );
        prevDecorations = getPluginState(editorView.state).decorationSet.find();
        findNext()(editorView.state, editorView.dispatch);
      });

      it('keeps all other decorations', () => {
        expect(
          getPluginState(editorView.state).decorationSet.find(),
        ).toHaveLength(prevDecorations.length);
      });
    });
  });

  describe('with no search query', () => {
    beforeEach(async () => {
      await initEditor(
        doc(p('{<>}{docStart}this is a {matchStart}document{matchEnd}')),
        '',
      );
    });

    it('leaves state as is', () => {
      const pluginStatePostFind = getPluginState(editorView.state);
      findNext()(editorView.state, editorView.dispatch);

      const pluginState = getPluginState(editorView.state);
      expect(pluginState).toMatchObject(pluginStatePostFind);
    });

    it('leaves selection', () => {
      findNext()(editorView.state, editorView.dispatch);
      expect(editorView.state.selection.from).toBe(refs.docStart);
    });
  });
});

describe('find/replace commands: findNextWithAnalytics', () => {
  it('should fire analytics event from button click', () => {
    initEditor(doc(p('{<>}this is a {matchStart}document{matchEnd}')));
    findNextWithAnalytics({
      triggerMethod: TRIGGER_METHOD.BUTTON,
    })(editorView.state, editorView.dispatch);
    expect(createAnalyticsEvent).toBeCalledWith({
      eventType: 'track',
      action: 'findNextPerformed',
      actionSubject: 'text',
      attributes: expect.objectContaining({
        triggerMethod: 'button',
      }),
    });
  });

  it('should fire analytics event from pressing Enter', () => {
    initEditor(doc(p('{<>}this is a {matchStart}document{matchEnd}')));
    findNextWithAnalytics({
      triggerMethod: TRIGGER_METHOD.KEYBOARD,
    })(editorView.state, editorView.dispatch);
    expect(createAnalyticsEvent).toBeCalledWith({
      eventType: 'track',
      action: 'findNextPerformed',
      actionSubject: 'text',
      attributes: expect.objectContaining({
        triggerMethod: 'keyboard',
      }),
    });
  });
});
