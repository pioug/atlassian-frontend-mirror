import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { Node as PMNode, NodeType } from 'prosemirror-model';
import { Mark as PMMark } from 'prosemirror-model';
import { EditorState, TextSelection, Transaction } from 'prosemirror-state';
import { canJoin, findWrapping } from 'prosemirror-transform';
import { GapCursorSelection } from '@atlaskit/editor-common/selection';
import {
  createInputRulePlugin,
  InputRuleHandler,
  InputRuleWrapper,
  OnInputEvent,
} from '@atlaskit/prosemirror-input-rules';
import { addAnalytics } from '../plugins/analytics';
import { AnalyticsEventPayload } from '../plugins/analytics/types';
import { JOIN_SCENARIOS_WHEN_TYPING_TO_INSERT_LIST } from '@atlaskit/editor-common/analytics';
import { closeHistory } from 'prosemirror-history';
import { findParentNodeOfTypeClosestToPos } from 'prosemirror-utils';
import { getFeatureFlags } from '../plugins/feature-flags-context';

type GetPayload =
  | AnalyticsEventPayload
  | ((
      state: EditorState,
      matchResult: RegExpExecArray,
    ) => AnalyticsEventPayload);
export const ruleWithAnalytics = (getPayload: GetPayload) => {
  return (originalRule: InputRuleWrapper): InputRuleWrapper => {
    const onHandlerApply = (
      state: EditorState,
      tr: Transaction,
      matchResult: RegExpExecArray,
    ) => {
      const payload: AnalyticsEventPayload =
        typeof getPayload === 'function'
          ? getPayload(state, matchResult)
          : getPayload;

      addAnalytics(state, tr, payload);

      if (originalRule.onHandlerApply) {
        originalRule.onHandlerApply(state, tr, matchResult);
      }
    };

    return {
      ...originalRule,
      onHandlerApply,
    };
  };
};

export const createRule = (
  match: RegExp,
  handler: InputRuleHandler,
): InputRuleWrapper => {
  return {
    match,
    handler,
    onHandlerApply: (state, tr) => {
      closeHistory(tr);
    },
  };
};

type Options = {
  isBlockNodeRule?: boolean;
  allowInsertTextOnDocument?: boolean;
};
export const createPlugin = (
  pluginName: string,
  rules: Array<InputRuleWrapper>,
  options: Options = {},
): SafePlugin => {
  const { isBlockNodeRule = false, allowInsertTextOnDocument = true } = options;

  const onInputEvent: OnInputEvent = ({ state, from, to }) => {
    const unsupportedMarks = isBlockNodeRule
      ? ['code', 'link', 'typeAheadQuery']
      : ['code'];

    const $from = state.selection.$from;

    if (
      $from.parent.type.spec.code ||
      (!(state.selection instanceof TextSelection) &&
        !(state.selection instanceof GapCursorSelection)) ||
      hasUnsupportedMarks(state, from, to, unsupportedMarks) ||
      (isBlockNodeRule &&
        isCursorInsideUnsupportedMarks(state, unsupportedMarks))
    ) {
      return false;
    }

    return true;
  };

  return createInputRulePlugin(pluginName, rules, {
    allowInsertTextOnDocument,
    onInputEvent,
    onBeforeRegexMatch: (tr) => {
      closeHistory(tr);
    },
  });
};

type WrappingTextRuleProps = {
  match: RegExp;
  nodeType: NodeType;
  getAttrs?:
    | Record<string, any>
    | ((matchResult: RegExpExecArray) => Record<string, any>);
};
export const createWrappingTextBlockRule = ({
  match,
  nodeType,
  getAttrs,
}: WrappingTextRuleProps): InputRuleWrapper => {
  const handler: InputRuleHandler = (
    state: EditorState,
    match: RegExpExecArray,
    start: number,
    end: number,
  ) => {
    const fixedStart = Math.max(start, 1);
    const $start = state.doc.resolve(fixedStart);
    const attrs = getAttrs instanceof Function ? getAttrs(match) : getAttrs;

    const nodeBefore = $start.node(-1);
    if (
      nodeBefore &&
      !nodeBefore.canReplaceWith(
        $start.index(-1),
        $start.indexAfter(-1),
        nodeType,
      )
    ) {
      return null;
    }

    return state.tr
      .delete(fixedStart, end)
      .setBlockType(fixedStart, fixedStart, nodeType, attrs);
  };

  return createRule(match, handler);
};

type WrappingRuleProps = {
  match: RegExp;
  nodeType: NodeType;
  getAttrs?:
    | Record<string, any>
    | ((matchResult: RegExpExecArray) => Record<string, any>);
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

    const featureFlags = getFeatureFlags(state);

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

export const createJoinNodesRule = (
  match: RegExp,
  nodeType: NodeType,
): InputRuleWrapper => {
  return createWrappingJoinRule({
    nodeType,
    match,
    getAttrs: {},
    joinPredicate: (_, node) => node.type === nodeType,
  });
};

const hasUnsupportedMarks = (
  state: EditorState,
  start: number,
  end: number,
  marksNameUnsupported: string[],
) => {
  const isUnsupportedMark = (node: PMMark) =>
    (marksNameUnsupported || []).includes(node.type.name);

  const $from = state.doc.resolve(start);
  const $to = state.doc.resolve(end);
  const marksInSelection =
    start === end ? $from.marks() : $from.marksAcross($to);

  return (marksInSelection || []).some(isUnsupportedMark);
};

const isCursorInsideUnsupportedMarks = (
  state: EditorState,
  marksNameUnsupported: string[],
): boolean => {
  const { selection } = state;
  if (!(selection instanceof TextSelection)) {
    return false;
  }
  const { $cursor } = selection;
  const isUnsupportedMark = (node: PMMark) =>
    marksNameUnsupported.includes(node.type.name);

  return Boolean($cursor?.nodeBefore?.marks?.some(isUnsupportedMark));
};
