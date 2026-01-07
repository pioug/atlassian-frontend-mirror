/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, useState, useMemo } from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { type Mark } from '@atlaskit/editor-prosemirror/model';
import { useSmartCardContext } from '@atlaskit/link-provider';
import { Card, getObjectAri, getObjectIconUrl, getObjectName } from '@atlaskit/smart-card';
import { isWithinPreviewPanelIFrame } from '@atlaskit/linking-common/utils';
import { useSmartLinkActions } from '@atlaskit/smart-card/hooks';
import { CardSSR } from '@atlaskit/smart-card/ssr';
import { HoverLinkOverlay, UnsupportedInline } from '@atlaskit/editor-common/ui';
import type { EventHandlers } from '@atlaskit/editor-common/ui';
import { fg } from '@atlaskit/platform-feature-flags';
import { AnalyticsContext } from '@atlaskit/analytics-next';
import { componentWithCondition } from '@atlaskit/platform-feature-flags-react';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';

import { CardErrorBoundary } from './fallback';
import type { WithSmartCardStorageProps } from '../../ui/SmartCardStorage';
import { withSmartCardStorage } from '../../ui/SmartCardStorage';
import { getCardClickHandler } from '../utils/getCardClickHandler';
import type { SmartLinksOptions } from '../../types/smartLinksOptions';

import {
	useInlineAnnotationProps,
	type MarkDataAttributes,
} from '../../ui/annotations/element/useInlineAnnotationProps';
import { usePortal } from '../../ui/Renderer/PortalContext';
import type { RendererAppearance } from '../../ui/Renderer/types';
import type { AnalyticsEventPayload } from '../../analytics/events';
import { extractSmartLinkEmbed } from '@atlaskit/link-extractors';

type HoverLinkOverlayProps = React.ComponentProps<typeof HoverLinkOverlay>;
export interface InlineCardProps extends MarkDataAttributes {
	data?: object;
	eventHandlers?: EventHandlers;
	fireAnalyticsEvent?: (event: AnalyticsEventPayload) => void;
	marks?: Mark[];
	onSetLinkTarget?: (url: string) => '_blank' | undefined;
	portal?: HTMLElement;
	rendererAppearance?: RendererAppearance;
	smartLinks?: SmartLinksOptions;
	url?: string;
}
const HoverLinkOverlayNoop = (props: OverlayWithCardContextProps) => (
	<Fragment>{props.children}</Fragment>
);

const HoverLinkOverlayWithCondition = componentWithCondition(
	() => editorExperiment('platform_editor_preview_panel_linking_exp', true, { exposure: true }),
	HoverLinkOverlay,
	HoverLinkOverlayNoop,
);

type OverlayWithCardContextProps = HoverLinkOverlayProps & {
	fireAnalyticsEvent?: (event: AnalyticsEventPayload) => void;
	isResolvedViewRendered?: boolean;
	rendererAppearance?: RendererAppearance;
	url: string;
};

const OverlayWithCardContext = ({
	rendererAppearance,
	isResolvedViewRendered,
	url,
	fireAnalyticsEvent,
	children,
}: OverlayWithCardContextProps) => {
	const cardContext = useSmartCardContext();
	// Note: useSmartLinkActions throws without smart card context. Using it here is safe
	// because we checked cardContext availability in the parent component
	const actions = useSmartLinkActions({ url, appearance: 'inline' });
	const preview = useMemo(
		() => actions.find((action) => action.id === 'preview-content'),
		[actions],
	);

	const fireHoverLabelAEP = (previewType: 'panel' | 'modal') => {
		if (fireAnalyticsEvent) {
			const store = cardContext?.value?.store;
			const urlState = store?.getState()[url || ''];

			fireAnalyticsEvent({
				action: ACTION.CLICKED,
				actionSubject: ACTION_SUBJECT.SMART_LINK,
				actionSubjectId: ACTION_SUBJECT_ID.HOVER_LABEL,
				eventType: EVENT_TYPE.UI,
				attributes: {
					previewType,
					destinationProduct: urlState?.details?.meta?.product ?? null,
					destinationSubproduct: urlState?.details?.meta?.subproduct ?? null,
				},
			});
		}
	};

	const cardState = cardContext?.value?.store?.getState()[url || ''];
	const ari = getObjectAri(cardState?.details);
	const name = getObjectName(cardState?.details);
	const iconUrl = getObjectIconUrl(cardState?.details);
	// Get resolved URL from card state, fallback to original URL if not available
	let resolvedUrl = url;
	if (expValEquals('platform_hover_card_preview_panel', 'cohort', 'test')) {
		const cardStateUrl =
			cardState?.details?.data && 'url' in cardState.details.data
				? (cardState.details.data as { url?: string }).url
				: undefined;
		resolvedUrl = cardStateUrl || url;
	}
	const isPanelAvailable = ari && cardContext?.value?.isPreviewPanelAvailable?.({ ari });
	const openPreviewPanel = cardContext?.value?.openPreviewPanel;

	const isPreviewPanelAvailable = Boolean(openPreviewPanel && isPanelAvailable);
	const isPreviewModalAvailable = Boolean(preview);
	const isPreviewAvailable = isPreviewModalAvailable || isPreviewPanelAvailable;
	const showPanelButtonIcon = isPreviewPanelAvailable
		? 'panel'
		: isPreviewModalAvailable
			? 'modal'
			: undefined;

	// When inside preview panel iframe, hide the overlay button
	const isInPreviewPanel =
		expValEquals('platform_hover_card_preview_panel_modal', 'cohort', 'test') &&
		isWithinPreviewPanelIFrame();
	const showPanelButton = isInPreviewPanel ? isPreviewPanelAvailable : isPreviewAvailable;

	const Overlay = isPreviewAvailable ? HoverLinkOverlayWithCondition : HoverLinkOverlayNoop;

	return (
		<Overlay
			isVisible={isResolvedViewRendered}
			url={url}
			compactPadding={rendererAppearance === 'comment'}
			showPanelButton={showPanelButton}
			showPanelButtonIcon={showPanelButtonIcon}
			onClick={(event) => {
				if (isPreviewPanelAvailable) {
					// Prevent anchor default behaviour(click to open the anchor link)
					// When glance panel is available, let openPreviewPanel handle it
					event.preventDefault();
					openPreviewPanel?.({
						url: resolvedUrl || '',
						ari: ari || '',
						name: name || '',
						iconUrl,
						panelData: {
							embedUrl: expValEquals('platform_hover_card_preview_panel', 'cohort', 'test')
								? extractSmartLinkEmbed(cardState?.details)?.src
								: undefined,
						},
					});
					editorExperiment('platform_editor_preview_panel_linking_exp', true, { exposure: true }) &&
						fireHoverLabelAEP('panel');
				} else if (isPreviewModalAvailable) {
					event.preventDefault();
					if (preview) {
						preview.invoke();
					}
					editorExperiment('platform_editor_preview_panel_linking_exp', true, { exposure: true }) &&
						fireHoverLabelAEP('modal');
				}
			}}
		>
			{children}
		</Overlay>
	);
};

const InlineCard = (props: InlineCardProps & WithSmartCardStorageProps) => {
	const {
		url,
		data,
		eventHandlers,
		fireAnalyticsEvent,
		smartLinks,
		rendererAppearance,
		onSetLinkTarget,
	} = props;
	const portal = usePortal(props);
	const cardContext = useSmartCardContext();
	const [isResolvedViewRendered, setIsResolvedViewRendered] = useState(false);

	const onClick = getCardClickHandler(eventHandlers, url);
	const cardProps = {
		url,
		data,
		onClick,
		container: portal,
	};
	const { hideHoverPreview, actionOptions, ssr } = smartLinks || {};

	const analyticsData = {
		attributes: {
			location: 'renderer',
		},
		// Below is added for the future implementation of Linking Platform namespaced analytic context
		location: 'renderer',
	};

	const inlineAnnotationProps = useInlineAnnotationProps(props);

	const CompetitorPrompt = smartLinks?.CompetitorPrompt;
	const CompetitorPromptComponent =
		CompetitorPrompt && url && fg('prompt_whiteboard_competitor_link_gate') ? (
			<CompetitorPrompt sourceUrl={url} linkType="inline" />
		) : null;
	const onError = ({ err }: { err?: Error }) => {
		if (err) {
			throw err;
		}
	};

	const MaybeOverlay = cardContext?.value ? OverlayWithCardContext : HoverLinkOverlayNoop;

	if (
		ssr &&
		url &&
		!editorExperiment('platform_editor_preview_panel_linking_exp', true, { exposure: true })
	) {
		if (
			// eslint-disable-next-line @atlaskit/platform/no-invalid-feature-flag-usage
			fg('editor_inline_comments_on_inline_nodes')
		) {
			return (
				<span
					data-inline-card
					data-card-data={data ? JSON.stringify(data) : undefined}
					data-card-url={url}
					// Ignored via go/ees005
					// eslint-disable-next-line react/jsx-props-no-spreading
					{...inlineAnnotationProps}
				>
					<AnalyticsContext data={analyticsData}>
						<CardSSR
							appearance="inline"
							url={url}
							showHoverPreview={!hideHoverPreview}
							actionOptions={actionOptions}
							onClick={onClick}
						/>
					</AnalyticsContext>
				</span>
			);
		}
		return (
			<AnalyticsContext data={analyticsData}>
				<CardSSR
					appearance="inline"
					url={url}
					showHoverPreview={!hideHoverPreview}
					actionOptions={actionOptions}
					onClick={onClick}
				/>
			</AnalyticsContext>
		);
	} else if (
		ssr &&
		url &&
		editorExperiment('platform_editor_preview_panel_linking_exp', true, { exposure: true })
	) {
		if (
			// eslint-disable-next-line @atlaskit/platform/no-invalid-feature-flag-usage
			fg('editor_inline_comments_on_inline_nodes')
		) {
			return (
				<span
					data-inline-card
					data-card-data={data ? JSON.stringify(data) : undefined}
					data-card-url={url}
					data-renderer-mark={inlineAnnotationProps['data-renderer-mark']}
					data-annotation-draft-mark={inlineAnnotationProps['data-annotation-draft-mark']}
					data-annotation-inline-node={inlineAnnotationProps['data-annotation-inline-node']}
					data-renderer-start-pos={inlineAnnotationProps['data-renderer-start-pos']}
					data-annotation-mark={inlineAnnotationProps['data-annotation-mark']}
				>
					<AnalyticsContext data={analyticsData}>
						<MaybeOverlay
							url={url || ''}
							rendererAppearance={rendererAppearance}
							isResolvedViewRendered={isResolvedViewRendered}
							fireAnalyticsEvent={fireAnalyticsEvent}
						>
							<CardSSR
								appearance="inline"
								url={url}
								showHoverPreview={!hideHoverPreview}
								actionOptions={actionOptions}
								onClick={onClick}
								onResolve={(data) => {
									if (!data.url || !data.title) {
										return;
									}

									props.smartCardStorage.set(data.url, data.title);

									if (data.title) {
										setIsResolvedViewRendered(true);
									}
								}}
								onError={onError}
								disablePreviewPanel={true}
							/>
						</MaybeOverlay>
					</AnalyticsContext>
				</span>
			);
		}
		return (
			<AnalyticsContext data={analyticsData}>
				<MaybeOverlay
					url={url || ''}
					rendererAppearance={rendererAppearance}
					isResolvedViewRendered={isResolvedViewRendered}
					fireAnalyticsEvent={fireAnalyticsEvent}
				>
					<CardSSR
						appearance="inline"
						url={url}
						showHoverPreview={!hideHoverPreview}
						actionOptions={actionOptions}
						onClick={onClick}
						onResolve={(data) => {
							if (!data.url || !data.title) {
								return;
							}

							props.smartCardStorage.set(data.url, data.title);

							if (data.title) {
								setIsResolvedViewRendered(true);
							}
						}}
						onError={onError}
						disablePreviewPanel={true}
					/>
				</MaybeOverlay>
				{CompetitorPromptComponent}
			</AnalyticsContext>
		);
	}

	return (
		<AnalyticsContext data={analyticsData}>
			<span
				data-inline-card
				data-card-data={data ? JSON.stringify(data) : undefined}
				data-card-url={url}
				// Ignored via go/ees005
				// eslint-disable-next-line react/jsx-props-no-spreading
				{...inlineAnnotationProps}
			>
				<CardErrorBoundary
					unsupportedComponent={UnsupportedInline}
					// Ignored via go/ees005
					// eslint-disable-next-line react/jsx-props-no-spreading
					{...cardProps}
					onSetLinkTarget={onSetLinkTarget}
				>
					<MaybeOverlay
						url={url || ''}
						rendererAppearance={rendererAppearance}
						isResolvedViewRendered={isResolvedViewRendered}
						fireAnalyticsEvent={fireAnalyticsEvent}
					>
						<Card
							appearance="inline"
							showHoverPreview={!hideHoverPreview}
							actionOptions={actionOptions}
							// Ignored via go/ees005
							// eslint-disable-next-line react/jsx-props-no-spreading
							{...cardProps}
							onResolve={(data) => {
								if (!data.url || !data.title) {
									return;
								}

								props.smartCardStorage.set(data.url, data.title);

								if (data.title) {
									setIsResolvedViewRendered(true);
								}
							}}
							onError={onError}
							disablePreviewPanel={editorExperiment(
								'platform_editor_preview_panel_linking_exp',
								true,
								{ exposure: true },
							)}
						/>
					</MaybeOverlay>
					{CompetitorPromptComponent}
				</CardErrorBoundary>
			</span>
		</AnalyticsContext>
	);
};

export default withSmartCardStorage(InlineCard);
