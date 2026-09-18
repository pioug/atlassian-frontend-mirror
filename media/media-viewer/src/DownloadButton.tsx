import React, { useCallback } from 'react';

import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';
import { useAnalyticsEvents } from '@atlaskit/analytics-next/useAnalyticsEvents';
import MediaButton from '@atlaskit/media-ui/MediaButton';
import Tooltip from '@atlaskit/tooltip/Tooltip';

import { fireAnalytics } from './analytics/fireAnalytics';
import type { DownloadButtonProps } from './DownloadButtonProps';
import { noop } from './noop';

export function DownloadButton({
	analyticspayload,
	onClick: providedOnClick = noop,
	tooltip,
	...rest
}: DownloadButtonProps): any {
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const onClick = useCallback(
		(event: React.MouseEvent<HTMLElement>, analyticsEvent: UIAnalyticsEvent) => {
			fireAnalytics(analyticspayload, createAnalyticsEvent);
			providedOnClick(event, analyticsEvent);
		},
		[analyticspayload, providedOnClick, createAnalyticsEvent],
	);

	const downloadButton = <MediaButton {...rest} onClick={onClick} />;

	return tooltip ? (
		<Tooltip content={tooltip} position="bottom" tag="span">
			{downloadButton}
		</Tooltip>
	) : (
		downloadButton
	);
}
