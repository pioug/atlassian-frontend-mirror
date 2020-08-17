import { InjectedIntl } from 'react-intl';
import { UIAnalyticsEventHandler } from '@atlaskit/analytics-next';

export type EditorReactContext = {
  getAtlaskitAnalyticsEventHandlers: () => UIAnalyticsEventHandler[];
  intl: InjectedIntl;
};
