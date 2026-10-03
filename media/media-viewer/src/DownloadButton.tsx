import React, { useCallback } from 'react';

import { useIntl } from 'react-intl';

import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';
import { useAnalyticsEvents } from '@atlaskit/analytics-next/useAnalyticsEvents';
import DownloadIcon from '@atlaskit/icon/core/download';
import MediaButton from '@atlaskit/media-ui/MediaButton';
import { messages } from '@atlaskit/media-ui/messages';
import Tooltip from '@atlaskit/tooltip/Tooltip';

import { fireAnalytics } from './analytics/fireAnalytics';
import type { DownloadButtonProps } from './DownloadButtonProps';
import { useIsInsetViewer } from './insetViewerContext';
import { noop } from './noop';
import { ViewerIconButton } from './viewer-icon-button';

export function DownloadButton({
	analyticspayload,
	onClick: providedOnClick = noop,
	tooltip,
	...rest
}: DownloadButtonProps): any {
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const { formatMessage } = useIntl();
	const isInsetViewer = useIsInsetViewer();
	const onClick = useCallback(
		(event: React.MouseEvent<HTMLElement>, analyticsEvent: UIAnalyticsEvent) => {
			fireAnalytics(analyticspayload, createAnalyticsEvent);
			providedOnClick(event, analyticsEvent);
		},
		[analyticspayload, providedOnClick, createAnalyticsEvent],
	);

	const downloadButton = isInsetViewer ? (
		<ViewerIconButton
			testId={rest.testId}
			isDisabled={rest.isDisabled}
			icon={DownloadIcon}
			label={formatMessage(messages.download)}
			onClick={onClick}
		/>
	) : (
		<MediaButton {...rest} onClick={onClick} />
	);

	return tooltip ? (
		<Tooltip content={tooltip} position="bottom" tag="span">
			{downloadButton}
		</Tooltip>
	) : (
		downloadButton
	);
}
