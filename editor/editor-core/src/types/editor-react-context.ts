import { IntlShape } from 'react-intl-next';
import { UIAnalyticsEventHandler } from '@atlaskit/analytics-next';

export type EditorReactContext = {
  getAtlaskitAnalyticsEventHandlers: () => UIAnalyticsEventHandler[];
  intl: IntlShape;
};
