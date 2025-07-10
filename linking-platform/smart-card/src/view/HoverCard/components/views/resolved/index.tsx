/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback, useEffect, useMemo, useRef } from 'react';

import { css, jsx } from '@compiled/react';

import { type JsonLd } from '@atlaskit/json-ld-types';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { useAnalyticsEvents } from '../../../../../common/analytics/generated/use-analytics-events';
import {
	CardDisplay,
	SmartLinkPosition,
	SmartLinkSize,
	SmartLinkStatus,
} from '../../../../../constants';
import { succeedUfoExperience } from '../../../../../state/analytics';
import FlexibleCard from '../../../../FlexibleCard';
import {
	ActionBlock,
	AIFooterBlock,
	AISummaryBlock,
	MetadataBlock,
	SnippetBlock,
	TitleBlock,
} from '../../../../FlexibleCard/components/blocks';
import { getMetadata } from '../../../utils';
import ImagePreview from '../../ImagePreview';

import { type HoverCardResolvedProps } from './types';

const hiddenSnippetStyles = css({
	visibility: 'hidden',
	position: 'absolute',
});

const titleBlockStyles = css({
	gap: token('space.100'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	"[data-smart-element='Title']": {
		fontWeight: token('font.weight.semibold'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-smart-element-group]': {
		gap: token('space.0'),
		display: 'flex',
	},
});

const snippetBlockCss = css({
	paddingTop: token('space.050'),
});

const actionBlockCss = css({
	paddingBottom: token('space.050'),
});

const HoverCardResolvedView = ({
	cardState,
	extensionKey,
	flexibleCardProps,
	isAISummaryEnabled,
	onActionClick,
	titleBlockProps,
	id,
}: HoverCardResolvedProps) => {
	const { fireEvent } = useAnalyticsEvents();

	useEffect(() => {
		// Since this hover view is only rendered on resolved status,
		// there is no need to check for statuses.
		succeedUfoExperience('smart-link-rendered', id || 'NULL', {
			extensionKey,
			display: CardDisplay.HoverCardPreview,
		});

		// UFO will disregard this if authentication experience has not yet been started
		succeedUfoExperience('smart-link-authenticated', id || 'NULL', {
			display: CardDisplay.HoverCardPreview,
		});

		fireEvent('ui.smartLink.renderSuccess', {
			display: CardDisplay.HoverCardPreview,
		});
	}, [extensionKey, fireEvent, id]);

	const data = cardState.details?.data as JsonLd.Data.BaseData;

	const { primary, secondary } = useMemo(() => {
		return getMetadata(extensionKey, data);
	}, [data, extensionKey]);

	const snippetHeight = React.useRef<number>(0);
	const snippetBlockRef = useRef<HTMLDivElement>(null);
	const onSnippetRender = useCallback(() => {
		snippetHeight.current = snippetBlockRef.current?.getBoundingClientRect().height ?? 0;
	}, []);

	const imagePreview = ImagePreview({
		fallbackElementHeight: snippetHeight.current,
		response: cardState.details,
	});

	const snippet = imagePreview ? null : (
		<SnippetBlock
			{...(fg('platform-linking-flexible-card-context')
				? undefined
				: { status: SmartLinkStatus.Resolved })}
			css={[snippetBlockCss]}
		/>
	);
	const aiSummaryMinHeight = snippet ? snippetHeight.current : 0;

	return (
		<FlexibleCard {...flexibleCardProps}>
			{imagePreview}
			<TitleBlock
				{...titleBlockProps}
				metadataPosition={SmartLinkPosition.Top}
				{...(fg('platform-linking-flexible-card-context')
					? undefined
					: { status: SmartLinkStatus.Resolved })}
				css={[titleBlockStyles]}
			/>
			<MetadataBlock
				primary={primary}
				secondary={secondary}
				maxLines={1}
				size={SmartLinkSize.Medium}
				{...(fg('platform-linking-flexible-card-context')
					? undefined
					: { status: SmartLinkStatus.Resolved })}
			/>
			{isAISummaryEnabled ? (
				<AISummaryBlock
					aiSummaryMinHeight={aiSummaryMinHeight}
					placeholder={snippet}
					{...(fg('platform-linking-flexible-card-context')
						? undefined
						: { status: SmartLinkStatus.Resolved })}
				/>
			) : (
				snippet
			)}
			<SnippetBlock
				testId="hidden-snippet"
				onRender={onSnippetRender}
				blockRef={snippetBlockRef}
				css={hiddenSnippetStyles}
				{...(fg('platform-linking-flexible-card-context')
					? undefined
					: { status: SmartLinkStatus.Resolved })}
				isHidden={true}
			/>
			<ActionBlock onClick={onActionClick} spaceInline="space.100" css={[actionBlockCss]} />
			<AIFooterBlock />
		</FlexibleCard>
	);
};

export default HoverCardResolvedView;
