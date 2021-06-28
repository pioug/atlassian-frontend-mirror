import type { NodeType, Node as PMNode } from 'prosemirror-model';
import { canJoin, findWrapping } from 'prosemirror-transform';
import { closeHistory } from 'prosemirror-history';
import { Mark as PMMark } from 'prosemirror-model';
import {
  EditorState,
  Transaction,
  Plugin,
  TextSelection,
} from 'prosemirror-state';

import { addAnalytics } from '../plugins/analytics/utils';

import { AnalyticsEventPayload } from '../plugins/analytics/types';
import {
  createInputRulePlugin,
  InputRuleWrapper,
  InputRuleHandler,
  OnInputEvent,
  OnHandlerApply,
  MAX_REGEX_MATCH,
} from '@atlaskit/prosemirror-input-rules';

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

export const ruleWithTransform = (
  transform: (state: EditorState, tr: Transaction) => void,
) => {
  return (originalRule: InputRuleWrapper): InputRuleWrapper => {
    const onHandlerApply = (
      state: EditorState,
      tr: Transaction,
      matchResult: RegExpExecArray,
    ) => {
      transform(state, tr);

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
  useUnpredictableInputRule?: boolean;
};
export const createPlugin = (
  pluginName: string,
  rules: Array<InputRuleWrapper>,
  options: Options = {},
): Plugin => {
  const {
    isBlockNodeRule = false,
    allowInsertTextOnDocument = true,
    useUnpredictableInputRule = true,
  } = options;

  if (useUnpredictableInputRule) {
    return createUnpredictableInputRulePlugin(
      pluginName,
      rules,
      isBlockNodeRule,
    );
  }

  const onInputEvent: OnInputEvent = ({ state, from, to }) => {
    const unsupportedMarks = isBlockNodeRule
      ? ['code', 'link', 'typeAheadQuery']
      : ['code'];

    const $from = state.selection.$from;

    if (
      $from.parent.type.spec.code ||
      !(state.selection instanceof TextSelection) ||
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
  joinPredicate?: (matchResult: RegExpExecArray, node: PMNode) => boolean;
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

    const before = tr.doc.resolve(fixedStart - 1).nodeBefore;

    if (
      before &&
      before.type === nodeType &&
      canJoin(tr.doc, fixedStart - 1) &&
      (!joinPredicate || joinPredicate(match, before))
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

// UnPredictable Input Rule
// After the new UndoRedo system being rollout,
// The function below can be removed.
// https://product-fabric.atlassian.net/browse/ED-12676
import {
  inputRules as unpredictableInputRulesPlugin,
  InputRule as UnpredictableInputRule,
} from 'prosemirror-inputrules';
import { EditorView } from 'prosemirror-view';
import { startMeasure, stopMeasure } from '@atlaskit/editor-common';
function createUnpredictableInputRulePlugin(
  pluginName: string,
  rules: Array<InputRuleWrapper>,
  isBlockNodeRule: boolean = false,
) {
  type UnpredictableInputRuleHandler = (
    state: EditorState,
    match: Array<string>,
    start: number,
    end: number,
  ) => Transaction | null;
  type UnpredictableInputRuleWithHandler = UnpredictableInputRule &
    Record<'handler', UnpredictableInputRuleHandler>;

  const hasUnsupportedMarkForBlockInputRule = (
    state: EditorState,
    start: number,
    end: number,
  ) => {
    const {
      doc,
      schema: { marks },
    } = state;
    let unsupportedMarksPresent = false;
    const isUnsupportedMark = (node: PMMark) =>
      node.type === marks.code ||
      node.type === marks.link ||
      node.type === marks.typeAheadQuery;
    doc.nodesBetween(start, end, (node) => {
      unsupportedMarksPresent =
        unsupportedMarksPresent ||
        node.marks.filter(isUnsupportedMark).length > 0;
    });
    return unsupportedMarksPresent;
  };

  const hasUnsupportedMarkForInputRule = (
    state: EditorState,
    start: number,
    end: number,
  ) => {
    const {
      doc,
      schema: { marks },
    } = state;
    let unsupportedMarksPresent = false;
    const isCodemark = (mark: PMMark) => mark.type === marks.code;
    doc.nodesBetween(start, end, (node) => {
      unsupportedMarksPresent =
        unsupportedMarksPresent || node.marks.filter(isCodemark).length > 0;
    });
    return unsupportedMarksPresent;
  };
  const wrapUnsupportedMarkCheck = (
    inputRule: UnpredictableInputRuleWithHandler,
  ) => {
    const originalHandler = inputRule.handler.bind(inputRule);

    inputRule.handler = (state: EditorState, match, start, end) => {
      const unsupportedMarks = isBlockNodeRule
        ? hasUnsupportedMarkForBlockInputRule(state, start, end)
        : hasUnsupportedMarkForInputRule(state, start, end);

      const $from = state.selection.$from;

      if (
        $from.parent.type.spec.code ||
        !(state.selection instanceof TextSelection) ||
        unsupportedMarks
      ) {
        return null;
      }

      return originalHandler(state, match, start, end);
    };

    return inputRule;
  };

  const wrapFixPositions = (inputRule: UnpredictableInputRuleWithHandler) => {
    const originalHandler = inputRule.handler.bind(inputRule);

    inputRule.handler = (state: EditorState, match, start, end) => {
      const parentNodeStartAt = state.selection.$from.start();
      const offset = Math.max(
        0,
        state.selection.$from.parentOffset - MAX_REGEX_MATCH,
      );
      const fromFixed = Math.max(
        parentNodeStartAt + (match as RegExpExecArray).index + offset,
        1,
      );

      return originalHandler(state, match, fromFixed, end);
    };

    return inputRule;
  };

  const wrapWithOnHandlerApply = (onHandlerApply?: OnHandlerApply) => (
    inputRule: UnpredictableInputRuleWithHandler,
  ) => {
    if (!onHandlerApply) {
      return inputRule;
    }

    const originalHandler = inputRule.handler.bind(inputRule);

    inputRule.handler = (state: EditorState, match, start, end) => {
      const result = originalHandler(state, match, start, end);

      if (result && onHandlerApply) {
        onHandlerApply(state, result, match as RegExpExecArray);
      }

      return result;
    };

    return inputRule;
  };

  const createUnpredictableRule = (
    match: RegExp,
    handler: InputRuleHandler,
    onHandlerApply?: OnHandlerApply,
  ): UnpredictableInputRule => {
    const unpredictableRule = new UnpredictableInputRule(
      match,
      handler as UnpredictableInputRuleHandler,
    );

    const rule: UnpredictableInputRule = [
      wrapUnsupportedMarkCheck,
      wrapFixPositions,
      wrapWithOnHandlerApply(onHandlerApply),
    ].reduce(
      (acc, cb) => cb(acc),
      unpredictableRule as UnpredictableInputRuleWithHandler,
    );

    return rule;
  };

  const unpredictableRules: UnpredictableInputRule[] = rules.map((rule) => {
    const { match, handler, onHandlerApply } = rule;
    const unpredictableRule = createUnpredictableRule(
      match,
      handler,
      onHandlerApply,
    );

    return unpredictableRule;
  });

  const plugin = unpredictableInputRulesPlugin({ rules: unpredictableRules });

  if (process.env.NODE_ENV !== 'production') {
    const handleTextInput = plugin.props.handleTextInput;
    const timerId = `input-rule:${pluginName}`;

    plugin.props.handleTextInput = (
      view: EditorView<any>,
      from: number,
      to: number,
      text: string,
    ) => {
      startMeasure(timerId);
      const result = handleTextInput!(view, from, to, text);
      stopMeasure(timerId, () => {});
      return result;
    };
  }

  return plugin;
}
