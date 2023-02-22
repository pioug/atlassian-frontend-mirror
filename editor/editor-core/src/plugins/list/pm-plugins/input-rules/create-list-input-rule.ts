import { EditorState } from 'prosemirror-state';
import { Node as PMNode, NodeType } from 'prosemirror-model';

import { FeatureFlags } from '../../../../types/feature-flags';
import {
  ruleWithAnalytics,
  createWrappingJoinRule,
} from '../../../../utils/input-rules';

import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  INPUT_METHOD,
  AnalyticsEventPayload,
} from '../../../analytics';

import { JOIN_SCENARIOS_WHEN_TYPING_TO_INSERT_LIST } from '@atlaskit/editor-common/analytics';

type Props = {
  listType: NodeType;
  expression: RegExp;
  featureFlags?: FeatureFlags;
};

const getOrder = (matchResult: RegExpExecArray) => Number(matchResult[1]);

export function createRuleForListType({
  listType,
  expression,
  featureFlags,
}: Props) {
  let joinScenario: JOIN_SCENARIOS_WHEN_TYPING_TO_INSERT_LIST =
    JOIN_SCENARIOS_WHEN_TYPING_TO_INSERT_LIST.NO_JOIN;

  const isBulletList = listType.name === 'bulletList';
  const actionSubjectId = isBulletList
    ? ACTION_SUBJECT_ID.FORMAT_LIST_BULLET
    : ACTION_SUBJECT_ID.FORMAT_LIST_NUMBER;

  const getAnalyticsPayload = (
    state: EditorState,
    matchResult: RegExpExecArray,
  ) => {
    const analyticsPayload: AnalyticsEventPayload = {
      action: ACTION.INSERTED,
      actionSubject: ACTION_SUBJECT.LIST,
      actionSubjectId,
      eventType: EVENT_TYPE.TRACK,
      attributes: {
        inputMethod: INPUT_METHOD.FORMATTING,
      },
    };

    if (
      featureFlags?.restartNumberedLists &&
      listType === state.schema.nodes.orderedList &&
      analyticsPayload.attributes
    ) {
      analyticsPayload.attributes.listStartNumber = getOrder(matchResult);
      analyticsPayload.attributes.joinScenario = joinScenario;
      // we reset the tracked joinScenario after storing it in the event payload
      joinScenario = JOIN_SCENARIOS_WHEN_TYPING_TO_INSERT_LIST.NO_JOIN;
    }

    return analyticsPayload;
  };

  const joinToNeighbourIfSameListType = (
    _: string[],
    node: PMNode,
    scenario: JOIN_SCENARIOS_WHEN_TYPING_TO_INSERT_LIST,
  ) => {
    const shouldJoin = node.type === listType;
    if (shouldJoin) {
      joinScenario = scenario;
    }
    return shouldJoin;
  };

  let getAttrs = {};
  if (featureFlags?.restartNumberedLists) {
    getAttrs = (matchResult: RegExpExecArray): Record<string, any> => {
      return {
        order: getOrder(matchResult),
      };
    };
  }

  const inputRule = createWrappingJoinRule({
    match: expression,
    nodeType: listType,
    getAttrs,
    joinPredicate: joinToNeighbourIfSameListType,
  });

  return ruleWithAnalytics(getAnalyticsPayload)(inputRule);
}
