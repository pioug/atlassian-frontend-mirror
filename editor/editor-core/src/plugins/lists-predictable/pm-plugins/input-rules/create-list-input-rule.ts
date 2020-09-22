import { wrappingInputRule } from 'prosemirror-inputrules';
import { Node as PMNode, NodeType } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import {
  defaultInputRuleHandler,
  InputRuleWithHandler,
} from '../../../../utils/input-rules';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  INPUT_METHOD,
} from '../../../analytics';
import { sanitiseMarksInSelection } from '../../../../utils';
import { addAnalytics } from '../../../analytics/utils';

type WrapProps = {
  inputRule: InputRuleWithHandler;
  listType: 'bulletList' | 'orderedList';
};
function wrapInputRuleIntoSanitizationContent({
  inputRule,
  listType,
}: WrapProps) {
  const actionSubjectId =
    listType === 'bulletList'
      ? ACTION_SUBJECT_ID.FORMAT_LIST_BULLET
      : ACTION_SUBJECT_ID.FORMAT_LIST_NUMBER;
  const originalHandler = inputRule.handler;
  inputRule.handler = (state: EditorState, match, start, end) => {
    const tr = originalHandler(state, match, start, end);

    if (tr) {
      const nodesSanitized = sanitiseMarksInSelection(tr);

      nodesSanitized.forEach(({ node, marksRemoved }) => {
        addAnalytics(state, tr, {
          action: ACTION.NODE_CONTENT_SANITIZED,
          actionSubject: ACTION_SUBJECT.LIST,
          actionSubjectId,
          eventType: EVENT_TYPE.TRACK,
          attributes: {
            inputMethod: INPUT_METHOD.FORMATTING,
            nodeSanitized: node.type.name,
            marksRemoved: marksRemoved.map(m => m.type.name),
          },
        });
      });

      addAnalytics(state, tr, {
        action: ACTION.INSERTED,
        actionSubject: ACTION_SUBJECT.LIST,
        actionSubjectId,
        eventType: EVENT_TYPE.TRACK,
        attributes: {
          inputMethod: INPUT_METHOD.FORMATTING,
        },
      });
    }
    return tr;
  };

  return inputRule;
}

type Props = {
  listType: NodeType;
  expression: RegExp;
};
export function createRuleForListType({ listType, expression }: Props) {
  const isBulletList = listType.name === 'bulletList';
  const shouldJoinNextNodeWhen = (_: string[], node: PMNode) =>
    node.type === listType;

  const inputRule = wrappingInputRule(
    expression,
    listType,
    {},
    shouldJoinNextNodeWhen,
  ) as InputRuleWithHandler;
  return wrapInputRuleIntoSanitizationContent({
    listType: isBulletList ? 'bulletList' : 'orderedList',
    inputRule: defaultInputRuleHandler(inputRule, true),
  });
}
