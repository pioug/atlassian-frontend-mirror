import type { CSSProperties } from 'react';
import React from 'react';

import classnames from 'classnames';
import memoizeOne from 'memoize-one';
import rafSchedule from 'raf-schd';
import type { IntlShape } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import type { TableColumnOrdering } from '@atlaskit/custom-steps';
import { ACTION_SUBJECT, EVENT_TYPE, TABLE_ACTION } from '@atlaskit/editor-common/analytics';
import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import { tintDirtyTransaction } from '@atlaskit/editor-common/collab';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import { getParentOfTypeCount } from '@atlaskit/editor-common/nesting';
import { nodeVisibilityManager } from '@atlaskit/editor-common/node-visibility';
import { getParentNodeWidth, getTableContainerWidth } from '@atlaskit/editor-common/node-width';
import { tableMarginSides } from '@atlaskit/editor-common/styles';
import type { EditorContainerWidth, GetEditorFeatureFlags } from '@atlaskit/editor-common/types';
import { browser, isValidPosition } from '@atlaskit/editor-common/utils';
import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import {
	akEditorTableNumberColumnWidth,
	akEditorTableToolbarSize as tableToolbarSize,
} from '@atlaskit/editor-shared-styles';
import { findTable, isTableSelected } from '@atlaskit/editor-tables/utils';
import { fg } from '@atlaskit/platform-feature-flags';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import type { CleanupFn } from '@atlaskit/pragmatic-drag-and-drop/types';
import UFOLoadHold from '@atlaskit/react-ufo/load-hold';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { token } from '@atlaskit/tokens';

import { autoSizeTable, clearHoverSelection } from '../pm-plugins/commands';
import { autoScrollerFactory } from '../pm-plugins/drag-and-drop/utils/autoscrollers';
import { getPluginState } from '../pm-plugins/plugin-factory';
import { pluginKey as stickyHeadersPluginKey } from '../pm-plugins/sticky-headers/plugin-key';
import type { RowStickyState, StickyPluginState } from '../pm-plugins/sticky-headers/types';
import { findStickyHeaderForTable } from '../pm-plugins/sticky-headers/util';
import { META_KEYS } from '../pm-plugins/table-analytics';
import {
	insertColgroupFromNode,
	hasTableBeenResized,
} from '../pm-plugins/table-resizing/utils/colgroup';
import {
	COLUMN_MIN_WIDTH,
	TABLE_EDITOR_MARGIN,
	TABLE_OFFSET_IN_COMMENT_EDITOR,
} from '../pm-plugins/table-resizing/utils/consts';
import { updateControls } from '../pm-plugins/table-resizing/utils/dom';
import {
	getLayoutSize,
	getScalingPercentForTableWithoutWidth,
	getTableScalingPercent,
} from '../pm-plugins/table-resizing/utils/misc';
import { getResizeState, updateColgroup } from '../pm-plugins/table-resizing/utils/resize-state';
import { scaleTable } from '../pm-plugins/table-resizing/utils/scale-table';
import {
	containsHeaderRow,
	isTableNested,
	isTableNestedInMoreThanOneNode,
	tablesHaveDifferentColumnWidths,
	tablesHaveDifferentNoOfColumns,
	tablesHaveDifferentNoOfRows,
} from '../pm-plugins/utils/nodes';
import { getAssistiveMessage } from '../pm-plugins/utils/table';
import type { CellHoverMeta, PluginInjectionAPI } from '../types';
import { TableCssClassName as ClassName, ShadowEvent } from '../types';
import {
	handleMouseOut,
	handleMouseOver,
	isTableInFocus,
	withCellTracking,
} from '../ui/event-handlers';
import TableFloatingColumnControls from '../ui/TableFloatingColumnControls';
// Ignored via go/ees005
// eslint-disable-next-line import/no-named-as-default
import TableFloatingControls from '../ui/TableFloatingControls';

import { ExternalDropTargets } from './ExternalDropTargets';
import { OverflowShadowsObserver } from './OverflowShadowsObserver';
import { TableContainer } from './TableContainer';
import { TableStickyScrollbar } from './TableStickyScrollbar';
import type { TableOptions } from './types';

const isIE11 = browser.ie_version === 11;
// When table is inserted via paste, keyboard shortcut or quickInsert,
// componentDidUpdate is called multiple times. The isOverflowing value is correct only on the last update.
// To make sure we capture the last update, we use setTimeout.
const initialOverflowCaptureTimeroutDelay = 300;

// This is a hard switch for controlling whether the overflow analytics should be dispatched. There has been 6months of data
// already collected which we could use but have not. This has been disabled rather then removed entirely in the event that
// the current collected data becomes stale and we want to start collecting fresh data again in future.
// PLEASE NOTE: that the current way this alaytics has been configured WILL cause reflows to occur. This is why the has been disabled.
const isOverflowAnalyticsEnabled = false;

// Prevent unnecessary parentWidth updates when table is nested inside of a node that is nested itself.
const NESTED_TABLE_IN_NESTED_PARENT_WIDTH_DIFF_MIN_THRESHOLD = 2;
const NESTED_TABLE_IN_NESTED_PARENT_WIDTH_DIFF_MAX_THRESHOLD = 20;

interface ComponentProps {
	view: EditorView;
	getNode: () => PmNode;
	allowColumnResizing?: boolean;
	eventDispatcher: EventDispatcher;
	getPos: () => number | undefined;
	options?: TableOptions;

	contentDOM: (node: HTMLElement | null) => void;
	containerWidth: EditorContainerWidth;
	allowControls?: boolean;

	allowTableResizing?: boolean;
	allowTableAlignment?: boolean;

	isHeaderRowEnabled: boolean;
	isHeaderColumnEnabled: boolean;
	isMediaFullscreen?: boolean;
	isDragAndDropEnabled?: boolean;
	isTableScalingEnabled?: boolean;
	tableActive: boolean;
	ordering?: TableColumnOrdering;
	isResizing?: boolean;
	getEditorFeatureFlags: GetEditorFeatureFlags;
	dispatchAnalyticsEvent: DispatchAnalyticsEvent;
	pluginInjectionApi?: PluginInjectionAPI;
	intl: IntlShape;

	// marking props as optional to ensure backward compatibility when platform_editor_table_use_shared_state_hook_fg disabled
	isInDanger?: boolean;
	hoveredRows?: number[];
	hoveredCell?: CellHoverMeta;
	isTableHovered?: boolean;
	isWholeTableInDanger?: boolean;
	selection?: Selection;
}

interface TableState {
	scroll: number;
	parentWidth?: number;
	stickyHeader?: RowStickyState;
	[ShadowEvent.SHOW_BEFORE_SHADOW]: boolean;
	[ShadowEvent.SHOW_AFTER_SHADOW]: boolean;
	tableWrapperWidth?: number;
	tableWrapperHeight?: number;
}

// Generate a unique ID to prevent collisions when multiple plugin versions exist on the same page
const generateUniqueTableId = () => {
	// Use crypto.randomUUID() if available, fallback to Math.random() based approach
	if (!globalThis.crypto || typeof globalThis.crypto.randomUUID !== 'function') {
		// Fallback: for older environments (IE).
		// Not the best fallback, but the crypto.randomUUID is widely available
		return (Math.random() + 1).toString(36).substring(20);
	}
	return crypto.randomUUID();
};

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
class TableComponent extends React.Component<ComponentProps, TableState> {
	static displayName = 'TableComponent';

	state: TableState = {
		scroll: 0,
		parentWidth: undefined,
		[ShadowEvent.SHOW_BEFORE_SHADOW]: false,
		[ShadowEvent.SHOW_AFTER_SHADOW]: false,
		tableWrapperWidth: undefined,
		tableWrapperHeight: undefined,
	};

	private wrapper?: HTMLDivElement | null;
	private table?: HTMLTableElement | null;
	private node: PmNode;
	private containerWidth?: EditorContainerWidth;
	private wasResizing?: boolean;
	private tableNodeWidth?: number;
	private layoutSize?: number;
	private overflowShadowsObserver?: OverflowShadowsObserver;
	private stickyScrollbar?: TableStickyScrollbar;

	private isInitialOverflowSent: boolean;
	private isNestedInTable: boolean;
	private initialOverflowCaptureTimerId?: ReturnType<typeof setTimeout>;
	private resizeObserver?: ResizeObserver;

	private wrapperWidth?: number;
	private wrapperReisizeObserver?: ResizeObserver;

	private updateColGroupFromFullWidthChange?: boolean;

	private dragAndDropCleanupFn?: CleanupFn;
	private nodeVisibilityObserverCleanupFn?: CleanupFn;
	private holdCompleted = false;
	private dispatchEventName = `tableResized-${generateUniqueTableId()}`;

	constructor(props: ComponentProps) {
		super(props);
		const { options, containerWidth, getNode } = props;
		this.node = getNode();
		this.containerWidth = containerWidth;

		const tablePos = props.getPos();

		this.isNestedInTable = tablePos
			? getParentOfTypeCount(props.view.state.schema.nodes.table)(
					props.view.state.doc.resolve(tablePos),
				) > 0
			: false;

		this.isInitialOverflowSent = false;

		if (!this.updateColGroupFromFullWidthChange) {
			this.updateColGroupFromFullWidthChange =
				options?.isFullWidthModeEnabled && !options?.wasFullWidthModeEnabled;
		}

		// store table size using previous full-width mode so can detect if it has changed.
		const isFullWidthModeEnabled = options ? options.wasFullWidthModeEnabled : false;
		this.layoutSize = this.tableNodeLayoutSize(this.node, containerWidth.width, {
			isFullWidthModeEnabled,
		});

		this.resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				this.setState((prev) => {
					return prev?.tableWrapperWidth === entry.contentRect?.width &&
						prev?.tableWrapperHeight === entry.contentRect?.height
						? prev
						: {
								...prev,
								tableWrapperWidth: entry.contentRect.width,
								tableWrapperHeight: entry.contentRect.height,
							};
				});
			}
		});

		// Disable inline table editing and resizing controls in Firefox
		// https://github.com/ProseMirror/prosemirror/issues/432
		if ('execCommand' in document) {
			['enableObjectResizing', 'enableInlineTableEditing'].forEach((cmd) => {
				if (document.queryCommandSupported(cmd)) {
					document.execCommand(cmd, false, 'false');
				}
			});
		}
	}

	private handleMouseOut = (event: Event) => {
		if (!isTableInFocus(this.props.view)) {
			return false;
		}
		return handleMouseOut(this.props.view, event);
	};

	private handleMouseOver = (event: Event) => {
		if (!isTableInFocus(this.props.view)) {
			return false;
		}
		return withCellTracking(handleMouseOver)(this.props.view, event);
	};

	componentDidMount() {
		const { observe } = nodeVisibilityManager(this.props.view.dom);
		if (this.table) {
			this.nodeVisibilityObserverCleanupFn = observe({
				element: this.table,
				onFirstVisible: () => {
					this.initialiseEventListenersAfterMount();
					// force width calculcation - missed resize event under firefox when
					// table is nested within bodied extension
					if (this.wrapper && fg('platform_editor_nodevisibility_resize_sync')) {
						this.wrapperWidth = this.wrapper?.clientWidth;
					}
				},
			});
		}
	}

	initialiseEventListenersAfterMount() {
		const {
			allowColumnResizing,
			allowTableResizing,
			eventDispatcher,
			isDragAndDropEnabled,
			getNode,
			getEditorFeatureFlags,
			isTableScalingEnabled,
		} = this.props;

		// Ignored via go/ees005
		// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
		this?.table?.addEventListener('mouseenter', this.handleMouseEnter);

		// Ignored via go/ees005
		// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
		this?.table?.addEventListener('mouseout', this.handleMouseOut);

		// Ignored via go/ees005
		// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
		this?.table?.addEventListener('mouseover', this.handleMouseOver);

		const { tableWithFixedColumnWidthsOption = false } = getEditorFeatureFlags();

		if (isTableScalingEnabled && !tableWithFixedColumnWidthsOption) {
			this.handleColgroupUpdates(true);
		}

		if (
			isTableScalingEnabled &&
			tableWithFixedColumnWidthsOption &&
			getNode().attrs.displayMode !== 'fixed'
		) {
			this.handleColgroupUpdates(true);
		}

		if (this.wrapper) {
			this.wrapperReisizeObserver = new ResizeObserver((entries) => {
				for (const entry of entries) {
					this.wrapperWidth = entry.contentRect?.width;
				}
			});

			this.wrapperReisizeObserver.observe(this.wrapper);
		}

		if (allowColumnResizing && this.wrapper && !isIE11) {
			// Ignored via go/ees005
			// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
			this.wrapper.addEventListener('scroll', this.handleScrollDebounced, {
				passive: true,
			});

			if (fg('disable-sticky-scrollbar-for-nested-tables')) {
				if (this.table && !this.isNestedInTable) {
					this.stickyScrollbar = new TableStickyScrollbar(this.wrapper, this.props.view);
				}
			} else {
				if (this.table) {
					this.stickyScrollbar = new TableStickyScrollbar(this.wrapper, this.props.view);
				}
			}

			if (isDragAndDropEnabled) {
				this.dragAndDropCleanupFn = combine(
					...autoScrollerFactory({
						tableWrapper: this.wrapper,
						getNode,
					}),
				);
			}
		}

		if (allowColumnResizing) {
			/**
			 * We no longer use `containerWidth` as a variable to determine an update for table resizing (avoids unnecessary updates).
			 * Instead we use the resize event to only trigger updates when necessary.
			 */
			if (!allowTableResizing) {
				// Ignored via go/ees005
				// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
				window.addEventListener('resize', this.handleWindowResizeDebounced);
			}
			this.handleTableResizingDebounced();
		}

		const currentStickyState = stickyHeadersPluginKey.getState(this.props.view.state);

		if (currentStickyState) {
			this.onStickyState(currentStickyState);
		}

		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		eventDispatcher.on((stickyHeadersPluginKey as any).key, this.onStickyState);

		if (isOverflowAnalyticsEnabled) {
			const initialIsOveflowing =
				this.state[ShadowEvent.SHOW_BEFORE_SHADOW] || this.state[ShadowEvent.SHOW_AFTER_SHADOW];

			this.setTimerToSendInitialOverflowCaptured(initialIsOveflowing);
		}
	}

	componentWillUnmount() {
		const { allowColumnResizing, allowTableResizing, eventDispatcher, isDragAndDropEnabled } =
			this.props;
		if (this.wrapper && !isIE11) {
			// Ignored via go/ees005
			// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
			this.wrapper.removeEventListener('scroll', this.handleScrollDebounced);
		}

		if (isDragAndDropEnabled && this.dragAndDropCleanupFn) {
			this.dragAndDropCleanupFn();
		}

		if (this.nodeVisibilityObserverCleanupFn) {
			this.nodeVisibilityObserverCleanupFn();
		}

		this.resizeObserver?.disconnect();
		this.wrapperReisizeObserver?.disconnect();

		if (this.stickyScrollbar) {
			this.stickyScrollbar.dispose();
		}

		this.handleScrollDebounced.cancel();
		this.scaleTableDebounced.cancel();
		this.handleTableResizingDebounced.cancel();
		this.handleAutoSizeDebounced.cancel();
		if (!allowTableResizing) {
			this.handleWindowResizeDebounced.cancel();
		}

		if (!allowTableResizing && allowColumnResizing) {
			// Ignored via go/ees005
			// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
			window.removeEventListener('resize', this.handleWindowResizeDebounced);
		}

		// Ignored via go/ees005
		// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
		this?.table?.removeEventListener('mouseenter', this.handleMouseEnter);

		// Ignored via go/ees005
		// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
		this?.table?.removeEventListener('mouseout', this.handleMouseOut);

		// Ignored via go/ees005
		// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
		this?.table?.removeEventListener('mouseover', this.handleMouseOver);

		if (this.overflowShadowsObserver) {
			this.overflowShadowsObserver.dispose();
		}

		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		eventDispatcher.off((stickyHeadersPluginKey as any).key, this.onStickyState);

		if (this.initialOverflowCaptureTimerId) {
			clearTimeout(this.initialOverflowCaptureTimerId);
		}
	}

	handleMouseEnter = () => {
		const node = this.props.getNode();
		const pos = this.props.getPos();
		const tr = this.props.view.state.tr;
		const tableId = node.attrs.localId;
		tr.setMeta('mouseEnterTable', [tableId, node, pos]);
		this.props.view.dispatch(tr);
	};

	// Should be called only when table node width is reset to undefined in Comment Editor
	// Maybe replaced by handleColgroupUpdates as we implement new table's support in Comment Editor.
	removeInlineTableWidth() {
		const { isResizing, getNode, view, getPos } = this.props;
		if (!this.table) {
			return;
		}

		const tableNode = getNode();
		const newTableWidth = tableNode.attrs.width;

		const start = getPos() || 0;
		const depth = view.state.doc.resolve(start).depth;
		if (depth !== 0) {
			return;
		}

		if (!isResizing && newTableWidth === null) {
			this.table.style.width = '';
		}
	}

	handleColgroupUpdates(force = false) {
		const { getNode, containerWidth, isResizing, view, getPos, getEditorFeatureFlags, options } =
			this.props;

		if (!this.table) {
			return;
		}

		// Remove any widths styles after resizing preview is completed
		this.table.style.width = '';
		const tableNode = getNode();
		const start = getPos() || 0;
		const depth = view.state.doc.resolve(start).depth;

		if (depth !== 0) {
			return;
		}

		let tableNodeWidth = getTableContainerWidth(tableNode);
		const isTableResizedFullWidth = tableNodeWidth === 1800 && this.wasResizing && !isResizing;

		// Needed for undo / redo
		const isTableWidthChanged = tableNodeWidth !== this.tableNodeWidth;

		const tableRenderWidth = options?.isCommentEditor
			? containerWidth.width - (TABLE_OFFSET_IN_COMMENT_EDITOR + 1) // should be the same as this.table.parentElement?.clientWidth - 1, subtract 1 to avoid overflow
			: containerWidth.width - TABLE_EDITOR_MARGIN;

		tableNodeWidth =
			options?.isCommentEditor && !tableNode.attrs.width ? tableRenderWidth : tableNodeWidth;

		const isTableSquashed = tableRenderWidth < tableNodeWidth;
		const isNumberColumnChanged =
			tableNode.attrs.isNumberColumnEnabled !== this.node.attrs.isNumberColumnEnabled;
		const isNumberOfColumnsChanged = tablesHaveDifferentNoOfColumns(tableNode, this.node);

		const { width: containerWidthValue, lineLength: containerLineLength } = containerWidth;
		const isLineLengthChanged = this.containerWidth?.lineLength !== containerLineLength;

		const isFullWidthModeAndLineLengthChanged =
			this.updateColGroupFromFullWidthChange &&
			isLineLengthChanged &&
			fg('platform_editor_table_overflow_in_full_width_fix');

		const maybeScale =
			isTableSquashed ||
			isTableWidthChanged ||
			(isTableResizedFullWidth && !options?.isCommentEditor) ||
			isNumberColumnChanged ||
			isNumberOfColumnsChanged;

		if (force || maybeScale || isFullWidthModeAndLineLengthChanged) {
			const isWidthChanged = this.containerWidth?.width !== containerWidthValue;
			const wasTableResized = hasTableBeenResized(this.node);
			const isTableResized = hasTableBeenResized(tableNode);
			const isColumnsDistributed = wasTableResized && !isTableResized;
			const isTableDisplayModeChanged = this.node.attrs.displayMode !== tableNode.attrs.displayMode;
			const shouldUpdateColgroup =
				isWidthChanged ||
				isColumnsDistributed ||
				isTableResizedFullWidth ||
				isTableWidthChanged ||
				isTableDisplayModeChanged ||
				isNumberColumnChanged ||
				isNumberOfColumnsChanged ||
				isFullWidthModeAndLineLengthChanged;

			const { tableWithFixedColumnWidthsOption = false } = getEditorFeatureFlags();

			const isTableScalingWithFixedColumnWidthsOptionEnabled =
				!!this.props.options?.isTableScalingEnabled && tableWithFixedColumnWidthsOption;

			const shouldUseIncreasedScalingPercent =
				isTableScalingWithFixedColumnWidthsOptionEnabled ||
				(!!this.props.options?.isTableScalingEnabled && !!this.props.options?.isCommentEditor);

			if (force || (!isResizing && shouldUpdateColgroup)) {
				const resizeState = getResizeState({
					minWidth: COLUMN_MIN_WIDTH,
					// When numbered column enabled, we need to subtract the width of the numbered column
					maxSize: tableNode.attrs.isNumberColumnEnabled
						? tableRenderWidth - akEditorTableNumberColumnWidth
						: tableRenderWidth,
					table: tableNode,
					tableRef: this.table,
					start,
					domAtPos: view.domAtPos.bind(view),
					isTableScalingEnabled: true,
					shouldUseIncreasedScalingPercent,
					isCommentEditor: !!this.props.options?.isCommentEditor,
				});

				let shouldScaleOnColgroupUpdate = false;
				if (this.props.options?.isTableScalingEnabled && !tableWithFixedColumnWidthsOption) {
					shouldScaleOnColgroupUpdate = true;
				}

				if (
					isTableScalingWithFixedColumnWidthsOptionEnabled &&
					tableNode.attrs.displayMode !== 'fixed'
				) {
					shouldScaleOnColgroupUpdate = true;
				}

				if (this.props.options?.isTableScalingEnabled && this.props.options?.isCommentEditor) {
					shouldScaleOnColgroupUpdate = true;
				}

				let scalePercent = 1;
				requestAnimationFrame(() => {
					// Scaling percent has to be calculated inside requestAnimationFrame, otherwise
					// renderWidth calculated as `tableRef?.parentElement?.clientWidth`
					// inside of getTableScalingPercent returns 0.
					if (
						!this.props.options?.isCommentEditor ||
						(this.props.options?.isCommentEditor && tableNode.attrs.width)
					) {
						scalePercent = getTableScalingPercent(
							tableNode,
							// Ignored via go/ees005
							// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
							this.table!,
							shouldUseIncreasedScalingPercent,
						);
					} else {
						// Ignored via go/ees005
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						scalePercent = getScalingPercentForTableWithoutWidth(tableNode, this.table!);
					}

					// Request animation frame required for Firefox
					updateColgroup(
						resizeState,
						// Ignored via go/ees005
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						this.table!,
						tableNode,
						shouldScaleOnColgroupUpdate,
						scalePercent,
					);

					if (expValEquals('cc_editor_ufo_hold_table_till_resize_complete', 'isEnabled', true)) {
						// Mark table as updated for TableHold component (if no table exists yet, the colgroup update will not have done anything)
						if (this.table && !this.holdCompleted) {
							const customTableResizedEvent = new CustomEvent(this.dispatchEventName);

							document.dispatchEvent(customTableResizedEvent);
							this.holdCompleted = true;
						}
					}
				});
			}
		}

		if (isFullWidthModeAndLineLengthChanged) {
			this.updateColGroupFromFullWidthChange = false;
		}

		this.tableNodeWidth = tableNodeWidth;
		this.wasResizing = isResizing;
		this.containerWidth = containerWidth;
	}

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	componentDidUpdate(_: any, prevState: TableState) {
		const {
			view,
			getNode,
			isMediaFullscreen,
			allowColumnResizing,
			allowTableResizing,
			isResizing,
			options,
			isTableScalingEnabled, // we could use options.isTableScalingEnabled here
			getPos,
			getEditorFeatureFlags,
		} = this.props;
		let { isInDanger } = this.props;

		const table = findTable(view.state.selection);

		if (!fg('platform_editor_table_use_shared_state_hook_fg')) {
			const pluginState = getPluginState(view.state);
			isInDanger = pluginState.isInDanger;
		}

		let shouldScale = false;
		let shouldHandleColgroupUpdates = false;
		const { tableWithFixedColumnWidthsOption = false } = getEditorFeatureFlags();

		if (isTableScalingEnabled && !tableWithFixedColumnWidthsOption) {
			shouldScale = true;
			shouldHandleColgroupUpdates = true;
		}

		const isTableScalingWithFixedColumnWidthsOptionEnabled =
			!!isTableScalingEnabled && tableWithFixedColumnWidthsOption;
		const shouldUseIncreasedScalingPercent =
			isTableScalingWithFixedColumnWidthsOptionEnabled ||
			(!!isTableScalingEnabled && !!this.props.options?.isCommentEditor);

		if (
			isTableScalingWithFixedColumnWidthsOptionEnabled &&
			getNode().attrs.displayMode !== 'fixed'
		) {
			shouldScale = true;
			shouldHandleColgroupUpdates = true;
		}

		if (shouldHandleColgroupUpdates) {
			this.handleColgroupUpdates();
		}

		if (isInDanger && !table) {
			clearHoverSelection()(view.state, view.dispatch);
		}

		if (
			this.props.options?.isCommentEditor &&
			allowTableResizing &&
			!options?.isTableScalingEnabled
		) {
			this.removeInlineTableWidth();
		}

		if (this.wrapper?.parentElement && this.table && !this.overflowShadowsObserver) {
			if (this.props.isDragAndDropEnabled) {
				// requestAnimationFrame is used here to fix a race condition issue
				// that happens when a table is nested in expand and expand's width is
				// changed via breakout button
				window.requestAnimationFrame(() => {
					this.overflowShadowsObserver = new OverflowShadowsObserver(
						this.updateShadowStateDebounced,
						// Ignored via go/ees005
						// eslint-disable-next-line @atlaskit/editor/no-as-casting
						this.table as HTMLElement,
						this.wrapper as HTMLDivElement,
					);
				});
			} else {
				this.overflowShadowsObserver = new OverflowShadowsObserver(
					this.updateShadowState,
					this.table,
					this.wrapper,
				);
			}
		}

		if (this.overflowShadowsObserver) {
			this.overflowShadowsObserver.observeShadowSentinels(this.state.stickyHeader?.sticky);
		}

		const currentTable = getNode();
		const previousTable = this.node;
		const isNoOfColumnsChanged = tablesHaveDifferentNoOfColumns(currentTable, previousTable);
		const isNoOfRowsChanged = tablesHaveDifferentNoOfRows(currentTable, previousTable);
		if (isNoOfColumnsChanged || isNoOfRowsChanged) {
			this.props.pluginInjectionApi?.accessibilityUtils?.actions.ariaNotify(
				getAssistiveMessage(previousTable, currentTable, this.props.intl),
				{ priority: 'important' },
			);
		}

		if (currentTable.attrs.__autoSize) {
			// Wait for next tick to handle auto sizing, gives the browser time to do layout calc etc.
			this.handleAutoSizeDebounced();
		}
		// re-drawing will cause media component get unmounted that will exit fullscreen mode if media is in fullscreen mode
		// see https://product-fabric.atlassian.net/browse/MEX-1290
		else if (allowColumnResizing && this.table && !isMediaFullscreen) {
			// If col widths (e.g. via collab) or number of columns (e.g. delete a column) have changed,
			// re-draw colgroup.
			if (tablesHaveDifferentColumnWidths(currentTable, previousTable) || isNoOfColumnsChanged) {
				const { view } = this.props;
				const shouldRecreateResizeCols =
					!allowTableResizing || !isResizing || (isNoOfColumnsChanged && isResizing);

				if (shouldRecreateResizeCols) {
					const start = getPos() || 0;
					const depth = view.state.doc.resolve(start).depth;
					shouldScale = depth === 0 && shouldScale;
					insertColgroupFromNode(
						this.table,
						currentTable,
						shouldScale,
						undefined,
						shouldUseIncreasedScalingPercent,
						options?.isCommentEditor,
					);
				}

				updateControls()(view.state);
			}

			this.handleTableResizingDebounced();
		}

		if (isOverflowAnalyticsEnabled) {
			const newIsOverflowing =
				this.state[ShadowEvent.SHOW_BEFORE_SHADOW] || this.state[ShadowEvent.SHOW_AFTER_SHADOW];

			const prevIsOverflowing =
				prevState[ShadowEvent.SHOW_BEFORE_SHADOW] || prevState[ShadowEvent.SHOW_AFTER_SHADOW];

			if (this.initialOverflowCaptureTimerId) {
				clearTimeout(this.initialOverflowCaptureTimerId);
			}

			if (!this.isInitialOverflowSent) {
				this.setTimerToSendInitialOverflowCaptured(newIsOverflowing);
			}

			if (this.isInitialOverflowSent && prevIsOverflowing !== newIsOverflowing) {
				const {
					dispatch,
					state: { tr },
				} = this.props.view;

				dispatch(
					tr.setMeta(META_KEYS.OVERFLOW_STATE_CHANGED, {
						isOverflowing: newIsOverflowing,
						wasOverflowing: prevIsOverflowing,
						editorWidth: this.props.containerWidth.width || 0,
						width: this.node.attrs.width || 0,
						parentWidth: this.state?.parentWidth || 0,
					}),
				);
			}
		}
	}

	private updateShadowState = (shadowKey: ShadowEvent, value: boolean) => {
		if (this.state[shadowKey] === value) {
			return;
		}
		this.setState({ [shadowKey]: value } as Pick<TableState, typeof shadowKey>);
	};

	private createShadowSentinels = (table: HTMLTableElement | null) => {
		if (table) {
			const shadowSentinelLeft = document.createElement('span');
			shadowSentinelLeft.className = ClassName.TABLE_SHADOW_SENTINEL_LEFT;
			const shadowSentinelRight = document.createElement('span');
			shadowSentinelRight.className = ClassName.TABLE_SHADOW_SENTINEL_RIGHT;
			table.prepend(shadowSentinelLeft);
			table.prepend(shadowSentinelRight);
		}
	};

	private observeTable(table: HTMLTableElement | null) {
		if (table) {
			this.resizeObserver?.observe(table);
		}
	}

	onStickyState = (state: StickyPluginState) => {
		const pos = this.props.getPos();
		if (!isValidPosition(pos, this.props.view.state)) {
			return;
		}
		const stickyHeader = findStickyHeaderForTable(state, pos);
		if (stickyHeader !== this.state.stickyHeader) {
			this.setState({ stickyHeader });
			if (this.overflowShadowsObserver) {
				this.overflowShadowsObserver.updateStickyShadows();
			}
		}
	};

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	prevTableState: any = null;

	render() {
		const {
			view,
			getNode,
			isResizing,
			allowControls = true,
			isHeaderRowEnabled,
			ordering,
			isHeaderColumnEnabled,
			tableActive,
			containerWidth,
			options,
			getPos,
			pluginInjectionApi,
			isDragAndDropEnabled,
			getEditorFeatureFlags,
			isTableScalingEnabled, // here we can use options.isTableScalingEnabled
			allowTableResizing,
			allowTableAlignment,
			selection,
		} = this.props;

		let { isInDanger, hoveredRows, hoveredCell, isTableHovered, isWholeTableInDanger } = this.props;

		const { showBeforeShadow, showAfterShadow } = this.state;
		const node = getNode();

		if (!fg('platform_editor_table_use_shared_state_hook_fg')) {
			const pluginState = getPluginState(view.state);
			isInDanger = pluginState.isInDanger;
			hoveredRows = pluginState.hoveredRows;
			hoveredCell = pluginState.hoveredCell;
			isTableHovered = pluginState.isTableHovered;
			isWholeTableInDanger = pluginState.isWholeTableInDanger;
		}

		const tableRef = this.table || undefined;
		const headerRow = tableRef
			? tableRef.querySelector<HTMLTableRowElement>('tr[data-header-row]')
			: undefined;

		const hasHeaderRow = containsHeaderRow(node);
		const rowControls = (
			<TableFloatingControls
				editorView={view}
				tableRef={tableRef}
				tableNode={node}
				tableActive={tableActive}
				hoveredRows={hoveredRows}
				hoveredCell={hoveredCell}
				isTableHovered={isTableHovered}
				isInDanger={isInDanger}
				isResizing={isResizing}
				isNumberColumnEnabled={node.attrs.isNumberColumnEnabled}
				isHeaderRowEnabled={isHeaderRowEnabled}
				isDragAndDropEnabled={isDragAndDropEnabled}
				ordering={ordering}
				isHeaderColumnEnabled={isHeaderColumnEnabled}
				hasHeaderRow={hasHeaderRow}
				// pass `selection` and `tableHeight` to control re-render
				selection={view.state.selection}
				headerRowHeight={headerRow ? headerRow.offsetHeight : undefined}
				stickyHeader={this.state.stickyHeader}
				tableWrapperWidth={this.state.tableWrapperWidth}
				api={pluginInjectionApi}
				isChromelessEditor={options?.isChromelessEditor}
			/>
		);
		const tableContainerWidth = getTableContainerWidth(node);
		const colControls = isDragAndDropEnabled ? (
			<TableFloatingColumnControls
				editorView={view}
				tableRef={tableRef}
				getNode={getNode}
				tableActive={tableActive}
				isInDanger={isInDanger}
				hoveredRows={hoveredRows}
				hoveredCell={hoveredCell}
				isTableHovered={isTableHovered}
				isResizing={isResizing}
				ordering={ordering}
				hasHeaderRow={hasHeaderRow}
				// pass `selection` to control re-render
				selection={view.state.selection}
				headerRowHeight={headerRow ? headerRow.offsetHeight : undefined}
				stickyHeader={this.state.stickyHeader}
				getEditorFeatureFlags={getEditorFeatureFlags}
				tableContainerWidth={tableContainerWidth}
				isNumberColumnEnabled={node.attrs.isNumberColumnEnabled}
				getScrollOffset={() => this.wrapper?.scrollLeft || 0}
				tableWrapperHeight={this.state.tableWrapperHeight}
				api={pluginInjectionApi}
				isChromelessEditor={options?.isChromelessEditor}
			/>
		) : null;

		const shadowPadding = allowControls && tableActive ? -tableToolbarSize : tableMarginSides;

		const shadowStyle = memoizeOne(
			(visible) => ({ visibility: visible ? 'visible' : 'hidden' }) as CSSProperties,
		);

		/**
		 *  ED-19838
		 *  There is a getPos issue coming from this code. We need to apply this workaround for now and apply a patch
		 *  before CR6 lands in production
		 */
		let tablePos: number | undefined;
		try {
			tablePos = getPos ? getPos() : undefined;
		} catch (e) {
			tablePos = undefined;
		}

		const isNested = isTableNested(view.state, tablePos);

		const topShadowPadding = isDragAndDropEnabled ? 0 : shadowPadding;
		const topOffset = 0;

		const topStickyShadowPosition =
			this.state.stickyHeader && topOffset + this.state.stickyHeader.padding + topShadowPadding + 2;

		const { tableWithFixedColumnWidthsOption = false } = getEditorFeatureFlags();

		const shouldUseIncreasedScalingPercent =
			!!isTableScalingEnabled &&
			(tableWithFixedColumnWidthsOption || !!this.props.options?.isCommentEditor);

		return (
			<TableContainer
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className={classnames(ClassName.TABLE_CONTAINER, {
					[ClassName.WITH_CONTROLS]: allowControls && tableActive,
					[ClassName.TABLE_STICKY]: this.state.stickyHeader && hasHeaderRow,
					[ClassName.HOVERED_DELETE_BUTTON]: isInDanger,
					[ClassName.TABLE_SELECTED]: isTableSelected(selection ?? view.state.selection),
					[ClassName.NESTED_TABLE_WITH_CONTROLS]:
						tableActive && allowControls && this.isNestedInTable,
				})}
				editorView={view}
				getPos={getPos}
				node={node}
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				tableRef={tableRef!}
				containerWidth={containerWidth}
				isNested={isNested}
				pluginInjectionApi={pluginInjectionApi}
				tableWrapperHeight={this.state.tableWrapperHeight}
				isTableResizingEnabled={allowTableResizing}
				isResizing={isResizing}
				isTableScalingEnabled={isTableScalingEnabled}
				isTableWithFixedColumnWidthsOptionEnabled={tableWithFixedColumnWidthsOption}
				isWholeTableInDanger={isWholeTableInDanger}
				isTableAlignmentEnabled={allowTableAlignment}
				shouldUseIncreasedScalingPercent={shouldUseIncreasedScalingPercent}
				isCommentEditor={options?.isCommentEditor}
				isChromelessEditor={options?.isChromelessEditor}
			>
				{expValEquals('cc_editor_ufo_hold_table_till_resize_complete', 'isEnabled', true) ? (
					<TableHold dispatchEventName={this.dispatchEventName} />
				) : null}
				<div
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className={ClassName.TABLE_STICKY_SENTINEL_TOP}
					data-testid="sticky-sentinel-top"
				/>
				{fg('disable-sticky-scrollbar-for-nested-tables') ? (
					!this.isNestedInTable && (
						<div
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
							className={ClassName.TABLE_STICKY_SCROLLBAR_SENTINEL_TOP}
							data-testid="sticky-scrollbar-sentinel-top"
						/>
					)
				) : (
					<div
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
						className={ClassName.TABLE_STICKY_SCROLLBAR_SENTINEL_TOP}
						data-testid="sticky-scrollbar-sentinel-top"
					/>
				)}

				{allowControls && rowControls}
				{isDragAndDropEnabled && (
					<ExternalDropTargets
						editorView={view}
						node={node}
						getScrollOffset={() => {
							return this.wrapper?.scrollLeft || 0;
						}}
						getTableWrapperWidth={() => {
							return this.wrapper?.clientWidth || 760;
						}}
					/>
				)}
				<div
					contentEditable={false}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					style={shadowStyle(showBeforeShadow)}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className={
						options?.isChromelessEditor && !isDragAndDropEnabled
							? ClassName.TABLE_LEFT_SHADOW + ' ' + ClassName.TABLE_CHROMELESS
							: ClassName.TABLE_LEFT_SHADOW
					}
				/>
				{this.state.stickyHeader && (
					<div
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
						className={`${ClassName.TABLE_LEFT_SHADOW} ${ClassName.TABLE_STICKY_SHADOW}`}
						style={{
							visibility: showBeforeShadow && hasHeaderRow ? 'visible' : 'hidden',
							top: `${topStickyShadowPosition}px`,
							paddingBottom: `${isDragAndDropEnabled && token('space.025', '2px')}`,
						}}
					/>
				)}
				<div
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className={classnames(ClassName.TABLE_NODE_WRAPPER)}
					ref={(elem) => {
						this.wrapper = elem;
						if (elem) {
							this.props.contentDOM(elem);
							const tableElement = elem.querySelector('table');

							if (tableElement !== this.table) {
								this.table = tableElement;
								this.createShadowSentinels(this.table);
								this.observeTable(this.table);
							}
						}
					}}
				>
					{allowControls && colControls}
				</div>
				{fg('disable-sticky-scrollbar-for-nested-tables') ? (
					!this.isNestedInTable ? (
						<div
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
							className={ClassName.TABLE_STICKY_SCROLLBAR_CONTAINER}
							style={{
								// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
								height: token('space.250', '20px'), // MAX_BROWSER_SCROLLBAR_HEIGHT
								// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
								display: 'none',
								// prevent unwanted scroll during table resize without removing scrollbar container from the dom
								width: isResizing ? token('space.0', '0px') : '100%',
							}}
						>
							<div
								style={{
									width: tableRef?.clientWidth,
									// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
									height: '100%',
								}}
							></div>
						</div>
					) : (
						<div
							style={{
								width: tableRef?.clientWidth,
								// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
								height: '100%',
							}}
						></div>
					)
				) : (
					<div
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
						className={ClassName.TABLE_STICKY_SCROLLBAR_CONTAINER}
						style={{
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							height: token('space.250', '20px'), // MAX_BROWSER_SCROLLBAR_HEIGHT
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							display: 'none',
							// prevent unwanted scroll during table resize without removing scrollbar container from the dom
							width: isResizing ? token('space.0', '0px') : '100%',
						}}
					>
						<div
							style={{
								width: tableRef?.clientWidth,
								// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
								height: '100%',
							}}
						></div>
					</div>
				)}
				<div
					contentEditable={false}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					style={shadowStyle(showAfterShadow)}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className={
						options?.isChromelessEditor && !isDragAndDropEnabled
							? ClassName.TABLE_RIGHT_SHADOW + ' ' + ClassName.TABLE_CHROMELESS
							: ClassName.TABLE_RIGHT_SHADOW
					}
				/>
				{this.state.stickyHeader && (
					<div
						style={{
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							position: 'absolute',
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							right: token('space.400', '32px'), // tableOverflowShadowWidthWide
						}}
					>
						<div
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
							className={`${ClassName.TABLE_RIGHT_SHADOW} ${ClassName.TABLE_STICKY_SHADOW}`}
							style={{
								visibility: showAfterShadow && hasHeaderRow ? 'visible' : 'hidden',
								top: `${topStickyShadowPosition}px`,
								paddingBottom: `${isDragAndDropEnabled && token('space.025', '2px')}`,
							}}
						/>
					</div>
				)}

				<div
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className={ClassName.TABLE_STICKY_SENTINEL_BOTTOM}
					data-testid="sticky-sentinel-bottom"
				/>
				{fg('disable-sticky-scrollbar-for-nested-tables') ? (
					!this.isNestedInTable && (
						<div
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
							className={ClassName.TABLE_STICKY_SCROLLBAR_SENTINEL_BOTTOM}
							data-testid="sticky-scrollbar-sentinel-bottom"
						/>
					)
				) : (
					<div
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
						className={ClassName.TABLE_STICKY_SCROLLBAR_SENTINEL_BOTTOM}
						data-testid="sticky-scrollbar-sentinel-bottom"
					/>
				)}
			</TableContainer>
		);
	}

	private handleScroll = (event: Event) => {
		if (!this.wrapper || event.target !== this.wrapper) {
			return;
		}

		if (this.stickyScrollbar) {
			this.stickyScrollbar.scrollLeft(this.wrapper.scrollLeft);
		}

		if (this.table) {
			// sync sticky header row to table scroll
			const headers = this.table.querySelectorAll('tr[data-header-row]');
			for (let i = 0; i < headers.length; i++) {
				// Ignored via go/ees005
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				const header = headers[i] as HTMLElement;

				header.scrollLeft = this.wrapper.scrollLeft;
				header.style.marginRight = '2px';
			}
		}

		this.setState({
			[ShadowEvent.SHOW_BEFORE_SHADOW]: this.wrapper.scrollLeft !== 0,
		});
	};

	private handleTableResizing = () => {
		const { getNode, containerWidth, options, allowTableResizing } = this.props;
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const prevNode = this.node!;
		const node = getNode();
		const prevAttrs = prevNode.attrs;

		const isNested = isTableNested(this.props.view.state, this.props.getPos());

		let parentWidth = this.getParentNodeWidth();

		if (isNested && isTableNestedInMoreThanOneNode(this.props.view.state, this.props.getPos())) {
			const resizeObsWrapperWidth = this.wrapperWidth || 0;

			const wrapperWidthDiffBetweenRerenders = Math.abs(
				resizeObsWrapperWidth - (this.state.parentWidth || 0),
			);
			const isOusideOfThreshold =
				wrapperWidthDiffBetweenRerenders <=
					NESTED_TABLE_IN_NESTED_PARENT_WIDTH_DIFF_MIN_THRESHOLD ||
				wrapperWidthDiffBetweenRerenders > NESTED_TABLE_IN_NESTED_PARENT_WIDTH_DIFF_MAX_THRESHOLD;
			// 1. Check isOusideOfThreshold is added to prevent undersired state update.
			// When table is nested in the extenstion and the table column is being resized,
			// space available within extension can change and cause undesirable state update.
			// MIN_THRESNESTED_TABLE_IN_NESTED_PARENT_WIDTH_DIFF_MIN_THRESHOLDHOLD value is required
			// as the resizeObsWrapperWidth can differ between page reloads by 2px.

			// 2. Check resizeObsWrapperWidth > 1 is added to prevent parentWidth update when table unmounts.
			// When a is nested table in a nested expand and the expand collabses, the table unmounts and
			// resizeObsWrapperWidth becomes 1.
			parentWidth =
				isOusideOfThreshold && resizeObsWrapperWidth > 1
					? resizeObsWrapperWidth
					: this.state.parentWidth;
		}

		const parentWidthChanged = parentWidth && parentWidth !== this.state.parentWidth;

		const layoutSize = this.tableNodeLayoutSize(node, containerWidth.width, options);

		const hasNumberedColumnChanged =
			prevAttrs.isNumberColumnEnabled !== node.attrs.isNumberColumnEnabled;

		const noOfColumnsChanged = tablesHaveDifferentNoOfColumns(node, prevNode);

		if (
			// We need to react if our parent changes
			// Scales the cols widths relative to the new parent width.
			parentWidthChanged ||
			// Enabling / disabling this feature reduces or adds size to the table.
			hasNumberedColumnChanged ||
			// This last check is also to cater for dynamic text sizing changing the 'default' layout width
			// Usually happens on window resize.
			layoutSize !== this.layoutSize ||
			noOfColumnsChanged
		) {
			const shouldScaleTable =
				(!allowTableResizing || (allowTableResizing && isNested)) &&
				!hasNumberedColumnChanged &&
				!noOfColumnsChanged;

			// If column has been inserted/deleted avoid multi dispatch
			if (shouldScaleTable) {
				this.scaleTable(
					{
						parentWidth,
					},
					hasNumberedColumnChanged,
				);
			}

			// only when table resizing is enabled and toggle numbered column to run scaleTable
			if (allowTableResizing && hasNumberedColumnChanged) {
				if (!hasTableBeenResized(prevNode)) {
					this.scaleTable(
						{
							parentWidth: node.attrs.width,
						},
						true,
					);
				}
			}

			this.updateParentWidth(parentWidth);
		}

		this.node = node;
		this.containerWidth = containerWidth;
		this.layoutSize = layoutSize;
	};

	// Function gets called when table is nested.
	private scaleTable = (scaleOptions: { parentWidth?: number }, isUserTriggered = false) => {
		const { view, getNode, getPos, containerWidth, options } = this.props;
		const node = getNode();
		const { state, dispatch } = view;
		const pos = getPos();

		if (typeof pos !== 'number' || !isValidPosition(pos, state)) {
			return;
		}
		const domAtPos = view.domAtPos.bind(view);
		const { width } = containerWidth;

		this.scaleTableDebounced.cancel();

		const tr = scaleTable(
			this.table,
			{
				...scaleOptions,
				node,
				prevNode: this.node || node,
				start: pos + 1,
				containerWidth: width,
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				previousContainerWidth: this.containerWidth!.width || width,
				...options,
			},
			domAtPos,
			this.props.pluginInjectionApi,
			false, // isTableScalingEnabled doesn't change the behavior of nested tables
			false, // shouldUseIncreasedScalingPercent set to false for nested tables
		)(state.tr);

		if (!isUserTriggered) {
			tintDirtyTransaction(tr);
			if (fg('platform_editor_fix_table_resizing_undo')) {
				// Avoid adding this transaction separately to the history as these are automatic updates
				// as a consequence of another action
				tr.setMeta('addToHistory', false);
			}
		}

		dispatch(tr);
	};

	private setTimerToSendInitialOverflowCaptured = (isOverflowing: boolean) => {
		const { dispatchAnalyticsEvent, containerWidth, allowTableResizing } = this.props;
		const parentWidth = this.state?.parentWidth || 0;

		this.initialOverflowCaptureTimerId = setTimeout(() => {
			dispatchAnalyticsEvent({
				action: TABLE_ACTION.INITIAL_OVERFLOW_CAPTURED,
				actionSubject: ACTION_SUBJECT.TABLE,
				actionSubjectId: null,
				eventType: EVENT_TYPE.TRACK,
				attributes: {
					editorWidth: containerWidth.width || 0,
					isOverflowing,
					tableResizingEnabled: allowTableResizing || false,
					width: this.node.attrs.width || 0,
					parentWidth,
				},
			});

			this.isInitialOverflowSent = true;
		}, initialOverflowCaptureTimeroutDelay);
	};

	private handleAutoSize = () => {
		if (this.table) {
			const { view, getNode, getPos, containerWidth } = this.props;
			const node = getNode();
			const pos = getPos();
			if (!isValidPosition(pos, view.state)) {
				return;
			}
			autoSizeTable(view, node, this.table, pos, {
				containerWidth: containerWidth.width,
			});
		}
	};

	private handleWindowResize = () => {
		const { getNode, containerWidth } = this.props;
		const node = getNode();
		const layoutSize = this.tableNodeLayoutSize(node);

		if (containerWidth.width > layoutSize) {
			return;
		}

		const parentWidth = this.getParentNodeWidth();
		this.scaleTableDebounced({
			parentWidth: parentWidth,
		});
	};

	private getParentNodeWidth = () => {
		const {
			getPos,
			containerWidth,
			options,
			view: { state },
		} = this.props;
		const pos = getPos();
		if (!isValidPosition(pos, state)) {
			return;
		}
		const parentNodeWith = getParentNodeWidth(
			pos,
			state,
			containerWidth,
			options && options.isFullWidthModeEnabled,
		);

		return parentNodeWith;
	};

	private updateParentWidth = (width?: number) => {
		this.setState({ parentWidth: width });
	};

	private tableNodeLayoutSize = (node: PmNode, containerWidth?: number, options?: TableOptions) =>
		getLayoutSize(
			node.attrs.layout,
			containerWidth || this.props.containerWidth.width,
			options || this.props.options || {},
		);

	private scaleTableDebounced = rafSchedule(this.scaleTable);
	private handleTableResizingDebounced = rafSchedule(this.handleTableResizing);
	private handleScrollDebounced = rafSchedule(this.handleScroll);
	private handleAutoSizeDebounced = rafSchedule(this.handleAutoSize);
	private handleWindowResizeDebounced = rafSchedule(this.handleWindowResize);
	private updateShadowStateDebounced = rafSchedule(this.updateShadowState);
}

export default injectIntl(TableComponent);

/**
 * This is needed because of how currently the table is resized post client boot up with code that exists outside react
 *
 * This can be deleted once https://home.atlassian.com/o/2346a038-3c8c-498b-a79b-e7847859868d/s/a436116f-02ce-4520-8fbb-7301462a1674/project/ATLAS-97756/updates
 * is rolled out (and doesn't need to be used in the test arm of that change).
 */
const TableHold = React.memo(function TableHold({
	dispatchEventName,
}: {
	dispatchEventName: string;
}) {
	const [tableUpdateConfirmed, setTableUpdateConfirmed] = React.useState(false);

	React.useEffect(() => {
		const customEventListener = () => {
			setTableUpdateConfirmed(true);
		};

		// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
		document.addEventListener(dispatchEventName, customEventListener);

		return () => {
			// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
			document.removeEventListener(dispatchEventName, customEventListener);
		};
	}, [dispatchEventName]);

	if (tableUpdateConfirmed === false) {
		return <UFOLoadHold name="editor_table_resize" />;
	}

	return null;
});
