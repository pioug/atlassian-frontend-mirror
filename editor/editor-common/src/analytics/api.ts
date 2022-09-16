import type { Transaction } from 'prosemirror-state';

import type { AnalyticsEventPayload } from './types';

export type EditorAnalyticsAPI = {
  attachAnalyticsEvent: (
    payload: AnalyticsEventPayload,
  ) => (tr: Transaction) => boolean;
};
