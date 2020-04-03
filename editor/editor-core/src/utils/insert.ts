import {
  isNodeSelection,
  canInsert,
  hasParentNodeOfType,
} from 'prosemirror-utils';
import { Node, Fragment, NodeType, ResolvedPos } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';
import { ReplaceStep, ReplaceAroundStep } from 'prosemirror-transform';
import { isEmptyParagraph } from './document';
import { GapCursorSelection, Side } from '../plugins/gap-cursor';

export type InsertableContent = Node | Fragment;
export enum LookDirection {
  Before = 'before',
  After = 'after',
}

const isLastChild = ($pos: ResolvedPos<any>, doc: Node<any>): boolean =>
  doc.resolve($pos.after()).node().lastChild === $pos.node();

const isFirstChild = ($pos: ResolvedPos<any>, doc: Node<any>): boolean =>
  doc.resolve($pos.before()).node().firstChild === $pos.node();

const nodeIsInsideAList = (tr: Transaction<any>) => {
  const { nodes } = tr.doc.type.schema;
  return hasParentNodeOfType([nodes.orderedList, nodes.bulletList])(
    tr.selection,
  );
};

const insertBeforeOrAfter = (
  tr: Transaction,
  lookDirection: LookDirection,
  $parentPos: ResolvedPos,
  $proposedPosition: ResolvedPos,
  content: InsertableContent,
) => {
  /**
   * This block caters for the first item in a parent with the cursor being at the very start
   * or the last item with the cursor being at the very end
   *
   * e.g.
   * ul
   *  li {<>}Scenario one
   *  li
   *  li Scenario two{<>}
   */

  if (
    (isFirstChild($proposedPosition, tr.doc) &&
      lookDirection === LookDirection.Before) ||
    (isLastChild($proposedPosition, tr.doc) &&
      lookDirection === LookDirection.After)
  ) {
    return tr.insert($parentPos[lookDirection](), content);
  }

  return tr.insert($proposedPosition[lookDirection](), content);
};

// FIXME: A more sustainable and configurable way to choose when to split
const shouldSplit = (nodeType: NodeType, schemaNodes: any) => {
  return [
    schemaNodes.bulletList,
    schemaNodes.orderedList,
    schemaNodes.panel,
  ].includes(nodeType);
};

export const safeInsert = (content: InsertableContent, position?: number) => (
  tr: Transaction,
) => {
  const { nodes } = tr.doc.type.schema;
  const whitelist = [nodes.rule, nodes.mediaSingle];

  // fallback if the node to insert is not in the whitelist, or if the insertion should happen within a list.
  if (
    content instanceof Fragment ||
    !whitelist.includes(content.type) ||
    nodeIsInsideAList(tr)
  ) {
    return null;
  }

  // Check for selection
  if (!tr.selection.empty || isNodeSelection(tr.selection)) {
    // NOT IMPLEMENTED
    return null;
  }

  const { $from } = tr.selection;
  const $insertPos = position
    ? tr.doc.resolve(position)
    : isNodeSelection(tr.selection)
    ? tr.doc.resolve($from.pos + 1)
    : $from;

  let lookDirection: LookDirection | undefined;
  const insertPosEnd = $insertPos.end();
  const insertPosStart = $insertPos.start();

  // When parent node is an empty paragraph,
  // check the empty paragraph is the first or last node of its parent.
  if (isEmptyParagraph($insertPos.parent)) {
    if (isLastChild($insertPos, tr.doc)) {
      lookDirection = LookDirection.After;
    } else if (isFirstChild($insertPos, tr.doc)) {
      lookDirection = LookDirection.Before;
    }
  } else {
    if ($insertPos.pos === insertPosEnd) {
      lookDirection = LookDirection.After;
    } else if ($insertPos.pos === insertPosStart) {
      lookDirection = LookDirection.Before;
    }
  }

  if (!lookDirection) {
    // fallback to consumer for now
    return null;
  }

  // Replace empty paragraph
  if (
    isEmptyParagraph($insertPos.parent) &&
    canInsert(tr.doc.resolve($insertPos[lookDirection]()), content)
  ) {
    return finaliseInsert(
      tr.replaceWith($insertPos.before(), $insertPos.after(), content),
      -1,
    );
  }

  let $proposedPosition = $insertPos;
  while ($proposedPosition.depth > 0) {
    const $parentPos = tr.doc.resolve($proposedPosition[lookDirection]());
    const parentNode = $parentPos.node();

    // Insert at position (before or after target pos)
    if (canInsert($proposedPosition, content)) {
      return finaliseInsert(
        tr.insert($proposedPosition.pos, content),
        content.nodeSize,
      );
    }

    // If we can't insert, and we think we should split, we fallback to consumer for now
    if (shouldSplit(parentNode.type, tr.doc.type.schema.nodes)) {
      return finaliseInsert(
        insertBeforeOrAfter(
          tr,
          lookDirection,
          $parentPos,
          $proposedPosition,
          content,
        ),
        content.nodeSize,
      );
    }

    // Can not insert into current parent, step up one parent
    $proposedPosition = $parentPos;
  }

  return finaliseInsert(
    tr.insert($proposedPosition.pos, content),
    content.nodeSize,
  );
};

const finaliseInsert = (tr: Transaction, nodeLength: number) => {
  const lastStep = tr.steps[tr.steps.length - 1];
  if (
    !(lastStep instanceof ReplaceStep || lastStep instanceof ReplaceAroundStep)
  ) {
    return null;
  }

  // Place gap cursor after the newly inserted node
  // Properties `to` and `slice` are private attributes of ReplaceStep.
  // @ts-ignore
  const gapCursorPos = lastStep.to + lastStep.slice.openStart + nodeLength;
  return tr
    .setSelection(
      new GapCursorSelection(tr.doc.resolve(gapCursorPos), Side.RIGHT),
    )
    .scrollIntoView();
};
