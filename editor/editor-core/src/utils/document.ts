import { Node, Fragment, Schema, ResolvedPos } from 'prosemirror-model';
import {
  Transaction,
  ReadonlyTransaction,
  EditorState,
  TextSelection,
} from 'prosemirror-state';

import { ContentNodeWithPos } from 'prosemirror-utils';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { isEmptyParagraph } from '@atlaskit/editor-common/utils';
import { Transformer, ReplaceRawValue } from '@atlaskit/editor-common/types';
import { DispatchAnalyticsEvent } from '../plugins/analytics/types/dispatch-analytics-event';
import { getBreakoutMode } from './node-width';
import { BreakoutMarkAttrs } from '@atlaskit/adf-schema';
import {
  processRawValue,
  hasDocAsParent,
  getStepRange,
} from '@atlaskit/editor-common/utils';

/**
 * Returns false if node contains only empty inline nodes and hardBreaks.
 */
export function hasVisibleContent(node: Node): boolean {
  const isInlineNodeHasVisibleContent = (inlineNode: Node) => {
    return inlineNode.isText
      ? !!inlineNode.textContent.trim()
      : inlineNode.type.name !== 'hardBreak';
  };

  if (node.isInline) {
    return isInlineNodeHasVisibleContent(node);
  } else if (node.isBlock && (node.isLeaf || node.isAtom)) {
    return true;
  } else if (!node.childCount) {
    return false;
  }

  for (let index = 0; index < node.childCount; index++) {
    const child = node.child(index);
    const invisibleNodeTypes = ['paragraph', 'text', 'hardBreak'];

    if (
      !invisibleNodeTypes.includes(child.type.name) ||
      hasVisibleContent(child)
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Checks if a node has any content. Ignores node that only contain empty block nodes.
 */
export function isNodeEmpty(node?: Node): boolean {
  if (node && node.textContent) {
    return false;
  }

  if (
    !node ||
    !node.childCount ||
    (node.childCount === 1 && isEmptyParagraph(node.firstChild))
  ) {
    return true;
  }

  const block: Node[] = [];
  const nonBlock: Node[] = [];

  node.forEach((child) => {
    child.isInline ? nonBlock.push(child) : block.push(child);
  });

  return (
    !nonBlock.length &&
    !block.filter(
      (childNode) =>
        (!!childNode.childCount &&
          !(
            childNode.childCount === 1 && isEmptyParagraph(childNode.firstChild)
          )) ||
        childNode.isAtom,
    ).length
  );
}

export function isInEmptyLine(state: EditorState) {
  const { selection } = state;
  const { $cursor, $anchor } = selection as TextSelection;

  if (!$cursor) {
    return false;
  }

  const node = $cursor.node();

  if (!node) {
    return false;
  }
  return isEmptyParagraph(node) && hasDocAsParent($anchor);
}

export function processRawFragmentValue(
  schema: Schema,
  value?: ReplaceRawValue[],
  providerFactory?: ProviderFactory,
  sanitizePrivateContent?: boolean,
  contentTransformer?: Transformer<string>,
  dispatchAnalyticsEvent?: DispatchAnalyticsEvent,
): Fragment | undefined {
  if (!value) {
    return;
  }

  const adfEntities = value
    .map((item) =>
      processRawValue(
        schema,
        item,
        providerFactory,
        sanitizePrivateContent,
        contentTransformer,
        dispatchAnalyticsEvent,
      ),
    )
    .filter((item) => Boolean(item)) as Node[];

  if (adfEntities.length === 0) {
    return;
  }

  return Fragment.from(adfEntities);
}

/**
 * Find the farthest node given a condition
 * @param predicate Function to check the node
 */
export const findFarthestParentNode =
  (predicate: (node: Node) => boolean) =>
  ($pos: ResolvedPos): ContentNodeWithPos | null => {
    let candidate: ContentNodeWithPos | null = null;

    for (let i = $pos.depth; i > 0; i--) {
      const node = $pos.node(i);
      if (predicate(node)) {
        candidate = {
          pos: i > 0 ? $pos.before(i) : 0,
          start: $pos.start(i),
          depth: i,
          node,
        };
      }
    }
    return candidate;
  };

export const isSelectionEndOfParagraph = (state: EditorState): boolean =>
  state.selection.$to.parent.type === state.schema.nodes.paragraph &&
  state.selection.$to.pos === state.doc.resolve(state.selection.$to.pos).end();

export type ChangedFn = (
  node: Node,
  pos: number,
  parent: Node | null,
  index: number,
) => boolean | void;

export function getChangedNodesIn({
  tr,
  doc,
}: {
  tr: ReadonlyTransaction | Transaction;
  doc: Node;
}): { node: Node; pos: number }[] {
  const nodes: { node: Node; pos: number }[] = [];
  const stepRange = getStepRange(tr);

  if (!stepRange) {
    return nodes;
  }

  const from = Math.min(doc.nodeSize - 2, stepRange.from);
  const to = Math.min(doc.nodeSize - 2, stepRange.to);

  doc.nodesBetween(from, to, (node, pos) => {
    nodes.push({ node, pos });
  });

  return nodes;
}

export function getChangedNodes(
  tr: ReadonlyTransaction | Transaction,
): { node: Node; pos: number }[] {
  return getChangedNodesIn({
    tr: tr,
    doc: tr.doc,
  });
}

export function nodesBetweenChanged(
  tr: Transaction | ReadonlyTransaction,
  f: ChangedFn,
  startPos?: number,
) {
  const stepRange = getStepRange(tr);
  if (!stepRange) {
    return;
  }

  tr.doc.nodesBetween(stepRange.from, stepRange.to, f, startPos);
}

export function getNodesCount(node: Node): Record<string, number> {
  let count: Record<string, number> = {};

  node.nodesBetween(0, node.nodeSize - 2, (node) => {
    count[node.type.name] = (count[node.type.name] || 0) + 1;
  });

  return count;
}

/**
 * Returns a set of active child breakout modes
 */
export function getChildBreakoutModes(
  doc: Node,
  schema: Schema,
  filter: BreakoutMarkAttrs['mode'][] = ['wide', 'full-width'],
): BreakoutMarkAttrs['mode'][] {
  const breakoutModes = new Set<string>();

  if (doc.type.name === 'doc' && doc.childCount) {
    for (let i = 0; i < doc.childCount; ++i) {
      if (breakoutModes.size === filter.length) {
        break;
      }

      const breakoutMode = getBreakoutMode(doc.child(i), schema.marks.breakout);
      if (breakoutMode && filter.includes(breakoutMode)) {
        breakoutModes.add(breakoutMode);
      }
    }
  }
  return [...breakoutModes] as BreakoutMarkAttrs['mode'][];
}
