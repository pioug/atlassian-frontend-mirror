import React, { useEffect, useMemo } from 'react';

import type { EditorCardProvider } from '@atlaskit/editor-card-provider';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import type { NamedPluginStatesFromInjectionAPI } from '@atlaskit/editor-common/hooks';
import type {
	InlineNodeViewComponentProps,
	getInlineNodeViewProducer,
} from '@atlaskit/editor-common/react-node-view';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { UnsupportedInline } from '@atlaskit/editor-common/ui';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { Decoration, EditorView, NodeView } from '@atlaskit/editor-prosemirror/view';
import {
	SmartLinkDraggable,
	SMART_LINK_DRAG_TYPES,
	SMART_LINK_APPEARANCE,
} from '@atlaskit/editor-smart-link-draggable';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { expVal } from '@atlaskit/tmp-editor-statsig/expVal';

import type { cardPlugin } from '../cardPlugin';
import { getAwarenessProps } from '../pm-plugins/utils';
import { SmartCardSSRReactContextsProvider } from '../ui/SmartCardSSRReactContextsProvider';

import type { SmartCardProps } from './genericCard';
import { Card } from './genericCard';
import { InlineCardWithAwareness } from './inlineCardWithAwareness';
import type { InlineCardWithAwarenessProps } from './inlineCardWithAwareness';

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
	| 'intl'
	| 'smartCardContext'
>;

const selectorWithCard = (
	states: NamedPluginStatesFromInjectionAPI<
		ExtractInjectionAPI<typeof cardPlugin>,
		'editorViewMode' | 'card'
	>,
) => ({
	mode: states.editorViewModeState?.mode,
	resolvedInlineSmartLinks: states.cardState?.resolvedInlineSmartLinks,
});

const selectorWithoutCard = (
	states: NamedPluginStatesFromInjectionAPI<
		ExtractInjectionAPI<typeof cardPlugin>,
		'editorViewMode'
	>,
) => ({
	mode: states.editorViewModeState?.mode,
	resolvedInlineSmartLinks: undefined as
		| Array<{ pos: number; source: string; url: string }>
		| undefined,
});

/**
 * Inline card node view component that renders a Smart Link inline card within the editor.
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
		intl,
		smartCardContext,
	} = props;

	const { mode, resolvedInlineSmartLinks } = useSharedPluginStateWithSelector(
		pluginInjectionApi,
		expVal('cc_dnd_smart_link_changeboard_platform_css', 'isEnabled', false) &&
			fg('cc_drag_and_drop_smart_link_from_content_to_tree')
			? ['editorViewMode', 'card']
			: ['editorViewMode'],
		expVal('cc_dnd_smart_link_changeboard_platform_css', 'isEnabled', false) &&
			fg('cc_drag_and_drop_smart_link_from_content_to_tree')
			? selectorWithCard
			: selectorWithoutCard,
	);

	const url = node.attrs.url;

	const CompetitorPromptComponent =
		CompetitorPrompt && url ? <CompetitorPrompt sourceUrl={url} linkType="inline" /> : null;

	useEffect(() => {
		if (expValEquals('platform_editor_smartlink_local_cache', 'isEnabled', true)) {
			// Refresh cache in the background
			provider?.then((providerInstance) => {
				(providerInstance as EditorCardProvider).refreshCache?.(props.node);
			});
		}
	}, [provider, props.node]);

	const linkPosition = useMemo(() => {
		if (!getPos || typeof getPos === 'boolean') {
			return undefined;
		}
		const pos = getPos();
		return typeof pos === 'number' ? pos : undefined;
	}, [getPos]);

	const isChangeboardTarget =
		linkPosition !== undefined && resolvedInlineSmartLinks?.[0]?.pos === linkPosition;
	const inlineCardContent = (
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

	return (
		<SmartCardSSRReactContextsProvider intl={intl} smartCardContext={smartCardContext}>
			<SmartLinkDraggable
				url={url}
				appearance={SMART_LINK_APPEARANCE.INLINE}
				source={SMART_LINK_DRAG_TYPES.EDITOR}
				isChangeboardTarget={isChangeboardTarget}
			>
				{inlineCardContent}
			</SmartLinkDraggable>
		</SmartCardSSRReactContextsProvider>
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
	): NodeView => {
		return inlineCardViewProducer(node, view, getPos, decorations);
	};
