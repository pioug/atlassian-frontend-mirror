/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useEffect, useMemo, useState } from 'react';

import { css, jsx } from '@compiled/react';

import { browser } from '@atlaskit/linking-common/user-agent';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { ActionName, ElementName, SmartLinkPosition, SmartLinkStatus } from '../../../constants';
import FlexibleCard from '../../FlexibleCard';
import {
	FooterBlock,
	MetadataBlock,
	PreviewBlock,
	SnippetBlock,
	TitleBlock,
} from '../../FlexibleCard/components/blocks';
import type { ActionItem } from '../../FlexibleCard/components/blocks/types';

import { type FlexibleBlockCardProps } from './types';
import {
	FlexibleCardUiOptions,
	FlexibleCardUiOptionsOld,
	getSimulatedBetterMetadata,
	PreviewBlockOptions,
	titleBlockOptions,
} from './utils';
import { withFlexibleUIBlockCardStyle } from './utils/withFlexibleUIBlockCardStyle';

const titleBlockCss = css({
	gap: token('space.100'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	"[data-smart-element='Title']": {
		fontWeight: token('font.weight.semibold'),
		color: token('color.link'),
	},
});

const footerBlockCss = css({
	height: '1.5rem',
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'flex-end',
	alignSelf: 'stretch',
});

const footerBlockSafariStyles = css({
	height: '100%',
});

/**
 * This view represents a Block card that has an 'Resolved' status.
 * @see SmartLinkStatus
 * @see FlexibleCardProps
 */
const ResolvedView = ({
	cardState,
	onClick,
	onError,
	onResolve,
	actionOptions,
	testId = 'smart-block-resolved-view',
	url,
	CompetitorPrompt,
	hideIconLoadingSkeleton,
}: FlexibleBlockCardProps) => {
	const [isPreviewBlockErrored, setIsPreviewBlockErrored] = useState<boolean>(false);

	const { safari = false } = fg('platform-linking-visual-refresh-v2')
		? // eslint-disable-next-line react-hooks/rules-of-hooks
			useMemo(() => browser(), [])
		: {};

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

	const status = cardState.status as SmartLinkStatus;

	const uiOptions = fg('platform-linking-flexible-card-context')
		? FlexibleCardUiOptions
		: FlexibleCardUiOptionsOld;
	if (fg('cc-ai-linking-platform-snippet-renderer')) {
		uiOptions.enableSnippetRenderer = true;
	}

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
			ui={uiOptions}
			url={url}
		>
			<TitleBlock
				{...titleBlockOptions}
				metadata={titleMetadata}
				subtitle={[{ name: ElementName.Location }]}
				metadataPosition={SmartLinkPosition.Top}
				css={[titleBlockCss]}
				{...(fg('platform-linking-flexible-card-context') ? undefined : { status })}
				CompetitorPrompt={CompetitorPrompt}
				url={url}
				hideIconLoadingSkeleton={hideIconLoadingSkeleton}
			/>
			<MetadataBlock
				primary={topMetadata}
				maxLines={1}
				{...(fg('platform-linking-flexible-card-context')
					? undefined
					: { status: SmartLinkStatus.Resolved })}
			/>
			<SnippetBlock />
			<MetadataBlock
				primary={bottomMetadata}
				maxLines={1}
				{...(fg('platform-linking-flexible-card-context')
					? undefined
					: { status: SmartLinkStatus.Resolved })}
			/>
			{!isPreviewBlockErrored ? (
				<PreviewBlock
					{...PreviewBlockOptions}
					onError={() => {
						setIsPreviewBlockErrored(true);
					}}
					{...(fg('platform-linking-flexible-card-context')
						? undefined
						: { status: SmartLinkStatus.Resolved })}
				/>
			) : null}
			<FooterBlock
				css={[
					footerBlockCss,
					safari && fg('platform-linking-visual-refresh-v2') && footerBlockSafariStyles,
				]}
				actions={footerActions}
				{...(fg('platform-linking-flexible-card-context')
					? undefined
					: { status: SmartLinkStatus.Resolved })}
			/>
		</FlexibleCard>
	);
};

export default withFlexibleUIBlockCardStyle(ResolvedView);
