import { toggleMark } from '@atlaskit/editor-prosemirror/commands';
import type {
  Mark as PMMark,
  MarkType,
  Slice,
} from '@atlaskit/editor-prosemirror/model';
import type {
  EditorState,
  TextSelection,
} from '@atlaskit/editor-prosemirror/state';
import type { JSONDocNode } from '@atlaskit/editor-json-transformer';
import { hasParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';

export {
  isEmptyNode,
  isSelectionInsideLastNodeInDocument,
  checkNodeDown,
  insideTableCell,
  isInListItem,
  toJSON,
  nodeToJSON,
} from '@atlaskit/editor-common/utils';

export { insideTable } from '@atlaskit/editor-common/core-utils';

export {
  findFarthestParentNode,
  nodesBetweenChanged,
  getNodesCount,
} from './document';

export { isParagraph, isText, isLinkMark } from './nodes';
export { setNodeSelection, setTextSelection } from './selection';

export type { JSONDocNode };

export { default as measurements } from './performance/measure-enum';

function isMarkTypeCompatibleWithMark(
  markType: MarkType,
  mark: PMMark,
): boolean {
  return !mark.type.excludes(markType) && !markType.excludes(mark.type);
}

function isMarkTypeAllowedInNode(
  markType: MarkType,
  state: EditorState,
): boolean {
  return toggleMark(markType)(state);
}

/**
 * Check if a mark is allowed at the current selection / cursor based on a given state.
 * This method looks at both the currently active marks on the transaction, as well as
 * the node and marks at the current selection to determine if the given mark type is
 * allowed.
 */
export function isMarkTypeAllowedInCurrentSelection(
  markType: MarkType,
  state: EditorState,
) {
  if (!isMarkTypeAllowedInNode(markType, state)) {
    return false;
  }

  const { empty, $cursor, ranges } = state.selection as TextSelection;
  if (empty && !$cursor) {
    return false;
  }

  let isCompatibleMarkType = (mark: PMMark) =>
    isMarkTypeCompatibleWithMark(markType, mark);

  // Handle any new marks in the current transaction
  if (
    state.tr.storedMarks &&
    !state.tr.storedMarks.every(isCompatibleMarkType)
  ) {
    return false;
  }

  if ($cursor) {
    return $cursor.marks().every(isCompatibleMarkType);
  }

  // Check every node in a selection - ensuring that it is compatible with the current mark type
  return ranges.every(({ $from, $to }) => {
    let allowedInActiveMarks =
      $from.depth === 0 ? state.doc.marks.every(isCompatibleMarkType) : true;

    state.doc.nodesBetween($from.pos, $to.pos, (node) => {
      allowedInActiveMarks =
        allowedInActiveMarks && node.marks.every(isCompatibleMarkType);
    });

    return allowedInActiveMarks;
  });
}

/**
 * Repeating string for multiple times
 */
export function stringRepeat(text: string, length: number): string {
  let result = '';
  for (let x = 0; x < length; x++) {
    result += text;
  }
  return result;
}

/*
 * From Modernizr
 * Returns the kind of transitionevent available for the element
 */
export function whichTransitionEvent<TransitionEventName extends string>() {
  const el = document.createElement('fakeelement');
  const transitions: Record<string, string> = {
    transition: 'transitionend',
    MozTransition: 'transitionend',
    OTransition: 'oTransitionEnd',
    WebkitTransition: 'webkitTransitionEnd',
  };

  for (const t in transitions) {
    if (el.style[t as keyof CSSStyleDeclaration] !== undefined) {
      // Use a generic as the return type because TypeScript doesnt know
      // about cross browser features, so we cast here to align to the
      // standard Event spec and propagate the type properly to the callbacks
      // of `addEventListener` and `removeEventListener`.
      return transitions[t] as TransitionEventName;
    }
  }

  return;
}

export const isTemporary = (id: string): boolean => {
  return id.indexOf('temporary:') === 0;
};

export const hasOpenEnd = (slice: Slice): boolean => {
  return slice.openStart > 0 || slice.openEnd > 0;
};

export const isInsideBlockQuote = (state: EditorState): boolean => {
  const { blockquote } = state.schema.nodes;

  return hasParentNodeOfType(blockquote)(state.selection);
};

export {
  isTextSelection,
  isElementInTableCell,
  isLastItemMediaGroup,
  nonNullable,
} from '@atlaskit/editor-common/utils';

export function sum<T>(arr: Array<T>, f: (val: T) => number) {
  return arr.reduce((val, x) => val + f(x), 0);
}

export { SetAttrsStep } from '@atlaskit/adf-schema/steps';
