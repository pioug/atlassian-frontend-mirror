import { EditorView } from 'prosemirror-view';
import createStub from 'raf-stub';
import { doc, p, DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import { find, activate } from '../../../commands';
import { activateWithAnalytics } from '../../../commands-with-analytics';
import {
  editor,
  setSelection,
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

const initEditor = (doc: DocBuilder) => {
  ({ editorView, refs } = editor(doc, createAnalyticsEvent));
};

describe('find/replace commands: activate', () => {
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

  beforeAll(() => {
    rafStub = createStub();
    rafSpy = jest
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation(rafStub.add);
  });

  afterAll(() => {
    rafSpy.mockRestore();
  });

  describe('with no text selected', () => {
    it('activates find/replace with no terms', async () => {
      initEditor(doc(p('{<>}this is a document')));
      activate()(editorView.state, editorView.dispatch);
      expect(getPluginState(editorView.state)).toMatchObject({
        isActive: true,
        shouldFocus: true,
        findText: '',
        replaceText: '',
        matches: [],
        index: 0,
      });
    });

    describe('and with a previous search active', () => {
      beforeEach(async () => {
        initEditor(
          doc(
            p('this is a {firstMatchStart}document{firstMatchEnd}'),
            p('{<>}this is a {secondMatchStart}document{secondMatchEnd}'),
          ),
        );
        await findCommand('document');
        activate()(editorView.state, editorView.dispatch);
      });

      it('activates find/replace using existing search', () => {
        expect(getPluginState(editorView.state)).toMatchObject({
          isActive: true,
          shouldFocus: true,
          findText: 'document',
        });
      });

      it('finds results', () => {
        expect(getPluginState(editorView.state)).toMatchObject({
          matches: [
            { start: refs.firstMatchStart, end: refs.firstMatchEnd },
            { start: refs.secondMatchStart, end: refs.secondMatchEnd },
          ],
        });
      });

      it('sets index to existing match', () => {
        expect(getPluginState(editorView.state)).toMatchObject({
          index: 1,
        });
      });

      it('leaves decorations as they are', () => {
        expect(
          getPluginState(editorView.state).decorationSet.find(),
        ).toHaveLength(2);
      });
    });
  });

  describe('with text selected', () => {
    describe('and one search result on page', () => {
      beforeEach(async () => {
        initEditor(doc(p('{<>}{matchStart}this{matchEnd} is a document')));
        setSelection(editorView, refs.matchStart, refs.matchEnd);
        activate()(editorView.state, editorView.dispatch);
      });

      it("activates find/replace using selected text as user's search", () => {
        expect(getPluginState(editorView.state)).toMatchObject({
          isActive: true,
          shouldFocus: true,
          findText: 'this',
        });
      });

      it('finds result', () => {
        expect(getPluginState(editorView.state)).toMatchObject({
          matches: [{ start: refs.matchStart, end: refs.matchEnd }],
        });
      });

      it('sets index to only match', () => {
        expect(getPluginState(editorView.state)).toMatchObject({
          index: 0,
        });
      });

      it('leaves selection as is', () => {
        expect(editorView.state.selection.from).toBe(refs.matchStart);
        expect(editorView.state.selection.to).toBe(refs.matchEnd);
      });

      it('decorates result as the selected word', async () => {
        // in the UI find will be triggered from activate setting the keyword
        // arguably, this doesn't belong in this file, but i felt it was good
        // to see the real chain of events
        await findCommand('this');
        const selectedWordDecorations = getSelectedWordDecorations(
          editorView.state,
        );
        expect(selectedWordDecorations).toHaveLength(1);
        expect(selectedWordDecorations[0].from).toEqual(refs.matchStart);
        expect(selectedWordDecorations[0].to).toEqual(refs.matchEnd);
      });
    });

    describe('and multiple search results on page', () => {
      beforeEach(async () => {
        initEditor(
          doc(
            p('{<>}{firstMatchStart}this{firstMatchEnd} is a document'),
            p('{secondMatchStart}this{secondMatchEnd} is a document'),
            p('{thirdMatchStart}this{thirdMatchEnd} is a document'),
          ),
        );
        setSelection(editorView, refs.secondMatchStart, refs.secondMatchEnd);
        activate()(editorView.state, editorView.dispatch);
      });

      it("activates find/replace using selected text as user's search", () => {
        expect(getPluginState(editorView.state)).toMatchObject({
          isActive: true,
          shouldFocus: true,
          findText: 'this',
        });
      });

      it('finds all results', () => {
        expect(getPluginState(editorView.state)).toMatchObject({
          matches: [
            { start: refs.firstMatchStart, end: refs.firstMatchEnd },
            { start: refs.secondMatchStart, end: refs.secondMatchEnd },
            { start: refs.thirdMatchStart, end: refs.thirdMatchEnd },
          ],
        });
      });

      it('sets index to the match the user selected', () => {
        expect(getPluginState(editorView.state)).toMatchObject({
          index: 1,
        });
      });

      it('leaves selection as is', () => {
        expect(editorView.state.selection.from).toBe(refs.secondMatchStart);
        expect(editorView.state.selection.to).toBe(refs.secondMatchEnd);
      });

      it('decorates result as the selected word', async () => {
        // in the UI find will be triggered from activate setting the keyword
        // arguably, this doesn't belong in this file, but i felt it was good
        // to see the chain of events
        await findCommand('this');
        const selectedWordDecorations = getSelectedWordDecorations(
          editorView.state,
        );
        expect(selectedWordDecorations).toHaveLength(1);
        expect(selectedWordDecorations[0].from).toEqual(refs.secondMatchStart);
        expect(selectedWordDecorations[0].to).toEqual(refs.secondMatchEnd);
      });
    });
  });
});

describe('find/replace commands: activateWithAnalytics', () => {
  it('should fire analytics event when text is not prefilled', () => {
    initEditor(doc(p('{<>}this is a document')));
    activateWithAnalytics({ triggerMethod: TRIGGER_METHOD.SHORTCUT })(
      editorView.state,
      editorView.dispatch,
    );
    expect(createAnalyticsEvent).toBeCalledWith({
      eventType: 'ui',
      action: 'activated',
      actionSubject: 'findReplaceDialog',
      attributes: expect.objectContaining({
        inputMethod: 'keyboard',
        triggerMethod: 'shortcut',
      }),
    });
  });

  it('should fire analytics event when text is prefilled', () => {
    initEditor(doc(p('{<}this{>} is a document')));
    activateWithAnalytics({ triggerMethod: TRIGGER_METHOD.SHORTCUT })(
      editorView.state,
      editorView.dispatch,
    );
    expect(createAnalyticsEvent).toBeCalledWith({
      eventType: 'ui',
      action: 'activated',
      actionSubject: 'findReplaceDialog',
      attributes: expect.objectContaining({
        inputMethod: 'prefill',
        triggerMethod: 'shortcut',
      }),
    });
  });
});
