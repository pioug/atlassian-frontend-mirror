import type {
  EditorState,
  Transaction,
} from '@atlaskit/editor-prosemirror/state';

import type { InputRuleWrapper } from '@atlaskit/prosemirror-input-rules';

import { addAnalytics } from '../plugins/analytics';
import type { AnalyticsEventPayload } from '../plugins/analytics/types';

type GetPayload =
  | AnalyticsEventPayload
  | ((
      state: EditorState,
      matchResult: RegExpExecArray,
    ) => AnalyticsEventPayload);

/**
 * @private
 * @deprecated Use import {inputRuleWithAnalytics} from "@atlaskit/editor-common/utils"; instead
 */
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
