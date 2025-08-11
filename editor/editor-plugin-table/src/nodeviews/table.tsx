import React from 'react';

import type { TableColumnOrdering } from '@atlaskit/custom-steps';
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
import { WithPluginState } from '@atlaskit/editor-common/with-plugin-state';
import type { LimitedModePluginState } from '@atlaskit/editor-plugin-limited-mode';
import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import { DOMSerializer } from '@atlaskit/editor-prosemirror/model';
import {
	type EditorState,
	type PluginKey,
	type SelectionBookmark,
} from '@atlaskit/editor-prosemirror/state';
import type { EditorView, NodeView } from '@atlaskit/editor-prosemirror/view';
import { akEditorTableNumberColumnWidth } from '@atlaskit/editor-shared-styles';
import { TableMap } from '@atlaskit/editor-tables/table-map';
import { fg } from '@atlaskit/platform-feature-flags';

import { pluginConfig as getPluginConfig } from '../pm-plugins/create-plugin-config';
import { pluginKey as tableDragAndDropPluginKey } from '../pm-plugins/drag-and-drop/plugin-key';
import { getPluginState } from '../pm-plugins/plugin-factory';
import { pluginKey } from '../pm-plugins/plugin-key';
import { pluginKey as tableResizingPluginKey } from '../pm-plugins/table-resizing/plugin-key';
import { pluginKey as tableWidthPluginKey } from '../pm-plugins/table-width';
import { isTableNested } from '../pm-plugins/utils/nodes';
import type { PluginInjectionAPI } from '../types';

import TableComponent from './TableComponent';
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
		);
		this.getPos = props.getPos;
		this.eventDispatcher = props.eventDispatcher;
		this.options = props.options;
		this.getEditorFeatureFlags = props.getEditorFeatureFlags;

		this.handleRef = (node: HTMLElement | null) => this._handleTableRef(node);
	}

	getContentDOM() {
		const tableDOMStructure = tableNodeSpecWithFixedToDOM({
			allowColumnResizing: !!this.reactComponentProps.allowColumnResizing,
			tableResizingEnabled: !!this.reactComponentProps.allowTableResizing,
			getEditorContainerWidth: this.reactComponentProps.getEditorContainerWidth,
		}).toDOM(this.node);

		const rendered = DOMSerializer.renderSpec(document, tableDOMStructure) as {
			dom: HTMLElement;
			contentDOM?: HTMLElement;
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
			this.ignoreMutation = (m: MutationRecord | { type: string; target: Node }) => {
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
			return;
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
		if (fg('platform_editor_table_use_shared_state_hook_fg')) {
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
		// Please, do not copy or use this kind of code below
		// @ts-ignore
		const fakePluginKey = {
			key: 'widthPlugin$',
			getState: (state: EditorState) => {
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				return (state as any)['widthPlugin$'];
			},
		} as PluginKey;

		// Please, do not copy or use this kind of code below
		// @ts-ignore
		const fakeMediaPluginKey = {
			key: 'mediaPlugin$',
			getState: (state: EditorState) => {
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				return (state as any)['mediaPlugin$'];
			},
		} as PluginKey;

		return (
			<WithPluginState
				plugins={{
					pluginState: pluginKey,
					tableResizingPluginState: tableResizingPluginKey,
					tableWidthPluginState: tableWidthPluginKey,
					widthPlugin: fakePluginKey,
					mediaState: fakeMediaPluginKey,
					tableDragAndDropState: tableDragAndDropPluginKey,

					limitedModePlugin: props.pluginInjectionApi?.limitedMode?.sharedState.currentState()
						?.limitedModePluginKey as PluginKey<LimitedModePluginState>,
				}}
				editorView={props.view}
				render={(pluginStates) => {
					const { tableResizingPluginState, tableWidthPluginState, pluginState, mediaState } =
						pluginStates;
					const containerWidth = props.getEditorContainerWidth();

					const isTableResizing = tableWidthPluginState?.resizing;
					const isResizing = Boolean(tableResizingPluginState?.dragging || isTableResizing);

					/**
					 *  ED-19810
					 *  There is a getPos issue coming from this code. We need to apply this workaround for now and apply a patch
					 *  directly to confluence since this bug is now in production.
					 */
					let tablePos: number | undefined;
					try {
						tablePos = props.getPos ? props.getPos() : undefined;
					} catch (e) {
						tablePos = undefined;
					}

					// Ignored via go/ees005
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					const tableActive = tablePos === pluginState!.tablePos && !isTableResizing;

					return (
						<TableComponent
							view={props.view}
							allowColumnResizing={props.allowColumnResizing}
							eventDispatcher={props.eventDispatcher}
							getPos={props.getPos}
							isMediaFullscreen={mediaState?.isFullscreen}
							options={props.options}
							// Ignored via go/ees005
							// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
							// Ignored via go/ees005
							// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
							allowControls={pluginState!.pluginConfig.allowControls!}
							// Ignored via go/ees005
							// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
							isHeaderRowEnabled={pluginState!.isHeaderRowEnabled}
							// Ignored via go/ees005
							// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
							isHeaderColumnEnabled={pluginState!.isHeaderColumnEnabled}
							// Ignored via go/ees005
							// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
							isDragAndDropEnabled={pluginState!.isDragAndDropEnabled}
							isTableScalingEnabled={props.options?.isTableScalingEnabled} // this.options?.isTableScalingEnabled same as TableOptions.isTableScalingEnabled same as pluginState.isTableScalingEnabled
							allowTableAlignment={props.allowTableAlignment}
							allowTableResizing={props.allowTableResizing}
							tableActive={tableActive}
							// Ignored via go/ees005
							// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
							ordering={pluginState!.ordering as TableColumnOrdering}
							isResizing={isResizing}
							getNode={this.getNode}
							// Ignored via go/ees005
							// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
							containerWidth={containerWidth!}
							contentDOM={forwardRef}
							getEditorFeatureFlags={props.getEditorFeatureFlags}
							dispatchAnalyticsEvent={props.dispatchAnalyticsEvent}
							pluginInjectionApi={props.pluginInjectionApi}
							limitedMode={pluginStates.limitedModePlugin?.documentSizeBreachesThreshold ?? false}
						/>
					);
				}}
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

	ignoreMutation(mutation: MutationRecord | { type: 'selection'; target: Node }) {
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
		isFullWidthModeEnabled,
		wasFullWidthModeEnabled,
		isDragAndDropEnabled,
		isTableScalingEnabled, // same as options.isTableScalingEnabled
	} = getPluginState(view.state);

	// Use shared state for isFullWidthModeEnabled and wasFullWidthModeEnabled for most up-to-date values
	const tableState = pluginInjectionApi?.table?.sharedState.currentState();

	const { allowColumnResizing, allowControls, allowTableResizing, allowTableAlignment } =
		getPluginConfig(pluginConfig);

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
			isFullWidthModeEnabled: fg('platform_editor_table_overflow_in_full_width_fix')
				? tableState?.isFullWidthModeEnabled
				: isFullWidthModeEnabled,
			wasFullWidthModeEnabled: fg('platform_editor_table_overflow_in_full_width_fix')
				? tableState?.wasFullWidthModeEnabled
				: wasFullWidthModeEnabled,
			isDragAndDropEnabled,
			isTableScalingEnabled, // same as options.isTableScalingEnabled
			isCommentEditor,
			isChromelessEditor,
		},
		getEditorContainerWidth,
		getEditorFeatureFlags,
		dispatchAnalyticsEvent,
		pluginInjectionApi,
	}).init();
};
