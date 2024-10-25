import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import type { Space } from '@atlaskit/primitives';

import type { SmartLinkSize } from '../../../../../../constants';
import type { ActionProps } from '../types';

export type ActionStackItemProps = ActionProps & {
	size: SmartLinkSize;
	space?: Space;
	tooltipOnHide?: (analyticsEvent: UIAnalyticsEvent) => any;
	hideTooltipOnMouseDown?: boolean;
};
