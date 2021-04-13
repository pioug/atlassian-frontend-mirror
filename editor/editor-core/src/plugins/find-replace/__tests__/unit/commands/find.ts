import { EditorView } from 'prosemirror-view';
import createStub from 'raf-stub';
import {
  doc,
  p,
  em,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import { find } from '../../../commands';
import { findWithAnalytics } from '../../../commands-with-analytics';
import {
  editor,
  getFindReplaceTr,
  getSelectedWordDecorations,
  getContainerElement,
} from '../_utils';
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

const initEditor = (doc: DocBuilder) => {
  ({ editorView, refs } = editor(doc, createAnalyticsEvent));
  dispatchSpy = jest.spyOn(editorView, 'dispatch');
};

describe('find/replace commands: find', () => {
  const findCommand = async (
    keyword?: string,
    posAtCoords?: { startPos: number; endPos: number },
  ) => {
    if (!posAtCoords) {
      const maxPos = editorView.state.doc.nodeSize;
      posAtCoords = { startPos: 1, endPos: maxPos };
    }
    mockPosAtCoords(posAtCoords);
    find(
      editorView,
      containerElement,
      keyword,
    )(editorView.state, editorView.dispatch);

    // decorations are applied async using promises & raf's in BatchDecorations
    await batchDecorationsStep();
  };

  const mockPosAtCoords = (posAtCoords: {
    startPos: number;
    endPos: number;
  }) => {
    const { startPos, endPos } = posAtCoords;
    jest
      .spyOn(editorView, 'posAtCoords')
      .mockReturnValueOnce({ pos: startPos, inside: startPos })
      .mockReturnValueOnce({ pos: endPos, inside: endPos });
  };

  const batchDecorationsStep = async () => {
    await flushPromises();
    rafStub.flush();
  };

  beforeAll(() => {
    rafStub = createStub();
    rafSpy = jest
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation(rafStub.add);
  });

  beforeEach(() => {
    initEditor(doc(p('{<>}this is a {matchStart}document{matchEnd}')));
  });

  afterEach(() => {
    dispatchSpy.mockClear();
  });

  afterAll(() => {
    rafSpy.mockRestore();
  });

  describe('and one search result on page', () => {
    beforeEach(async () => {
      await findCommand('document');
    });

    it('finds result', () => {
      expect(getPluginState(editorView.state)).toMatchObject({
        findText: 'document',
        matches: [{ start: refs.matchStart, end: refs.matchEnd }],
      });
    });

    it('finds result ignoring case', async () => {
      await findCommand('DocumenT');
      expect(getPluginState(editorView.state)).toMatchObject({
        findText: 'DocumenT',
        matches: [{ start: refs.matchStart, end: refs.matchEnd }],
      });
    });

    it('sets index to only match', () => {
      expect(getPluginState(editorView.state)).toMatchObject({
        index: 0,
      });
    });

    it('sets selection to only match', () => {
      expect(editorView.state.selection.from).toBe(refs.matchStart);
    });

    it('scrolls result into view', () => {
      expect(getFindReplaceTr(dispatchSpy).scrolledIntoView).toBe(true);
    });

    it('decorates result as the selected word', () => {
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
          p('this is a {firstMatchStart}document{firstMatchEnd}'),
          p('{<>}this is a {secondMatchStart}document{secondMatchEnd}'),
          p('this is a {thirdMatchStart}document{thirdMatchEnd}'),
        ),
      );
      await findCommand('document');
    });

    it('finds all results', () => {
      expect(getPluginState(editorView.state)).toMatchObject({
        findText: 'document',
        matches: [
          { start: refs.firstMatchStart, end: refs.firstMatchEnd },
          { start: refs.secondMatchStart, end: refs.secondMatchEnd },
          { start: refs.thirdMatchStart, end: refs.thirdMatchEnd },
        ],
      });
    });

    it('finds all results irrespective of case', async () => {
      initEditor(
        doc(
          p('this is a {firstMatchStart}DOCUMENT{firstMatchEnd}'),
          p('{<>}this is a {secondMatchStart}document{secondMatchEnd}'),
          p('this is a {thirdMatchStart}Document{thirdMatchEnd}'),
        ),
      );
      await findCommand('document');
      expect(getPluginState(editorView.state)).toMatchObject({
        findText: 'document',
        matches: [
          { start: refs.firstMatchStart, end: refs.firstMatchEnd },
          { start: refs.secondMatchStart, end: refs.secondMatchEnd },
          { start: refs.thirdMatchStart, end: refs.thirdMatchEnd },
        ],
      });
    });

    it('finds all results irrespective of splitting of text nodes or partial marks', async () => {
      initEditor(
        doc(
          p('this is a {firstMatchStart}DOC', em('UME'), 'NT{firstMatchEnd}'),
          p('{<>}this is a {secondMatchStart}docu', 'ment{secondMatchEnd}'),
          p('this is a {thirdMatchStart}Document{thirdMatchEnd}'),
        ),
      );
      await findCommand('document');
      expect(getPluginState(editorView.state)).toMatchObject({
        findText: 'document',
        matches: [
          { start: refs.firstMatchStart, end: refs.firstMatchEnd },
          { start: refs.secondMatchStart, end: refs.secondMatchEnd },
          { start: refs.thirdMatchStart, end: refs.thirdMatchEnd },
        ],
      });
    });

    it("sets index to match following the user's cursor pos", () => {
      expect(getPluginState(editorView.state)).toMatchObject({
        index: 1,
      });
    });

    it("sets selection to match following user's cursor pos", () => {
      expect(editorView.state.selection.from).toBe(refs.secondMatchStart);
    });

    it('scrolls result into view', () => {
      expect(getFindReplaceTr(dispatchSpy).scrolledIntoView).toBe(true);
    });

    it("decorates match following user's cursor as the selected word", () => {
      const selectedWordDecorations = getSelectedWordDecorations(
        editorView.state,
      );
      expect(selectedWordDecorations).toHaveLength(1);
      expect(selectedWordDecorations[0].from).toEqual(refs.secondMatchStart);
      expect(selectedWordDecorations[0].to).toEqual(refs.secondMatchEnd);
    });
  });

  describe('and no search results on page', () => {
    beforeEach(async () => {
      await findCommand('no results');
    });

    it('finds zero results', () => {
      expect(getPluginState(editorView.state)).toMatchObject({
        findText: 'no results',
        matches: [],
      });
    });

    it('sets index to default value', () => {
      expect(getPluginState(editorView.state)).toMatchObject({
        index: 0,
      });
    });

    it('leaves selection as is', () => {
      expect(editorView.state.selection.from).toBe(1);
    });
  });

  describe('with no text for keyword', () => {
    beforeEach(async () => {
      await findCommand('');
    });

    it('resets to default values', () => {
      expect(getPluginState(editorView.state)).toMatchObject({
        findText: '',
        matches: [],
        index: 0,
      });
    });

    it('leaves selection as is', () => {
      expect(editorView.state.selection.from).toBe(1);
    });

    describe('after a valid search', () => {
      beforeEach(async () => {
        await findCommand('document');
        await findCommand('');
      });

      it('resets to default values', () => {
        find(editorView, null, '')(editorView.state, editorView.dispatch);
        expect(getPluginState(editorView.state)).toMatchObject({
          findText: '',
          matches: [],
          index: 0,
        });
      });
    });
  });

  describe('with a large document', () => {
    beforeEach(() => {
      initEditor(doc(...Array(100).fill(p('this is a large document'))));
    });

    describe('and user has scrolled to bottom', () => {
      beforeEach(async () => {
        const maxPos = editorView.state.doc.nodeSize;
        await findCommand('this', { startPos: maxPos - 500, endPos: maxPos });

        // this will take 3 iterations for all decorations to be applied
        await batchDecorationsStep();
        await batchDecorationsStep();
        await batchDecorationsStep();
      });

      it('applies all decorations', () => {
        const decorations = getPluginState(
          editorView.state,
        ).decorationSet.find();
        expect(decorations).toHaveLength(100);
      });
    });

    describe('and user has scrolled to top', () => {
      beforeEach(async () => {
        await findCommand('this', { startPos: 1, endPos: 500 });

        // this will take 3 iterations for all decorations to be applied
        await batchDecorationsStep();
        await batchDecorationsStep();
        await batchDecorationsStep();
      });

      it('applies all decorations', () => {
        const decorations = getPluginState(
          editorView.state,
        ).decorationSet.find();
        expect(decorations).toHaveLength(100);
      });
    });

    describe('and user has scrolled to middle', () => {
      beforeEach(async () => {
        await findCommand('this', { startPos: 1000, endPos: 1500 });

        // this will take 3 iterations for all decorations to be applied
        await batchDecorationsStep();
        await batchDecorationsStep();
        await batchDecorationsStep();
      });

      it('applies all decorations', () => {
        const decorations = getPluginState(
          editorView.state,
        ).decorationSet.find();
        expect(decorations).toHaveLength(100);
      });
    });
  });
});

describe('find/replace commands: findWithAnalytics', () => {
  it('should fire analytics event', () => {
    initEditor(doc(p('{<>}word')));
    findWithAnalytics({
      editorView,
      containerElement,
      keyword: 'word',
    })(editorView.state, editorView.dispatch);
    expect(createAnalyticsEvent).toBeCalledWith({
      eventType: 'track',
      action: 'findPerformed',
      actionSubject: 'text',
    });
  });
});
