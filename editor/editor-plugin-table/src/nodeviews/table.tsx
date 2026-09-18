import React from 'react';

import type { IntlShape } from 'react-intl';

import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import { getTableContainerWidth } from '@atlaskit/editor-common/node-width';
import type { PortalProviderAPI } from '@atlaskit/editor-common/portal';
import ReactNodeView from '@atlaskit/editor-common/react-node-view';
import { isTableInContentMode } from '@atlaskit/editor-common/table';
import type {
	GetEditorContainerWidth,
	GetEditorFeatureFlags,
	getPosHandler,
	getPosHandlerNode,
} from '@atlaskit/editor-common/types';
import {
	applyContentVisibility,
	estimateTableIntrinsicHeight,
} from '@atlaskit/editor-common/utils/content-visibility';
import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import { DOMSerializer } from '@atlaskit/editor-prosemirror/model';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorState, SelectionBookmark } from '@atlaskit/editor-prosemirror/state';
import type {
	Decoration,
	DecorationSource,
	EditorView,
	NodeView,
} from '@atlaskit/editor-prosemirror/view';
import { akEditorTableNumberColumnWidth } from '@atlaskit/editor-shared-styles';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import { TableMap } from '@atlaskit/editor-tables/table-map';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { pluginConfig as getPluginConfig } from '../pm-plugins/create-plugin-config';
import { getPluginState } from '../pm-plugins/plugin-factory';
import { pluginKey as tableWidthPluginKey } from '../pm-plugins/table-width';
import { isTableNested, tablesHaveDifferentColumnWidths } from '../pm-plugins/utils/nodes';
import { isContentModeSupported } from '../pm-plugins/utils/tableMode/is-content-mode-supported';
import type { PluginInjectionAPI } from '../types';
import { RoundedTableEdges } from './rounded-table-edges';
import { TableComponentWithSharedState } from './TableComponentWithSharedState';
import { TableSSRReactContextsProvider } from './TableSSRReactContextsProvider';
import { tableNodeSpecWithFixedToDOM } from './toDOM';
import type { Props, TableOptions } from './types';

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
	private roundedTableEdges: RoundedTableEdges | undefined;
	private intl?: IntlShape;
	private isNestedTable = false;
	eventDispatcher?: EventDispatcher;
	getPos: getPosHandlerNode;
	options: TableOptions | undefined;
	getEditorFeatureFlags: GetEditorFeatureFlags;

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
		this.intl = props.intl;

		if (expValEquals('platform_editor_table_q4_loveability', 'isEnabled', true)) {
			this.roundedTableEdges = new RoundedTableEdges(() => this.table, props.node);
		}

		this.handleRef = (node: Element | null) => this._handleTableRef(node);
	}

	getContentDOM(): {
		contentDOM?: HTMLElement;
		dom: HTMLElement;
	} {
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

			this.isNestedTable = isNested;
			this.updateContentVisibility();
			const allowFixedColumnWidthOption =
				this.reactComponentProps?.allowFixedColumnWidthOption || false;

			if (
				!this.options?.isTableScalingEnabled ||
				(this.options?.isTableScalingEnabled &&
					allowFixedColumnWidthOption &&
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
	private _handleTableRef(node: Element | null) {
		let oldIgnoreMutation: (mutation: MutationRecord) => boolean;

		let selectionBookmark: SelectionBookmark;
		let mutationsIgnored = false;

		// Only proceed if we have both a node and table, and the table isn't already inside the node
		if (node && this.table && !node.contains(this.table)) {
			// Patch to prevent selection collapsing when moving the table down with ctrl + shift + down
			const selectionBeforeMove = this.view.state.selection;
			const shouldPreserveCellSelection =
				isExperimentEnabled('platform_editor_fix_table_move_shortcut') &&
				selectionBeforeMove instanceof CellSelection;

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
				return (
					!isSelectionMutation ||
					(shouldPreserveCellSelection && this.view.state.selection.eq(selectionBeforeMove))
				);
			};

			// Store the current selection state if there is a visible selection
			// This lets us restore it after DOM changes
			const { selection } = this.view.state;
			const tablePos = this.getPos();
			if (
				selection.empty &&
				tablePos &&
				TextSelection.near(this.view.state.doc.resolve(tablePos)).from === selection.from
			) {
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
			// In SSR the portal renders via `container.innerHTML = html` (portal/common.tsx), which detaches
			// `renderedDOM` from `dom` before this runs; require it to still be a child so `removeChild` doesn't throw
			// `NotFoundError` (which would make EditorSSRRenderer fall back to the position-blind schema toDOM and lose
			// nested detection).
			if (this.dom && this.renderedDOM && this.renderedDOM.parentNode === this.dom) {
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

					/**
					 * This handles a very specific case only -> insertion by the user of a new
					 * table
					 * Since it's behind a RAF it's possible the user has clicked elsewhere or
					 * it affects collaborative users (which selection changes shouldn't ever)
					 *
					 * This ensures that the selectionBookmark *before* is inside the first
					 * position in the table and that after it is the text position directly
					 * before the table
					 * Ideally we want to remove this RAF entirely but that would require removing
					 * the DOM manipulation and is a more complex effort
					 */
					if (
						!resolvedSelection.eq(this.view.state.selection) &&
						resolvedSelection.empty &&
						// Ensure that the *next* valid text position matches the first position
						// in the table
						TextSelection.findFrom(
							this.view.state.doc.resolve(this.view.state.selection.from + 1),
							1,
							true,
						)?.eq(resolvedSelection)
					) {
						const tr = this.view.state.tr.setSelection(resolvedSelection);
						tr.setMeta('source', 'TableNodeView:_handleTableRef:selection-resync');
						this.view.dispatch(tr);
					}
				}
			});
		}
	}

	setDomAttrs(node: PmNode): void {
		if (!this.table) {
			return; // width / attribute application to actual table will happen later when table is set
		}
		const attrs = tableAttributes(node) as Record<string, string>;

		// render table with content-mode attribute which removes all width constraints from the table
		// fire exposure here
		if (
			isTableInContentMode({
				tableNode: node,
				isSupported: isContentModeSupported({
					allowColumnResizing: !!this.reactComponentProps.allowColumnResizing,
					allowTableResizing: !!this.reactComponentProps.allowTableResizing,
					isFullPageEditor:
						!this.reactComponentProps.options?.isCommentEditor &&
						!this.reactComponentProps.options?.isChromelessEditor,
				}),
				isTableNested: isTableNested(this.view.state, this.getPos()),
			})
		) {
			attrs['data-initial-width-mode'] = 'content';
		}

		(Object.keys(attrs) as Array<keyof typeof attrs>).forEach((attr) => {
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			this.table!.setAttribute(attr, attrs[attr]);
		});

		const isTableFixedColumnWidthsOptionEnabled =
			this.reactComponentProps?.allowFixedColumnWidthOption || false;
		// Preserve Table Width cannot have inline width set on the table
		if (
			!this.options?.isTableScalingEnabled ||
			(this.options?.isTableScalingEnabled &&
				isTableFixedColumnWidthsOptionEnabled &&
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

	getNode = (): PmNode => {
		return this.node;
	};

	private updateContentVisibility(): void {
		if (this.isNestedTable || !this.table) {
			return;
		}
		// Read limited mode from the nodeView's own `this.view.state` via the plugin key exposed on
		// the (already-typed) shared state, NOT `currentState().enabled`: during initial EditorView
		// construction the injection API's editor state is undefined, so `.enabled` reads a stale false.
		//
		// Reads the plugin's derived `enabled`, so this covers every reason limited mode can be on.
		const limitedMode = this.reactComponentProps.pluginInjectionApi?.limitedMode;
		const enabled = Boolean(
			limitedMode?.sharedState.currentState()?.limitedModePluginKey?.getState(this.view.state)
				?.enabled,
		);
		const applied = applyContentVisibility(this.table, enabled, () => ({
			// The `<table>` is content-sized (`display: table`), so it needs an explicit intrinsic
			// width or it collapses to 0 wide while contained. `getTableContainerWidth` covers
			// wide/full-width tables; explicit inline widths (resizable tables) simply override it.
			width: getTableContainerWidth(this.node),
			height: estimateTableIntrinsicHeight(this.node),
		}));
		// Marker for the shared table CSS: when content-visibility (→ contain: paint) is actually
		// applied, it pulls the `::after` outer-border overlay from `inset: -0.5px` to `inset: 0` so
		// paint clipping doesn't shave the border. Keyed off the real applied style so it stays in
		// sync with the gate inside applyContentVisibility.
		this.table.toggleAttribute('data-content-visibility', applied);
	}

	update(
		node: PmNode,
		decorations: ReadonlyArray<Decoration>,
		innerDecorations?: DecorationSource,
		validUpdate?: (currentNode: PmNode, newNode: PmNode) => boolean,
	): boolean {
		const didUpdate = super.update(node, decorations, innerDecorations, validUpdate);

		// Keep the rounded-corner edge attrs in sync with structural changes (rows/columns
		// added, removed, merged, or reordered via drag-and-drop) that the cells themselves
		// can miss.
		if (didUpdate) {
			this.updateContentVisibility();
		}

		if (didUpdate && expValEquals('platform_editor_table_q4_loveability', 'isEnabled', true)) {
			this.roundedTableEdges?.handleUpdate(node);
		}
		return didUpdate;
	}

	render(props: Props, forwardRef: ForwardRef): React.JSX.Element {
		return (
			<TableSSRReactContextsProvider intl={this.intl}>
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
					allowFixedColumnWidthOption={props.allowFixedColumnWidthOption}
				/>
			</TableSSRReactContextsProvider>
		);
	}

	private hasHoveredRows = false;
	viewShouldUpdate(nextNode: PmNode): boolean {
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

		if (tablesHaveDifferentColumnWidths(node, nextNode)) {
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

	ignoreMutation(mutation: MutationRecord | { target: Node; type: 'selection' }): boolean {
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

		if (!this.contentDOM) {
			return true;
		}
		return !this.contentDOM.contains(mutation.target) && mutation.type !== 'selection';
	}

	destroy(): void {
		if (expValEquals('platform_editor_table_q4_loveability', 'isEnabled', true)) {
			this.roundedTableEdges?.destroy();
		}

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
	allowFixedColumnWidthOption?: boolean,
	intl?: IntlShape,
): NodeView => {
	const {
		pluginConfig,
		isTableScalingEnabled, // same as options.isTableScalingEnabled
	} = getPluginState(view.state);

	// Use shared state for isFullWidthModeEnabled and wasFullWidthModeEnabled for most up-to-date values
	const tableState = pluginInjectionApi?.table?.sharedState.currentState();

	const { allowColumnResizing, allowControls, allowTableResizing, allowTableAlignment } =
		getPluginConfig(pluginConfig);

	const isTableFixedColumnWidthsOptionEnabled = allowFixedColumnWidthOption || false;

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
			isTableScalingEnabled, // same as options.isTableScalingEnabled
			isCommentEditor,
			isChromelessEditor,
			shouldUseIncreasedScalingPercent,
		},
		getEditorContainerWidth,
		getEditorFeatureFlags,
		dispatchAnalyticsEvent,
		pluginInjectionApi,
		allowFixedColumnWidthOption,
		intl,
	}).init();
};
