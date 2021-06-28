import { EditorState, TextSelection } from 'prosemirror-state';
import { Decoration, DecorationSet, EditorView } from 'prosemirror-view';
import { createCommand, getPluginState } from './plugin';
import { FindReplaceActionTypes, FindReplaceAction } from './actions';
import { Match } from './types';
import {
  findMatches,
  findSearchIndex,
  getSelectedText,
  createDecoration,
  nextIndex,
  prevIndex,
  findDecorationFromMatch,
  removeDecorationsFromSet,
  getSelectionForMatch,
  removeMatchesFromSet,
} from './utils';
import { withScrollIntoView } from '../../utils/commands';
import batchDecorations from './utils/batch-decorations';

export const activate = () =>
  createCommand((state) => {
    const { selection } = state;
    let findText: string | undefined;
    let matches: Match[] | undefined;
    let index: number | undefined;

    // if user has selected text and hit cmd-f, set that as the keyword
    if (selection instanceof TextSelection && !selection.empty) {
      findText = getSelectedText(selection);
      const { shouldMatchCase } = getPluginState(state);
      matches = findMatches(state.doc, findText, shouldMatchCase);
      index = findSearchIndex(selection.from, matches);
    }

    return {
      type: FindReplaceActionTypes.ACTIVATE,
      findText,
      matches,
      index,
    };
  });

export const find = (
  editorView: EditorView,
  containerElement: HTMLElement | null,
  keyword?: string,
) =>
  withScrollIntoView(
    createCommand(
      (state) => {
        const { selection } = state;
        const { shouldMatchCase } = getPluginState(state);
        const matches =
          keyword !== undefined
            ? findMatches(state.doc, keyword, shouldMatchCase)
            : [];
        const index = findSearchIndex(selection.from, matches);

        // we can't just apply all the decorations to highlight the search results at once
        // as if there are a lot ProseMirror cries :'(
        batchDecorations.applyAllSearchDecorations(
          editorView,
          containerElement,
          (decorations) =>
            addDecorations(decorations)(editorView.state, editorView.dispatch),
          (decorations) =>
            removeDecorations(decorations)(
              editorView.state,
              editorView.dispatch,
            ),
        );

        return {
          type: FindReplaceActionTypes.FIND,
          findText: keyword || '',
          matches,
          index,
        };
      },
      (tr, state) => {
        const { selection } = state;
        const { shouldMatchCase } = getPluginState(state);
        const matches =
          keyword !== undefined
            ? findMatches(state.doc, keyword, shouldMatchCase)
            : [];
        if (matches.length > 0) {
          const index = findSearchIndex(selection.from, matches);
          return tr.setSelection(
            getSelectionForMatch(tr.selection, tr.doc, index, matches),
          );
        }
        return tr;
      },
    ),
  );

export const findNext = () =>
  withScrollIntoView(
    createCommand(
      (state) => findInDirection(state, 'next'),
      (tr, state) => {
        const { matches, index } = getPluginState(state);
        // can't use index from plugin state because if the cursor has moved, it will still be the
        // OLD index (the find next operation should look for the first match forward starting
        // from the current cursor position)
        let searchIndex = findSearchIndex(state.selection.from, matches);
        if (searchIndex === index) {
          // cursor has not moved, so we just want to find the next in matches array
          searchIndex = nextIndex(searchIndex, matches.length);
        }
        return tr.setSelection(
          getSelectionForMatch(tr.selection, tr.doc, searchIndex, matches),
        );
      },
    ),
  );

export const findPrevious = () =>
  withScrollIntoView(
    createCommand(
      (state) => findInDirection(state, 'previous'),
      (tr, state) => {
        const { matches } = getPluginState(state);
        // can't use index from plugin state because if the cursor has moved, it will still be the
        // OLD index (the find prev operation should look for the first match backward starting
        // from the current cursor position)
        const searchIndex = findSearchIndex(
          state.selection.from,
          matches,
          true,
        );
        return tr.setSelection(
          getSelectionForMatch(tr.selection, tr.doc, searchIndex, matches),
        );
      },
    ),
  );

const findInDirection = (
  state: EditorState,
  dir: 'next' | 'previous',
): FindReplaceAction => {
  const pluginState = getPluginState(state);
  const { matches, findText } = pluginState;
  let { decorationSet, index } = pluginState;

  if (findText) {
    const searchIndex = findSearchIndex(
      state.selection.from,
      matches,
      dir === 'previous',
    );
    // compare index from plugin state and index of first match forward from cursor position
    if (index === searchIndex) {
      // normal case, cycling through matches
      index =
        dir === 'next'
          ? nextIndex(index, matches.length)
          : prevIndex(index, matches.length);
    } else {
      // cursor has moved
      index = searchIndex;
    }
    decorationSet = updateSelectedHighlight(state, index);
  }

  return {
    type:
      dir === 'next'
        ? FindReplaceActionTypes.FIND_NEXT
        : FindReplaceActionTypes.FIND_PREVIOUS,
    index,
    decorationSet,
  };
};

export const replace = (replaceText: string) =>
  withScrollIntoView(
    createCommand(
      (state) => {
        const pluginState = getPluginState(state);
        const { findText } = pluginState;
        let { decorationSet, matches, index } = pluginState;

        decorationSet = updateSelectedHighlight(
          state,
          nextIndex(index, matches.length),
        );
        if (replaceText.toLowerCase().indexOf(findText.toLowerCase()) === -1) {
          decorationSet = removeMatchesFromSet(
            decorationSet,
            [matches[index]],
            state.doc,
          );
          matches.splice(index, 1);
          if (index > matches.length - 1) {
            index = 0;
          }
        } else {
          index = nextIndex(index, matches.length);
        }

        return {
          type: FindReplaceActionTypes.REPLACE,
          replaceText,
          decorationSet,
          matches,
          index,
        };
      },
      (tr, state) => {
        const { matches, index, findText } = getPluginState(state);
        if (matches[index]) {
          const { start, end } = matches[index];
          const newIndex = nextIndex(index, matches.length);
          tr.insertText(replaceText, start, end).setSelection(
            getSelectionForMatch(
              tr.selection,
              tr.doc,
              newIndex,
              matches,
              newIndex === 0 ? 0 : replaceText.length - findText.length,
            ),
          );
        }
        return tr;
      },
    ),
  );

export const replaceAll = (replaceText: string) =>
  createCommand(
    {
      type: FindReplaceActionTypes.REPLACE_ALL,
      replaceText: replaceText,
      decorationSet: DecorationSet.empty,
      matches: [],
      index: 0,
    },
    (tr, state) => {
      const pluginState = getPluginState(state);
      pluginState.matches.forEach((match) => {
        tr.insertText(
          replaceText,
          tr.mapping.map(match.start),
          tr.mapping.map(match.end),
        );
      });
      tr.setMeta('scrollIntoView', false);
      return tr;
    },
  );

export const addDecorations = (decorations: Decoration[]) =>
  createCommand((state) => {
    const { decorationSet } = getPluginState(state);
    return {
      type: FindReplaceActionTypes.UPDATE_DECORATIONS,
      decorationSet: decorationSet.add(state.doc, decorations),
    };
  });

export const removeDecorations = (decorations: Decoration[]) =>
  createCommand((state) => {
    const { decorationSet } = getPluginState(state);
    return {
      type: FindReplaceActionTypes.UPDATE_DECORATIONS,
      decorationSet: removeDecorationsFromSet(
        decorationSet,
        decorations,
        state.doc,
      ),
    };
  });

export const cancelSearch = () =>
  createCommand(() => {
    batchDecorations.stop();
    return {
      type: FindReplaceActionTypes.CANCEL,
    };
  });

export const blur = () =>
  createCommand({
    type: FindReplaceActionTypes.BLUR,
  });

export const toggleMatchCase = () =>
  createCommand({ type: FindReplaceActionTypes.TOGGLE_MATCH_CASE });

const updateSelectedHighlight = (
  state: EditorState,
  nextSelectedIndex: number,
): DecorationSet => {
  let { decorationSet, index, matches } = getPluginState(state);
  const currentSelectedMatch = matches[index];
  const nextSelectedMatch = matches[nextSelectedIndex];
  if (index === nextSelectedIndex) {
    return decorationSet;
  }

  const currentSelectedDecoration = findDecorationFromMatch(
    decorationSet,
    currentSelectedMatch,
  );
  const nextSelectedDecoration = findDecorationFromMatch(
    decorationSet,
    nextSelectedMatch,
  );

  // Update decorations so the current selected match becomes a normal match
  // and the next selected gets the selected styling
  const decorationsToRemove: Decoration[] = [];
  if (currentSelectedDecoration) {
    decorationsToRemove.push(currentSelectedDecoration);
  }
  if (nextSelectedDecoration) {
    decorationsToRemove.push(nextSelectedDecoration);
  }
  if (decorationsToRemove.length > 0) {
    // removeDecorationsFromSet depends on decorations being pre-sorted
    decorationsToRemove.sort((a, b) => (a.from < b.from ? -1 : 1));
    decorationSet = removeDecorationsFromSet(
      decorationSet,
      decorationsToRemove,
      state.doc,
    );
  }

  if (currentSelectedMatch) {
    decorationSet = decorationSet.add(state.doc, [
      createDecoration(currentSelectedMatch.start, currentSelectedMatch.end),
    ]);
  }
  if (nextSelectedMatch) {
    decorationSet = decorationSet.add(state.doc, [
      createDecoration(nextSelectedMatch.start, nextSelectedMatch.end, true),
    ]);
  }

  return decorationSet;
};
