import React from 'react';

import rafSchedule from 'raf-schd';
import uuid from 'uuid/v4';

import { browser as browserLegacy, getBrowserInfo } from '@atlaskit/editor-common/browser';
import ReactNodeView, {
	type getInlineNodeViewProducer,
} from '@atlaskit/editor-common/react-node-view';
import type { PMPluginFactoryParams } from '@atlaskit/editor-common/types';
import { findOverflowScrollParent, UnsupportedBlock } from '@atlaskit/editor-common/ui';
import { canRenderDatasource } from '@atlaskit/editor-common/utils';
import { type EditorViewModePluginState } from '@atlaskit/editor-plugin-editor-viewmode';
import type { Node } from '@atlaskit/editor-prosemirror/model';
import type { Decoration, DecorationSource, EditorView } from '@atlaskit/editor-prosemirror/view';
import { Card as SmartCard } from '@atlaskit/smart-card';
import { CardSSR } from '@atlaskit/smart-card/ssr';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { Datasource } from '../nodeviews/datasource';
import { registerCard, removeCard } from '../pm-plugins/actions';
import { isDatasourceNode } from '../pm-plugins/utils';

import type { SmartCardProps } from './genericCard';
import { Card } from './genericCard';

// eslint-disable-next-line @repo/internal/react/no-class-components
export class BlockCardComponent extends React.PureComponent<
	SmartCardProps & { id?: string },
	unknown
> {
	private scrollContainer?: HTMLElement;

	constructor(props: SmartCardProps & { id?: string }) {
		super(props);
		// Ignored via go/ees005
		// eslint-disable-next-line @atlaskit/editor/no-as-casting
		this.scrollContainer = findOverflowScrollParent(props.view.dom as HTMLElement) || undefined;
	}

	onResolve = (data: { title?: string; url?: string }) => {
		const { getPos, view } = this.props;
		if (!getPos || typeof getPos === 'boolean') {
			return;
		}

		const { title, url } = data;

		// don't dispatch immediately since we might be in the middle of
		// rendering a nodeview
		rafSchedule(() => {
			const pos = getPos();

			if (typeof pos !== 'number') {
				return;
			}

			view.dispatch(
				registerCard({
					title,
					url,
					pos,
					id: this.props.id,
				})(view.state.tr),
			);
		})();
	};

	componentWillUnmount(): void {
		this.removeCard();
	}

	private removeCardDispatched = false;

	private removeCard() {
		if (this.removeCardDispatched) {
			return;
		}
		this.removeCardDispatched = true;
		const { tr } = this.props.view.state;
		removeCard({ id: this.props.id })(tr);
		this.props.view.dispatch(tr);
	}

	gapCursorSpan = () => {
		const browser = expValEquals('platform_editor_hydratable_ui', 'isEnabled', true)
			? getBrowserInfo()
			: browserLegacy;
		// Don't render in EdgeHTMl version <= 18 (Edge version 44)
		// as it forces the edit popup to render 24px lower than it should
		if (browser.ie && browser.ie_version < 79) {
			return;
		}

		// render an empty span afterwards to get around Webkit bug
		// that puts caret in next editable text element
		return <span contentEditable={true} />;
	};

	onError = ({ err }: { err?: Error }) => {
		if (err) {
			throw err;
		}
	};

	render() {
		const { node, cardContext, actionOptions, onClick, CompetitorPrompt, isPageSSRed } = this.props;
		const { url, data } = node.attrs;

		const cardInner =
			expValEquals('platform_editor_smart_card_otp', 'isEnabled', true) && isPageSSRed ? (
				<>
					<CardSSR
						key={url}
						url={url ?? data.url}
						container={this.scrollContainer}
						appearance="block"
						onClick={onClick}
						onResolve={this.onResolve}
						onError={this.onError}
						platform={'web'}
						actionOptions={actionOptions}
						CompetitorPrompt={CompetitorPrompt}
						hideIconLoadingSkeleton={true}
					/>
					{this.gapCursorSpan()}
				</>
			) : (
				<>
					<SmartCard
						key={url}
						url={url ?? data.url}
						container={this.scrollContainer}
						appearance="block"
						onClick={onClick}
						onResolve={this.onResolve}
						onError={this.onError}
						platform={'web'}
						actionOptions={actionOptions}
						CompetitorPrompt={CompetitorPrompt}
					/>
					{this.gapCursorSpan()}
				</>
			);
		// [WS-2307]: we only render card wrapped into a Provider when the value is ready,
		// otherwise if we got data, we can render the card directly since it doesn't need the Provider
		return (
			<div>
				{cardContext && cardContext.value ? (
					<cardContext.Provider value={cardContext.value}>{cardInner}</cardContext.Provider>
				) : data ? (
					cardInner
				) : null}
			</div>
		);
	}
}

const WrappedBlockCard = Card(BlockCardComponent, UnsupportedBlock);

export type BlockCardNodeViewProps = Pick<
	SmartCardProps,
	| 'actionOptions'
	| 'pluginInjectionApi'
	| 'onClickCallback'
	| 'isPageSSRed'
	| 'provider'
	| 'CompetitorPrompt'
>;

export class BlockCard extends ReactNodeView<BlockCardNodeViewProps> {
	private id = uuid();

	unsubscribe: (() => void) | undefined;

	createDomRef(): HTMLElement {
		const domRef = document.createElement('div');
		// workaround Chrome bug in https://product-fabric.atlassian.net/browse/ED-5379
		// see also: https://github.com/ProseMirror/prosemirror/issues/884
		this.unsubscribe =
			this.reactComponentProps.pluginInjectionApi?.editorViewMode?.sharedState.onChange(
				({ nextSharedState }) => this.updateContentEditable(nextSharedState, domRef),
			);
		this.updateContentEditable(
			this.reactComponentProps.pluginInjectionApi?.editorViewMode?.sharedState.currentState(),
			domRef,
		);
		domRef.setAttribute('spellcheck', 'false');
		return domRef;
	}

	private updateContentEditable = (
		editorViewModeState: EditorViewModePluginState | null | undefined,
		divElement: HTMLDivElement,
	) => {
		divElement.contentEditable = editorViewModeState?.mode === 'view' ? 'false' : 'true';
	};

	// Need this function to check if the datasource attribute was added or not to a blockCard.
	// If so, we return false so we can get the node to re-render properly as a datasource node instead.
	// Otherwise, the node view will still consider the node as a blockCard and render a regular blockCard.
	validUpdate(currentNode: Node, newNode: Node) {
		const isCurrentNodeBlockCard = !isDatasourceNode(currentNode);
		const isNewNodeDatasource = isDatasourceNode(newNode);

		// need to return falsy to update node
		return !(isCurrentNodeBlockCard && isNewNodeDatasource);
	}

	update(node: Node, decorations: ReadonlyArray<Decoration>, _innerDecorations?: DecorationSource) {
		return super.update(node, decorations, _innerDecorations, this.validUpdate);
	}

	render() {
		const {
			actionOptions,
			pluginInjectionApi,
			onClickCallback,
			CompetitorPrompt,
			isPageSSRed,
			provider,
		} = this.reactComponentProps;

		return (
			<WrappedBlockCard
				node={this.node}
				view={this.view}
				getPos={this.getPos}
				actionOptions={actionOptions}
				pluginInjectionApi={pluginInjectionApi}
				onClickCallback={onClickCallback}
				id={this.id}
				CompetitorPrompt={CompetitorPrompt}
				isPageSSRed={isPageSSRed}
				provider={provider}
			/>
		);
	}

	destroy() {
		this.unsubscribe?.();
		super.destroy();
	}
}

export interface BlockCardNodeViewProperties {
	actionOptions: BlockCardNodeViewProps['actionOptions'];
	allowDatasource: boolean | undefined;
	CompetitorPrompt?: React.ComponentType<{ linkType?: string; sourceUrl: string }>;
	inlineCardViewProducer: ReturnType<typeof getInlineNodeViewProducer>;
	isPageSSRed: BlockCardNodeViewProps['isPageSSRed'];
	onClickCallback: BlockCardNodeViewProps['onClickCallback'];
	pluginInjectionApi: BlockCardNodeViewProps['pluginInjectionApi'];
	pmPluginFactoryParams: PMPluginFactoryParams;
	provider: BlockCardNodeViewProps['provider'];
}

export const blockCardNodeView =
	({
		pmPluginFactoryParams,
		actionOptions,
		pluginInjectionApi,
		onClickCallback,
		allowDatasource,
		inlineCardViewProducer,
		CompetitorPrompt,
		isPageSSRed,
		provider,
	}: BlockCardNodeViewProperties) =>
	(
		node: Node,
		view: EditorView,
		getPos: () => number | undefined,
		decorations: readonly Decoration[],
	) => {
		const { portalProviderAPI, eventDispatcher } = pmPluginFactoryParams;
		const reactComponentProps: BlockCardNodeViewProps = {
			actionOptions,
			pluginInjectionApi,
			onClickCallback: onClickCallback,
			CompetitorPrompt,
			isPageSSRed,
			provider,
		};
		const isDatasource = isDatasourceNode(node);

		if (isDatasource) {
			if (allowDatasource && canRenderDatasource(node?.attrs?.datasource?.id)) {
				const datasourcePosition = typeof getPos === 'function' && getPos();

				const datasourceResolvedPosition =
					datasourcePosition && view.state.doc.resolve(datasourcePosition);

				const isNodeNested = !!(datasourceResolvedPosition && datasourceResolvedPosition.depth > 0);

				return new Datasource({
					node,
					view,
					getPos,
					portalProviderAPI,
					eventDispatcher,
					pluginInjectionApi,
					isNodeNested,
				}).init();
			} else {
				return inlineCardViewProducer(node, view, getPos, decorations);
			}
		}

		return new BlockCard(
			node,
			view,
			getPos,
			portalProviderAPI,
			eventDispatcher,
			reactComponentProps,
			undefined,
		).init();
	};
