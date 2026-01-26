import React, { useCallback, useState } from 'react';

import { useIntl } from 'react-intl-next';

import { syncBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { SyncBlockLabelSharedCssClassName } from '@atlaskit/editor-common/sync-block';
import BlockSyncedIcon from '@atlaskit/icon-lab/core/block-synced';
import { fg } from '@atlaskit/platform-feature-flags';
import { Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';
import VisuallyHidden from '@atlaskit/visually-hidden';

import { formatElapsedTime } from './utils/time';

const SyncBlockLabelDataId = 'sync-block-label';

type SyncBlockLabelProps = {
	contentUpdatedAt?: string;
	isSource: boolean;
	localId: string;
	title?: string;
};

const SyncBlockLabelComponent = ({
	contentUpdatedAt,
	isSource,
	localId,
	title,
}: SyncBlockLabelProps): React.JSX.Element => {
	const intl = useIntl();
	const { formatMessage } = intl;

	const [tooltipContent, setTooltipContent] = useState<string | React.JSX.Element>(
		formatMessage(messages.defaultSyncBlockTooltip),
	);

	let tooltipMessage: string = formatMessage(messages.defaultSyncBlockTooltip);
	if (isSource && !fg('platform_synced_block_dogfooding')) {
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
	const LabelComponent = () => (
		<>
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
		</>
	);

	const LabelWithTooltip = () => (
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
			<LabelComponent />
		</Tooltip>
	);

	return fg('platform_synced_block_dogfooding') ? (
		isSource ? (
			<LabelComponent />
		) : (
			<LabelWithTooltip />
		)
	) : (
		<LabelWithTooltip />
	);
};

export const SyncBlockLabel = React.memo(SyncBlockLabelComponent);
