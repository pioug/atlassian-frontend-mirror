import { EditorView } from 'prosemirror-view';
import { doc, p, DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import { find, toggleMatchCase } from '../../../commands';
import { editor } from '../_utils';
import { getPluginState } from '../../../plugin';

describe('find/replace commands: toggleMatchCase', () => {
  const createAnalyticsEvent: CreateUIAnalyticsEvent = jest.fn(
    () => ({ fire: () => {} } as UIAnalyticsEvent),
  );
  let editorView: EditorView;
  let refs: { [name: string]: number };

  const initEditor = (doc: DocBuilder) => {
    ({ editorView, refs } = editor(doc, createAnalyticsEvent));
  };

  const toggleMatchCaseAndFind = (findText: string) => {
    // In Find.tsx handleMatchCaseClick method, the find cmd is fired
    // immediately after toggleMatchCase cmd. We emulate this here to
    // update pluginState.matches, so we can assert against it
    toggleMatchCase()(editorView.state, editorView.dispatch);
    find(editorView, null, findText)(editorView.state, editorView.dispatch);
  };

  type MatchPositionTuple = [string, string];

  const buildExpectedMatches = (
    matchPositions: MatchPositionTuple[],
    refs: { [name: string]: number },
  ) =>
    matchPositions.map((refPair) => ({
      start: refs[refPair[0]],
      end: refs[refPair[1]],
    }));

  const allMatchPos: MatchPositionTuple[] = [
    ['firstMatchStart', 'firstMatchEnd'],
    ['secondMatchStart', 'secondMatchEnd'],
    ['thirdMatchStart', 'thirdMatchEnd'],
    ['fourthMatchStart', 'fourthMatchEnd'],
  ];
  const caseMatchPos: MatchPositionTuple[] = [
    ['secondMatchStart', 'secondMatchEnd'],
    ['thirdMatchStart', 'thirdMatchEnd'],
  ];
  beforeEach(() => {
    initEditor(
      doc(
        p(`{<>}{firstMatchStart}hello{firstMatchEnd} world`),
        p('{secondMatchStart}HELLO{secondMatchEnd} world'),
        p('{thirdMatchStart}HELLO{thirdMatchEnd}OO world'),
        p('{fourthMatchStart}hello{fourthMatchEnd}oo world'),
      ),
    );
  });

  it('inititally has Match Case toggled off', () => {
    expect(getPluginState(editorView.state)).toMatchObject({
      shouldMatchCase: false,
    });
  });

  describe('when Match Case starts toggled off', () => {
    it('finds all results, ignoring case', () => {
      find(editorView, null, 'HELLO')(editorView.state, editorView.dispatch);
      expect(getPluginState(editorView.state)).toMatchObject({
        shouldMatchCase: false,
        findText: 'HELLO',
        matches: buildExpectedMatches(allMatchPos, refs),
      });
    });
  });

  describe('when Match Case is toggled on', () => {
    beforeEach(() => {
      toggleMatchCaseAndFind('HELLO');
    });
    it('finds results, matching case', () => {
      expect(getPluginState(editorView.state)).toMatchObject({
        shouldMatchCase: true,
        findText: 'HELLO',
        matches: buildExpectedMatches(caseMatchPos, refs),
      });
    });
    describe('then when Match Case is toggled off', () => {
      beforeEach(() => {
        toggleMatchCaseAndFind('HELLO');
      });
      it('finds all results, ignoring case', () => {
        expect(getPluginState(editorView.state)).toMatchObject({
          shouldMatchCase: false,
          findText: 'HELLO',
          matches: buildExpectedMatches(allMatchPos, refs),
        });
      });
    });
  });
});
