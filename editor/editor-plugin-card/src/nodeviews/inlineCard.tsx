import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';

import rafSchedule from 'raf-schd';
import uuid from 'uuid/v4';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import {
	type NamedPluginStatesFromInjectionAPI,
	sharedPluginStateHookMigratorFactory,
	useSharedPluginState,
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
import { fg } from '@atlaskit/platform-feature-flags';
import { Card as SmartCard } from '@atlaskit/smart-card';
import { CardSSR } from '@atlaskit/smart-card/ssr';
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
	}: SmartCardProps) => {
		const { url, data } = node.attrs;
		const refId = useRef(uuid());

		useEffect(() => {
			const id = refId.current;
			return () => {
				const { tr } = view.state;
				removeCard({ id })(tr);
				view.dispatch(tr);
			};
		}, [getPos, view]);

		const scrollContainer: HTMLElement | undefined = useMemo(
			// Ignored via go/ees005
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			() => findOverflowScrollParent(view.dom as HTMLElement) || undefined,
			[view.dom],
		);

		const onResolve = useCallback(
			(data: { url?: string; title?: string }) => {
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
			(data: { url?: string; err?: Error }) => {
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

		const onClick =
			editorExperiment('platform_editor_controls', 'variant1') &&
			editorExperiment('platform_editor_smart_link_cmd_ctrl_click', true, {
				exposure: true,
			})
				? handleOnClick
				: propsOnClick;

		const card = useMemo(() => {
			if (isPageSSRed && url && fg('platform_ssr_smartlinks_editor')) {
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
>;

const selector = (
	states: NamedPluginStatesFromInjectionAPI<
		ExtractInjectionAPI<typeof cardPlugin>,
		'selection' | 'editorViewMode'
	>,
) => {
	return {
		mode: states.editorViewModeState?.mode,
		selection: states.selectionState?.selection,
	};
};

const useSharedState = sharedPluginStateHookMigratorFactory(
	(pluginInjectionApi: ExtractInjectionAPI<typeof cardPlugin> | undefined) => {
		return useSharedPluginStateWithSelector(
			pluginInjectionApi,
			['selection', 'editorViewMode'],
			selector,
		);
	},
	(pluginInjectionApi: ExtractInjectionAPI<typeof cardPlugin> | undefined) => {
		const { selectionState, editorViewModeState } = useSharedPluginState(pluginInjectionApi, [
			'selection',
			'editorViewMode',
		]);
		return {
			mode: editorViewModeState?.mode,
			selection: selectionState?.selection,
		};
	},
);

/**
 *
 * @param props
 * @example
 */
export function InlineCardNodeView(
	props: InlineNodeViewComponentProps & InlineCardNodeViewProps & InlineCardWithAwarenessProps,
) {
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
		CompetitorPrompt,
	} = props;

	const { mode } = useSharedState(pluginInjectionApi);

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
				appearance="inline"
				// Ignored via go/ees005
				// eslint-disable-next-line react/jsx-props-no-spreading
				{...(enableInlineUpgradeFeatures &&
					getAwarenessProps(view.state, getPos, allowEmbeds, allowBlockCards, mode === 'view'))}
			/>
			{fg('prompt_whiteboard_competitor_link_gate') && CompetitorPromptComponent}
		</>
	);
}

export interface InlineCardNodeViewProperties {
	inlineCardViewProducer: ReturnType<typeof getInlineNodeViewProducer>;
	isPageSSRed?: boolean;
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
