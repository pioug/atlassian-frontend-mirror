import React, { useCallback, useMemo, useState } from 'react';

import { useIntl } from 'react-intl-next';

import { syncBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { SyncBlockLabelSharedCssClassName } from '@atlaskit/editor-common/sync-block';
import BlockSyncedIcon from '@atlaskit/icon-lab/core/block-synced';
import { Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';
import VisuallyHidden from '@atlaskit/visually-hidden';

import { formatElapsedTime } from './utils/time';

const SyncBlockLabelDataId = 'sync-block-label';

type SyncBlockLabelProps = {
	contentUpdatedAt?: string;
	isSource: boolean;
	isUnsyncedBlock?: boolean;
	localId: string;
	title?: string;
};

const SyncBlockLabelComponent = ({
	contentUpdatedAt,
	isSource,
	localId,
	title,
	isUnsyncedBlock,
}: SyncBlockLabelProps): React.JSX.Element => {
	const intl = useIntl();
	const { formatMessage } = intl;

	const [tooltipContent, setTooltipContent] = useState<string | React.JSX.Element>(
		formatMessage(messages.defaultSyncBlockTooltip),
	);

	let tooltipMessage: string = formatMessage(messages.defaultSyncBlockTooltip);
	if (title) {
		tooltipMessage = formatMessage(messages.referenceSyncBlockTooltip, { title });
	}

	const updateTooltipContent = useCallback(() => {
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

	const getLabelContent = useMemo(() => {
		if (isUnsyncedBlock) {
			return (
				<Text size="small" color="color.text.subtle">
					{formatMessage(messages.unsyncedBlockLabel)}
				</Text>
			);
		}
		if (isSource || !title) {
			return (
				<Text size="small" color="color.text.subtle">
					{formatMessage(messages.syncedBlockLabel)}
				</Text>
			);
		}
		return (
			<Text maxLines={1} size="small" color="color.text.subtle">
				{title}
			</Text>
		);
	}, [formatMessage, isSource, isUnsyncedBlock, title]);

	const label = (
		<div
			data-testid={SyncBlockLabelDataId}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
			className={SyncBlockLabelSharedCssClassName.labelClassName}
			aria-describedby={ariaDescribedById}
		>
			<BlockSyncedIcon color={token('color.icon.subtle')} size="small" label="" />
			{getLabelContent}
		</div>
	);

	if (isSource || isUnsyncedBlock) {
		return label;
	}

	return (
		<Tooltip
			position="top"
			content={tooltipContent}
			// workaround because tooltip adds aria-describedby with a new id every time the tooltip is opened
			// this causes an infinite rerender loop because of the forwardRef from the node view we are inside in bodiedSyncBlock
			// tooltip content is available for screen readers in visually hidden content after the label
			isScreenReaderAnnouncementDisabled
			// using this to ensure that the 'last edited' time is updated when the tooltip is opened
			onShow={updateTooltipContent}
		>
			{label}
			<VisuallyHidden id={ariaDescribedById}>{tooltipContent}</VisuallyHidden>
		</Tooltip>
	);
};

export const SyncBlockLabel = React.memo(SyncBlockLabelComponent);
