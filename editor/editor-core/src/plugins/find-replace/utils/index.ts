import { Fragment, Node as PmNode, Slice } from 'prosemirror-model';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { TextSelection, Transaction, Selection } from 'prosemirror-state';
import { Step } from 'prosemirror-transform';
import { Match, TextGrouping } from '../types';
import { selectedSearchMatchClass, searchMatchClass } from '../styles';

export function getSelectedText(selection: TextSelection): string {
  let text = '';
  const selectedContent = selection.content().content;
  for (let i = 0; i < selectedContent.childCount; i++) {
    text += selectedContent.child(i).textContent;
  }
  return text;
}

export const createDecorations = (
  selectedIndex: number,
  matches: { start: number; end: number }[],
): Decoration[] =>
  matches.map(({ start, end }, i) =>
    createDecoration(start, end, i === selectedIndex),
  );

export const createDecoration = (
  start: number,
  end: number,
  isSelected?: boolean,
) => {
  let className = searchMatchClass;
  if (isSelected) {
    className += ` ${selectedSearchMatchClass}`;
  }
  return Decoration.inline(start, end, {
    class: className,
  });
};

export function findMatches(
  content: PmNode | Fragment,
  searchText: string,
  shouldMatchCase: boolean,
  contentIndex = 0,
): Match[] {
  let matches: Match[] = [];
  const searchTextLength = searchText.length;

  let textGrouping: TextGrouping = null;

  const collectMatch = (textGrouping: TextGrouping) => {
    if (!textGrouping) {
      return;
    }
    let { text, pos: relativePos } = textGrouping;
    const pos = contentIndex + relativePos;
    if (!shouldMatchCase) {
      searchText = searchText.toLowerCase();
      text = text.toLowerCase();
    }
    let index = text.indexOf(searchText);
    while (index !== -1) {
      // Find the next substring from the end of the first, so that they don't overlap
      const end = index + searchTextLength;
      // Add the substring index to the position of the node
      matches.push({ start: pos + index, end: pos + end });
      index = text.indexOf(searchText, end);
    }
  };

  if (searchTextLength > 0) {
    content.descendants((node, pos) => {
      if (node.isText) {
        if (textGrouping === null) {
          textGrouping = {
            text: node.text as string,
            pos,
          };
        } else {
          textGrouping.text = textGrouping.text + node.text;
        }
      } else {
        collectMatch(textGrouping);
        textGrouping = null;
      }
    });
    // if there's a dangling text grouping and no non-text node to trigger collectMatch, manually collectMatch
    if (textGrouping) {
      collectMatch(textGrouping);
    }
  }

  return matches;
}

/**
 * Finds index of first item in matches array that comes after user's cursor pos.
 * If `backward` is `true`, finds index of first item that comes before instead.
 */
export function findSearchIndex(
  selectionPos: number,
  matches: Match[],
  backward = false,
): number {
  if (backward) {
    let matchIndex =
      matches.findIndex((match) => match.start >= selectionPos) - 1;
    if (matchIndex < 0) {
      matchIndex = matches.length - 1; // wrap around from the end
    }
    return matchIndex;
  }
  return Math.max(
    matches.findIndex((match) => match.start >= selectionPos),
    0,
  );
}

export const nextIndex = (currentIndex: number, total: number) =>
  (currentIndex + 1) % total;

export const prevIndex = (currentIndex: number, total: number) =>
  (currentIndex - 1 + total) % total;

export const getSelectionForMatch = (
  selection: Selection,
  doc: PmNode,
  index: number,
  matches: Match[],
  offset = 0,
): TextSelection => {
  if (matches[index]) {
    return TextSelection.create(doc, matches[index].start + offset);
  }
  return selection;
};

export const findDecorationFromMatch = (
  decorationSet: DecorationSet,
  match: Match,
): Decoration | undefined => {
  if (!match) {
    return;
  }
  const decorations = decorationSet.find(match.start, match.end);
  return decorations.length
    ? decorations.find(
        // decorationSet.find() returns any decorations that touch the specifided
        // positions, but we want to be stricter
        (decoration) =>
          decoration.from === match.start && decoration.to === match.end,
      )
    : undefined;
};

export const removeDecorationsFromSet = (
  decorationSet: DecorationSet,
  decorationsToRemove: Decoration[],
  doc: PmNode,
): DecorationSet => {
  const prevDecorations = decorationSet.find();

  // it is essential that we copy the decorations otherwise in some rare cases
  // prosemirror-view will update our decorationsToRemove array to contain nulls
  // instead of Decorations which ruins our check for lost decorations below
  decorationSet = decorationSet.remove(
    decorationsToRemove.map((decoration) =>
      // copy exists but isn't on the type definition
      (decoration as Decoration & {
        copy: (from: number, to: number) => Decoration;
      }).copy(decoration.from, decoration.to),
    ),
  );
  const newDecorations = decorationSet.find();

  // there is a bug in prosemirror-view where it can't cope with deleting inline
  // decorations from a set in some cases (where there are multiple levels of nested
  // children arrays), and it deletes more decorations than it should
  // todo: ticket link
  const lostDecorations = findLostAdjacentDecorations(
    decorationsToRemove,
    prevDecorations,
    newDecorations,
  );
  if (lostDecorations.length > 0) {
    decorationSet = decorationSet.add(doc, lostDecorations);
  }

  return decorationSet;
};

export const removeMatchesFromSet = (
  decorationSet: DecorationSet,
  matches: Match[],
  doc: PmNode,
) => {
  const decorationsToRemove = matches
    .filter((match) => !!match)
    .map((match) => findDecorationFromMatch(decorationSet, match));
  decorationsToRemove.forEach((decoration) => {
    if (decoration) {
      decorationSet = removeDecorationsFromSet(
        decorationSet,
        [decoration],
        doc,
      );
    }
  });
  return decorationSet;
};

/**
 * Finds decorations in prevDecorations that are not in newDecorations or decorationsToRemove
 * These decorations have been lost by Prosemirror during an over eager decoration removal
 * We need to be smart to cope with thousands of decorations without crashing everything
 */
export const findLostAdjacentDecorations = (
  decorationsToRemove: Decoration[],
  prevDecorations: Decoration[],
  newDecorations: Decoration[],
): Decoration[] => {
  let lostDecorations: Decoration[] = [];
  if (
    prevDecorations.length - decorationsToRemove.length >
    newDecorations.length
  ) {
    const position =
      decorationsToRemove.length > 0 ? decorationsToRemove[0].from : 0;
    const prevDecorationsStartIdx = findIndexBeforePosition(
      prevDecorations,
      position,
    );
    const newDecorationsStartIdx = findIndexBeforePosition(
      newDecorations,
      position,
    );
    const startIdx = Math.min(prevDecorationsStartIdx, newDecorationsStartIdx);

    const prevDecorationsToCheck = prevDecorations.slice(startIdx);
    const newDecorationsToCheck = newDecorations.slice(startIdx);

    const uniqueInPrev: Decoration[] = [];
    const numToFind =
      prevDecorationsToCheck.length - newDecorationsToCheck.length;
    let foundAll = false;
    let newDecorationsIdxOffset = 0;

    for (let i = 0; i < prevDecorationsToCheck.length; i++) {
      const prevDecoration = prevDecorationsToCheck[i];
      // this was a legit removal, skip and continue
      if (
        decorationsToRemove.find(
          (decoration) => decoration.from === prevDecoration.from,
        )
      ) {
        newDecorationsIdxOffset -= 1;
        continue;
      }

      let j = i + newDecorationsIdxOffset;

      // this is a lost decoration
      if (j >= newDecorationsToCheck.length) {
        uniqueInPrev.push(prevDecoration);
        if (uniqueInPrev.length === numToFind) {
          foundAll = true;
        }
      }

      for (; j < newDecorationsToCheck.length; j++) {
        const newDecoration = newDecorationsToCheck[j];

        // decoration found in both arrays, skip and continue
        if (prevDecoration.from === newDecoration.from) {
          break;
        }

        // this is a lost decoration
        if (
          newDecoration.from > prevDecoration.from ||
          j === newDecorationsToCheck.length - 1
        ) {
          uniqueInPrev.push(prevDecoration);
          newDecorationsIdxOffset -= 1;
          if (uniqueInPrev.length === numToFind) {
            foundAll = true;
          }
          break;
        }
      }
      if (foundAll) {
        break;
      }
    }

    // make sure we ignore any that we wanted to delete
    lostDecorations = uniqueInPrev.filter(
      (decoration) =>
        !decorationsToRemove.find(
          (decorationToRemove) => decoration.from === decorationToRemove.from,
        ),
    );
  }
  return lostDecorations;
};

/**
 * Searches through array in bumps of 100 to return the index of the first
 * decoration whose 'from' value is before or equal to the position
 */
export const findIndexBeforePosition = (
  items: Decoration[],
  position: number,
) => {
  // jump in batches to cope with arrays with thousands of decorations
  const increment = 100;
  let index = 0;
  for (let i = items.length - 1; i >= 0; i -= increment) {
    if (items[i].from < position) {
      // now we have found the 100 range, we can narrow it down to exact index
      index = i;
      for (let j = i; j <= items.length - 1; j++) {
        if (items[j].from <= position) {
          index = j;
        } else {
          break;
        }
      }
      break;
    }

    if (i < 100 && i > 0) {
      i = 100;
    }
  }

  return index;
};

/**
 * Determines whether a find/replace text Match will be changed as a result
 * of a Step modification to the document. This is evaluated by checking
 * both mapped and unmapped versions of the Step as in different cases the
 * matches will match.
 *
 * **Note:** Match state received here is after step has been applied.
 */
export const isMatchAffectedByStep = (
  match: Match,
  step: Step & { from: number; to: number; slice: Slice },
  tr: Transaction,
) => {
  const { from, to, slice } = step;
  const sliceSize = slice.content.size;
  return (
    (from + sliceSize >= match.start && to - sliceSize <= match.end) ||
    (tr.mapping.map(from) + sliceSize >= match.start &&
      tr.mapping.map(to) - sliceSize <= match.end)
  );
};
