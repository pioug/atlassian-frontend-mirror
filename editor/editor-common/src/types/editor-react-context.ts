import type { IntlShape } from 'react-intl';

import type { UIAnalyticsEventHandler } from '@atlaskit/analytics-next';

export type EditorReactContext = {
	getAtlaskitAnalyticsEventHandlers: () => UIAnalyticsEventHandler[];
	intl: IntlShape;
};
