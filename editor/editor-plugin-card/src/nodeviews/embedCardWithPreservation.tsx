import { preserveNodeView } from '@atlaskit/editor-common/preserve-node-view';
import type { PreservedNodeView } from '@atlaskit/editor-common/preserve-node-view';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView, NodeView } from '@atlaskit/editor-prosemirror/view';
import { akEditorFullPageNarrowBreakout } from '@atlaskit/editor-shared-styles/constants';

import { embedCardNodeView, EmbedCard, isPreviewPanelResponsivenessEnabled } from './embedCard';
import type { EmbedCardNodeViewProperties, EmbedCardNodeViewProps } from './embedCard';

export const embedCardNodeViewWithPreservation =
	(properties: EmbedCardNodeViewProperties) =>
	(node: PMNode, view: EditorView, getPos: () => number | undefined): NodeView => {
		const width = properties.pluginInjectionApi?.width?.sharedState.currentState()?.width;
		const useResponsiveRenderer =
			isPreviewPanelResponsivenessEnabled() && !!width && width <= akEditorFullPageNarrowBreakout;
		if (useResponsiveRenderer) {
			return embedCardNodeView(properties)(node, view, getPos);
		}

		const { portalProviderAPI, eventDispatcher, dispatchAnalyticsEvent } =
			properties.pmPluginFactoryParams;
		const renderProps: EmbedCardNodeViewProps = {
			eventDispatcher,
			allowResizing: properties.allowResizing,
			fullWidthMode: properties.fullWidthMode,
			dispatchAnalyticsEvent,
			pluginInjectionApi: properties.pluginInjectionApi,
			actionOptions: properties.actionOptions,
			onClickCallback: properties.onClickCallback,
			CompetitorPrompt: properties.CompetitorPrompt,
			isPageSSRed: properties.isPageSSRed,
			provider: properties.provider,
			intl: properties.intl,
			smartCardContext: properties.smartCardContext,
		};
		const createCard = (cardNode: PMNode): PreservedNodeView =>
			new EmbedCard(cardNode, view, getPos, portalProviderAPI, eventDispatcher, renderProps);

		return preserveNodeView({
			node,
			view,
			getPos,
			renderProps,
			rendererKind: portalProviderAPI,
			createNodeView: createCard,
			isSameNode: (previous, next) => previous === next,
			canUpdateNode: (previous, next) => previous.type === next.type,
			canReuse: (inner) => {
				if (
					!(inner instanceof EmbedCard) ||
					!inner.canReuseWith(properties.provider, properties.pmPluginFactoryParams.eventDispatcher)
				) {
					return false;
				}
				let nodeIdentityCount = 0;
				view.state.doc.descendants((candidate) => {
					if (candidate === inner.node) {
						nodeIdentityCount++;
					}
				});
				return nodeIdentityCount === 1;
			},
			onAttach: (inner, slot, freshGetPos) => {
				if (inner instanceof EmbedCard) {
					inner.attachPreservationSlot(slot, freshGetPos);
				}
			},
			requireUniqueMatch: true,
		});
	};
