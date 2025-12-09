import React from 'react';

import { useIntl } from 'react-intl-next';

import { syncBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { SyncBlockLabelSharedCssClassName } from '@atlaskit/editor-common/sync-block';
import { ConfluenceIcon } from '@atlaskit/logo';
import { Text } from '@atlaskit/primitives/compiled';
import Tooltip from '@atlaskit/tooltip';
import VisuallyHidden from '@atlaskit/visually-hidden';

const SyncBlockLabelDataId = 'sync-block-label';

type SyncBlockLabelProps = {
	isSource: boolean;
	localId: string;
	useFetchSyncBlockTitle?: () => string | undefined;
};

const SyncBlockLabelComponent = ({
	isSource,
	useFetchSyncBlockTitle,
	localId,
}: SyncBlockLabelProps): React.JSX.Element => {
	const { formatMessage } = useIntl();
	const title = useFetchSyncBlockTitle?.();

	const tooltipContent = isSource
		? formatMessage(messages.sourceSyncBlockTooltip)
		: title
			? formatMessage(messages.referenceSyncBlockTooltip, { title })
			: formatMessage(messages.defaultSyncBlockTooltip);

	const ariaDescribedById = `sync-block-label-description-${localId}`;
	return (
		<Tooltip
			position="top"
			content={tooltipContent}
			// workaround because tooltip adds aria-describedby with a new id every time the tooltip is opened
			// this causes an infinite rerender loop because of the forwardRef from the node view we are inside in bodiedSyncBlock
			// tooltip content is available for screen readers in visually hidden content after the label
			isScreenReaderAnnouncementDisabled
		>
			<div
				data-testid={SyncBlockLabelDataId}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
				className={SyncBlockLabelSharedCssClassName.labelClassName}
				aria-describedby={ariaDescribedById}
			>
				<ConfluenceIcon size="xsmall" appearance="neutral" shouldUseNewLogoDesign />
				{isSource || !title ? (
					<Text size="small">{formatMessage(messages.syncedBlockLabel)}</Text>
				) : (
					<Text maxLines={1} size="small">
						{title}
					</Text>
				)}
			</div>
			<VisuallyHidden id={ariaDescribedById}>{tooltipContent}</VisuallyHidden>
		</Tooltip>
	);
};

export const SyncBlockLabel = React.memo(SyncBlockLabelComponent);
