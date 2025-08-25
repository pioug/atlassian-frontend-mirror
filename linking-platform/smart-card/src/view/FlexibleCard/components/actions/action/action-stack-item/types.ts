import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import type { Space } from '@atlaskit/primitives/compiled';

import type { SmartLinkSize } from '../../../../../../constants';
import type { ActionProps } from '../types';

export type ActionStackItemProps = ActionProps & {
	hideTooltipOnMouseDown?: boolean;
	size: SmartLinkSize;
	space?: Space;
	tooltipOnHide?: (analyticsEvent: UIAnalyticsEvent) => any;
};
