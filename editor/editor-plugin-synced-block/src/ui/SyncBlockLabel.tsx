import React, { useCallback, useMemo, useState } from 'react';

import { cssMap } from '@compiled/react';
import { useIntl } from 'react-intl';

import { syncBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { SyncBlockLabelSharedCssClassName } from '@atlaskit/editor-common/sync-block';
import BlockSyncedIcon from '@atlaskit/icon-lab/core/block-synced';
import { Box, Text } from '@atlaskit/primitives/compiled';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip/Tooltip';
import VisuallyHidden from '@atlaskit/visually-hidden/visually-hidden';

import type { UnpublishedSourceType } from './getUnpublishedSourceType';
import { formatElapsedTime } from './utils/time';

const SyncBlockLabelDataId = 'sync-block-label';

const styles = cssMap({
	// Both label parts are direct flex children of the label chrome so they align with the sync icon.
	// The leading text is the only shrinkable item, so it absorbs the truncation.
	truncatedLabelText: {
		font: token('font.body.small'),
		color: token('color.text.subtle'),
		minWidth: '0px',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
	},
	unpublishedSuffix: {
		font: token('font.body.small'),
		color: token('color.text.subtle'),
		flexShrink: 0,
		whiteSpace: 'nowrap',
	},
});

export type UnpublishedLabelInfo = Readonly<{
	sourceType: UnpublishedSourceType;
	variant: 'local-reference' | 'source';
}>;

type SyncBlockLabelProps = {
	contentUpdatedAt?: string;
	isSource: boolean;
	isUnsyncedBlock?: boolean;
	localId: string;
	title?: string;
	unpublishedInfo?: UnpublishedLabelInfo;
};

const SyncBlockLabelComponent = ({
	contentUpdatedAt,
	isSource,
	localId,
	title,
	isUnsyncedBlock,
	unpublishedInfo,
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
					{title ? (
						<>
							<Text size="small" color="color.text.inverse" weight="bold">
								{formatMessage(messages.referenceSyncBlockSyncedFrom)}
							</Text>
							<Text size="small" color="color.text.inverse">
								{' '}
								{title}
							</Text>
						</>
					) : (
						<Text size="small" color="color.text.inverse">
							{tooltipMessage}
						</Text>
					)}
					<br />
					<br />
					<Text size="small" color="color.text.inverse" weight="bold">
						{formatMessage(messages.referenceSyncBlockLastEdited)}
					</Text>
					<Text size="small" color="color.text.inverse">
						{' '}
						{elapsedTime}
					</Text>
				</div>
			);
		}
		setTooltipContent(tooltipContent);
	}, [contentUpdatedAt, formatMessage, intl, title, tooltipMessage]);

	const ariaDescribedById = `sync-block-label-description-${localId}`;
	const unpublishedParenthetical = unpublishedInfo
		? formatMessage(messages.unpublishedInParentheses)
		: undefined;

	const getLabelContent = useMemo(() => {
		// The parenthetical carries a leading space so the accessible name and copied text read as
		// "… (unpublished)". Flex trims it visually, and the label's own gap provides the spacing.
		const renderUnpublishedLabel = (label: string) => (
			<>
				<Box as="span" xcss={styles.truncatedLabelText}>
					{label}
				</Box>
				<Box as="span" xcss={styles.unpublishedSuffix}>
					{` ${unpublishedParenthetical}`}
				</Box>
			</>
		);
		const renderPlainLabel = (label: string) =>
			unpublishedParenthetical ? (
				renderUnpublishedLabel(label)
			) : (
				<Text size="small" color="color.text.subtle">
					{label}
				</Text>
			);
		const renderTruncatingTitle = (label: string) =>
			unpublishedParenthetical ? (
				renderUnpublishedLabel(label)
			) : (
				<Text maxLines={1} size="small" color="color.text.subtle">
					{label}
				</Text>
			);

		if (isUnsyncedBlock) {
			return renderPlainLabel(formatMessage(messages.unsyncedBlockLabel));
		}
		if (isSource) {
			return renderPlainLabel(
				formatMessage(
					expValEquals('platform_editor_sync_block_activation', 'isEnabled', true)
						? messages.sourceSyncedBlockLabel
						: messages.syncedBlockLabel,
				),
			);
		}
		if (!title) {
			return renderPlainLabel(formatMessage(messages.syncedBlockLabel));
		}
		return renderTruncatingTitle(title);
	}, [formatMessage, isSource, isUnsyncedBlock, title, unpublishedParenthetical]);

	const unpublishedTooltipLabel = unpublishedInfo
		? formatMessage(
				unpublishedInfo.variant === 'source'
					? messages.unpublishedSourceAvailabilityTooltip
					: messages.unpublishedLocalReferenceAvailabilityTooltip,
				{ sourceType: unpublishedInfo.sourceType },
			)
		: undefined;

	const primaryLabel = (
		<div
			data-testid={SyncBlockLabelDataId}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
			className={SyncBlockLabelSharedCssClassName.labelClassName}
			aria-describedby={isSource || isUnsyncedBlock ? undefined : ariaDescribedById}
		>
			<BlockSyncedIcon color={token('color.icon.subtle')} size="small" label="" />
			{getLabelContent}
		</div>
	);

	const referenceDescription = !isSource && !isUnsyncedBlock && (
		<VisuallyHidden id={ariaDescribedById}>
			{expValEquals('platform_editor_sync_block_activation', 'isEnabled', true)
				? tooltipMessage
				: tooltipContent}
		</VisuallyHidden>
	);

	if (unpublishedTooltipLabel) {
		return (
			<Tooltip position="top" content={unpublishedTooltipLabel}>
				{primaryLabel}
				{referenceDescription}
			</Tooltip>
		);
	}

	if (isSource || isUnsyncedBlock) {
		return primaryLabel;
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
			{primaryLabel}
			{referenceDescription}
		</Tooltip>
	);
};

export const SyncBlockLabel: React.MemoExoticComponent<
	({
		contentUpdatedAt,
		isSource,
		localId,
		title,
		isUnsyncedBlock,
		unpublishedInfo,
	}: SyncBlockLabelProps) => React.JSX.Element
> = React.memo(SyncBlockLabelComponent);
