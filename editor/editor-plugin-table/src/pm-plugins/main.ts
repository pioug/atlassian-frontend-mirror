import type { IntlShape } from 'react-intl-next';

import {
	ACTION,
	ACTION_SUBJECT,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import type { DispatchAnalyticsEvent, EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { insideTable } from '@atlaskit/editor-common/core-utils';
import type { Dispatch, EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import { type PortalProviderAPI } from '@atlaskit/editor-common/portal';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import {
	transformSliceToRemoveOpenBodiedExtension,
	transformSliceToRemoveOpenExpand,
	transformSliceToRemoveOpenLayoutNodes,
	transformSliceToRemoveOpenMultiBodiedExtension,
	transformSliceToRemoveOpenNestedExpand,
} from '@atlaskit/editor-common/transforms';
import type { GetEditorContainerWidth, GetEditorFeatureFlags } from '@atlaskit/editor-common/types';
import { browser, closestElement } from '@atlaskit/editor-common/utils';
import type { EditorState, TextSelection, Transaction } from '@atlaskit/editor-prosemirror/state';
import { findParentDomRefOfType, findParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { TableMap } from '@atlaskit/editor-tables';
import { findTable } from '@atlaskit/editor-tables/utils';
import { fg } from '@atlaskit/platform-feature-flags';

import {
	lazyTableCellView,
	lazyTableHeaderView,
	lazyTableRowView,
	lazyTableView,
} from '../nodeviews/lazy-node-views';
import { pluginKey as decorationsPluginKey } from '../pm-plugins/decorations/plugin';
import type {
	InvalidNodeAttr,
	PluginConfig,
	PluginInjectionAPI,
	PluginInjectionAPIWithA11y,
} from '../types';
import { TableCssClassName as ClassName } from '../types';
import {
	handleBlur,
	handleClick,
	handleCut,
	handleFocus,
	handleMouseDown,
	handleMouseEnter,
	handleMouseLeave,
	handleMouseMove,
	handleMouseUp,
	handleTripleClick,
	whenTableInFocus,
	withCellTracking,
} from '../ui/event-handlers';

import { addBoldInEmptyHeaderCells, clearHoverSelection, setTableRef } from './commands';
import { stopKeyboardColumnResizing } from './commands/column-resize';
import {
	removeResizeHandleDecorations,
	transformSliceRemoveCellBackgroundColor,
	transformSliceToAddTableHeaders,
	transformSliceToRemoveColumnsWidths,
} from './commands/misc';
import { defaultHoveredCell, defaultTableSelection } from './default-table-selection';
import { createPluginState, getPluginState } from './plugin-factory';
import { pluginKey } from './plugin-key';
import { fixTables } from './transforms/fix-tables';
import { replaceSelectedTable } from './transforms/replace-table';
import { findControlsHoverDecoration } from './utils/decoration';
import {
	transformSliceToCorrectEmptyTableCells,
	transformSliceToFixHardBreakProblemOnCopyFromCell,
	transformSliceToRemoveOpenTable,
	transformSliceToRemoveNestedTables,
	isHeaderRowRequired,
	transformSliceTableLayoutDefaultToCenter,
} from './utils/paste';

export const createPlugin = (
	dispatchAnalyticsEvent: DispatchAnalyticsEvent,
	dispatch: Dispatch,
	portalProviderAPI: PortalProviderAPI,
	nodeViewPortalProviderAPI: PortalProviderAPI,
	eventDispatcher: EventDispatcher,
	pluginConfig: PluginConfig,
	getEditorContainerWidth: GetEditorContainerWidth,
	getEditorFeatureFlags: GetEditorFeatureFlags,
	getIntl: () => IntlShape,
	fullWidthModeEnabled?: boolean,
	previousFullWidthModeEnabled?: boolean,
	dragAndDropEnabled?: boolean,
	editorAnalyticsAPI?: EditorAnalyticsAPI,
	pluginInjectionApi?: PluginInjectionAPI,
	isTableScalingEnabled?: boolean,
	shouldUseIncreasedScalingPercent?: boolean,
	isCommentEditor?: boolean,
	isChromelessEditor?: boolean,
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/max-params
) => {
	const state = createPluginState(dispatch, {
		pluginConfig,
		isTableHovered: false,
		insertColumnButtonIndex: undefined,
		insertRowButtonIndex: undefined,
		isFullWidthModeEnabled: fullWidthModeEnabled,
		wasFullWidthModeEnabled: previousFullWidthModeEnabled,
		isHeaderRowEnabled: !!pluginConfig.allowHeaderRow,
		isHeaderColumnEnabled: false,
		isDragAndDropEnabled: dragAndDropEnabled,
		isTableScalingEnabled: isTableScalingEnabled,
		...defaultHoveredCell,
		...defaultTableSelection,
		getIntl,
	});

	// Used to prevent invalid table cell spans being reported more than once per editor/document
	const invalidTableIds: string[] = [];
	let editorViewRef: EditorView | null = null;

	const ariaNotifyPlugin = (pluginInjectionApi as PluginInjectionAPIWithA11y)?.accessibilityUtils
		?.actions.ariaNotify;

	const getCurrentEditorState = (): EditorState | null => {
		const editorView = editorViewRef;
		if (!editorView) {
			return null;
		}

		return editorView.state;
	};
	return new SafePlugin({
		state: state,
		key: pluginKey,
		appendTransaction: (
			transactions: readonly Transaction[],
			oldState: EditorState,
			newState: EditorState,
		) => {
			const tr = transactions.find((tr) => tr.getMeta('uiEvent') === 'cut');

			function reportInvalidTableCellSpanAttrs(invalidNodeAttr: InvalidNodeAttr) {
				if (invalidTableIds.find((id) => id === invalidNodeAttr.tableLocalId)) {
					return;
				}

				invalidTableIds.push(invalidNodeAttr.tableLocalId);

				dispatchAnalyticsEvent({
					action: ACTION.INVALID_DOCUMENT_ENCOUNTERED,
					actionSubject: ACTION_SUBJECT.EDITOR,
					eventType: EVENT_TYPE.OPERATIONAL,
					attributes: {
						nodeType: invalidNodeAttr.nodeType,
						reason: `${invalidNodeAttr.attribute}: ${invalidNodeAttr.reason}`,
						tableLocalId: invalidNodeAttr.tableLocalId,
						spanValue: invalidNodeAttr.spanValue,
					},
				});
			}

			if (tr) {
				const { tableWithFixedColumnWidthsOption = false } = getEditorFeatureFlags();
				// "fixTables" removes empty rows as we don't allow that in schema
				const updatedTr = handleCut(
					tr,
					oldState,
					newState,
					pluginInjectionApi,
					editorAnalyticsAPI,
					editorViewRef || undefined,
					isTableScalingEnabled,
					tableWithFixedColumnWidthsOption,
					shouldUseIncreasedScalingPercent,
				);
				return fixTables(updatedTr) || updatedTr;
			}
			if (transactions.find((tr) => tr.docChanged)) {
				return fixTables(newState.tr, reportInvalidTableCellSpanAttrs);
			}
		},
		view: (editorView: EditorView) => {
			const domAtPos = editorView.domAtPos.bind(editorView);
			editorViewRef = editorView;

			return {
				update: (view: EditorView, prevState: EditorState) => {
					const { state, dispatch } = view;
					const { selection } = state;
					const pluginState = getPluginState(state);
					let tableRef: HTMLTableElement | undefined;
					if (pluginState.editorHasFocus) {
						const parent = findParentDomRefOfType(state.schema.nodes.table, domAtPos)(selection);
						if (parent) {
							tableRef =
								// Ignored via go/ees005
								// eslint-disable-next-line @atlaskit/editor/no-as-casting
								(parent as HTMLElement).querySelector<HTMLTableElement>('table') || undefined;
						}
						const tableNode = findTable(state.selection);
						// when keyboard cursor leaves the table we need to stop column resizing
						const pluginPrevState = getPluginState(prevState);
						const isStopKeyboardColumResizing =
							pluginPrevState.isResizeHandleWidgetAdded && pluginPrevState.isKeyboardResize;
						if (isStopKeyboardColumResizing) {
							const isTableNodesDifferent = pluginPrevState?.tableNode !== tableNode?.node;
							if (pluginPrevState?.tableNode && tableNode && isTableNodesDifferent) {
								const oldRowsNumber = TableMap.get(pluginPrevState.tableNode).height;
								const newRowsNumber = TableMap.get(tableNode.node).height;
								if (
									oldRowsNumber !== newRowsNumber || // Add/delete row
									tableNode.node.attrs.localId !== pluginPrevState.tableNode.attrs.localId
								) {
									// Jump to another table
									stopKeyboardColumnResizing({
										ariaNotify: ariaNotifyPlugin,
										getIntl: getIntl,
									})(state, dispatch);
								}
							} else if (!tableNode) {
								// selection outside of table
								stopKeyboardColumnResizing({
									ariaNotify: ariaNotifyPlugin,
									getIntl: getIntl,
								})(state, dispatch);
							}
						}
					}

					if (pluginState.tableRef !== tableRef) {
						setTableRef(tableRef)(state, dispatch);
					}

					if (pluginState.editorHasFocus && pluginState.tableRef) {
						const { $cursor } = state.selection as TextSelection;
						if ($cursor) {
							// Only update bold when it's a cursor
							const tableCellHeader = findParentNodeOfType(state.schema.nodes.tableHeader)(
								state.selection,
							);

							if (tableCellHeader) {
								addBoldInEmptyHeaderCells(tableCellHeader)(state, dispatch);
							}
						}
					} else if (pluginState.isResizeHandleWidgetAdded) {
						removeResizeHandleDecorations()(state, dispatch);
					}
				},
			};
		},
		props: {
			transformPasted(slice) {
				const editorState = getCurrentEditorState();
				if (!editorState) {
					return slice;
				}

				const { schema } = editorState;

				// if we're pasting to outside a table or outside a table
				// header, ensure that we apply any table headers to the first
				// row of content we see, if required
				if (!insideTable(editorState) && isHeaderRowRequired(editorState)) {
					slice = transformSliceToAddTableHeaders(slice, schema);
				}

				// fix for when pasting a table with default layout into comment editor
				// table lose width and expand to full width
				if (
					!insideTable(editorState) &&
					isCommentEditor &&
					pluginConfig.allowTableAlignment &&
					isTableScalingEnabled
				) {
					slice = transformSliceTableLayoutDefaultToCenter(slice, schema);
				}

				slice = transformSliceToFixHardBreakProblemOnCopyFromCell(slice, schema);

				// We do this separately, so it also applies to drag/drop events
				// This needs to go before `transformSliceToRemoveOpenExpand`
				slice = transformSliceToRemoveOpenLayoutNodes(slice, schema);

				// If a partial paste of expand, paste only the content
				// This needs to go before `transformSliceToRemoveOpenTable`
				slice = transformSliceToRemoveOpenExpand(slice, schema);

				/** If a partial paste of table, paste only table's content */
				slice = transformSliceToRemoveOpenTable(slice, schema);

				/** If a partial paste of bodied extension, paste only text */
				slice = transformSliceToRemoveOpenBodiedExtension(slice, schema);

				/** If a partial paste of multi bodied extension, paste only children */
				slice = transformSliceToRemoveOpenMultiBodiedExtension(slice, schema);

				slice = transformSliceToCorrectEmptyTableCells(slice, schema);

				if (!pluginConfig.allowColumnResizing) {
					slice = transformSliceToRemoveColumnsWidths(slice, schema);
				}

				// If we don't allow background on cells, we need to remove it
				// from the paste slice
				if (!pluginConfig.allowBackgroundColor) {
					slice = transformSliceRemoveCellBackgroundColor(slice, schema);
				}

				slice = transformSliceToRemoveOpenNestedExpand(slice, schema);

				if (fg('platform_editor_use_nested_table_pm_nodes')) {
					slice = transformSliceToRemoveNestedTables(slice, schema, editorState.selection);
				}

				return slice;
			},
			handleClick: ({ state, dispatch }, _pos, event: MouseEvent) => {
				const decorationSet = decorationsPluginKey.getState(state);
				if (findControlsHoverDecoration(decorationSet).length) {
					clearHoverSelection()(state, dispatch);
				}

				// ED-6069: workaround for Chrome given a regression introduced in prosemirror-view@1.6.8
				// Returning true prevents that updateSelection() is getting called in the commit below:
				// @see https://github.com/ProseMirror/prosemirror-view/commit/33fe4a8b01584f6b4103c279033dcd33e8047b95
				if (browser.chrome && event.target) {
					// Ignored via go/ees005
					// eslint-disable-next-line @atlaskit/editor/no-as-casting
					const targetClassList = (event.target as HTMLElement).classList;

					if (
						targetClassList.contains(ClassName.CONTROLS_BUTTON) ||
						targetClassList.contains(ClassName.CONTEXTUAL_MENU_BUTTON) ||
						targetClassList.contains(ClassName.DRAG_HANDLE_BUTTON_CLICKABLE_ZONE)
					) {
						return true;
					}
				}

				return false;
			},
			handleScrollToSelection: (view: EditorView) => {
				// when typing into a sticky header cell, we don't want to scroll
				// back to the top of the table if the user has already scrolled down
				const { tableHeader } = view.state.schema.nodes;
				const domRef = findParentDomRefOfType(
					tableHeader,
					view.domAtPos.bind(view),
				)(view.state.selection);

				const maybeTr = closestElement(domRef as HTMLElement | undefined, 'tr');
				return maybeTr ? maybeTr.classList.contains('sticky') : false;
			},
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/max-params
			handleTextInput: (view, _from, _to, text) => {
				const { state, dispatch } = view;
				const { isKeyboardResize } = getPluginState(state);
				if (isKeyboardResize) {
					stopKeyboardColumnResizing({
						ariaNotify: ariaNotifyPlugin,
						getIntl: getIntl,
					})(state, dispatch);
					return false;
				}
				const tr = replaceSelectedTable(state, text, INPUT_METHOD.KEYBOARD, editorAnalyticsAPI);
				if (tr.selectionSet) {
					dispatch(tr);
					return true;
				}
				return false;
			},
			nodeViews: {
				table: lazyTableView({
					portalProviderAPI,
					eventDispatcher,
					getEditorContainerWidth,
					getEditorFeatureFlags,
					dispatchAnalyticsEvent,
					pluginInjectionApi,
					isCommentEditor,
					isChromelessEditor,
				}),
				tableRow: lazyTableRowView({ eventDispatcher }),
				tableCell: lazyTableCellView({ eventDispatcher, pluginInjectionApi }),
				tableHeader: lazyTableHeaderView({ eventDispatcher, pluginInjectionApi }),
			},
			handleDOMEvents: {
				focus: handleFocus,
				blur: handleBlur,
				mousedown: withCellTracking(handleMouseDown),
				mouseleave: handleMouseLeave,
				mousemove: whenTableInFocus(handleMouseMove(nodeViewPortalProviderAPI), pluginInjectionApi),
				mouseenter: handleMouseEnter,
				mouseup: whenTableInFocus(handleMouseUp),
				click: withCellTracking(whenTableInFocus(handleClick)),
			},

			handleTripleClick,
		},
	});
};
