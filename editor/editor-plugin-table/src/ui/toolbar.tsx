/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { TableSortOrder as SortOrder } from '@atlaskit/custom-steps';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { CHANGE_ALIGNMENT_REASON, INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { DropdownMenuExtensionItems } from '@atlaskit/editor-common/floating-toolbar';
import { addColumnAfter, addRowAfter, backspace, tooltip } from '@atlaskit/editor-common/keymaps';
import commonMessages, { tableMessages as messages } from '@atlaskit/editor-common/messages';
import { isSelectionTableNestedInTable } from '@atlaskit/editor-common/nesting';
import { getTableContainerWidth } from '@atlaskit/editor-common/node-width';
import type {
	Command,
	CommandDispatch,
	ConfirmDialogOptions,
	DropdownOptions,
	DropdownOptionT,
	FloatingToolbarDropdown,
	FloatingToolbarHandler,
	FloatingToolbarItem,
	GetEditorContainerWidth,
	Icon,
	typeOption,
} from '@atlaskit/editor-common/types';
import { cellBackgroundColorPalette, DEFAULT_BORDER_COLOR } from '@atlaskit/editor-common/ui-color';
import {
	closestElement,
	getChildrenInfo,
	getNodeName,
	isReferencedSource,
} from '@atlaskit/editor-common/utils';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { findParentDomRefOfType } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { akEditorFloatingPanelZIndex } from '@atlaskit/editor-shared-styles';
import { shortcutStyle } from '@atlaskit/editor-shared-styles/shortcut';
import { Rect, TableMap } from '@atlaskit/editor-tables/table-map';
import {
	findCellRectClosestToPos,
	findTable,
	getSelectionRect,
	isSelectionType,
	splitCell,
} from '@atlaskit/editor-tables/utils';
import AlignImageCenterIcon from '@atlaskit/icon/core/align-image-center';
import AlignImageLeftIcon from '@atlaskit/icon/core/align-image-left';
import CopyIcon from '@atlaskit/icon/core/copy';
import CustomizeIcon from '@atlaskit/icon/core/migration/customize--preferences';
import DeleteIcon from '@atlaskit/icon/core/migration/delete--editor-remove';
import TableColumnsDistributeIcon from '@atlaskit/icon/core/table-columns-distribute';
import EditorAlignImageCenter from '@atlaskit/icon/glyph/editor/align-image-center';
import EditorAlignImageLeft from '@atlaskit/icon/glyph/editor/align-image-left';
import DistributeColumnIcon from '@atlaskit/icon/glyph/editor/layout-three-equal';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import {
	clearHoverSelection,
	hoverColumns,
	hoverMergedCells,
	hoverRows,
	hoverTable,
	removeDescendantNodes,
} from '../pm-plugins/commands';
import {
	deleteColumnsWithAnalytics,
	deleteRowsWithAnalytics,
	deleteTableWithAnalytics,
	distributeColumnsWidthsWithAnalytics,
	emptyMultipleCellsWithAnalytics,
	insertColumnWithAnalytics,
	insertRowWithAnalytics,
	mergeCellsWithAnalytics,
	setColorWithAnalytics,
	setTableAlignmentWithAnalytics,
	sortColumnWithAnalytics,
	splitCellWithAnalytics,
	toggleFixedColumnWidthsOptionAnalytics,
	toggleHeaderColumnWithAnalytics,
	toggleHeaderRowWithAnalytics,
	toggleNumberColumnWithAnalytics,
	wrapTableInExpandWithAnalytics,
} from '../pm-plugins/commands/commands-with-analytics';
import { getPluginState as getDragDropPluginState } from '../pm-plugins/drag-and-drop/plugin-factory';
import { getPluginState } from '../pm-plugins/plugin-factory';
import { pluginKey as tableResizingPluginKey } from '../pm-plugins/table-resizing/plugin-key';
import { getStaticTableScalingPercent } from '../pm-plugins/table-resizing/utils/misc';
import { getNewResizeStateFromSelectedColumns } from '../pm-plugins/table-resizing/utils/resize-state';
import { pluginKey as tableWidthPluginKey } from '../pm-plugins/table-width';
import { canMergeCells } from '../pm-plugins/transforms/merge';
import { normaliseAlignment } from '../pm-plugins/utils/alignment';
import { isTableNested } from '../pm-plugins/utils/nodes';
import { getSelectedColumnIndexes, getSelectedRowIndexes } from '../pm-plugins/utils/selection';
import { getMergedCellsPositions } from '../pm-plugins/utils/table';
import type { TablePluginOptions } from '../tablePluginType';
import type {
	AlignmentOptions,
	PluginConfig,
	PluginInjectionAPI,
	ToolbarMenuConfig,
	ToolbarMenuContext,
	ToolbarMenuState,
} from '../types';
import { TableCssClassName } from '../types';

import { FloatingAlignmentButtons } from './FloatingAlignmentButtons/FloatingAlignmentButtons';

export const getToolbarMenuConfig = (
	config: ToolbarMenuConfig,
	state: ToolbarMenuState,
	{ formatMessage }: ToolbarMenuContext,
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined | null,
	isTableScalingWithFixedColumnWidthsOptionShown = false,
	areTableColumnWidthsFixed = false,
): FloatingToolbarItem<Command> => {
	const optionItem: typeOption = 'item-checkbox';

	const options = [
		{
			id: 'editor.table.lockColumnWidths',
			title: formatMessage(messages.lockColumnWidths),
			onClick: toggleFixedColumnWidthsOptionAnalytics(editorAnalyticsAPI, INPUT_METHOD.FLOATING_TB),
			selected: areTableColumnWidthsFixed,
			hidden: !isTableScalingWithFixedColumnWidthsOptionShown,
			domItemOptions: { type: optionItem },
		},
		{
			id: 'editor.table.headerRow',
			title: formatMessage(messages.headerRow),
			onClick: toggleHeaderRowWithAnalytics(editorAnalyticsAPI),
			selected: state.isHeaderRowEnabled,
			hidden: !config.allowHeaderRow,
			domItemOptions: { type: optionItem },
		},
		{
			id: 'editor.table.headerColumn',
			title: formatMessage(messages.headerColumn),
			onClick: toggleHeaderColumnWithAnalytics(editorAnalyticsAPI),
			selected: state.isHeaderColumnEnabled,
			hidden: !config.allowHeaderColumn,
			domItemOptions: { type: optionItem },
		},
		{
			id: 'editor.table.numberedColumn',
			title: formatMessage(messages.numberedColumn),
			onClick: toggleNumberColumnWithAnalytics(editorAnalyticsAPI),
			selected: state.isNumberColumnEnabled,
			hidden: !config.allowNumberColumn,
			domItemOptions: { type: optionItem },
		},
		{
			id: 'editor.table.collapseTable',
			title: formatMessage(messages.collapseTable),
			onClick: wrapTableInExpandWithAnalytics(editorAnalyticsAPI),
			selected: !!state.isTableCollapsed,
			disabled: !state.canCollapseTable,
			hidden: !config.allowCollapse,
			domItemOptions: { type: optionItem },
		},
	];

	const tableOptionsDropdownWidth = isTableScalingWithFixedColumnWidthsOptionShown
		? 192
		: undefined;
	if (state.isDragAndDropEnabled) {
		return {
			id: 'editor.table.tableOptions',
			type: 'dropdown',
			testId: 'table_options',
			// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-prefix
			icon: fg('platform-visual-refresh-icons') ? undefined : CustomizeIcon,
			iconBefore: fg('platform-visual-refresh-icons') ? CustomizeIcon : undefined,
			title: formatMessage(messages.tableOptions),
			hidden: options.every((option) => option.hidden),
			options,
			dropdownWidth: tableOptionsDropdownWidth,
		};
	} else {
		return {
			id: 'editor.table.tableOptions',
			type: 'dropdown',
			testId: 'table_options',
			title: formatMessage(messages.tableOptions),
			hidden: options.every((option) => option.hidden),
			options,
			dropdownWidth: tableOptionsDropdownWidth,
		};
	}
};

// Added these options for mobile. Mobile bridge translates this menu and
// relay it to the native mobile. Native mobile displays the menu
// with native widgets. It's enabled via a plugin config.
export const getToolbarCellOptionsConfig = (
	editorState: EditorState,
	editorView: EditorView | undefined | null,
	initialSelectionRect: Rect,
	{ formatMessage }: ToolbarMenuContext,
	getEditorContainerWidth: GetEditorContainerWidth,
	api: PluginInjectionAPI | undefined | null,
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined | null,
	isTableScalingEnabled = false,
	isTableFixedColumnWidthsOptionEnabled = false,
	shouldUseIncreasedScalingPercent = false,
	isCommentEditor = false,
): FloatingToolbarDropdown<Command> => {
	const { top, bottom, right, left } = initialSelectionRect;
	const numberOfColumns = right - left;
	const numberOfRows = bottom - top;
	const pluginState = getPluginState(editorState);

	const options: DropdownOptionT<Command>[] = [
		{
			id: 'editor.table.insertColumn',
			title: formatMessage(messages.insertColumn),
			onClick: (state: EditorState, dispatch?: CommandDispatch, view?: EditorView) => {
				const selectionRect = getClosestSelectionRect(state);
				const index = selectionRect?.right;
				if (index) {
					insertColumnWithAnalytics(
						api,
						editorAnalyticsAPI,
						isTableScalingEnabled,
						isTableFixedColumnWidthsOptionEnabled,
						shouldUseIncreasedScalingPercent,
						isCommentEditor,
					)(INPUT_METHOD.FLOATING_TB, index)(state, dispatch, view);
				}
				return true;
			},
			selected: false,
			disabled: false,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
			elemAfter: <div css={shortcutStyle}>{tooltip(addColumnAfter)}</div>,
		},
		{
			id: 'editor.table.insertRow',
			title: formatMessage(messages.insertRow),
			onClick: (state: EditorState, dispatch?: CommandDispatch) => {
				const selectionRect = getClosestSelectionRect(state);
				const index = selectionRect?.bottom;
				if (index) {
					insertRowWithAnalytics(editorAnalyticsAPI)(INPUT_METHOD.FLOATING_TB, {
						index,
						moveCursorToInsertedRow: true,
					})(state, dispatch);
				}
				return true;
			},
			selected: false,
			disabled: false,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
			elemAfter: <div css={shortcutStyle}>{tooltip(addRowAfter)}</div>,
		},
		{
			id: 'editor.table.removeColumns',
			title: formatMessage(messages.removeColumns, {
				0: numberOfColumns,
			}),
			onClick: (state: EditorState, dispatch?: CommandDispatch, view?: EditorView) => {
				const selectionRect = getClosestSelectionRect(state);
				if (selectionRect) {
					deleteColumnsWithAnalytics(
						editorAnalyticsAPI,
						api,
						isTableScalingEnabled,
						isTableFixedColumnWidthsOptionEnabled,
						shouldUseIncreasedScalingPercent,
						isCommentEditor,
					)(INPUT_METHOD.FLOATING_TB, selectionRect)(state, dispatch, view);
				}
				return true;
			},
			onFocus: highlightColumnsHandler,
			onBlur: clearHoverSelection(),
			onMouseOver: highlightColumnsHandler,
			onMouseLeave: clearHoverSelection(),
			selected: false,
			disabled: false,
		},
		{
			id: 'editor.table.removeRows',
			title: formatMessage(messages.removeRows, {
				0: numberOfRows,
			}),
			onClick: (state: EditorState, dispatch?: CommandDispatch) => {
				const selectionRect = getClosestSelectionRect(state);
				if (selectionRect) {
					deleteRowsWithAnalytics(editorAnalyticsAPI)(
						INPUT_METHOD.FLOATING_TB,
						selectionRect,
						false,
					)(state, dispatch);
				}
				return true;
			},
			onFocus: highlightRowsHandler,
			onBlur: clearHoverSelection(),
			onMouseOver: highlightRowsHandler,
			onMouseLeave: clearHoverSelection(),
			selected: false,
			disabled: false,
		},
	];

	if (pluginState.pluginConfig.allowMergeCells) {
		options.push(
			{
				id: 'editor.table.mergeCells',
				title: formatMessage(messages.mergeCells),
				onClick: mergeCellsWithAnalytics(editorAnalyticsAPI)(INPUT_METHOD.FLOATING_TB),
				selected: false,
				disabled: !canMergeCells(editorState.tr),
			},
			{
				id: 'editor.table.splitCell',
				title: formatMessage(messages.splitCell),
				onClick: splitCellWithAnalytics(editorAnalyticsAPI)(INPUT_METHOD.FLOATING_TB),
				selected: false,
				disabled: !splitCell(editorState),
			},
		);
	}

	if (pluginState?.pluginConfig?.allowDistributeColumns) {
		const newResizeStateWithAnalytics = editorView
			? getNewResizeStateFromSelectedColumns(
					initialSelectionRect,
					editorState,
					editorView.domAtPos.bind(editorView),
					getEditorContainerWidth,
					isTableScalingEnabled,
					isTableFixedColumnWidthsOptionEnabled,
					isCommentEditor,
				)
			: undefined;
		const wouldChange = newResizeStateWithAnalytics?.changed ?? false;

		const distributeColumnWidths: Command = (state, dispatch) => {
			if (newResizeStateWithAnalytics) {
				distributeColumnsWidthsWithAnalytics(editorAnalyticsAPI, api)(
					INPUT_METHOD.FLOATING_TB,
					newResizeStateWithAnalytics,
				)(state, dispatch);
				return true;
			}
			return false;
		};

		options.push({
			id: 'editor.table.distributeColumns',
			title: formatMessage(messages.distributeColumns),
			onClick: distributeColumnWidths,
			selected: false,
			disabled: !wouldChange,
		});
	}

	if (pluginState?.pluginConfig?.allowColumnSorting) {
		const hasMergedCellsInTable = getMergedCellsPositions(editorState.tr).length > 0;
		const warning = hasMergedCellsInTable ? formatMessage(messages.canNotSortTable) : undefined;

		options.push({
			id: 'editor.table.sortColumnAsc',
			title: formatMessage(messages.sortColumnASC),
			onMouseOver: (state: EditorState, dispatch?: CommandDispatch) => {
				if (getMergedCellsPositions(state.tr).length !== 0) {
					hoverMergedCells()(state, dispatch);
					return true;
				}
				return false;
			},
			onMouseOut: (state: EditorState, dispatch?: CommandDispatch) => {
				clearHoverSelection()(state, dispatch);
				return true;
			},
			onClick: (state: EditorState, dispatch?: CommandDispatch) => {
				sortColumnWithAnalytics(editorAnalyticsAPI)(
					INPUT_METHOD.FLOATING_TB,
					initialSelectionRect.left,
					SortOrder.ASC,
				)(state, dispatch);
				return true;
			},
			selected: false,
			disabled: hasMergedCellsInTable,
			tooltip: warning,
		});

		options.push({
			id: 'editor.table.sortColumnDesc',
			title: formatMessage(messages.sortColumnDESC),
			onMouseOver: (state: EditorState, dispatch?: CommandDispatch) => {
				if (getMergedCellsPositions(state.tr).length !== 0) {
					hoverMergedCells()(state, dispatch);
					return true;
				}
				return false;
			},
			onMouseOut: (state: EditorState, dispatch?: CommandDispatch) => {
				clearHoverSelection()(state, dispatch);
				return true;
			},
			onClick: (state: EditorState, dispatch?: CommandDispatch) => {
				sortColumnWithAnalytics(editorAnalyticsAPI)(
					INPUT_METHOD.FLOATING_TB,
					initialSelectionRect.left,
					SortOrder.DESC,
				)(state, dispatch);
				return true;
			},
			selected: false,
			disabled: hasMergedCellsInTable,
			tooltip: warning,
		});
	}

	options.push({
		id: 'editor.table.clearCells',
		title: formatMessage(messages.clearCells, {
			0: Math.max(numberOfColumns, numberOfRows),
		}),
		onClick: (state: EditorState, dispatch?: CommandDispatch) => {
			const { targetCellPosition } = getPluginState(state);
			emptyMultipleCellsWithAnalytics(editorAnalyticsAPI)(
				INPUT_METHOD.FLOATING_TB,
				targetCellPosition,
			)(state, dispatch);
			return true;
		},
		selected: false,
		disabled: false,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
		elemAfter: <div css={shortcutStyle}>{tooltip(backspace)}</div>,
	});

	return {
		id: 'editor.table.cellOptions',
		testId: 'cell_options',
		type: 'dropdown',
		title: formatMessage(messages.cellOptions),
		options,
		// Increased dropdown item width to prevent labels from being truncated
		dropdownWidth: 230,
		showSelected: false,
	};
};

export const getClosestSelectionRect = (state: EditorState): Rect | undefined => {
	const selection = state.selection;
	return isSelectionType(selection, 'cell')
		? // Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			getSelectionRect(selection)!
		: findCellRectClosestToPos(selection.$from);
};

const getClosestSelectionOrTableRect = (state: EditorState): Rect | undefined => {
	const selection = state.selection;
	const tableObject = findTable(state.selection);
	if (!tableObject) {
		return;
	}
	const map = TableMap.get(tableObject.node);
	const tableRect = new Rect(0, 0, map.width, map.height);

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	return isSelectionType(selection, 'cell') ? getSelectionRect(selection)! : tableRect;
};

export const getToolbarConfig =
	(
		getEditorContainerWidth: GetEditorContainerWidth,
		api: PluginInjectionAPI | undefined | null,
		editorAnalyticsAPI: EditorAnalyticsAPI | undefined | null,
		getEditorView: () => EditorView | null,
		options?: TablePluginOptions,
		isTableFixedColumnWidthsOptionEnabled = false,
		shouldUseIncreasedScalingPercent = false,
	) =>
	(config: PluginConfig): FloatingToolbarHandler =>
	(state, intl) => {
		const tableObject = findTable(state.selection);
		const pluginState = getPluginState(state);
		const resizeState = tableResizingPluginKey.getState(state);
		const tableWidthState = tableWidthPluginKey.getState(state);
		const isTableScalingEnabled = options?.isTableScalingEnabled || false;
		const nodeType = state.schema.nodes.table;
		const toolbarTitle = 'Table floating controls';

		if (
			editorExperiment('platform_editor_controls', 'variant1') &&
			fg('platform_editor_controls_patch_4')
		) {
			let isDragHandleMenuOpened = false;
			let isTableRowOrColumnDragged = false;
			if (options?.dragAndDropEnabled) {
				const { isDragMenuOpen = false, isDragging = false } = getDragDropPluginState(state);
				isDragHandleMenuOpened = isDragMenuOpen;
				isTableRowOrColumnDragged = isDragging;
			}

			const isTableOrColumnResizing = !!(resizeState?.dragging || tableWidthState?.resizing);
			const isTableMenuOpened = pluginState.isContextualMenuOpen || isDragHandleMenuOpened;
			const isViewMode = api?.editorViewMode?.sharedState.currentState()?.mode === 'view';

			const shouldSuppressAllToolbars =
				(!pluginState.editorHasFocus && !isViewMode) ||
				isTableMenuOpened ||
				isTableOrColumnResizing ||
				isTableRowOrColumnDragged;

			if (shouldSuppressAllToolbars) {
				return {
					title: toolbarTitle,
					items: [],
					nodeType,
					__suppressAllToolbars: true,
				};
			}
		}

		// We don't want to show floating toolbar while resizing the table
		const isWidthResizing = tableWidthState?.resizing;

		if (tableObject && pluginState.editorHasFocus && !isWidthResizing) {
			const isNested = pluginState.tablePos && isTableNested(state, pluginState.tablePos);
			const isTableScalingWithFixedColumnWidthsOptionShown =
				isTableScalingEnabled && isTableFixedColumnWidthsOptionEnabled && !isNested;
			const areTableColumWidthsFixed = tableObject.node.attrs.displayMode === 'fixed';
			const editorView = getEditorView();

			const getDomRef = (editorView: EditorView) => {
				let element: HTMLElement | undefined;
				const domAtPos = editorView.domAtPos.bind(editorView);
				const parent = findParentDomRefOfType(nodeType, domAtPos)(state.selection);
				if (parent) {
					const tableRef =
						// Ignored via go/ees005
						// eslint-disable-next-line @atlaskit/editor/no-as-casting
						(parent as HTMLElement).querySelector<HTMLTableElement>('table') || undefined;
					if (tableRef) {
						element =
							closestElement(tableRef, `.${TableCssClassName.TABLE_NODE_WRAPPER}`) || undefined;
					}
				}

				return element;
			};

			const menu = getToolbarMenuConfig(
				config,
				pluginState,
				intl,
				editorAnalyticsAPI,
				isTableScalingWithFixedColumnWidthsOptionShown,
				areTableColumWidthsFixed,
			);

			const alignmentMenu =
				config.allowTableAlignment && !isNested
					? getAlignmentOptionsConfig(
							state,
							intl,
							editorAnalyticsAPI,
							getEditorContainerWidth,
							getDomRef,
							editorView,
							shouldUseIncreasedScalingPercent,
							options?.fullWidthEnabled,
							options?.isCommentEditor,
						)
					: [];

			const cellItems = pluginState.isDragAndDropEnabled
				? []
				: getCellItems(
						state,
						editorView,
						intl,
						getEditorContainerWidth,
						api,
						editorAnalyticsAPI,
						isTableScalingEnabled,
						isTableFixedColumnWidthsOptionEnabled,
						shouldUseIncreasedScalingPercent,
						options?.isCommentEditor,
					);

			const columnSettingsItems = pluginState.isDragAndDropEnabled
				? getColumnSettingItems(
						state,
						editorView,
						intl,
						getEditorContainerWidth,
						api,
						editorAnalyticsAPI,
						isTableScalingEnabled,
						isTableFixedColumnWidthsOptionEnabled,
						options?.isCommentEditor,
					)
				: [];

			const colorPicker = editorExperiment('platform_editor_controls', 'control')
				? getColorPicker(state, menu, intl, editorAnalyticsAPI, getEditorView)
				: [];

			// Check if we need to show confirm dialog for delete button
			let confirmDialog;

			if (isReferencedSource(state, tableObject.node)) {
				const localSourceName = intl.formatMessage(messages.unnamedSource);

				confirmDialog = (): ConfirmDialogOptions => ({
					title: intl.formatMessage(messages.deleteElementTitle),
					okButtonLabel: intl.formatMessage(messages.confirmDeleteLinkedModalOKButton),
					message: intl.formatMessage(messages.confirmDeleteLinkedModalMessage, {
						nodeName: getNodeName(state, tableObject.node) || localSourceName,
					}),
					messagePrefix: intl.formatMessage(messages.confirmDeleteLinkedModalMessagePrefix),
					isReferentialityDialog: true,
					getChildrenInfo: () => getChildrenInfo(state, tableObject.node),
					checkboxLabel: intl.formatMessage(messages.confirmModalCheckboxLabel),
					onConfirm: (isChecked = false) => clickWithCheckboxHandler(isChecked, tableObject.node),
				});
			}

			const deleteButton = {
				id: 'editor.table.delete',
				type: 'button' as const,
				appearance: 'danger',
				icon: DeleteIcon,
				onClick: deleteTableWithAnalytics(editorAnalyticsAPI),
				disabled: !!resizeState && !!resizeState.dragging,
				onMouseEnter: hoverTable(true),
				onFocus: hoverTable(true),
				onBlur: clearHoverSelection(),
				onMouseLeave: clearHoverSelection(),
				title: intl.formatMessage(commonMessages.remove),
				focusEditoronEnter: true,
				confirmDialog,
			};

			const copyButton = {
				type: 'copy-button',
				supportsViewMode: true,
				items: [
					{
						state,
						formatMessage: intl.formatMessage,
						nodeType,
						onMouseEnter: hoverTable(false, true),
						onMouseLeave: clearHoverSelection(),
						onFocus: hoverTable(false, true),
						onBlur: clearHoverSelection(),
					},
				],
			};

			const isNestedTable =
				fg('platform_editor_use_nested_table_pm_nodes') && isSelectionTableNestedInTable(state);

			const hoverTableProps = (isInDanger?: boolean, isSelected?: boolean) =>
				fg('platform_editor_controls_patch_1')
					? {
							onMouseEnter: hoverTable(isInDanger, isSelected),
							onMouseLeave: clearHoverSelection(),
							onFocus: hoverTable(isInDanger, isSelected),
							onBlur: clearHoverSelection(),
						}
					: undefined;

			return {
				title: toolbarTitle,
				getDomRef,
				nodeType,
				offset: [0, 18],
				absoluteOffset: { top: -6 },
				zIndex: akEditorFloatingPanelZIndex + 1, // Place the context menu slightly above the others
				items: [
					menu,
					separator(menu.hidden),
					...alignmentMenu,
					separator(alignmentMenu.length === 0),
					...cellItems,
					...columnSettingsItems,
					...colorPicker,
					...((editorExperiment('platform_editor_controls', 'control')
						? ([
								{
									type: 'extensions-placeholder',
									separator: 'end',
								},
								copyButton,
								{ type: 'separator' },
								deleteButton,
							] as Array<FloatingToolbarItem<Command>>)
						: [
								{
									type: 'overflow-dropdown',
									dropdownWidth: 220,
									options: [
										{
											type: 'custom',
											fallback: [],
											render: (editorView, dropdownOptions) => {
												if (!editorView) {
													return null;
												}

												const extensionState = api?.extension?.sharedState?.currentState();
												const extensionApi = api?.extension?.actions.api();

												if (!extensionApi || !extensionState?.extensionProvider) {
													return null;
												}

												return (
													<DropdownMenuExtensionItems
														node={tableObject.node}
														editorView={editorView}
														extension={{
															extensionProvider: extensionState?.extensionProvider
																? Promise.resolve(extensionState.extensionProvider)
																: undefined,
															extensionApi: api?.extension?.actions.api(),
														}}
														dropdownOptions={dropdownOptions}
														disabled={(key: string) => {
															return (
																isNestedTable &&
																['referentiality:connections', 'chart:insert-chart'].includes(key)
															);
														}}
													/>
												);
											},
										},
										{
											title: intl.formatMessage(commonMessages.copyToClipboard),
											onClick: () => {
												api?.core?.actions.execute(
													// @ts-ignore
													api?.floatingToolbar?.commands.copyNode(nodeType),
												);
												return true;
											},
											icon: <CopyIcon label={intl.formatMessage(commonMessages.copyToClipboard)} />,
											...hoverTableProps(false, true),
										},
										{
											title: intl.formatMessage(commonMessages.delete),
											onClick: deleteTableWithAnalytics(editorAnalyticsAPI),
											icon: <DeleteIcon label={intl.formatMessage(commonMessages.delete)} />,
											...hoverTableProps(true),
										},
									],
								},
							]) as Array<FloatingToolbarItem<Command>>),
				],
				scrollable: true,
			};
		}

		return;
	};

const separator = (hidden?: boolean): FloatingToolbarItem<Command> => {
	return {
		type: 'separator',
		hidden: hidden,
	};
};

const getCellItems = (
	state: EditorState,
	view: EditorView | null,
	{ formatMessage }: ToolbarMenuContext,
	getEditorContainerWidth: GetEditorContainerWidth,
	api: PluginInjectionAPI | undefined | null,
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined | null,
	isTableScalingEnabled = false,
	isTableFixedColumnWidthsOptionEnabled = false,
	shouldUseIncreasedScalingPercent = false,
	isCommentEditor = false,
): Array<FloatingToolbarItem<Command>> => {
	const initialSelectionRect = getClosestSelectionRect(state);
	if (initialSelectionRect) {
		const cellOptions = getToolbarCellOptionsConfig(
			state,
			view,
			initialSelectionRect,
			{ formatMessage },
			getEditorContainerWidth,
			api,
			editorAnalyticsAPI,
			isTableScalingEnabled,
			isTableFixedColumnWidthsOptionEnabled,
			shouldUseIncreasedScalingPercent,
			isCommentEditor,
		);
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		return [cellOptions, separator(cellOptions.hidden!)];
	}
	return [];
};

const getDistributeConfig =
	(
		getEditorContainerWidth: GetEditorContainerWidth,
		api: PluginInjectionAPI | undefined | null,
		editorAnalyticsAPI: EditorAnalyticsAPI | undefined | null,
		isTableScalingEnabled = false,
		isTableFixedColumnWidthsOptionEnabled = false,
		isCommentEditor = false,
	): Command =>
	(state, dispatch, editorView) => {
		const selectionOrTableRect = getClosestSelectionOrTableRect(state);
		if (!editorView || !selectionOrTableRect) {
			return false;
		}

		const newResizeStateWithAnalytics = getNewResizeStateFromSelectedColumns(
			selectionOrTableRect,
			state,
			editorView.domAtPos.bind(editorView),
			getEditorContainerWidth,
			isTableScalingEnabled,
			isTableFixedColumnWidthsOptionEnabled,
			isCommentEditor,
		);

		if (newResizeStateWithAnalytics) {
			distributeColumnsWidthsWithAnalytics(editorAnalyticsAPI, api)(
				INPUT_METHOD.FLOATING_TB,
				newResizeStateWithAnalytics,
			)(state, dispatch);
			return true;
		}
		return false;
	};

// this create the button group for distribute column and also fixed column width
// fixed column button should be in this function call in the future
const getColumnSettingItems = (
	editorState: EditorState,
	editorView: EditorView | undefined | null,
	{ formatMessage }: ToolbarMenuContext,
	getEditorContainerWidth: GetEditorContainerWidth,
	api: PluginInjectionAPI | undefined | null,
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined | null,
	isTableScalingEnabled = false,
	isTableFixedColumnWidthsOptionEnabled = false,
	isCommentEditor = false,
): Array<FloatingToolbarItem<Command>> => {
	const pluginState = getPluginState(editorState);
	const selectionOrTableRect = getClosestSelectionOrTableRect(editorState);
	if (!selectionOrTableRect || !editorView) {
		return [];
	}
	const newResizeStateWithAnalytics = getNewResizeStateFromSelectedColumns(
		selectionOrTableRect,
		editorState,
		editorView.domAtPos.bind(editorView),
		getEditorContainerWidth,
		isTableScalingEnabled,
		isTableFixedColumnWidthsOptionEnabled,
		isCommentEditor,
	);

	const wouldChange = newResizeStateWithAnalytics?.changed ?? false;

	const items: Array<FloatingToolbarItem<Command>> = [];

	if (pluginState?.pluginConfig?.allowDistributeColumns && pluginState.isDragAndDropEnabled) {
		items.push({
			id: 'editor.table.distributeColumns',
			type: 'button',
			title: formatMessage(messages.distributeColumns),
			icon: () => (
				<TableColumnsDistributeIcon
					LEGACY_fallbackIcon={DistributeColumnIcon}
					spacing={'spacious'}
					label={''}
				/>
			),
			onClick: (state, dispatch, view) =>
				getDistributeConfig(
					getEditorContainerWidth,
					api,
					editorAnalyticsAPI,
					isTableScalingEnabled,
					isTableFixedColumnWidthsOptionEnabled,
					isCommentEditor,
				)(state, dispatch, view),
			disabled: !wouldChange,
		});
	}

	if (items.length !== 0) {
		items.push({
			type: 'separator',
		});
	}

	return items;
};

const getColorPicker = (
	state: EditorState,
	menu: FloatingToolbarItem<Command>,
	{ formatMessage }: ToolbarMenuContext,
	editorAnalyticsAPI: EditorAnalyticsAPI | null | undefined,
	getEditorView: () => EditorView | null,
): Array<FloatingToolbarItem<Command>> => {
	const { targetCellPosition, pluginConfig } = getPluginState(state);
	if (!pluginConfig.allowBackgroundColor) {
		return [];
	}
	const node = targetCellPosition ? state.doc.nodeAt(targetCellPosition) : undefined;
	const currentBackground = node?.attrs?.background || '#ffffff';
	const defaultPalette = cellBackgroundColorPalette.find(
		(item) => item.value === currentBackground,
	) || {
		label: 'Custom',
		value: currentBackground,
		border: DEFAULT_BORDER_COLOR,
	};

	return [
		{
			id: 'editor.table.colorPicker',
			title: formatMessage(messages.cellBackground),
			type: 'select',
			isAriaExpanded: true,
			selectType: 'color',
			defaultValue: defaultPalette,
			options: cellBackgroundColorPalette,
			returnEscToButton: true,
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			onChange: (option: any) =>
				setColorWithAnalytics(editorAnalyticsAPI)(
					INPUT_METHOD.FLOATING_TB,
					option.value,
					getEditorView(),
				),
		},
		separator(menu.hidden),
	];
};

const clickWithCheckboxHandler =
	(
		isChecked: boolean,
		node?: PMNode,
		editorAnalyticsAPI?: EditorAnalyticsAPI | undefined | null,
	): Command =>
	(state, dispatch) => {
		if (!node) {
			return false;
		}

		if (!isChecked) {
			return deleteTableWithAnalytics(editorAnalyticsAPI)(state, dispatch);
		} else {
			removeDescendantNodes(node)(state, dispatch);
		}
		return true;
	};

const highlightRowsHandler = (state: EditorState, dispatch?: CommandDispatch) => {
	const selectionRect = getClosestSelectionRect(state);
	if (selectionRect) {
		hoverRows(getSelectedRowIndexes(selectionRect), true)(state, dispatch);
		return true;
	}
	return false;
};

const highlightColumnsHandler = (state: EditorState, dispatch?: CommandDispatch) => {
	const selectionRect = getClosestSelectionRect(state);
	if (selectionRect) {
		hoverColumns(getSelectedColumnIndexes(selectionRect), true)(state, dispatch);
		return true;
	}
	return false;
};

type AlignmentIcon = {
	id?: string;
	value: AlignmentOptions;
	icon: Icon;
};

const getAlignmentOptionsConfig = (
	editorState: EditorState,
	{ formatMessage }: ToolbarMenuContext,
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined | null,
	getEditorContainerWidth: GetEditorContainerWidth,
	getDomRef: (editorView: EditorView) => HTMLElement | undefined,
	editorView: EditorView | null,
	shouldUseIncreasedScalingPercent: boolean,
	isFullWidthEditor?: boolean,
	isCommentEditor?: boolean,
): Array<FloatingToolbarDropdown<Command>> => {
	const tableObject = findTable(editorState.selection);

	if (!tableObject) {
		return [];
	}

	const alignmentIcons: AlignmentIcon[] = [
		{
			id: 'editor.table.alignLeft',
			value: 'align-start',
			icon: () => (
				<AlignImageLeftIcon
					color="currentColor"
					spacing="spacious"
					label="table-align-start-icon"
					LEGACY_fallbackIcon={EditorAlignImageLeft}
				/>
			),
		},
		{
			id: 'editor.table.alignCenter',
			value: 'center',
			icon: () => (
				<AlignImageCenterIcon
					color="currentColor"
					spacing="spacious"
					label="table-align-center-icon"
					LEGACY_fallbackIcon={EditorAlignImageCenter}
				/>
			),
		},
	];

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const layoutToMessages: Record<AlignmentOptions, any> = {
		center: messages.alignTableCenter,
		'align-start': messages.alignTableLeft,
	};

	const alignmentButtons = alignmentIcons.map<FloatingToolbarItem<Command>>((alignmentIcon) => {
		const { id, value, icon } = alignmentIcon;
		const currentLayout = tableObject.node.attrs.layout;

		return {
			id: id,
			type: 'button',
			icon: icon,
			title: formatMessage(layoutToMessages[value]),
			selected: normaliseAlignment(currentLayout) === value,
			onClick: setTableAlignmentWithAnalytics(editorAnalyticsAPI, isCommentEditor || false)(
				value,
				currentLayout,
				INPUT_METHOD.FLOATING_TB,
				CHANGE_ALIGNMENT_REASON.TOOLBAR_OPTION_CHANGED,
			),
			...(isLayoutOptionDisabled(
				tableObject.node,
				getEditorContainerWidth,
				getDomRef,
				editorView,
				shouldUseIncreasedScalingPercent,
				isFullWidthEditor,
			) && {
				disabled: value !== 'center',
			}),
		};
	});

	const alignmentItemOptions: DropdownOptions<Command> = {
		render: (props) => {
			return (
				<FloatingAlignmentButtons
					alignmentButtons={alignmentButtons}
					// Ignored via go/ees005
					// eslint-disable-next-line react/jsx-props-no-spreading
					{...props}
				/>
			);
		},
		width: 74,
		height: 32,
	};

	const selectedAlignmentIcon = getSelectedAlignmentIcon(alignmentIcons, tableObject.node);

	const alignmentToolbarItem: Array<FloatingToolbarDropdown<Command>> = [
		{
			id: 'table-layout',
			testId: 'table-layout-dropdown',
			type: 'dropdown',
			options: alignmentItemOptions,
			title: formatMessage(messages.tableAlignmentOptions),
			icon: selectedAlignmentIcon?.icon,
		},
	];

	return alignmentToolbarItem;
};

const getSelectedAlignmentIcon = (alignmentIcons: AlignmentIcon[], selectedNode: PMNode) => {
	const selectedAlignment = selectedNode.attrs.layout;

	return alignmentIcons.find((icon) => icon.value === normaliseAlignment(selectedAlignment));
};

const isLayoutOptionDisabled = (
	selectedNode: PMNode,
	getEditorContainerWidth: GetEditorContainerWidth,
	getDomRef: (editorView: EditorView) => HTMLElement | undefined,
	editorView: EditorView | null,
	shouldUseIncreasedScalingPercent: boolean,
	isFullWidthEditor: boolean | undefined,
) => {
	const { lineLength } = getEditorContainerWidth();
	let tableContainerWidth = getTableContainerWidth(selectedNode);

	// table may be scaled, use the scale percent to calculate the table width
	if (editorView) {
		const tableWrapper = getDomRef(editorView);
		const tableWrapperWidth = tableWrapper?.clientWidth || tableContainerWidth;
		const scalePercent = getStaticTableScalingPercent(
			selectedNode,
			tableWrapperWidth,
			shouldUseIncreasedScalingPercent,
		);
		tableContainerWidth = tableContainerWidth * scalePercent;
	}

	// If fixed-width editor, we disable 'left-alignment' when table width is 760px.
	// tableContainerWidth +1 here because tableContainerWidth is 759 in fixed-width editor
	if (selectedNode && !isFullWidthEditor && lineLength && tableContainerWidth + 1 >= lineLength) {
		return true;
	}

	return false;
};
