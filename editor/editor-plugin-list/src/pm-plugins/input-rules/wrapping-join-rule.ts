import { JOIN_SCENARIOS_WHEN_TYPING_TO_INSERT_LIST } from '@atlaskit/editor-common/analytics';
import type {
  FeatureFlags,
  InputRuleHandler,
  InputRuleWrapper,
} from '@atlaskit/editor-common/types';
import type {
  NodeType,
  Node as PMNode,
} from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { canJoin, findWrapping } from '@atlaskit/editor-prosemirror/transform';
import { findParentNodeOfTypeClosestToPos } from '@atlaskit/editor-prosemirror/utils';
import { createRule } from '@atlaskit/prosemirror-input-rules';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Attrs = Record<string, any>;

type WrappingRuleProps = {
  featureFlags: FeatureFlags;
  match: RegExp;
  nodeType: NodeType;
  getAttrs?: Attrs | ((matchResult: RegExpExecArray) => Attrs);
  joinPredicate?: (
    matchResult: RegExpExecArray,
    node: PMNode,
    joinScenario: JOIN_SCENARIOS_WHEN_TYPING_TO_INSERT_LIST,
  ) => boolean;
};

export const createWrappingJoinRule = ({
  match,
  nodeType,
  getAttrs,
  joinPredicate,
  featureFlags,
}: WrappingRuleProps): InputRuleWrapper => {
  const handler: InputRuleHandler = (
    state: EditorState,
    match: RegExpExecArray,
    start: number,
    end: number,
  ) => {
    const attrs =
      (getAttrs instanceof Function ? getAttrs(match) : getAttrs) || {};

    const tr = state.tr;
    const fixedStart = Math.max(start, 1);
    tr.delete(fixedStart, end);

    const $start = tr.doc.resolve(fixedStart);
    const range = $start.blockRange();
    const wrapping = range && findWrapping(range, nodeType, attrs);

    if (!wrapping || !range) {
      return null;
    }

    const parentNodePosMapped = tr.mapping.map(range.start);
    const parentNode = tr.doc.nodeAt(parentNodePosMapped);
    const lastWrap = wrapping[wrapping.length - 1];

    if (parentNode && lastWrap) {
      const allowedMarks = lastWrap.type.allowedMarks(parentNode.marks) || [];
      tr.setNodeMarkup(
        parentNodePosMapped,
        parentNode.type,
        parentNode.attrs,
        allowedMarks,
      );
    }

    tr.wrap(range, wrapping);

    if (
      featureFlags?.restartNumberedLists &&
      nodeType === state.schema.nodes.orderedList
    ) {
      // if an orderedList node would be inserted by the input rule match, and
      // that orderedList node is being added directly before another orderedList
      // node, then join those nodes
      const $end = tr.doc.resolve(tr.mapping.map(end));
      const node = findParentNodeOfTypeClosestToPos($end, nodeType);
      if (node) {
        const nodeEnd = node.pos + node.node.nodeSize;
        const after = tr.doc.resolve(nodeEnd).nodeAfter;
        if (
          after &&
          after.type === nodeType &&
          canJoin(tr.doc, nodeEnd) &&
          (!joinPredicate ||
            joinPredicate(
              match,
              after,
              JOIN_SCENARIOS_WHEN_TYPING_TO_INSERT_LIST.JOINED_TO_LIST_BELOW,
            ))
        ) {
          tr.join(nodeEnd);
        }
      }
    }

    const before = tr.doc.resolve(fixedStart - 1).nodeBefore;

    if (
      before &&
      before.type === nodeType &&
      canJoin(tr.doc, fixedStart - 1) &&
      (!joinPredicate ||
        joinPredicate(
          match,
          before,
          JOIN_SCENARIOS_WHEN_TYPING_TO_INSERT_LIST.JOINED_TO_LIST_ABOVE,
        ))
    ) {
      tr.join(fixedStart - 1);
    }

    return tr;
  };

  return createRule(match, handler);
};
