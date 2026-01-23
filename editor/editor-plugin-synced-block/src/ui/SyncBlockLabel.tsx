import React, { useCallback, useState } from 'react';

import isYesterday from 'date-fns/isYesterday';
import { useIntl, type IntlShape } from 'react-intl-next';

import { syncBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { SyncBlockLabelSharedCssClassName } from '@atlaskit/editor-common/sync-block';
import BlockSyncedIcon from '@atlaskit/icon-lab/core/block-synced';
import { fg } from '@atlaskit/platform-feature-flags';
import { Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';
import VisuallyHidden from '@atlaskit/visually-hidden';

const SyncBlockLabelDataId = 'sync-block-label';

const SECONDS_IN_MINUTE = 60;
const SECONDS_IN_HOUR = SECONDS_IN_MINUTE * 60;
const SECONDS_IN_DAY = SECONDS_IN_HOUR * 24;
const SECONDS_IN_WEEK = SECONDS_IN_DAY * 7;
const SECONDS_IN_MONTH = SECONDS_IN_DAY * 30;
const SECONDS_IN_YEAR = SECONDS_IN_DAY * 365;

export const formatElapsedTime = (isoDate: string, intl: IntlShape): string => {
	const now = Date.now();
	const date = new Date(isoDate).getTime();
	const diffInSeconds = Math.floor((now - date) / 1000);
	const dateObj = new Date(isoDate);

	// Show "yesterday" when timestamp is from the previous calendar day
	if (isYesterday(dateObj) && diffInSeconds >= SECONDS_IN_DAY) {
		return intl.formatRelativeTime(-1, 'day', { numeric: 'auto', style: 'long' });
	}

	if (diffInSeconds < SECONDS_IN_MINUTE) {
		return intl.formatRelativeTime(-Math.max(diffInSeconds, 1), 'second', { style: 'long' });
	} else if (diffInSeconds < SECONDS_IN_HOUR) {
		const minutes = Math.floor(diffInSeconds / SECONDS_IN_MINUTE);
		return intl.formatRelativeTime(-minutes, 'minute', { style: 'long' });
	} else if (diffInSeconds < SECONDS_IN_DAY) {
		const hours = Math.floor(diffInSeconds / SECONDS_IN_HOUR);
		return intl.formatRelativeTime(-hours, 'hour', { style: 'long' });
	} else if (diffInSeconds < SECONDS_IN_WEEK) {
		const days = Math.floor(diffInSeconds / SECONDS_IN_DAY);
		return intl.formatRelativeTime(-days, 'day', { style: 'long' });
	} else if (diffInSeconds < SECONDS_IN_MONTH) {
		const weeks = Math.floor(diffInSeconds / SECONDS_IN_WEEK);
		return intl.formatRelativeTime(-weeks, 'week', { style: 'long' });
	} else if (diffInSeconds < SECONDS_IN_YEAR) {
		const months = Math.floor(diffInSeconds / SECONDS_IN_MONTH);
		return intl.formatRelativeTime(-months, 'month', { style: 'long' });
	} else {
		const years = Math.floor(diffInSeconds / SECONDS_IN_YEAR);
		return intl.formatRelativeTime(-years, 'year', { style: 'long' });
	}
};

type SyncBlockLabelProps = {
	contentUpdatedAt?: string;
	isSource: boolean;
	localId: string;
	useFetchSyncBlockTitle?: () => string | undefined;
};

const SyncBlockLabelComponent = ({
	isSource,
	useFetchSyncBlockTitle,
	localId,
	contentUpdatedAt,
}: SyncBlockLabelProps): React.JSX.Element => {
	const intl = useIntl();
	const { formatMessage } = intl;
	const title = useFetchSyncBlockTitle?.();

	const [tooltipContent, setTooltipContent] = useState<string | React.JSX.Element>(
		formatMessage(messages.defaultSyncBlockTooltip),
	);

	let tooltipMessage: string = formatMessage(messages.defaultSyncBlockTooltip);
	if (isSource) {
		tooltipMessage = formatMessage(messages.sourceSyncBlockTooltip);
	} else if (title) {
		tooltipMessage = formatMessage(messages.referenceSyncBlockTooltip, { title });
	}

	const updateTooltipContent = useCallback(() => {
		if (!fg('platform_synced_block_dogfooding')) {
			return;
		}

		let tooltipContent: string | React.JSX.Element = tooltipMessage;

		if (contentUpdatedAt) {
			const elapsedTime = formatElapsedTime(contentUpdatedAt, intl);
			tooltipContent = (
				<div>
					<Text size="small" color="color.text.inverse">
						{tooltipMessage}
					</Text>
					<br />
					<br />
					<Text size="small" color="color.text.inverse" weight="bold">
						{formatMessage(messages.referenceSyncBlockLastEdited)}
					</Text>
					<Text size="small" color="color.text.inverse">
						{elapsedTime}
					</Text>
				</div>
			);
		}
		setTooltipContent(tooltipContent);
	}, [contentUpdatedAt, formatMessage, intl, tooltipMessage]);

	const ariaDescribedById = `sync-block-label-description-${localId}`;
	return (
		<Tooltip
			position="top"
			content={fg('platform_synced_block_dogfooding') ? tooltipContent : tooltipMessage}
			// workaround because tooltip adds aria-describedby with a new id every time the tooltip is opened
			// this causes an infinite rerender loop because of the forwardRef from the node view we are inside in bodiedSyncBlock
			// tooltip content is available for screen readers in visually hidden content after the label
			isScreenReaderAnnouncementDisabled
			// using this to ensure that the 'last edited' time is updated when the tooltip is opened
			onShow={updateTooltipContent}
		>
			<div
				data-testid={SyncBlockLabelDataId}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
				className={SyncBlockLabelSharedCssClassName.labelClassName}
				aria-describedby={ariaDescribedById}
			>
				<BlockSyncedIcon color={token('color.icon.subtle')} size="small" label="" />
				{isSource || !title ? (
					<Text size="small" color="color.text.subtle">
						{formatMessage(messages.syncedBlockLabel)}
					</Text>
				) : (
					<Text maxLines={1} size="small" color="color.text.subtle">
						{title}
					</Text>
				)}
			</div>
			<VisuallyHidden id={ariaDescribedById}>{tooltipContent}</VisuallyHidden>
		</Tooltip>
	);
};

export const SyncBlockLabel = React.memo(SyncBlockLabelComponent);
