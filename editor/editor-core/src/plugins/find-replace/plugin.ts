import { Plugin, Transaction } from 'prosemirror-state';
import { DecorationSet, Decoration } from 'prosemirror-view';
import { pluginFactory } from '../../utils/plugin-state-factory';
import reducer from './reducer';
import { Dispatch } from '../../event-dispatcher';
import { Match, FindReplacePluginState, findReplacePluginKey } from './types';
import {
  findMatches,
  createDecorations,
  removeDecorationsFromSet,
  findSearchIndex,
  removeMatchesFromSet,
  findDecorationFromMatch,
  isMatchAffectedByStep,
} from './utils';
import { findUniqueItemsIn } from '../../utils/array';
import { stepHasSlice } from '../../utils/step';

export const initialState: FindReplacePluginState = {
  isActive: false,
  shouldFocus: false,
  findText: '',
  replaceText: '',
  index: 0,
  matches: [],
  decorationSet: DecorationSet.empty,
  shouldMatchCase: false,
};

const handleDocChanged = (
  tr: Transaction,
  pluginState: FindReplacePluginState,
): FindReplacePluginState => {
  const { isActive, findText } = pluginState;
  if (!isActive || !findText) {
    return pluginState;
  }

  if (!tr.steps.find(stepHasSlice)) {
    return pluginState;
  }

  let { index, decorationSet, matches, shouldMatchCase } = pluginState;
  const newMatches = findMatches(tr.doc, findText, shouldMatchCase);
  decorationSet = decorationSet.map(tr.mapping, tr.doc);
  const numDecorations = decorationSet.find().length;

  const mappedMatches = matches.map((match) => ({
    start: tr.mapping.map(match.start),
    end: tr.mapping.map(match.end),
  }));

  let matchesToAdd: Match[] = [];
  let matchesToDelete: Match[] = [];

  if (newMatches.length > 0 && numDecorations === 0) {
    matchesToAdd = newMatches;
  } else if (newMatches.length === 0 && numDecorations > 0) {
    decorationSet = DecorationSet.empty;
  } else if (newMatches.length > 0 || numDecorations > 0) {
    // go through tr steps and find any new matches from user adding content or
    // any dead matches from user deleting content
    tr.steps.forEach((step) => {
      if (stepHasSlice(step)) {
        // add all matches that are between the affected positions and don't already have
        // corresponding decorations
        matchesToAdd = [
          ...matchesToAdd,
          ...newMatches.filter(
            (match) =>
              isMatchAffectedByStep(match, step, tr) &&
              !findDecorationFromMatch(decorationSet, match),
          ),
        ];

        // delete any matches that are missing from the newMatches array and have a
        // corresponding decoration
        matchesToDelete = [
          ...matchesToDelete,
          ...findUniqueItemsIn<Match>(
            mappedMatches.filter(
              (match) =>
                isMatchAffectedByStep(match, step, tr) &&
                !!findDecorationFromMatch(decorationSet, match),
            ),
            newMatches,
            (firstMatch, secondMatch) =>
              firstMatch.start === secondMatch.start &&
              firstMatch.end === secondMatch.end,
          ),
        ];
      }
    });
  }

  // update decorations if matches changed following document update
  if (matchesToDelete.length > 0) {
    const decorationsToDelete = matchesToDelete.reduce(
      (decorations: Decoration[], match) => [
        ...decorations,
        ...decorationSet.find(match.start, match.end),
      ],
      [],
    );
    decorationSet = removeDecorationsFromSet(
      decorationSet,
      decorationsToDelete,
      tr.doc,
    );
  }
  if (matchesToAdd.length > 0) {
    decorationSet = decorationSet.add(
      tr.doc,
      createDecorations(tr.selection.from, matchesToAdd),
    );
  }

  // update selected match if it has changed
  let newIndex = index;
  const selectedMatch = mappedMatches[index];
  if (selectedMatch) {
    newIndex = newMatches.findIndex(
      (match) => match.start === selectedMatch.start,
    );
  }
  if (newIndex === undefined || newIndex === -1) {
    newIndex = findSearchIndex(tr.selection.from, newMatches);
  }
  const newSelectedMatch = newMatches[newIndex];

  decorationSet = removeMatchesFromSet(
    decorationSet,
    [selectedMatch, newSelectedMatch],
    tr.doc,
  );
  if (newSelectedMatch) {
    decorationSet = decorationSet.add(
      tr.doc,
      createDecorations(0, [newSelectedMatch]),
    );
  }

  return {
    ...pluginState,
    matches: newMatches,
    index: newIndex,
    decorationSet,
  };
};

export const {
  createCommand,
  getPluginState,
  createPluginState,
} = pluginFactory(
  findReplacePluginKey,
  reducer(() => initialState),
  {
    onDocChanged: handleDocChanged,
  },
);

export const createPlugin = (dispatch: Dispatch) =>
  new Plugin({
    key: findReplacePluginKey,
    state: createPluginState(dispatch, () => initialState),
    props: {
      decorations(state) {
        const { isActive, findText, decorationSet } = getPluginState(state);
        if (isActive && findText) {
          return decorationSet;
        }
      },
    },
  });
