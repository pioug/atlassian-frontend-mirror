import React from 'react';

import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import { getTableContainerWidth } from '@atlaskit/editor-common/node-width';
import { type PortalProviderAPI } from '@atlaskit/editor-common/portal';
import ReactNodeView from '@atlaskit/editor-common/react-node-view';
import type {
	GetEditorContainerWidth,
	GetEditorFeatureFlags,
	getPosHandler,
	getPosHandlerNode,
} from '@atlaskit/editor-common/types';
import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import { DOMSerializer } from '@atlaskit/editor-prosemirror/model';
import { type EditorState, type SelectionBookmark } from '@atlaskit/editor-prosemirror/state';
import type { EditorView, NodeView } from '@atlaskit/editor-prosemirror/view';
import { akEditorTableNumberColumnWidth } from '@atlaskit/editor-shared-styles';
import { TableMap } from '@atlaskit/editor-tables/table-map';

import { pluginConfig as getPluginConfig } from '../pm-plugins/create-plugin-config';
import { getPluginState } from '../pm-plugins/plugin-factory';
import { pluginKey as tableWidthPluginKey } from '../pm-plugins/table-width';
import { isTableNested } from '../pm-plugins/utils/nodes';
import type { PluginInjectionAPI } from '../types';

import { TableComponentWithSharedState } from './TableComponentWithSharedState';
import { tableNodeSpecWithFixedToDOM } from './toDOM';
import type { Props } from './types';

type ForwardRef = (node: HTMLElement | null) => void;

const tableAttributes = (node: PmNode) => {
	return {
		'data-number-column': node.attrs.isNumberColumnEnabled,
		'data-layout': node.attrs.layout,
		'data-autosize': node.attrs.__autoSize,
		'data-table-local-id': node.attrs.localId || '',
		'data-table-width': node.attrs.width || 'inherit',
		'data-table-display-mode': node.attrs.displayMode,
	};
};

const getInlineWidth = (
	node: PmNode,
	options: Props['options'],
	state: EditorState,
	pos: number | undefined,
	allowTableResizing?: boolean,
): number | undefined => {
	if (
		(!node.attrs.width && options?.isChromelessEditor) ||
		(!node.attrs.width && options?.isCommentEditor && allowTableResizing)
	) {
		return;
	}

	// provide a width for tables when custom table width is supported
	// this is to ensure 'responsive' tables (colgroup widths are undefined) become fixed to
	// support screen size adjustments
	const shouldHaveInlineWidth = allowTableResizing && !isTableNested(state, pos);

	let widthValue = getTableContainerWidth(node);

	if (node.attrs.isNumberColumnEnabled) {
		widthValue -= akEditorTableNumberColumnWidth;
	}

	return shouldHaveInlineWidth ? widthValue : undefined;
};

const handleInlineTableWidth = (table: HTMLElement, width: number | undefined) => {
	if (!table || !width) {
		return;
	}
	table.style.setProperty('width', `${width}px`);
};

export default class TableView extends ReactNodeView<Props> {
	private table: HTMLElement | undefined;
	private renderedDOM?: HTMLElement;
	private resizeObserver?: ResizeObserver;
	eventDispatcher?: EventDispatcher;
	getPos: getPosHandlerNode;
	options;
	getEditorFeatureFlags;

	constructor(props: Props) {
		super(
			props.node,
			props.view,
			props.getPos,
			props.portalProviderAPI,
			props.eventDispatcher,
			props,
			undefined,
			undefined,
			// @portal-render-immediately
			true,
		);
		this.getPos = props.getPos;
		this.eventDispatcher = props.eventDispatcher;
		this.options = props.options;
		this.getEditorFeatureFlags = props.getEditorFeatureFlags;

		this.handleRef = (node: HTMLElement | null) => this._handleTableRef(node);
	}

	getContentDOM() {
		const isNested = isTableNested(this.view.state, this.getPos());
		const tableDOMStructure = tableNodeSpecWithFixedToDOM({
			allowColumnResizing: !!this.reactComponentProps.allowColumnResizing,
			tableResizingEnabled: !!this.reactComponentProps.allowTableResizing,
			getEditorContainerWidth: this.reactComponentProps.getEditorContainerWidth,
			isTableScalingEnabled: this.reactComponentProps.options?.isTableScalingEnabled,
			shouldUseIncreasedScalingPercent:
				this.reactComponentProps.options?.shouldUseIncreasedScalingPercent,
			isCommentEditor: this.reactComponentProps.options?.isCommentEditor,
			isChromelessEditor: this.reactComponentProps.options?.isChromelessEditor,
			isNested,
		}).toDOM(this.node);

		const rendered = DOMSerializer.renderSpec(document, tableDOMStructure) as {
			contentDOM?: HTMLElement;
			dom: HTMLElement;
		};

		if (rendered.dom) {
			const tableElement = rendered.dom.querySelector('table');
			this.table = tableElement ? tableElement : rendered.dom;
			this.renderedDOM = rendered.dom;

			if (
				!this.options?.isTableScalingEnabled ||
				(this.options?.isTableScalingEnabled &&
					this.getEditorFeatureFlags?.().tableWithFixedColumnWidthsOption &&
					this.node.attrs.displayMode === 'fixed')
			) {
				const tableInlineWidth = getInlineWidth(
					this.node,
					this.reactComponentProps.options,
					this.reactComponentProps.view.state,
					this.reactComponentProps.getPos(),
					this.reactComponentProps.allowTableResizing,
				);
				if (tableInlineWidth) {
					handleInlineTableWidth(this.table, tableInlineWidth);
				}
			}
		}

		return rendered;
	}

	/**
	 * Handles moving the table from ProseMirror's DOM structure into a React-rendered table node.
	 * Temporarily disables mutation observers (except for selection changes) during the move,
	 * preserves selection state, and restores it afterwards if mutations occurred and cursor
	 * wasn't at start of node. This prevents duplicate tables and maintains editor state during
	 * the DOM manipulation.
	 */
	private _handleTableRef(node: HTMLElement | null) {
		let oldIgnoreMutation: (mutation: MutationRecord) => boolean;

		let selectionBookmark: SelectionBookmark;
		let mutationsIgnored = false;

		// Only proceed if we have both a node and table, and the table isn't already inside the node
		if (node && this.table && !node.contains(this.table)) {
			// Store the current ignoreMutation handler so we can restore it later
			oldIgnoreMutation = this.ignoreMutation;

			// Set up a temporary mutation handler that:
			// - Ignores all DOM mutations except selection changes
			// - Tracks when mutations have been ignored via mutationsIgnored flag
			this.ignoreMutation = (m: MutationRecord | { target: Node; type: string }) => {
				const isSelectionMutation = m.type === 'selection';
				if (!isSelectionMutation) {
					mutationsIgnored = true;
				}
				return !isSelectionMutation;
			};

			// Store the current selection state if there is a visible selection
			// This lets us restore it after DOM changes
			if (this.view.state.selection.visible) {
				selectionBookmark = this.view.state.selection.getBookmark();
			}

			if (this.dom) {
				this.dom.setAttribute('data-ssr-placeholder', `table-nodeview-${this.node.attrs.localId}`);
				this.dom.setAttribute(
					'data-ssr-placeholder-replace',
					`table-nodeview-${this.node.attrs.localId}`,
				);
			}

			// Remove the ProseMirror table DOM structure to avoid duplication, as it's replaced with the React table node.
			if (this.dom && this.renderedDOM) {
				this.dom.removeChild(this.renderedDOM);
			}
			// Move the table from the ProseMirror table structure into the React rendered table node.
			node.appendChild(this.table);

			// After the next frame:
			requestAnimationFrame(() => {
				// Restore the original mutation handler
				this.ignoreMutation = oldIgnoreMutation;

				// Restore the selection only if:
				// - We have a selection bookmark
				// - Mutations were ignored during the table move
				// - The bookmarked selection is different from the current selection.
				if (selectionBookmark && mutationsIgnored) {
					const resolvedSelection = selectionBookmark.resolve(this.view.state.tr.doc);
					// Don't set the selection if it's the same as the current selection.
					if (!resolvedSelection.eq(this.view.state.selection)) {
						const tr = this.view.state.tr.setSelection(resolvedSelection);
						tr.setMeta('source', 'TableNodeView:_handleTableRef:selection-resync');
						this.view.dispatch(tr);
					}
				}
			});
		}
	}

	setDomAttrs(node: PmNode) {
		if (!this.table) {
			return; // width / attribute application to actual table will happen later when table is set
		}
		const attrs = tableAttributes(node);
		(Object.keys(attrs) as Array<keyof typeof attrs>).forEach((attr) => {
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			this.table!.setAttribute(attr, attrs[attr]);
		});

		// Preserve Table Width cannot have inline width set on the table
		if (
			!this.options?.isTableScalingEnabled ||
			(this.options?.isTableScalingEnabled &&
				this.getEditorFeatureFlags?.().tableWithFixedColumnWidthsOption &&
				node.attrs.displayMode === 'fixed')
		) {
			// handle inline style when table been resized
			const tableInlineWidth = getInlineWidth(
				node,
				(this.reactComponentProps as Props).options,
				this.view.state,
				this.getPos(),
				this.reactComponentProps.allowTableResizing,
			);

			const isTableResizing = tableWidthPluginKey.getState(this.view.state)?.resizing;

			if (!isTableResizing && tableInlineWidth) {
				handleInlineTableWidth(this.table, tableInlineWidth);
			}
		}
	}

	getNode = () => {
		return this.node;
	};

	render(props: Props, forwardRef: ForwardRef) {
		return (
			<TableComponentWithSharedState
				forwardRef={forwardRef}
				getNode={this.getNode}
				view={props.view}
				options={props.options}
				eventDispatcher={props.eventDispatcher}
				api={props.pluginInjectionApi}
				allowColumnResizing={props.allowColumnResizing}
				allowTableAlignment={props.allowTableAlignment}
				allowTableResizing={props.allowTableResizing}
				allowControls={props.allowControls}
				getPos={props.getPos}
				getEditorFeatureFlags={props.getEditorFeatureFlags}
				dispatchAnalyticsEvent={props.dispatchAnalyticsEvent}
			/>
		);
	}

	private hasHoveredRows = false;
	viewShouldUpdate(nextNode: PmNode) {
		const { hoveredRows } = getPluginState(this.view.state);
		const hoveredRowsChanged = !!hoveredRows?.length !== this.hasHoveredRows;
		if (nextNode.attrs.isNumberColumnEnabled && hoveredRowsChanged) {
			this.hasHoveredRows = !!hoveredRows?.length;
			return true;
		}

		const node = this.getNode();
		if (typeof node.attrs !== typeof nextNode.attrs) {
			return true;
		}
		const attrKeys = Object.keys(node.attrs);
		const nextAttrKeys = Object.keys(nextNode.attrs);
		if (attrKeys.length !== nextAttrKeys.length) {
			return true;
		}

		const tableMap = TableMap.get(node);
		const nextTableMap = TableMap.get(nextNode);

		if (tableMap.width !== nextTableMap.width) {
			return true;
		}

		return attrKeys.some((key) => {
			return node.attrs[key] !== nextNode.attrs[key];
		});
	}

	ignoreMutation(mutation: MutationRecord | { target: Node; type: 'selection' }) {
		const {
			type,
			target: { nodeName, firstChild },
		} = mutation;

		if (
			type === 'selection' &&
			nodeName?.toUpperCase() === 'DIV' &&
			firstChild?.nodeName.toUpperCase() === 'TABLE'
		) {
			return false;
		}

		// ED-16668
		// Do not remove this fixes an issue with windows firefox that relates to
		// the addition of the shadow sentinels
		if (
			type === 'selection' &&
			nodeName?.toUpperCase() === 'TABLE' &&
			(firstChild?.nodeName.toUpperCase() === 'COLGROUP' ||
				firstChild?.nodeName.toUpperCase() === 'SPAN')
		) {
			return false;
		}

		if (!this.contentDOM) {
			return true;
		}
		return !this.contentDOM.contains(mutation.target) && mutation.type !== 'selection';
	}

	destroy() {
		if (this.resizeObserver) {
			this.resizeObserver.disconnect();
		}

		this.eventDispatcher?.emit('TABLE_DELETED', this.node);
		super.destroy();
	}
}

export const createTableView = (
	node: PmNode,
	view: EditorView,
	getPos: getPosHandler,
	portalProviderAPI: PortalProviderAPI,
	eventDispatcher: EventDispatcher,
	getEditorContainerWidth: GetEditorContainerWidth,
	getEditorFeatureFlags: GetEditorFeatureFlags,
	dispatchAnalyticsEvent: DispatchAnalyticsEvent,
	pluginInjectionApi?: PluginInjectionAPI,
	isCommentEditor?: boolean,
	isChromelessEditor?: boolean,
): NodeView => {
	const {
		pluginConfig,
		isDragAndDropEnabled,
		isTableScalingEnabled, // same as options.isTableScalingEnabled
	} = getPluginState(view.state);

	// Use shared state for isFullWidthModeEnabled and wasFullWidthModeEnabled for most up-to-date values
	const tableState = pluginInjectionApi?.table?.sharedState.currentState();

	const { allowColumnResizing, allowControls, allowTableResizing, allowTableAlignment } =
		getPluginConfig(pluginConfig);

	const isTableFixedColumnWidthsOptionEnabled =
		getEditorFeatureFlags?.().tableWithFixedColumnWidthsOption || false;

	const shouldUseIncreasedScalingPercent =
		isTableScalingEnabled && (isTableFixedColumnWidthsOptionEnabled || isCommentEditor);

	return new TableView({
		node,
		view,
		allowColumnResizing,
		allowTableResizing,
		allowTableAlignment,
		allowControls,
		portalProviderAPI,
		eventDispatcher,
		getPos: getPos as getPosHandlerNode,
		options: {
			isFullWidthModeEnabled: tableState?.isFullWidthModeEnabled,
			wasFullWidthModeEnabled: tableState?.wasFullWidthModeEnabled,
			isDragAndDropEnabled,
			isTableScalingEnabled, // same as options.isTableScalingEnabled
			isCommentEditor,
			isChromelessEditor,
			shouldUseIncreasedScalingPercent,
		},
		getEditorContainerWidth,
		getEditorFeatureFlags,
		dispatchAnalyticsEvent,
		pluginInjectionApi,
	}).init();
};
