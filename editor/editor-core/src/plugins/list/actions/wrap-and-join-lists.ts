import { Fragment, Slice, NodeType, NodeRange } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';
import {
  ReplaceAroundStep,
  findWrapping,
  canSplit,
} from 'prosemirror-transform';
import { autoJoinTr } from '../../../utils/prosemirror/autojoin';
import { GapCursorSelection } from '../../selection/gap-cursor-selection';
import { isWrappingPossible } from '../utils/selection';

/**
 * Wraps the selection in a list with the given type. If this results in
 * two adjacent lists of the same type, those will be joined together.
 */
export function wrapInListAndJoin(nodeType: NodeType, tr: Transaction) {
  wrapInList(nodeType)(tr);
  autoJoinTr(
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
    let range;
    if (
      tr.selection instanceof GapCursorSelection &&
      $from.nodeAfter &&
      isWrappingPossible(listType, tr.selection)
    ) {
      const nodeSize = $from.nodeAfter.nodeSize || 1;
      range = $from.blockRange($from.doc.resolve($from.pos + nodeSize));
    } else {
      range = $from.blockRange($to);
    }

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
