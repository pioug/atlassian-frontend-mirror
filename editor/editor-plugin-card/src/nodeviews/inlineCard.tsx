import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';

import rafSchedule from 'raf-schd';
// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
import uuid from 'uuid/v4';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import {
	type NamedPluginStatesFromInjectionAPI,
	useSharedPluginStateWithSelector,
} from '@atlaskit/editor-common/hooks';
import type {
	InlineNodeViewComponentProps,
	getInlineNodeViewProducer,
} from '@atlaskit/editor-common/react-node-view';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { UnsupportedInline, findOverflowScrollParent } from '@atlaskit/editor-common/ui';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { Decoration, EditorView } from '@atlaskit/editor-prosemirror/view';
import { Card as SmartCard } from '@atlaskit/smart-card';
import { useSmartLinkReload } from '@atlaskit/smart-card/hooks';
import { CardSSR } from '@atlaskit/smart-card/ssr';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { type cardPlugin } from '../cardPlugin';
import { registerCard, removeCard } from '../pm-plugins/actions';
import { getAwarenessProps } from '../pm-plugins/utils';
import { visitCardLinkAnalytics } from '../ui/toolbar';

import type { SmartCardProps } from './genericCard';
import { Card } from './genericCard';
import {
	InlineCardWithAwareness,
	type InlineCardWithAwarenessProps,
} from './inlineCardWithAwareness';

export const InlineCard = memo(
	({
		node,
		cardContext,
		actionOptions,
		useAlternativePreloader,
		view,
		getPos,
		onClick: propsOnClick,
		onResolve: onRes,
		isHovered,
		showHoverPreview,
		hoverPreviewOptions,
		isPageSSRed,
		pluginInjectionApi,
		disablePreviewPanel,
	}: SmartCardProps): React.JSX.Element | null => {
		const { url, data } = node.attrs;
		// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
		const refId = useRef(uuid());
		const reload = useSmartLinkReload({ url });

		useEffect(() => {
			const id = refId.current;
			return () => {
				const { tr } = view.state;
				removeCard({ id })(tr);
				view.dispatch(tr);
			};
		}, [getPos, view]);

		useEffect(() => {
			// if we render from cache, we want to make sure we reload the data in the background
			const cardState = cardContext?.value?.store?.getState()[url || ''];
			if (
				expValEquals('platform_editor_smartlink_local_cache', 'isEnabled', true) &&
				!isPageSSRed &&
				cardState?.status === 'resolved'
			) {
				reload();
			}
		});

		const scrollContainer: HTMLElement | undefined = useMemo(
			// Ignored via go/ees005
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			() => findOverflowScrollParent(view.dom as HTMLElement) || undefined,
			[view.dom],
		);

		const onResolve = useCallback(
			(data: { title?: string; url?: string }) => {
				if (!getPos || typeof getPos === 'boolean') {
					return;
				}

				const { title, url } = data;
				// don't dispatch immediately since we might be in the middle of
				// rendering a nodeview
				rafSchedule(() => {
					// prosemirror-bump-fix
					const pos = getPos();

					if (typeof pos !== 'number') {
						return;
					}

					const tr = view.state.tr;

					registerCard({
						title,
						url,
						pos,
						id: refId.current,
					})(tr);

					onRes?.(tr, title);

					view.dispatch(tr);
				})();
			},
			[getPos, view, onRes],
		);

		const onError = useCallback(
			(data: { err?: Error; url?: string }) => {
				const { url, err } = data;
				if (err) {
					throw err;
				}
				onResolve({ url });
			},
			[onResolve],
		);

		const handleOnClick = useCallback(
			(event: React.MouseEvent<HTMLSpanElement>) => {
				if (event.metaKey || event.ctrlKey) {
					const { actions: editorAnalyticsApi } = pluginInjectionApi?.analytics ?? {};

					visitCardLinkAnalytics(editorAnalyticsApi, INPUT_METHOD.META_CLICK)(
						view.state,
						view.dispatch,
					);

					window.open(url, '_blank');
				} else {
					// only trigger the provided onClick callback if the meta key or ctrl key is not pressed
					propsOnClick?.(event);
				}
			},
			[propsOnClick, url, view, pluginInjectionApi],
		);

		const onClick = editorExperiment('platform_editor_controls', 'variant1')
			? handleOnClick
			: propsOnClick;

		const card = useMemo(() => {
			const cardState = cardContext?.value?.store?.getState()[url || ''];
			if (
				(isPageSSRed ||
					(cardState &&
						expValEquals('platform_editor_smartlink_local_cache', 'isEnabled', true))) &&
				url
			) {
				return (
					<CardSSR
						key={url}
						url={url}
						appearance="inline"
						onClick={onClick}
						container={scrollContainer}
						onResolve={onResolve}
						onError={onError}
						inlinePreloaderStyle={useAlternativePreloader ? 'on-right-without-skeleton' : undefined}
						actionOptions={actionOptions}
						isHovered={isHovered}
						showHoverPreview={showHoverPreview}
						hoverPreviewOptions={hoverPreviewOptions}
						disablePreviewPanel={disablePreviewPanel}
						hideIconLoadingSkeleton
					/>
				);
			}

			return (
				<SmartCard
					key={url}
					url={url ?? data.url}
					appearance="inline"
					onClick={onClick}
					container={scrollContainer}
					onResolve={onResolve}
					onError={onError}
					inlinePreloaderStyle={useAlternativePreloader ? 'on-right-without-skeleton' : undefined}
					actionOptions={actionOptions}
					isHovered={isHovered}
					showHoverPreview={showHoverPreview}
					hoverPreviewOptions={hoverPreviewOptions}
					disablePreviewPanel={disablePreviewPanel}
				/>
			);
		}, [
			url,
			data,
			onClick,
			scrollContainer,
			onResolve,
			onError,
			useAlternativePreloader,
			actionOptions,
			isHovered,
			showHoverPreview,
			hoverPreviewOptions,
			isPageSSRed,
			disablePreviewPanel,
			cardContext?.value?.store,
		]);

		// [WS-2307]: we only render card wrapped into a Provider when the value is ready,
		// otherwise if we got data, we can render the card directly since it doesn't need the Provider
		return cardContext && cardContext.value ? (
			<cardContext.Provider value={cardContext.value}>{card}</cardContext.Provider>
		) : data ? (
			card
		) : null;
	},
);

const WrappedInlineCardWithAwareness = Card(InlineCardWithAwareness, UnsupportedInline);

export type InlineCardNodeViewProps = Pick<
	SmartCardProps,
	| 'useAlternativePreloader'
	| 'actionOptions'
	| 'allowEmbeds'
	| 'allowBlockCards'
	| 'enableInlineUpgradeFeatures'
	| 'pluginInjectionApi'
	| 'onClickCallback'
	| 'isPageSSRed'
	| 'CompetitorPrompt'
	| 'provider'
>;

const selector = (
	states: NamedPluginStatesFromInjectionAPI<
		ExtractInjectionAPI<typeof cardPlugin>,
		'editorViewMode'
	>,
) => {
	return {
		mode: states.editorViewModeState?.mode,
	};
};

/**
 *
 * @param props
 * @example
 */
export function InlineCardNodeView(
	props: InlineNodeViewComponentProps & InlineCardNodeViewProps & InlineCardWithAwarenessProps,
): React.JSX.Element {
	const {
		useAlternativePreloader,
		node,
		view,
		getPos,
		actionOptions,
		allowEmbeds,
		allowBlockCards,
		enableInlineUpgradeFeatures,
		pluginInjectionApi,
		onClickCallback,
		isPageSSRed,
		provider,
		CompetitorPrompt,
	} = props;

	const { mode } = useSharedPluginStateWithSelector(
		pluginInjectionApi,
		['editorViewMode'],
		selector,
	);

	const url = node.attrs.url;
	const CompetitorPromptComponent =
		CompetitorPrompt && url ? <CompetitorPrompt sourceUrl={url} linkType="inline" /> : null;

	return (
		<>
			<WrappedInlineCardWithAwareness
				node={node}
				view={view}
				getPos={getPos}
				actionOptions={actionOptions}
				useAlternativePreloader={useAlternativePreloader}
				pluginInjectionApi={pluginInjectionApi}
				onClickCallback={onClickCallback}
				isPageSSRed={isPageSSRed}
				provider={provider}
				appearance="inline"
				// Ignored via go/ees005
				// eslint-disable-next-line react/jsx-props-no-spreading
				{...(enableInlineUpgradeFeatures &&
					getAwarenessProps(view.state, getPos, allowEmbeds, allowBlockCards, mode === 'view'))}
			/>
			{CompetitorPromptComponent}
		</>
	);
}

export interface InlineCardNodeViewProperties {
	inlineCardViewProducer: ReturnType<typeof getInlineNodeViewProducer>;
	isPageSSRed: InlineCardNodeViewProps['isPageSSRed'];
}

export const inlineCardNodeView =
	({ inlineCardViewProducer }: InlineCardNodeViewProperties) =>
	(
		node: PMNode,
		view: EditorView,
		getPos: () => number | undefined,
		decorations: readonly Decoration[],
	) => {
		return inlineCardViewProducer(node, view, getPos, decorations);
	};
