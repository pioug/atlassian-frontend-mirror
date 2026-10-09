import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';
import type { PositiveSpaceToken as Space } from '@atlaskit/primitives/compiled/components/types';

import type { SmartLinkSize } from '../../../../../../constants';
import type { ActionProps } from '../types';

export type ActionStackItemProps = ActionProps & {
	hideTooltipOnMouseDown?: boolean;
	size: SmartLinkSize;
	space?: Space;
	tooltipOnHide?: (analyticsEvent: UIAnalyticsEvent) => any;
};
