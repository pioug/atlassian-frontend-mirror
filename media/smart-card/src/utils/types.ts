import { GasPayload } from '@atlaskit/analytics-gas-types';

// Types of analytics have been defined in the minimum event spec here:
// https://hello.atlassian.net/wiki/spaces/PData/pages/367398441/Minimum+Event+Spec+-+Smart+Links
export type AnalyticsAction =
  | 'resolved'
  | 'unresolved'
  | 'connectSucceeded'
  | 'connectFailed'
  | 'connected'
  | 'clicked'
  | 'closed';

export type AnalyticsActionSubject =
  | 'smartLink'
  | 'applicationAccount'
  | 'button'
  | 'consentModal';

export type AnalyticsPayload = GasPayload & {
  action?: AnalyticsAction;
  actionSubject: AnalyticsActionSubject;
};

export type AnalyticsHandler = (event: AnalyticsPayload) => void;
