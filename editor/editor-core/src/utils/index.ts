import { toggleMark } from '@atlaskit/editor-prosemirror/commands';
import type {
  Mark as PMMark,
  MarkType,
  Node,
  NodeType,
  ResolvedPos,
  Schema,
  Slice,
} from '@atlaskit/editor-prosemirror/model';
import type {
  EditorState,
  Selection,
} from '@atlaskit/editor-prosemirror/state';
import {
  NodeSelection,
  TextSelection,
} from '@atlaskit/editor-prosemirror/state';
import type { JSONDocNode, JSONNode } from '@atlaskit/editor-json-transformer';
import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import { FakeTextCursorSelection } from '../plugins/fake-text-cursor/cursor';
import { hasParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import { isNodeEmpty } from './document';
import { atTheBeginningOfDoc, atTheEndOfDoc } from './prosemirror/position';
import { isMediaNode } from '@atlaskit/editor-common/utils';

export { insideTable } from '@atlaskit/editor-common/core-utils';

export {
  hasVisibleContent,
  isNodeEmpty,
  findFarthestParentNode,
  isSelectionEndOfParagraph,
  nodesBetweenChanged,
  getNodesCount,
} from './document';

export { sanitiseMarksInSelection } from './mark';
export { isParagraph, isText, isLinkMark } from './nodes';
export {
  setNodeSelection,
  setGapCursorSelection,
  setTextSelection,
} from './selection';

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

export function canMoveUp(state: EditorState): boolean {
  const { selection } = state;
  /**
   * If there's a media element on the selection it will use a gap cursor to move
   */
  if (selection instanceof NodeSelection && isMediaNode(selection.node)) {
    return true;
  }

  if (selection instanceof TextSelection) {
    if (!selection.empty) {
      return true;
    }
  }

  return !atTheBeginningOfDoc(state);
}

export function canMoveDown(state: EditorState): boolean {
  const { selection } = state;

  /**
   * If there's a media element on the selection it will use a gap cursor to move
   */
  if (selection instanceof NodeSelection && isMediaNode(selection.node)) {
    return true;
  }
  if (selection instanceof TextSelection) {
    if (!selection.empty) {
      return true;
    }
  }

  return !atTheEndOfDoc(state);
}

export function isSelectionInsideLastNodeInDocument(
  selection: Selection,
): boolean {
  const docNode = selection.$anchor.node(0);
  const rootNode = selection.$anchor.node(1);

  return docNode.lastChild === rootNode;
}

export function getCursor(selection: Selection): ResolvedPos | undefined {
  return (selection as TextSelection).$cursor || undefined;
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
  if (state.selection instanceof FakeTextCursorSelection) {
    return true;
  }

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

export function checkNodeDown(
  selection: Selection,
  doc: Node,
  filter: (node: Node) => boolean,
): boolean {
  const ancestorDepth = findAncestorPosition(doc, selection.$to).depth;

  // Top level node
  if (ancestorDepth === 0) {
    return false;
  }

  const res = doc.resolve(selection.$to.after(ancestorDepth));
  return res.nodeAfter ? filter(res.nodeAfter) : false;
}

/**
 * Traverse the document until an "ancestor" is found. Any nestable block can be an ancestor.
 */
function findAncestorPosition(doc: Node, pos: ResolvedPos): any {
  const nestableBlocks = ['blockquote', 'bulletList', 'orderedList'];

  if (pos.depth === 1) {
    return pos;
  }

  let node: Node | undefined = pos.node(pos.depth);
  let newPos = pos;
  while (pos.depth >= 1) {
    pos = doc.resolve(pos.before(pos.depth));
    node = pos.node(pos.depth);

    if (node && nestableBlocks.indexOf(node.type.name) !== -1) {
      newPos = pos;
    }
  }

  return newPos;
}

const transformer = new JSONTransformer();
export function toJSON(node: Node): JSONDocNode {
  return transformer.encode(node);
}

export function nodeToJSON(node: Node): JSONNode {
  return transformer.encodeNode(node);
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

/**
 * Function will create a list of wrapper blocks present in a selection.
 */
function getSelectedWrapperNodes(state: EditorState): NodeType[] {
  const nodes: Array<NodeType> = [];
  if (state.selection) {
    const { $from, $to } = state.selection;
    const {
      blockquote,
      panel,
      orderedList,
      bulletList,
      listItem,
      codeBlock,
      decisionItem,
      decisionList,
      taskItem,
      taskList,
    } = state.schema.nodes;
    state.doc.nodesBetween($from.pos, $to.pos, (node) => {
      if (
        node.isBlock &&
        [
          blockquote,
          panel,
          orderedList,
          bulletList,
          listItem,
          codeBlock,
          decisionItem,
          decisionList,
          taskItem,
          taskList,
        ].indexOf(node.type) >= 0
      ) {
        nodes.push(node.type);
      }
    });
  }
  return nodes;
}

/**
 * Function will check if changing block types: Paragraph, Heading is enabled.
 */
export function areBlockTypesDisabled(state: EditorState): boolean {
  const nodesTypes: NodeType[] = getSelectedWrapperNodes(state);
  const { panel } = state.schema.nodes;
  return nodesTypes.filter((type) => type !== panel).length > 0;
}

export const isTemporary = (id: string): boolean => {
  return id.indexOf('temporary:') === 0;
};

export const isEmptyNode = (schema: Schema) => {
  const {
    doc,
    paragraph,
    codeBlock,
    blockquote,
    panel,
    heading,
    listItem,
    bulletList,
    orderedList,
    taskList,
    taskItem,
    decisionList,
    decisionItem,
    media,
    mediaGroup,
    mediaSingle,
  } = schema.nodes;
  const innerIsEmptyNode = (node: Node): boolean => {
    switch (node.type) {
      case media:
      case mediaGroup:
      case mediaSingle:
        return false;
      case paragraph:
      case codeBlock:
      case heading:
      case taskItem:
      case decisionItem:
        return node.content.size === 0;
      case blockquote:
      case panel:
      case listItem:
        return (
          node.content.size === 2 && innerIsEmptyNode(node.content.firstChild!)
        );
      case bulletList:
      case orderedList:
        return (
          node.content.size === 4 && innerIsEmptyNode(node.content.firstChild!)
        );
      case taskList:
      case decisionList:
        return (
          node.content.size === 2 && innerIsEmptyNode(node.content.firstChild!)
        );
      case doc:
        let isEmpty = true;
        node.content.forEach((child) => {
          isEmpty = isEmpty && innerIsEmptyNode(child);
        });
        return isEmpty;
      default:
        return isNodeEmpty(node);
    }
  };
  return innerIsEmptyNode;
};

export const insideTableCell = (state: EditorState) => {
  const { tableCell, tableHeader } = state.schema.nodes;
  return hasParentNodeOfType([tableCell, tableHeader])(state.selection);
};

export const isInListItem = (state: EditorState): boolean => {
  return hasParentNodeOfType(state.schema.nodes.listItem)(state.selection);
};

export const hasOpenEnd = (slice: Slice): boolean => {
  return slice.openStart > 0 || slice.openEnd > 0;
};

export const isInsideBlockQuote = (state: EditorState): boolean => {
  const { blockquote } = state.schema.nodes;

  return hasParentNodeOfType(blockquote)(state.selection);
};

export function dedupe<T>(
  list: T[] = [],
  iteratee: (p: T) => T[keyof T] | T = (p) => p,
): T[] {
  /**
              .,
    .      _,'f----.._
    |\ ,-'"/  |     ,'
    |,_  ,--.      /
    /,-. ,'`.     (_
    f  o|  o|__     "`-.
    ,-._.,--'_ `.   _.,-`
    `"' ___.,'` j,-'
      `-.__.,--'
    Gotta go fast!
 */

  const seen = new Set();
  list.forEach((l) => seen.add(iteratee(l)));

  return list.filter((l) => {
    const it = iteratee(l);
    if (seen.has(it)) {
      seen.delete(it);
      return true;
    }
    return false;
  });
}

export {
  isTextSelection,
  isElementInTableCell,
  isLastItemMediaGroup,
  nonNullable,
} from '@atlaskit/editor-common/utils';

/** Helper type for single arg function */
type Func<A, B> = (a: A) => B;
type FuncN<A extends any[], B> = (...args: A) => B;

/**
 * Compose 1 to n functions.
 * @param func first function
 * @param funcs additional functions
 */
export function compose<
  F1 extends Func<any, any>,
  FN extends Array<Func<any, any>>,
  R extends FN extends []
    ? F1
    : FN extends [Func<infer A, any>]
    ? (a: A) => ReturnType<F1>
    : FN extends [any, Func<infer A, any>]
    ? (a: A) => ReturnType<F1>
    : FN extends [any, any, Func<infer A, any>]
    ? (a: A) => ReturnType<F1>
    : FN extends [any, any, any, Func<infer A, any>]
    ? (a: A) => ReturnType<F1>
    : FN extends [any, any, any, any, Func<infer A, any>]
    ? (a: A) => ReturnType<F1>
    : Func<any, ReturnType<F1>>, // Doubtful we'd ever want to pipe this many functions, but in the off chance someone does, we can still infer the return type
>(func: F1, ...funcs: FN): R {
  const allFuncs = [func, ...funcs];
  return function composed(raw: any) {
    return allFuncs.reduceRight((memo, func) => func(memo), raw);
  } as R;
}

export function pipe(): <R>(a: R) => R;

export function pipe<F extends Function>(f: F): F;

// one function
export function pipe<F1 extends FuncN<any, any>>(
  f1: F1,
): (...args: Parameters<F1>) => ReturnType<F1>;

// two function
export function pipe<
  F1 extends FuncN<any, any>,
  F2 extends Func<ReturnType<F1>, any>,
>(f1: F1, f2: F2): (...args: Parameters<F1>) => ReturnType<F2>;

// three function
export function pipe<
  F1 extends FuncN<any, any>,
  F2 extends Func<ReturnType<F1>, any>,
  F3 extends Func<ReturnType<F2>, any>,
>(f1: F1, f2: F2, f3: F3): (...args: Parameters<F1>) => ReturnType<F3>;
// If needed add more than 3 function
// Generic
export function pipe<
  F1 extends FuncN<any, any>,
  F2 extends Func<ReturnType<F1>, any>,
  F3 extends Func<ReturnType<F2>, any>,
  FN extends Array<Func<any, any>>,
>(f1: F1, f2: F2, f3: F3, ...fn: FN): (...args: Parameters<F1>) => any;

// rest
export function pipe(...fns: Function[]) {
  if (fns.length === 0) {
    return (a: any) => a;
  }

  if (fns.length === 1) {
    return fns[0];
  }

  return fns.reduce(
    (prevFn, nextFn) =>
      (...args: any[]) =>
        nextFn(prevFn(...args)),
  );
}

export function sum<T>(arr: Array<T>, f: (val: T) => number) {
  return arr.reduce((val, x) => val + f(x), 0);
}

export { SetAttrsStep } from '@atlaskit/adf-schema/steps';
