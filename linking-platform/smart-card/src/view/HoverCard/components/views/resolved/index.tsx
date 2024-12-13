import React, { useCallback, useEffect, useMemo, useRef } from 'react';

import { type JsonLd } from 'json-ld-types';

import { fg } from '@atlaskit/platform-feature-flags';

import { useAnalyticsEvents } from '../../../../../common/analytics/generated/use-analytics-events';
import {
	CardDisplay,
	SmartLinkPosition,
	SmartLinkSize,
	SmartLinkStatus,
} from '../../../../../constants';
import { succeedUfoExperience } from '../../../../../state/analytics';
import { getCanBeDatasource, getDefinitionId } from '../../../../../state/helpers';
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

import { hiddenSnippetStyles, metadataBlockCss } from './styled';
import { type HoverCardResolvedProps } from './types';

const HoverCardResolvedView = ({
	analytics,
	cardState,
	extensionKey,
	flexibleCardProps,
	isAISummaryEnabled,
	onActionClick,
	titleBlockProps,
	id,
}: HoverCardResolvedProps) => {
	const { fireEvent } = useAnalyticsEvents();
	const definitionId = React.useMemo(() => getDefinitionId(cardState.details), [cardState.details]);
	const canBeDatasource = React.useMemo(
		() => getCanBeDatasource(cardState.details),
		[cardState.details],
	);

	useEffect(() => {
		// Since this hover view is only rendered on resolved status,
		// there is no need to check for statuses.
		if (fg('platform-smart-card-migrate-embed-modal-analytics')) {
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
		} else {
			analytics.ui.renderSuccessEvent({
				display: CardDisplay.HoverCardPreview,
				status: cardState.status,
				canBeDatasource,
			});
		}
	}, [analytics.ui, cardState.status, canBeDatasource, fireEvent, definitionId, extensionKey, id]);

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
		data: data,
		fallbackElementHeight: snippetHeight.current,
	});
	const snippet = imagePreview ? null : <SnippetBlock status={SmartLinkStatus.Resolved} />;
	const aiSummaryMinHeight = snippet ? snippetHeight.current : 0;

	return (
		<FlexibleCard {...flexibleCardProps}>
			{imagePreview}
			<TitleBlock {...titleBlockProps} metadataPosition={SmartLinkPosition.Top} />
			<MetadataBlock
				primary={primary}
				secondary={secondary}
				overrideCss={metadataBlockCss}
				maxLines={1}
				size={SmartLinkSize.Medium}
			/>
			{isAISummaryEnabled ? (
				<AISummaryBlock
					aiSummaryMinHeight={aiSummaryMinHeight}
					placeholder={snippet}
					status={SmartLinkStatus.Resolved}
				/>
			) : (
				snippet
			)}
			<SnippetBlock
				testId="hidden-snippet"
				onRender={onSnippetRender}
				blockRef={snippetBlockRef}
				overrideCss={hiddenSnippetStyles}
			/>
			<ActionBlock onClick={onActionClick} spaceInline="space.100" />
			<AIFooterBlock />
		</FlexibleCard>
	);
};

export default HoverCardResolvedView;
