import React, { useCallback } from 'react';

import { useIntl } from 'react-intl';

import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';
import { useAnalyticsEvents } from '@atlaskit/analytics-next/useAnalyticsEvents';
import Button from '@atlaskit/button/default/button';
import DownloadIcon from '@atlaskit/icon/core/download';
import MediaButton from '@atlaskit/media-ui/MediaButton';
import { messages } from '@atlaskit/media-ui/messages';
import Tooltip from '@atlaskit/tooltip/Tooltip';

import { fireAnalytics } from './analytics/fireAnalytics';
import type { DownloadButtonProps } from './DownloadButtonProps';
import { noop } from './noop';
import { ViewerIconButton } from './viewer-icon-button';

export function DownloadButton({
	analyticspayload,
	onClick: providedOnClick = noop,
	tooltip,
	variant = 'default',
	...rest
}: DownloadButtonProps): any {
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const { formatMessage } = useIntl();
	const onClick = useCallback(
		(event: React.MouseEvent<HTMLElement>, analyticsEvent: UIAnalyticsEvent) => {
			fireAnalytics(analyticspayload, createAnalyticsEvent);
			providedOnClick(event, analyticsEvent);
		},
		[analyticspayload, providedOnClick, createAnalyticsEvent],
	);

	const downloadButton =
		variant === 'insetIcon' ? (
			<ViewerIconButton
				testId={rest.testId}
				isDisabled={rest.isDisabled}
				icon={DownloadIcon}
				label={formatMessage(messages.download)}
				onClick={onClick}
			/>
		) : variant === 'insetText' ? (
			// The themed button used elsewhere in the inset viewer for non-icons
			<Button
				appearance="primary"
				testId={rest.testId}
				isDisabled={rest.isDisabled}
				onClick={onClick}
			>
				{rest.children}
			</Button>
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
