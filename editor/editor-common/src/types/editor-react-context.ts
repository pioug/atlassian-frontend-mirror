import type { IntlShape } from 'react-intl';

import type { UIAnalyticsEventHandler } from '@atlaskit/analytics-next/UIAnalyticsEvent';

export type EditorReactContext = {
	getAtlaskitAnalyticsEventHandlers: () => UIAnalyticsEventHandler[];
	intl: IntlShape;
};
