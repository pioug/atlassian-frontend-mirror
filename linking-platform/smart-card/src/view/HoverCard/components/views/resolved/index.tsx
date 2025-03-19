/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback, useEffect, useMemo, useRef } from 'react';

import { css, jsx } from '@compiled/react';
import { type JsonLd } from 'json-ld-types';

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

const metadataBlockCssOld = css({
	gap: '0px',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'[data-smart-element-group]:nth-of-type(1)': {
		flexGrow: 7,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-separator] + [data-separator]::before': {
			marginRight: token('space.100', '0.5rem'),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'> span': {
			marginRight: token('space.100', '0.5rem'),
		},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'[data-smart-element-group]:nth-of-type(2)': {
		flexGrow: 3,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'> span': {
			marginLeft: token('space.100', '0.5rem'),
		},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-smart-element-group]': {
		font: token('font.body.small'),
	},
});

/**
 * Moved from HoverCardContent.tsx due to CompiledCSS migration.
 */
const titleBlockStyleOld = css({
	gap: token('space.100'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-separator] + [data-separator]::before': {
		marginRight: token('space.100'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-smart-element-group]': {
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
		gap: '0.06rem',
		display: 'flex',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'> [data-smart-element-group]': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'> span': {
				marginRight: token('space.100'),
			},
		},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	"[data-smart-element='Title']": {
		fontWeight: token('font.weight.semibold'),
	},
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
		data: data,
		fallbackElementHeight: snippetHeight.current,
	});
	const snippet = imagePreview ? null : (
		<SnippetBlock
			status={SmartLinkStatus.Resolved}
			css={[fg('platform-linking-visual-refresh-v1') && snippetBlockCss]}
		/>
	);
	const aiSummaryMinHeight = snippet ? snippetHeight.current : 0;

	return (
		<FlexibleCard {...flexibleCardProps}>
			{imagePreview}
			<TitleBlock
				{...titleBlockProps}
				metadataPosition={SmartLinkPosition.Top}
				status={SmartLinkStatus.Resolved}
				css={[fg('platform-linking-visual-refresh-v1') ? titleBlockStyles : titleBlockStyleOld]}
			/>
			<MetadataBlock
				primary={primary}
				secondary={secondary}
				css={[!fg('platform-linking-visual-refresh-v1') && metadataBlockCssOld]}
				maxLines={1}
				size={SmartLinkSize.Medium}
				status={SmartLinkStatus.Resolved}
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
				css={hiddenSnippetStyles}
				status={SmartLinkStatus.Resolved}
			/>
			<ActionBlock
				onClick={onActionClick}
				spaceInline="space.100"
				css={[fg('platform-linking-visual-refresh-v1') && actionBlockCss]}
			/>
			<AIFooterBlock />
		</FlexibleCard>
	);
};

export default HoverCardResolvedView;
