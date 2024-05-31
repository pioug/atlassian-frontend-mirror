import React from 'react';

import PropTypes from 'prop-types';
import rafSchedule from 'raf-schd';

import ReactNodeView from '@atlaskit/editor-common/react-node-view';
import { findOverflowScrollParent, UnsupportedBlock } from '@atlaskit/editor-common/ui';
import { browser } from '@atlaskit/editor-common/utils';
import type { Node } from '@atlaskit/editor-prosemirror/model';
import type { Decoration, DecorationSource } from '@atlaskit/editor-prosemirror/view';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { Card as SmartCard } from '@atlaskit/smart-card';

import { registerCard } from '../pm-plugins/actions';
import { isDatasourceNode } from '../utils';

import type { SmartCardProps } from './genericCard';
import { Card } from './genericCard';

// eslint-disable-next-line @repo/internal/react/no-class-components
export class BlockCardComponent extends React.PureComponent<SmartCardProps> {
	private scrollContainer?: HTMLElement;

	static contextTypes = {
		contextAdapter: PropTypes.object,
	};

	UNSAFE_componentWillMount() {
		const { view } = this.props;
		const scrollContainer = findOverflowScrollParent(view.dom as HTMLElement);
		this.scrollContainer = scrollContainer || undefined;
	}

	onResolve = (data: { url?: string; title?: string }) => {
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
				})(view.state.tr),
			);
		})();
	};

	gapCursorSpan = () => {
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
		const { node, cardContext, platform, actionOptions, showServerActions, onClick } = this.props;
		const { url, data } = node.attrs;

		const cardInner = (
			<>
				<SmartCard
					key={url}
					url={url}
					data={data}
					container={this.scrollContainer}
					appearance="block"
					onClick={onClick}
					onResolve={this.onResolve}
					onError={this.onError}
					platform={platform}
					actionOptions={actionOptions}
					showServerActions={showServerActions}
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
	'platform' | 'actionOptions' | 'showServerActions' | 'pluginInjectionApi' | 'onClickCallback'
>;

export class BlockCard extends ReactNodeView<BlockCardNodeViewProps> {
	createDomRef(): HTMLElement {
		const domRef = document.createElement('div');
		if (this.reactComponentProps.platform !== 'mobile') {
			// workaround Chrome bug in https://product-fabric.atlassian.net/browse/ED-5379
			// see also: https://github.com/ProseMirror/prosemirror/issues/884
			domRef.contentEditable = 'true';
			domRef.setAttribute('spellcheck', 'false');
		}
		return domRef;
	}

	// Need this function to check if the datasource attribute was added or not to a blockCard.
	// If so, we return false so we can get the node to re-render properly as a datasource node instead.
	// Otherwise, the node view will still consider the node as a blockCard and render a regular blockCard.
	validUpdate(currentNode: Node, newNode: Node) {
		if (getBooleanFF('platform.linking-platform.editor-datasource-typeguards')) {
			const isCurrentNodeBlockCard = !isDatasourceNode(currentNode);
			const isNewNodeDatasource = isDatasourceNode(newNode);

			// need to return falsy to update node
			return !(isCurrentNodeBlockCard && isNewNodeDatasource);
		}

		const isCurrentNodeBlockCard = !currentNode.attrs?.datasource;
		const isNewNodeDatasource = newNode.attrs?.datasource;

		// need to return falsy to update node
		return !(isCurrentNodeBlockCard && isNewNodeDatasource);
	}

	update(node: Node, decorations: ReadonlyArray<Decoration>, _innerDecorations?: DecorationSource) {
		return super.update(node, decorations, _innerDecorations, this.validUpdate);
	}

	render() {
		const { platform, actionOptions, showServerActions, pluginInjectionApi, onClickCallback } =
			this.reactComponentProps;

		return (
			<WrappedBlockCard
				node={this.node}
				view={this.view}
				getPos={this.getPos}
				platform={platform}
				actionOptions={actionOptions}
				showServerActions={showServerActions}
				pluginInjectionApi={pluginInjectionApi}
				onClickCallback={onClickCallback}
			/>
		);
	}
}
