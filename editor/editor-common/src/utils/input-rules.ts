import type { EditorState, Transaction } from 'prosemirror-state';

import type { EditorAnalyticsAPI } from '../analytics';
import type { AnalyticsEventPayload } from '../analytics/types';
import type { InputRuleWrapper } from '../types/input-rules';

type GetPayload =
  | AnalyticsEventPayload
  | ((
      state: EditorState,
      matchResult: RegExpExecArray,
    ) => AnalyticsEventPayload);

// Roughly based on atlassian-frontend/packages/editor/editor-core/src/utils/input-rules.ts but with the Editor Analytics API that's injected in plugins
export const inputRuleWithAnalytics = (
  getPayload: GetPayload,
  analyticsApi: EditorAnalyticsAPI | undefined,
) => {
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

      analyticsApi?.attachAnalyticsEvent(payload)(tr);

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
