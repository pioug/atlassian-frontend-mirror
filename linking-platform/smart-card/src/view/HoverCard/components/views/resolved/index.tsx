/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback, useEffect, useMemo, useRef } from 'react';

import { css, jsx } from '@compiled/react';
import { di } from 'react-magnetic-di';

import { type JsonLd } from '@atlaskit/json-ld-types';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { token } from '@atlaskit/tokens';

import { useAnalyticsEvents } from '../../../../../common/analytics/generated/use-analytics-events';
import { CardDisplay, SmartLinkPosition, SmartLinkSize } from '../../../../../constants';
import { succeedUfoExperience } from '../../../../../state/analytics';
import useAISummaryAction from '../../../../../state/hooks/use-ai-summary-action';
import FlexibleCard from '../../../../FlexibleCard';
import {
	ActionBlock,
	AIFooterBlock,
	AISummaryBlock,
	ResolvedHoverCardFooterBlock,
	MetadataBlock,
	SnippetBlock,
	TitleBlock,
} from '../../../../FlexibleCard/components/blocks';
import { RovoSummaryBlock } from '../../../../FlexibleCard/components/blocks/ai-summary-block';
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
	showRovoResolvedView,
	titleBlockProps,
	id,
	url,
}: HoverCardResolvedProps) => {
	di(useAISummaryAction);

	const { fireEvent } = useAnalyticsEvents();

	// We want to fire exposure event only for those cases when user otherwise can see the experiment which would be controlled
	// by all the other condition defined above as a result of what was defined in actionOptions as well as in CardContext.
	const is3PAuthRovoActionsExperimentOn =
		showRovoResolvedView && expValEquals('platform_sl_3p_auth_rovo_action', 'isEnabled', true);

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

	const snippet = imagePreview ? null : <SnippetBlock css={[snippetBlockCss]} />;
	const aiSummaryMinHeight = snippet ? snippetHeight.current : 0;

	return (
		<FlexibleCard {...flexibleCardProps}>
			{imagePreview}
			<TitleBlock
				{...titleBlockProps}
				metadataPosition={SmartLinkPosition.Top}
				css={[titleBlockStyles]}
			/>
			<MetadataBlock
				primary={primary}
				secondary={secondary}
				maxLines={1}
				size={SmartLinkSize.Medium}
			/>
			{is3PAuthRovoActionsExperimentOn ? (
				<RovoSummaryBlock aiSummaryMinHeight={aiSummaryMinHeight} url={url} />
			) : isAISummaryEnabled ? (
				<AISummaryBlock aiSummaryMinHeight={aiSummaryMinHeight} placeholder={snippet} />
			) : (
				snippet
			)}
			<SnippetBlock
				testId="hidden-snippet"
				onRender={onSnippetRender}
				blockRef={snippetBlockRef}
				css={hiddenSnippetStyles}
				isHidden={true}
			/>
			<ActionBlock
				onClick={onActionClick}
				spaceInline="space.100"
				css={[actionBlockCss]}
				is3PAuthRovoActionsExperimentOn={is3PAuthRovoActionsExperimentOn}
			/>
			{is3PAuthRovoActionsExperimentOn ? (
				<ResolvedHoverCardFooterBlock onActionClick={onActionClick} />
			) : (
				<AIFooterBlock />
			)}
		</FlexibleCard>
	);
};

export default HoverCardResolvedView;
