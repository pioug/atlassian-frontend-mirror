import React, { useEffect, useMemo, useState } from 'react';

import { ActionName, ElementName, SmartLinkPosition } from '../../../constants';
import FlexibleCard from '../../FlexibleCard';
import {
	FooterBlock,
	MetadataBlock,
	PreviewBlock,
	SnippetBlock,
	TitleBlock,
} from '../../FlexibleCard/components/blocks';
import type { ActionItem } from '../../FlexibleCard/components/blocks/types';

import { metadataBlockCss } from './styledOld';
import { type FlexibleBlockCardProps } from './types';
import {
	FlexibleCardUiOptions,
	FooterBlockOptionsOld,
	getSimulatedBetterMetadata,
	PreviewBlockOptions,
	titleBlockOptionsOld,
} from './utils';

/**
 * This view represents a Block card that has an 'Resolved' status.
 * @see SmartLinkStatus
 * @see FlexibleCardProps
 */
const ResolvedViewOld = ({
	cardState,
	onClick,
	onError,
	onResolve,
	actionOptions,
	testId = 'smart-block-resolved-view',
	url,
}: FlexibleBlockCardProps) => {
	const [isPreviewBlockErrored, setIsPreviewBlockErrored] = useState<boolean>(false);

	useEffect(() => {
		setIsPreviewBlockErrored(false);
	}, [url, cardState]);

	const { titleMetadata, topMetadata, bottomMetadata } = getSimulatedBetterMetadata(
		cardState.details,
	);

	const footerActions: ActionItem[] = useMemo(
		() => [
			{ name: ActionName.FollowAction, hideIcon: true },
			{ name: ActionName.PreviewAction, hideIcon: true },
			{ name: ActionName.DownloadAction, hideIcon: true },
		],
		[],
	);

	return (
		<FlexibleCard
			appearance="block"
			cardState={cardState}
			onClick={onClick}
			onError={onError}
			onResolve={onResolve}
			origin="smartLinkCard"
			actionOptions={actionOptions}
			testId={testId}
			ui={FlexibleCardUiOptions}
			url={url}
		>
			<TitleBlock
				{...titleBlockOptionsOld}
				metadata={titleMetadata}
				subtitle={[{ name: ElementName.Location }]}
				metadataPosition={SmartLinkPosition.Top}
			/>
			<MetadataBlock primary={topMetadata} maxLines={1} overrideCss={metadataBlockCss} />
			<SnippetBlock />
			<MetadataBlock primary={bottomMetadata} maxLines={1} overrideCss={metadataBlockCss} />
			{!isPreviewBlockErrored ? (
				<PreviewBlock
					{...PreviewBlockOptions}
					onError={() => {
						setIsPreviewBlockErrored(true);
					}}
				/>
			) : null}
			<FooterBlock {...FooterBlockOptionsOld} actions={footerActions} />
		</FlexibleCard>
	);
};

export default ResolvedViewOld;
