import { EditorView, DecorationSet } from 'prosemirror-view';
import createStub from 'raf-stub';
import { doc, p, DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import { find, replaceAll } from '../../../commands';
import { replaceAllWithAnalytics } from '../../../commands-with-analytics';
import { editor, getContainerElement } from '../_utils';
import { getPluginState } from '../../../plugin';
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

  // need to do a find before we can do a replaceAll
  await findCommand(query);
  dispatchSpy.mockClear();
};

describe('find/replace commands: replaceAll', () => {
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
      replaceAll('numbat')(editorView.state, editorView.dispatch);
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
      replaceAll('numbat')(editorView.state, editorView.dispatch);
    });

    it('replaces all results in document', () => {
      expect(editorView.state.doc).toEqualDocument(
        doc(
          p('this is a numbat'),
          p('this is a numbat'),
          p('this is a numbat'),
        ),
      );
    });

    it('updates search results', () => {
      expect(getPluginState(editorView.state)).toMatchObject({
        findText: 'quokka',
        replaceText: 'numbat',
        matches: [],
      });
    });

    it('leaves selection as is', () => {
      expect(editorView.state.selection.from).toBe(refs.firstMatchStart);
    });

    it('removes all decorations', () => {
      expect(getPluginState(editorView.state)).toMatchObject({
        decorationSet: DecorationSet.empty,
      });
    });
  });

  describe('and no search results on page', () => {
    beforeEach(async () => {
      await initEditor(doc(p('{<>}no results')));
      replaceAll('numbat')(editorView.state, editorView.dispatch);
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

describe('find/replace commands: replaceAllWithAnalytics', () => {
  it('should fire analytics event', () => {
    initEditor(
      doc(
        p('{<>}this is a {firstMatchStart}quokka{firstMatchEnd}'),
        p('this is a {secondMatchStart}quokka{secondMatchEnd}'),
        p('this is a {thirdMatchStart}quokka{thirdMatchEnd}'),
      ),
    );
    replaceAllWithAnalytics({
      replaceText: 'numbat',
    })(editorView.state, editorView.dispatch);
    expect(createAnalyticsEvent).toBeCalledWith({
      eventType: 'track',
      action: 'replacedAll',
      actionSubject: 'text',
    });
  });
});
