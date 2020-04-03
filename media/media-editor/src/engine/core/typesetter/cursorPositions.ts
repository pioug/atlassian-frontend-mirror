import { TextDirection } from '../../../common';
import { getUtf32CodeUnits } from '../../../util';

export type Text = Array<string>; // array of characters, each character is a string with only one UTF-32 code unit

// A group is either:
// - one whitespace character;
// - a sequence of non-whitespace characters that have same direction.
//
// We inroduce groups because we can rather simply detect cursor positions inside a group.
//
// Examples:
// 'abc def'  contains 3 groups ['abc', ' ', 'def']
// 'abc  def' contains 4 groups ['abc', ' ', ' ', 'def']
// '123abרא'  contains 2 groups ['123ab', 'רא']
export interface Group {
  text: Text;
  direction: TextDirection;
  startIndex: number;
  xmin: number;
  xmax: number;
}

// GroupBase, GroupMinMax describe data that obtained at different steps and then combined into a group

export interface GroupBase {
  // describes the group content
  text: Text;
  direction?: TextDirection;
}

export interface GroupMinMax {
  // describes the group position
  xmin: number;
  xmax: number;
}

// Tolerance to compare values for equality. It's for screen units, we don't need high precision
const screenUnitsTolerance = 1;

// Gets x coordinates of cursors for one line.
// For a text containing N characters (UTF-32 code units) we must produce N + 1 cursor positions.
//
// Note: textHelperDiv must already have font and direction with which the text is rendered
export const getCursorPositions = (
  text: string,
  direction: TextDirection,
  textHelperDiv: HTMLDivElement,
): Array<number> => {
  if (text.length === 0) {
    return [0];
  }

  // We need a root span where we will put other spans
  const rootSpan = document.createElement('span');
  textHelperDiv.appendChild(rootSpan);
  const cursors = detectCursorPositions(
    getUtf32CodeUnits(text),
    direction,
    rootSpan,
  );
  textHelperDiv.removeChild(rootSpan);

  return cursors;
};

// In short:
//
// 1) We extract groups from the text. A group is a single whitespace character or an array of characters that have same direction.
//    We loop through the text in the logical order (how it is stored in memory).
// 2) When we will assign positions at the next step, it's better (for consistency) to loop through the groups in their visual order
//    (how they are displayed on the screen).
//    So we reorder the groups. We don't mess any data because each group holds the start index in the original text.
// 3) For each group we assign a cursor position at the beginning of the group and inside it.
// 4) We assign the last cursor position.
const detectCursorPositions = (
  text: Text,
  direction: TextDirection,
  rootSpan: HTMLSpanElement,
): Array<number> => {
  const cursorCount = text.length + 1;
  const cursors = initCursorsArray(cursorCount); // initial cursors array with zeros

  const groups = getGroups(text, direction, rootSpan);
  const totalLength = calculateTotalLength(groups);

  // Reorder groups so that they are ordered left-to-right like they appear on the screen
  groups.sort((a, b) => a.xmin - b.xmin);

  // We're ready to find the cursor positions.
  // For each group we'll put the start position:
  //   - for a 'ltr' group it's the leftmost position
  //   - for a 'rtl' group it's the rightmost position.
  // Then we set the internal positions inside a group.
  //
  // Finally we set the last cursor position.
  if (direction === 'rtl') {
    groups.forEach(group => {
      cursors[group.startIndex] = group.xmax;
      setInternalCursorPositions(group, rootSpan, cursors);
    });

    // The text direction is 'rtl', so the text ends at the leftmost position
    cursors[cursorCount - 1] = -totalLength;
  } else {
    groups.forEach(group => {
      cursors[group.startIndex] = group.xmin;
      setInternalCursorPositions(group, rootSpan, cursors);
    });

    // The text direction is 'ltr', so the text ends at the rightmost position
    cursors[cursorCount - 1] = totalLength;
  }

  return cursors;
};

// Gets the array for cursor position filled with zeros
const initCursorsArray = (length: number, value = 0) =>
  Array.from({ length }).map(() => value);

// Extracting groups from the text

const getGroups = (
  text: Text,
  baseDirection: TextDirection,
  rootSpan: HTMLSpanElement,
): Array<Group> => {
  // We extract groups in several steps:
  // 1) We detect groups of text that are either a single whitespace or have the same direction.
  // 2) We calculate start index for each group.
  // 3) We determine xmin and xmax for each group by putting a group into a span.
  const baseGroups = extractBaseGroups(text, baseDirection, rootSpan);
  const startIndices = getGroupStartIndices(baseGroups);
  const groupXMinMax = getGroupXMinMax(baseGroups, baseDirection, rootSpan);

  // Then we combine the results and return the groups
  return baseGroups.map((baseGroup, index) => {
    const { text } = baseGroup;
    const direction = baseGroup.direction || baseDirection;
    const startIndex = startIndices[index];
    const { xmin, xmax } = groupXMinMax[index];

    return { text, direction, startIndex, xmin, xmax };
  });
};

const extractBaseGroups = (
  text: Text,
  direction: TextDirection,
  rootSpan: HTMLSpanElement,
): Array<GroupBase> => {
  // We create a temporary span where we will put spans containig every character.
  const parentSpan = document.createElement('span');
  parentSpan.style.direction = direction;
  rootSpan.appendChild(parentSpan);

  const spans = createSpansForCharacters(text, parentSpan);
  const result: Array<GroupBase> = [];

  // Data for the group being extracted
  let currentText: Text = [];
  let currentDirection: TextDirection | undefined;

  text.forEach((character, index) => {
    if (isWhiteSpace(character)) {
      // The current character is a whitespace. It forms one group.
      // If we were extracting a group before, we put it to the result.
      if (currentText.length !== 0) {
        result.push({ text: currentText, direction: currentDirection });
        currentText = [];
        currentDirection = undefined;
      }

      // One whitespace forms a group
      result.push({ text: [character], direction: undefined });
    } else {
      // The character is not a whitespace
      if (currentText.length === 0) {
        // We only start to extract a group
        currentText.push(character);
      } else {
        // We determine direction based on the previous character
        const dir = getDirection(index, spans);

        // If we could not detect direction (currently we are at the second character of a group),
        // or it is different than the current, we will start a new group
        if (!dir || (currentDirection && currentDirection !== dir)) {
          result.push({ text: currentText, direction: currentDirection }); // put previous to the result
          currentText = [character]; // start a new group
        } else {
          // we continue pushing characters into the current group
          currentText.push(character);
        }

        currentDirection = dir;
      }
    }
  });

  // If we were extracting a group before, we put it to the result
  if (currentText.length !== 0) {
    result.push({ text: currentText, direction: currentDirection });
  }

  rootSpan.removeChild(parentSpan);
  return result;
};

export const isWhiteSpace = (codeUnit: string): boolean => {
  return codeUnit === ' ' || codeUnit === '\t'; // currently we don't support tabs, but they can be added
};

// Determines if two values are close
export const isClose = (x1: number, x2: number): boolean => {
  return Math.abs(x1 - x2) < screenUnitsTolerance;
};

// Gets the direction based on the previous character
export const getDirection = (
  index: number,
  spans: Array<HTMLSpanElement>,
): TextDirection | undefined => {
  if (index <= 0 || index >= spans.length) {
    return undefined;
  }

  const previousRect = spans[index - 1].getBoundingClientRect();
  const currentRect = spans[index].getBoundingClientRect();

  if (isClose(previousRect.right, currentRect.left)) {
    //  | previous || current |
    return 'ltr';
  } else if (isClose(previousRect.left, currentRect.right)) {
    //  | current || previous |
    return 'rtl';
  } else {
    return undefined;
  }
};

export const getGroupStartIndices = (
  baseGroups: Array<GroupBase>,
): Array<number> => {
  let index = 0;
  return baseGroups.map(group => {
    const groupIndex = index;
    index += group.text.length;
    return groupIndex;
  });
};

export const getGroupXMinMax = (
  baseGroups: Array<GroupBase>,
  direction: TextDirection,
  rootSpan: HTMLSpanElement,
): Array<GroupMinMax> => {
  // We create a temporary span where we will put spans for every group to get their xmin, xmax
  const parentSpan = document.createElement('span');
  parentSpan.style.direction = direction;
  rootSpan.appendChild(parentSpan);

  // Wrap each group into a span
  const spans = createSpansForGroups(baseGroups, parentSpan);

  // Get x origin of the line. Currently we have spans for each group inside parentSpan
  // For 'rtl' direction the line starts at the rightmost position,
  // for 'ltr' direction the line starts at the leftmost position.
  const parentSpanRect = parentSpan.getBoundingClientRect();
  const xorigin =
    direction === 'rtl' ? parentSpanRect.right : parentSpanRect.left;

  const groupXMinMax = spans.map(span => {
    const rect = span.getBoundingClientRect();
    return {
      xmin: rect.left - xorigin,
      xmax: rect.right - xorigin,
    };
  });

  rootSpan.removeChild(parentSpan);
  return groupXMinMax;
};

// Wrap each character into a span
export const createSpansForCharacters = (
  text: Text,
  parent: HTMLSpanElement,
): Array<HTMLSpanElement> => {
  return text.map(character => {
    const span = document.createElement('span');
    span.innerText = character;
    parent.appendChild(span);
    return span;
  });
};

// Wrap each group into a span
export const createSpansForGroups = (
  baseGroups: Array<GroupBase>,
  parent: HTMLSpanElement,
): Array<HTMLSpanElement> => {
  return baseGroups.map(group => {
    const span = document.createElement('span');
    span.innerText = group.text.join('');
    parent.appendChild(span);
    return span;
  });
};

// Gets the total length of all groups. Sums the lengths of all groups
export const calculateTotalLength = (groups: Array<Group>): number => {
  return groups
    .map(group => group.xmax - group.xmin)
    .reduce((prev, curr) => prev + curr, 0);
};

// Setting cursor positions inside a group

const setInternalCursorPositions = (
  group: Group,
  rootSpan: HTMLSpanElement,
  cursors: Array<number>,
): void => {
  if (group.text.length < 2) {
    // No internal cursor positions, nothing to do
    return;
  }

  // To detect cursor positions inside a group we'll need additional span
  const span = document.createElement('span');
  span.style.direction = group.direction;
  rootSpan.appendChild(span);

  if (group.direction === 'rtl') {
    putInternalPositions(
      group.text,
      span,
      cursors,
      group.startIndex,
      spanWidth => group.xmax - spanWidth, // for 'rtl' groups we calculate from the right side
      pos => Math.max(pos, group.xmin), // the coordinate grows to the left, it mustn't exceed group.xmin
    );
  } else {
    putInternalPositions(
      group.text,
      span,
      cursors,
      group.startIndex,
      spanWidth => group.xmin + spanWidth, // for 'ltr' groups we calculate from the left side
      pos => Math.min(pos, group.xmax), // the coordinate grows to the right, it mustn't exceed group.xmax
    );
  }

  rootSpan.removeChild(span);
};

// Records internal cursor positions of a group into the cursors array.
// Uses a helper span. At every step adds a new character to the helper span.
// Calls posCalculator to get the cursor position based on the span width,
// then posLimiter to adjust the calculated cursor positions to the borders of the group.
//
// To understand the function better, let's look at the simple example. Let our group is 'lwqi', starts from x = 15.
// Let 'l' is 10 pixels wide, 'w' - 14, 'q' - 12
// Let our posCalculator function just return the (span width + group.xmin), i.e. (span width + 15)
//
// Step (i)    Span content       Span width          Calculated cursor position
// -----------------------------------------------------------------------------
//    1            l                 10                       25
//    2            lw                24                       39
//    3            lwq               36                       51
//
//
// Group starts from x = 15
//
//   |   l   |     w     |   q   |  i  |
//           25          39      51          - calculated values
export const putInternalPositions = (
  text: Text,
  span: HTMLSpanElement,
  cursors: Array<number>,
  startIndex: number,
  posCalculator: (spanWidth: number) => number,
  posLimiter: (position: number) => number,
): void => {
  for (let i = 1; i < text.length; ++i) {
    span.innerText = text.slice(0, i).join('');
    const rect = span.getBoundingClientRect();
    const pos = posCalculator(rect.right - rect.left);
    cursors[startIndex + i] = posLimiter(pos);
  }
};
