import { Fragment, Slice, Node, NodeType, NodeRange } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';
import {
  ReplaceAroundStep,
  findWrapping,
  canSplit,
  canJoin,
} from 'prosemirror-transform';

/**
 * Wraps the selection in a list with the given type. If this results in
 * two adjacent lists of the same type, those will be joined together.
 */
export function wrapInListAndJoin(nodeType: NodeType, tr: Transaction) {
  wrapInList(nodeType)(tr);
  autoJoin(
    tr,
    (before, after) => before.type === after.type && before.type === nodeType,
  );
}

/**
 * Wraps the selection in a list with the given type and attributes.
 *
 * Adapted from https://github.com/ProseMirror/prosemirror-schema-list/blob/master/src/schema-list.js#L64-L89
 */
export function wrapInList(listType: NodeType, attrs?: { [key: string]: any }) {
  return function (tr: Transaction) {
    const { $from, $to } = tr.selection;
    let range = $from.blockRange($to);
    let doJoin = false;
    let outerRange = range;
    if (!range) {
      return false;
    }
    // This is at the top of an existing list item
    if (
      range.depth >= 2 &&
      // @ts-ignore - missing type for compatibleContent
      $from.node(range.depth - 1).type.compatibleContent(listType) &&
      range.startIndex === 0
    ) {
      // Don't do anything if this is the top of the list
      if ($from.index(range.depth - 1) === 0) {
        return false;
      }
      let $insert = tr.doc.resolve(range.start - 2);
      outerRange = new NodeRange($insert, $insert, range.depth);
      if (range.endIndex < range.parent.childCount) {
        range = new NodeRange(
          $from,
          tr.doc.resolve($to.end(range.depth)),
          range.depth,
        );
      }
      doJoin = true;
    }
    let wrap = findWrapping(outerRange!, listType, attrs, range);
    if (!wrap) {
      return false;
    }
    tr = doWrapInList(tr, range, wrap, doJoin, listType);
    return true;
  };
}

/**
 * Internal function used by wrapInList
 *
 * Adapted from https://github.com/ProseMirror/prosemirror-schema-list/blob/master/src/schema-list.js#L91-L112
 */
function doWrapInList(
  tr: Transaction,
  range: NodeRange,
  wrappers: Array<{ type: NodeType; attrs?: { [key: string]: any } | null }>,
  joinBefore: boolean,
  listType: NodeType,
) {
  let content = Fragment.empty;
  for (let i = wrappers.length - 1; i >= 0; i--) {
    content = Fragment.from(
      wrappers[i].type.create(wrappers[i].attrs, content),
    );
  }

  tr.step(
    new ReplaceAroundStep(
      range.start - (joinBefore ? 2 : 0),
      range.end,
      range.start,
      range.end,
      new Slice(content, 0, 0),
      wrappers.length,
      true,
    ),
  );

  let found = 0;
  for (let i = 0; i < wrappers.length; i++) {
    if (wrappers[i].type === listType) {
      found = i + 1;
    }
  }
  const splitDepth = wrappers.length - found;

  let splitPos = range.start + wrappers.length - (joinBefore ? 2 : 0);
  const parent = range.parent;
  for (
    let i = range.startIndex, e = range.endIndex, first = true;
    i < e;
    i++, first = false
  ) {
    if (!first && canSplit(tr.doc, splitPos, splitDepth)) {
      tr.split(splitPos, splitDepth);
      splitPos += 2 * splitDepth;
    }
    splitPos += parent.child(i).nodeSize;
  }
  return tr;
}

/**
 * Checks whether two adjacent nodes can be joined. If so, the document
 * will be updated to join those nodes. If not, the original transaction
 * remains untouched.
 *
 * Nodes are considered joinable if the `isJoinable` predicate returns true.
 *
 * Adapted from https://github.com/ProseMirror/prosemirror-commands/blob/master/src/commands.js#L597-L610
 */
export function autoJoin(
  tr: Transaction,
  isJoinable: (before: Node, after: Node) => boolean,
) {
  if (!tr.isGeneric) {
    return;
  }

  const ranges: number[] = [];
  for (let i = 0; i < tr.mapping.maps.length; i++) {
    const map = tr.mapping.maps[i];
    for (let j = 0; j < ranges.length; j++) {
      ranges[j] = map.map(ranges[j]);
    }
    map.forEach((_s: unknown, _e: unknown, from: number, to: number) =>
      ranges.push(from, to),
    );
  }

  // Figure out which joinable points exist inside those ranges,
  // by checking all node boundaries in their parent nodes.
  const joinable = [];
  for (let i = 0; i < ranges.length; i += 2) {
    const from = ranges[i];
    const to = ranges[i + 1];
    const $from = tr.doc.resolve(from);
    const depth = $from.sharedDepth(to);
    const parent = $from.node(depth);
    for (
      let index = $from.indexAfter(depth), pos = $from.after(depth + 1);
      pos <= to;
      ++index
    ) {
      const after = parent.maybeChild(index);
      if (!after) {
        break;
      }
      if (index && joinable.indexOf(pos) === -1) {
        const before = parent.child(index - 1);
        if (before.type === after.type && isJoinable(before, after)) {
          joinable.push(pos);
        }
      }
      pos += after.nodeSize;
    }
  }
  // Join the joinable points
  joinable.sort((a, b) => a - b);
  for (let i = joinable.length - 1; i >= 0; i--) {
    if (canJoin(tr.doc, joinable[i])) {
      tr.join(joinable[i]);
    }
  }
}
