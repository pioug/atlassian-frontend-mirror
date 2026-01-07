/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/* eslint-disable jsdoc/check-tag-names */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { useContext, useState, useRef } from 'react';
import type { ComponentProps } from 'react';
import { Card, EmbedResizeMessageListener } from '@atlaskit/smart-card';
import { CardSSR } from '@atlaskit/smart-card/ssr';
import { SmartCardContext } from '@atlaskit/link-provider';
import type { SmartLinksOptions } from '../../types/smartLinksOptions';

import {
	WidthConsumer,
	UnsupportedBlock,
	MediaSingle as UIMediaSingle,
	WidthContext,
} from '@atlaskit/editor-common/ui';

import type { EventHandlers } from '@atlaskit/editor-common/ui';
import {
	akEditorDefaultLayoutWidth,
	akEditorFullPageNarrowBreakout,
	akEditorFullWidthLayoutWidth,
	DEFAULT_EMBED_CARD_HEIGHT,
	DEFAULT_EMBED_CARD_WIDTH,
} from '@atlaskit/editor-shared-styles';
import type { RichMediaLayout } from '@atlaskit/adf-schema';
import { fg } from '@atlaskit/platform-feature-flags';
import { componentWithCondition } from '@atlaskit/platform-feature-flags-react';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { CardErrorBoundary } from './fallback';

import type { RendererAppearance } from '../../ui/Renderer/types';
import { FullPagePadding } from '../../ui/Renderer/style';
import { getCardClickHandler } from '../utils/getCardClickHandler';
import { AnalyticsContext } from '@atlaskit/analytics-next';
import { usePortal } from '../../ui/Renderer/PortalContext';
import BlockCard from './blockCard';

const embedCardWrapperStyles = css({
	width: '100%',
	height: '100%',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> div': {
		height: '100%',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.loader-wrapper': {
		height: '100%',
	},
	margin: '0 auto',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
const uIMediaSingleLayoutStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	marginLeft: '50%',
	transform: 'translateX(-50%)',
});

type EmbedCardInternalProps = {
	data?: object;
	eventHandlers?: EventHandlers;
	isInsideOfBlockNode?: boolean;
	isInsideOfInlineExtension?: boolean;
	layout: RichMediaLayout;
	onSetLinkTarget?: (url: string) => '_blank' | undefined;
	originalHeight?: number;
	originalWidth?: number;
	portal?: HTMLElement;
	rendererAppearance?: RendererAppearance;
	smartLinks?: SmartLinksOptions;
	url?: string;
	width?: number;
};

function EmbedCardInternal(props: EmbedCardInternalProps) {
	const {
		url,
		data,
		eventHandlers,
		layout,
		width,
		isInsideOfBlockNode,
		rendererAppearance,
		smartLinks,
		isInsideOfInlineExtension,
		onSetLinkTarget,
	} = props;
	const portal = usePortal(props);
	const embedIframeRef = useRef(null);
	const onClick = getCardClickHandler(eventHandlers, url);
	const { actionOptions } = smartLinks || {};

	const platform = 'web';

	const cardProps: Partial<ComponentProps<typeof Card>> = {
		url,
		onClick,
		container: portal,
		platform,
		frameStyle: smartLinks?.frameStyle ?? 'show',
		actionOptions,
		CompetitorPrompt: smartLinks?.CompetitorPrompt,
	};

	const [liveHeight, setLiveHeight] = useState<number | null>(null);
	const [aspectRatio, setAspectRatio] = useState<number>();

	const height = liveHeight || props.originalHeight;

	// We start with height and width defined with default values
	let originalHeight = DEFAULT_EMBED_CARD_HEIGHT;
	let originalWidth: number | undefined = DEFAULT_EMBED_CARD_WIDTH;

	// Then can override height and width with values from ADF if available
	if (props.originalHeight && props.originalWidth) {
		originalHeight = props.originalHeight;
		originalWidth = props.originalWidth;
	}

	// Then we can override it with aspectRatio that is comming from iframely via `resolve()`
	if (aspectRatio) {
		originalHeight = 1;
		originalWidth = aspectRatio;
	}

	// And finally if iframe sends live `height` events we use that as most precise measure.
	const isHeightOnlyMode = !(props.originalHeight && props.originalWidth) || liveHeight;
	if (height && isHeightOnlyMode) {
		originalHeight = height;
		originalWidth = undefined;
	}

	const padding = rendererAppearance === 'full-page' ? FullPagePadding * 2 : 0;

	const [hasPreview, setPreviewAvailableState] = useState(true);

	const cardContext = useContext(SmartCardContext);

	const onResolve = ({ aspectRatio: resolvedAspectRatio }: { aspectRatio?: number }) => {
		const hasPreviewOnResolve = !!(
			cardContext &&
			url &&
			cardContext.extractors.getPreview(url, platform)
		);
		if (!hasPreviewOnResolve) {
			setPreviewAvailableState(false);
		}
		setAspectRatio(resolvedAspectRatio);
	};

	const analyticsData = {
		attributes: {
			location: 'renderer',
		},
		// Below is added for the future implementation of Linking Platform namespaced analytic context
		location: 'renderer',
	};

	return (
		<AnalyticsContext data={analyticsData}>
			<WidthConsumer>
				{({ width: documentWidth }) => {
					const isFullWidth = rendererAppearance === 'full-width';
					let containerWidth = documentWidth;
					if (smartLinks?.ssr && !containerWidth) {
						// EDM-8114: When we are rendering on SSR, we have no idea what the width is.
						containerWidth = isFullWidth
							? akEditorFullWidthLayoutWidth
							: akEditorDefaultLayoutWidth;
					}

					let nonFullWidthSize = containerWidth;
					if (!isInsideOfBlockNode && rendererAppearance !== 'comment') {
						const isContainerSizeGreaterThanMaxFullPageWidth =
							containerWidth - padding >= akEditorDefaultLayoutWidth;

						if (isContainerSizeGreaterThanMaxFullPageWidth) {
							nonFullWidthSize = akEditorDefaultLayoutWidth;
						} else {
							nonFullWidthSize = containerWidth - padding;
						}
					}

					const lineLength = isFullWidth
						? Math.min(akEditorFullWidthLayoutWidth, containerWidth - padding)
						: nonFullWidthSize;

					const uiMediaSingleStyles =
						layout === 'full-width' || layout === 'wide' ? uIMediaSingleLayoutStyles : '';

					const onError = ({ err }: { err?: Error }) => {
						if (err) {
							throw err;
						}
					};

					let cardComponent;
					if (
						smartLinks?.ssr &&
						url &&
						(fg('platform_ssr_smartlink_embeds') || fg('jfp-magma-ssr-iv-editor-links'))
					) {
						const ssrCardProps = {
							url,
							onClick,
							container: portal,
							platform: platform as 'web' | 'mobile',
							frameStyle: smartLinks?.frameStyle ?? 'show',
							actionOptions,
						};

						cardComponent = (
							<CardSSR
								appearance="embed"
								// Ignored via go/ees005
								// eslint-disable-next-line react/jsx-props-no-spreading
								{...ssrCardProps}
								onResolve={onResolve}
								inheritDimensions={true}
								embedIframeRef={embedIframeRef}
								onError={onError}
							/>
						);
					} else {
						cardComponent = (
							<Card
								appearance="embed"
								// Ignored via go/ees005
								// eslint-disable-next-line react/jsx-props-no-spreading
								{...cardProps}
								onResolve={onResolve}
								inheritDimensions={true}
								embedIframeRef={embedIframeRef}
								onError={onError}
							/>
						);
					}

					return (
						// Ignored via go/ees005
						<CardErrorBoundary
							unsupportedComponent={UnsupportedBlock}
							onSetLinkTarget={onSetLinkTarget}
							// eslint-disable-next-line react/jsx-props-no-spreading
							{...cardProps}
						>
							<EmbedResizeMessageListener
								embedIframeRef={embedIframeRef}
								onHeightUpdate={setLiveHeight}
							>
								<UIMediaSingle
									css={uiMediaSingleStyles}
									layout={layout}
									width={originalWidth}
									containerWidth={containerWidth}
									pctWidth={width}
									height={originalHeight}
									fullWidthMode={isFullWidth}
									nodeType="embedCard"
									lineLength={isInsideOfBlockNode ? containerWidth : lineLength}
									hasFallbackContainer={hasPreview}
									isInsideOfInlineExtension={isInsideOfInlineExtension}
								>
									<div css={embedCardWrapperStyles}>
										<div
											// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
											className="embedCardView-content-wrap"
											data-embed-card
											data-layout={layout}
											data-width={width}
											data-card-data={data ? JSON.stringify(data) : undefined}
											data-card-url={url}
											data-card-original-height={originalHeight}
										>
											{cardComponent}
										</div>
									</div>
								</UIMediaSingle>
							</EmbedResizeMessageListener>
						</CardErrorBoundary>
					);
				}}
			</WidthConsumer>
		</AnalyticsContext>
	);
}

export const EmbedOrBlockCardInternal = ({
	url,
	data,
	eventHandlers,
	portal,
	originalHeight,
	originalWidth,
	width: embedWidth,
	layout,
	rendererAppearance,
	isInsideOfBlockNode,
	smartLinks,
	isInsideOfInlineExtension,
	onSetLinkTarget,
}: EmbedCardInternalProps) => {
	const { width } = useContext(WidthContext);
	const viewAsBlockCard = width && width <= akEditorFullPageNarrowBreakout;

	return viewAsBlockCard ? (
		<BlockCard
			url={url}
			data={data}
			eventHandlers={eventHandlers}
			portal={portal}
			layout={layout}
			rendererAppearance={rendererAppearance}
			smartLinks={smartLinks}
			onSetLinkTarget={onSetLinkTarget}
		/>
	) : (
		<EmbedCardInternal
			url={url}
			data={data}
			eventHandlers={eventHandlers}
			portal={portal}
			originalHeight={originalHeight}
			originalWidth={originalWidth}
			width={embedWidth}
			layout={layout}
			rendererAppearance={rendererAppearance}
			isInsideOfBlockNode={isInsideOfBlockNode}
			smartLinks={smartLinks}
			isInsideOfInlineExtension={isInsideOfInlineExtension}
			onSetLinkTarget={onSetLinkTarget}
		/>
	);
};

const EmbedCardWithCondition = componentWithCondition(
	() =>
		editorExperiment('platform_editor_preview_panel_responsiveness', true, {
			exposure: true,
		}),
	EmbedOrBlockCardInternal,
	EmbedCardInternal,
);

export default EmbedCardWithCondition;
