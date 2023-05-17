import type { Transaction } from 'prosemirror-state';

import type { AnalyticsEventPayload } from './types';

export type EditorAnalyticsAPI = {
  attachAnalyticsEvent: (
    payload: AnalyticsEventPayload,
    channel?: string,
  ) => (tr: Transaction) => boolean;
};
