/* eslint-disable @atlaskit/design-system/prefer-primitives */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { Component } from 'react';
import type { PointerEvent } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

type DropdownItem = MenuItem & {
	value: {
		name: string;
	};
};

import { TableSortOrder as SortOrder } from '@atlaskit/custom-steps';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { addColumnAfter, addRowAfter, backspace, tooltip } from '@atlaskit/editor-common/keymaps';
import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import { DropdownMenuSharedCssClassName } from '@atlaskit/editor-common/styles';
import type { GetEditorContainerWidth, GetEditorFeatureFlags } from '@atlaskit/editor-common/types';
import {
	backgroundPaletteTooltipMessages,
	cellBackgroundColorPalette,
	ColorPalette,
	getSelectedRowAndColumnFromPalette,
} from '@atlaskit/editor-common/ui-color';
import type { MenuItem } from '@atlaskit/editor-common/ui-menu';
import {
	ArrowKeyNavigationProvider,
	ArrowKeyNavigationType,
	DropdownMenu,
} from '@atlaskit/editor-common/ui-menu';
import { closestElement } from '@atlaskit/editor-common/utils';
import { hexToEditorBackgroundPaletteColor } from '@atlaskit/editor-palette';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { shortcutStyle } from '@atlaskit/editor-shared-styles/shortcut';
import type { Rect } from '@atlaskit/editor-tables/table-map';
import { splitCell } from '@atlaskit/editor-tables/utils';
import PaintBucketIcon from '@atlaskit/icon/core/migration/paint-bucket--editor-background-color';
import TableCellClearIcon from '@atlaskit/icon/core/table-cell-clear';
import TableCellMergeIcon from '@atlaskit/icon/core/table-cell-merge';
import TableCellSplitIcon from '@atlaskit/icon/core/table-cell-split';
import TableColumnAddRightIcon from '@atlaskit/icon/core/table-column-add-right';
import TableColumnDeleteIcon from '@atlaskit/icon/core/table-column-delete';
import TableColumnsDistributeIcon from '@atlaskit/icon/core/table-columns-distribute';
import TableRowAddBelowIcon from '@atlaskit/icon/core/table-row-add-below';
import TableRowDeleteIcon from '@atlaskit/icon/core/table-row-delete';
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import {
	clearHoverSelection,
	hoverColumns,
	hoverMergedCells,
	hoverRows,
	setFocusToCellMenu,
	toggleContextualMenu,
} from '../../pm-plugins/commands';
import {
	deleteColumnsWithAnalytics,
	deleteRowsWithAnalytics,
	distributeColumnsWidthsWithAnalytics,
	emptyMultipleCellsWithAnalytics,
	insertColumnWithAnalytics,
	insertRowWithAnalytics,
	mergeCellsWithAnalytics,
	setColorWithAnalytics,
	sortColumnWithAnalytics,
	splitCellWithAnalytics,
} from '../../pm-plugins/commands/commands-with-analytics';
import { getPluginState } from '../../pm-plugins/plugin-factory';
import { pluginKey as tablePluginKey } from '../../pm-plugins/plugin-key';
import { getNewResizeStateFromSelectedColumns } from '../../pm-plugins/table-resizing/utils/resize-state';
import { canMergeCells } from '../../pm-plugins/transforms/merge';
import { getSelectedColumnIndexes, getSelectedRowIndexes } from '../../pm-plugins/utils/selection';
import { getMergedCellsPositions } from '../../pm-plugins/utils/table';
import { TableCssClassName as ClassName } from '../../types';
import type { PluginInjectionAPI } from '../../types';
import {
	colorPalletteColumns,
	contextualMenuDropdownWidth,
	contextualMenuDropdownWidthDnD,
} from '../consts';
import { AddColRightIcon } from '../icons/AddColRightIcon';
import { AddRowBelowIcon } from '../icons/AddRowBelowIcon';
import { MergeCellsIcon } from '../icons/MergeCellsIcon';
import { SplitCellIcon } from '../icons/SplitCellIcon';

import { cellColourPreviewStyles } from './styles';

interface Props {
	allowBackgroundColor?: boolean;
	allowColumnSorting?: boolean;
	allowMergeCells?: boolean;
	api: PluginInjectionAPI | undefined | null;
	boundariesElement?: HTMLElement;
	editorAnalyticsAPI?: EditorAnalyticsAPI;
	editorView: EditorView;
	getEditorContainerWidth: GetEditorContainerWidth;
	getEditorFeatureFlags?: GetEditorFeatureFlags;
	isCellMenuOpenByKeyboard?: boolean;
	isCommentEditor?: boolean;
	isOpen: boolean;
	mountPoint?: HTMLElement;
	offset?: Array<number>;
	selectionRect: Rect;
	targetCellPosition?: number; // We keep this because we need to know when to rerender
}

interface State {
	isOpenAllowed: boolean;
	isSubmenuOpen: boolean;
}
const arrowsList = new Set(['ArrowRight', 'ArrowLeft']);

const elementBeforeIconStyles = xcss({
	marginRight: 'space.negative.075',
	display: 'flex',
});
// eslint-disable-next-line @repo/internal/react/no-class-components
export class ContextualMenu extends Component<Props & WrappedComponentProps, State> {
	state: State = {
		isSubmenuOpen: false,
		isOpenAllowed: false,
	};

	static defaultProps = {
		boundariesElement: typeof document !== 'undefined' ? document.body : undefined,
	};
	private dropdownMenuRef = React.createRef<HTMLDivElement>();

	componentDidMount() {
		// ArrowKeyNavigationProvider in DropdownMenu expects that menu handle will stay focused
		// until user pressed ArrowDown.
		// Behavior above fails the A11Y requirement about first item in menu should be focused immediately.
		// so here is triggering componentDidUpdate inside dropdown to set focus on first element
		const { isCellMenuOpenByKeyboard } = this.props;
		if (isCellMenuOpenByKeyboard) {
			this.setState({
				...this.state,
				isOpenAllowed: isCellMenuOpenByKeyboard,
			});
		}
	}

	render() {
		const { isOpen, mountPoint, offset, boundariesElement, editorView, isCellMenuOpenByKeyboard } =
			this.props;
		const { isDragAndDropEnabled } = getPluginState(editorView.state);
		const items = isDragAndDropEnabled
			? this.createNewContextMenuItems()
			: this.createOriginalContextMenuItems();
		let isOpenAllowed = false;

		isOpenAllowed = isCellMenuOpenByKeyboard ? this.state.isOpenAllowed : isOpen;

		return (
			// eslint-disable-next-line jsx-a11y/no-static-element-interactions
			<div
				data-testid="table-cell-contextual-menu"
				onMouseLeave={this.closeSubmenu}
				ref={this.dropdownMenuRef}
			>
				<DropdownMenu
					mountTo={mountPoint}
					//This needs be removed when the a11y is completely handled
					//Disabling key navigation now as it works only partially
					arrowKeyNavigationProviderOptions={{
						type: ArrowKeyNavigationType.MENU,
						disableArrowKeyNavigation: !isCellMenuOpenByKeyboard || this.state.isSubmenuOpen,
					}}
					items={items}
					isOpen={isOpenAllowed}
					onOpenChange={this.handleOpenChange}
					onItemActivated={this.onMenuItemActivated}
					onMouseEnter={this.handleItemMouseEnter}
					onMouseLeave={this.handleItemMouseLeave}
					fitHeight={188}
					fitWidth={
						isDragAndDropEnabled ? contextualMenuDropdownWidthDnD : contextualMenuDropdownWidth
					}
					shouldFocusFirstItem={() => {
						return Boolean(isCellMenuOpenByKeyboard);
					}}
					boundariesElement={boundariesElement}
					offset={offset}
					section={isDragAndDropEnabled ? { hasSeparator: true } : undefined}
					allowEnterDefaultBehavior={this.state.isSubmenuOpen}
				/>
			</div>
		);
	}

	private handleSubMenuRef = (ref: HTMLDivElement | null) => {
		const parent = closestElement(
			// Ignored via go/ees005
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			this.props.editorView.dom as HTMLElement,
			'.fabric-editor-popup-scroll-parent',
		);
		if (!(parent && ref)) {
			return;
		}
		const boundariesRect = parent.getBoundingClientRect();
		const rect = ref.getBoundingClientRect();
		if (rect.left + rect.width > boundariesRect.width) {
			ref.style.left = `-${rect.width}px`;
		}
	};

	private createBackgroundColorItem = () => {
		const {
			allowBackgroundColor,
			editorView: { state },
			isOpen,
			intl: { formatMessage },
			editorView,
			isCellMenuOpenByKeyboard,
		} = this.props;
		const { isSubmenuOpen } = this.state;
		const { targetCellPosition, isDragAndDropEnabled } = getPluginState(editorView.state);

		if (allowBackgroundColor) {
			const node = isOpen && targetCellPosition ? state.doc.nodeAt(targetCellPosition) : null;
			const background = hexToEditorBackgroundPaletteColor(node?.attrs?.background || '#ffffff');

			const selectedRowAndColumnFromPalette = getSelectedRowAndColumnFromPalette(
				cellBackgroundColorPalette,
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				background!,
				colorPalletteColumns,
			);
			const selectedRowIndex = selectedRowAndColumnFromPalette.selectedRowIndex;
			const selectedColumnIndex = selectedRowAndColumnFromPalette.selectedColumnIndex;
			return {
				content: isDragAndDropEnabled
					? formatMessage(messages.backgroundColor)
					: formatMessage(messages.cellBackground),
				value: { name: 'background' },
				elemBefore: isDragAndDropEnabled ? (
					<Box xcss={elementBeforeIconStyles}>
						<PaintBucketIcon
							color="currentColor"
							spacing="spacious"
							label={formatMessage(messages.backgroundColor)}
						/>
					</Box>
				) : undefined,
				elemAfter: (
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					<div className={DropdownMenuSharedCssClassName.SUBMENU}>
						<div
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
							css={cellColourPreviewStyles(background)}
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
							className={
								isDragAndDropEnabled
									? ClassName.CONTEXTUAL_MENU_ICON_SMALL
									: ClassName.CONTEXTUAL_MENU_ICON
							}
						/>
						{isSubmenuOpen && (
							<div
								// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
								className={ClassName.CONTEXTUAL_SUBMENU}
								ref={this.handleSubMenuRef}
							>
								<ArrowKeyNavigationProvider
									type={ArrowKeyNavigationType.COLOR}
									selectedRowIndex={selectedRowIndex || 0}
									selectedColumnIndex={selectedColumnIndex || 0}
									handleClose={() => {
										this.setState({ isSubmenuOpen: false });
										if (this.dropdownMenuRef && this.dropdownMenuRef.current) {
											const focusableItems = this.dropdownMenuRef.current.querySelectorAll(
												'div[tabindex="-1"]:not([disabled])',
											) as NodeListOf<HTMLElement>;
											if (focusableItems && focusableItems.length) {
												focusableItems[0].focus();
											}
										}
									}}
									isPopupPositioned={true}
									// Ignored via go/ees005
									// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
									isOpenedByKeyboard={isCellMenuOpenByKeyboard!}
								>
									<ColorPalette
										cols={7}
										onClick={this.setColor}
										selectedColor={node?.attrs?.background || '#ffffff'}
										paletteOptions={{
											palette: cellBackgroundColorPalette,
											paletteColorTooltipMessages: backgroundPaletteTooltipMessages,
											hexToPaletteColor: hexToEditorBackgroundPaletteColor,
										}}
									/>
								</ArrowKeyNavigationProvider>
							</div>
						)}
					</div>
				),
				'aria-expanded': isSubmenuOpen,
			} as MenuItem;
		}
	};

	// Used in the NewContextMenuItems object
	private newDistributeColumnsItem = () => {
		const {
			intl: { formatMessage },
		} = this.props;
		return this.createDistributeColumnsItemInternal({
			elemBefore: (
				<Box xcss={elementBeforeIconStyles}>
					<TableColumnsDistributeIcon
						color="currentColor"
						spacing="spacious"
						label={formatMessage(messages.distributeColumns)}
						LEGACY_fallbackIcon={MergeCellsIcon}
					/>
				</Box>
			),
		});
	};

	private createMergeSplitCellItems = () => {
		const {
			allowMergeCells,
			editorView: { state },
			intl: { formatMessage },
			editorView,
		} = this.props;
		const { isDragAndDropEnabled } = getPluginState(editorView.state);

		if (allowMergeCells) {
			return [
				{
					content: formatMessage(messages.mergeCells),
					value: { name: 'merge' },
					isDisabled: !canMergeCells(state.tr),
					elemBefore: isDragAndDropEnabled ? (
						<Box xcss={elementBeforeIconStyles}>
							<TableCellMergeIcon
								color="currentColor"
								spacing="spacious"
								label={formatMessage(messages.mergeCells)}
								LEGACY_fallbackIcon={MergeCellsIcon}
							/>
						</Box>
					) : undefined,
				},
				{
					content: formatMessage(messages.splitCell),
					value: { name: 'split' },
					isDisabled: !splitCell(state),
					elemBefore: isDragAndDropEnabled ? (
						<Box xcss={elementBeforeIconStyles}>
							<TableCellSplitIcon
								color="currentColor"
								spacing="spacious"
								label={formatMessage(messages.splitCell)}
								LEGACY_fallbackIcon={SplitCellIcon}
							/>
						</Box>
					) : undefined,
				},
			] as MenuItem[];
		}
		return [];
	};

	private createInsertColumnItem = () => {
		const {
			intl: { formatMessage },
			editorView,
		} = this.props;
		const { isDragAndDropEnabled } = getPluginState(editorView.state);
		const content = formatMessage(
			isDragAndDropEnabled ? messages.addColumnRight : messages.insertColumn,
		);

		return {
			content,
			value: { name: 'insert_column' },
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
			elemAfter: <div css={shortcutStyle}>{tooltip(addColumnAfter)}</div>,
			elemBefore: isDragAndDropEnabled ? (
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
				<Box xcss={elementBeforeIconStyles}>
					<TableColumnAddRightIcon
						color="currentColor"
						spacing="spacious"
						label={formatMessage(messages.addColumnRight)}
						LEGACY_fallbackIcon={AddColRightIcon}
					/>
				</Box>
			) : undefined,
			'aria-label': tooltip(addColumnAfter, String(content)),
		} as MenuItem;
	};

	private createInsertRowItem = () => {
		const {
			intl: { formatMessage },
			editorView,
		} = this.props;
		const { isDragAndDropEnabled } = getPluginState(editorView.state);
		const content = formatMessage(isDragAndDropEnabled ? messages.addRowBelow : messages.insertRow);

		return {
			content,
			value: { name: 'insert_row' },
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
			elemAfter: <div css={shortcutStyle}>{tooltip(addRowAfter)}</div>,
			elemBefore: isDragAndDropEnabled ? (
				<Box xcss={elementBeforeIconStyles}>
					<TableRowAddBelowIcon
						color="currentColor"
						spacing="spacious"
						label={formatMessage(messages.addRowBelow)}
						LEGACY_fallbackIcon={AddRowBelowIcon}
					/>
				</Box>
			) : undefined,
			'aria-label': tooltip(addRowAfter, String(content)),
		} as MenuItem;
	};

	private createClearCellsItem = () => {
		const {
			selectionRect,
			intl: { formatMessage },
			editorView,
		} = this.props;
		const { isDragAndDropEnabled } = getPluginState(editorView.state);
		const { top, bottom, right, left } = selectionRect;
		const noOfColumns = right - left;
		const noOfRows = bottom - top;

		const content = formatMessage(messages.clearCells, {
			0: Math.max(noOfColumns, noOfRows),
		});

		return {
			content,
			value: { name: 'clear' },
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
			elemAfter: <div css={shortcutStyle}>{tooltip(backspace)}</div>,
			elemBefore: isDragAndDropEnabled ? (
				<Box xcss={elementBeforeIconStyles}>
					<TableCellClearIcon
						color="currentColor"
						spacing="spacious"
						label={formatMessage(messages.clearCells, {
							0: Math.max(noOfColumns, noOfRows),
						})}
						LEGACY_fallbackIcon={CrossCircleIcon}
					/>
				</Box>
			) : undefined,
			'aria-label': tooltip(backspace, String(content)),
		} as MenuItem;
	};

	private createDeleteColumnItem = () => {
		const {
			selectionRect,
			intl: { formatMessage },
			editorView,
		} = this.props;
		const { isDragAndDropEnabled } = getPluginState(editorView.state);

		const { right, left } = selectionRect;
		const noOfColumns = right - left;

		return {
			content: formatMessage(messages.removeColumns, {
				0: noOfColumns,
			}),
			value: { name: 'delete_column' },
			elemBefore: isDragAndDropEnabled ? (
				<Box xcss={elementBeforeIconStyles}>
					<TableColumnDeleteIcon
						color="currentColor"
						spacing="spacious"
						label={formatMessage(messages.removeColumns, {
							0: noOfColumns,
						})}
						LEGACY_fallbackIcon={RemoveIcon}
					/>
				</Box>
			) : undefined,
		} as MenuItem;
	};

	private createDeleteRowItem = () => {
		const {
			selectionRect,
			intl: { formatMessage },
			editorView,
		} = this.props;
		const { isDragAndDropEnabled } = getPluginState(editorView.state);

		const { bottom, top } = selectionRect;
		const noOfRows = bottom - top;

		return {
			content: formatMessage(messages.removeRows, {
				0: noOfRows,
			}),
			value: { name: 'delete_row' },
			elemBefore: isDragAndDropEnabled ? (
				<Box xcss={elementBeforeIconStyles}>
					<TableRowDeleteIcon
						color="currentColor"
						spacing="spacious"
						label={formatMessage(messages.removeRows, {
							0: noOfRows,
						})}
						LEGACY_fallbackIcon={RemoveIcon}
					/>
				</Box>
			) : undefined,
		} as MenuItem;
	};

	private createDistributeColumnsItemInternal = (partialMenuItem?: Partial<MenuItem>) => {
		const {
			selectionRect,
			editorView,
			getEditorContainerWidth,
			getEditorFeatureFlags,
			intl: { formatMessage },
		} = this.props;

		const { isTableScalingEnabled = false } = getPluginState(editorView.state);
		const { tableWithFixedColumnWidthsOption = false } = getEditorFeatureFlags
			? getEditorFeatureFlags()
			: {};

		const newResizeState = getNewResizeStateFromSelectedColumns(
			selectionRect,
			editorView.state,
			editorView.domAtPos.bind(editorView),
			getEditorContainerWidth,
			isTableScalingEnabled,
			tableWithFixedColumnWidthsOption,
		);

		const wouldChange = newResizeState?.changed ?? false;

		return {
			content: formatMessage(messages.distributeColumns),
			value: { name: 'distribute_columns' },
			isDisabled: !wouldChange,
			...partialMenuItem,
		} as MenuItem;
	};

	private createDistributeColumnsItem = () => {
		const { editorView } = this.props;
		const {
			isDragAndDropEnabled,
			pluginConfig: { allowDistributeColumns },
		} = getPluginState(editorView.state);
		if (allowDistributeColumns && !isDragAndDropEnabled) {
			return this.createDistributeColumnsItemInternal();
		}
		return null;
	};

	private createSortColumnItems = () => {
		const {
			intl: { formatMessage },
			editorView,
			allowColumnSorting,
		} = this.props;
		const { isDragAndDropEnabled } = getPluginState(editorView.state);

		if (allowColumnSorting && !isDragAndDropEnabled) {
			const hasMergedCellsInTable = getMergedCellsPositions(editorView.state.tr).length > 0;
			const warning = hasMergedCellsInTable
				? {
						tooltipDescription: formatMessage(messages.canNotSortTable),
						isDisabled: true,
					}
				: {};

			return [
				{
					content: formatMessage(messages.sortColumnASC),
					value: { name: 'sort_column_asc' },
					...warning,
				},
				{
					content: formatMessage(messages.sortColumnDESC),
					value: { name: 'sort_column_desc' },
					...warning,
				},
			] as MenuItem[];
		}

		return null;
	};

	private createOriginalContextMenuItems = () => {
		const items: MenuItem[] = [];
		const sortColumnItems = this.createSortColumnItems();
		const backgroundColorItem = this.createBackgroundColorItem();
		const distributeColumnsItem = this.createDistributeColumnsItem();

		sortColumnItems && items.push(...sortColumnItems);

		backgroundColorItem && items.push(backgroundColorItem);

		items.push(this.createInsertColumnItem());

		items.push(this.createInsertRowItem());

		items.push(this.createDeleteColumnItem());

		items.push(this.createDeleteRowItem());

		items.push(...this.createMergeSplitCellItems());

		distributeColumnsItem && items.push(distributeColumnsItem);

		items.push(this.createClearCellsItem());

		return [{ items }];
	};

	private createNewContextMenuItems = () => {
		const backgroundColorItem = this.createBackgroundColorItem();
		const mergeSplitCellItems = this.createMergeSplitCellItems();
		const insertColumnItem = this.createInsertColumnItem();
		const insertRowItem = this.createInsertRowItem();
		const clearCellsItem = this.createClearCellsItem();
		const deleteColumnItem = this.createDeleteColumnItem();
		const deleteRowItem = this.createDeleteRowItem();

		// Group items so when table.menu.group-items FF is enabled, a divider shows under split cell, above add column
		const items: { items: MenuItem[] }[] = [
			{
				items: [],
			},
			{
				items: [],
			},
		];

		backgroundColorItem && items[0].items.push(backgroundColorItem);
		items[0].items.push(...mergeSplitCellItems);
		items[1].items.push(insertColumnItem);
		items[1].items.push(insertRowItem);
		if (editorExperiment('platform_editor_controls', 'variant1')) {
			items[1].items.push(this.newDistributeColumnsItem());
		}
		items[1].items.push(clearCellsItem);
		items[1].items.push(deleteColumnItem);
		items[1].items.push(deleteRowItem);

		return items;
	};

	private onMenuItemActivated = ({ item }: { item: DropdownItem }) => {
		const {
			editorView,
			selectionRect,
			editorAnalyticsAPI,
			getEditorContainerWidth,
			getEditorFeatureFlags,
			isCellMenuOpenByKeyboard,
			isCommentEditor,
		} = this.props;
		// TargetCellPosition could be outdated: https://product-fabric.atlassian.net/browse/ED-8129
		const { state, dispatch } = editorView;
		const { targetCellPosition, isTableScalingEnabled = false } = getPluginState(state);

		const { tableWithFixedColumnWidthsOption = false } = getEditorFeatureFlags
			? getEditorFeatureFlags()
			: {};
		// context menu opened by keyboard and any item except 'background' activated
		// or color has been chosen from color palette
		if (
			isCellMenuOpenByKeyboard &&
			(item.value.name !== 'background' ||
				(item.value.name === 'background' && this.state.isSubmenuOpen))
		) {
			const { tr } = state;
			tr.setMeta(tablePluginKey, {
				type: 'SET_CELL_MENU_OPEN',
				data: {
					isCellMenuOpenByKeyboard: false,
				},
			});
			dispatch(tr);
			editorView.dom.focus(); // otherwise cursor disappears from cell
		}

		const shouldUseIncreasedScalingPercent =
			isTableScalingEnabled &&
			(tableWithFixedColumnWidthsOption ||
				// When in comment editor, we need the scaling percent to be 40% while tableWithFixedColumnWidthsOption is not visible
				isCommentEditor);

		switch (item.value.name) {
			case 'sort_column_desc':
				sortColumnWithAnalytics(editorAnalyticsAPI)(
					INPUT_METHOD.CONTEXT_MENU,
					selectionRect.left,
					SortOrder.DESC,
				)(state, dispatch);
				this.toggleOpen();
				break;
			case 'sort_column_asc':
				sortColumnWithAnalytics(editorAnalyticsAPI)(
					INPUT_METHOD.CONTEXT_MENU,
					selectionRect.left,
					SortOrder.ASC,
				)(state, dispatch);
				this.toggleOpen();
				break;
			case 'merge':
				mergeCellsWithAnalytics(editorAnalyticsAPI)(INPUT_METHOD.CONTEXT_MENU)(state, dispatch);
				this.toggleOpen();
				break;
			case 'split':
				splitCellWithAnalytics(editorAnalyticsAPI)(INPUT_METHOD.CONTEXT_MENU)(state, dispatch);
				this.toggleOpen();
				break;
			case 'distribute_columns':
				const newResizeStateWithAnalytics = getNewResizeStateFromSelectedColumns(
					selectionRect,
					state,
					editorView.domAtPos.bind(editorView),
					getEditorContainerWidth,
					isTableScalingEnabled,
					tableWithFixedColumnWidthsOption,
					isCommentEditor,
				);

				if (newResizeStateWithAnalytics) {
					distributeColumnsWidthsWithAnalytics(editorAnalyticsAPI, this.props.api)(
						INPUT_METHOD.CONTEXT_MENU,
						newResizeStateWithAnalytics,
					)(state, dispatch);
					this.toggleOpen();
				}
				break;
			case 'clear':
				emptyMultipleCellsWithAnalytics(editorAnalyticsAPI)(
					INPUT_METHOD.CONTEXT_MENU,
					targetCellPosition,
				)(state, dispatch);
				this.toggleOpen();
				break;
			case 'insert_column':
				insertColumnWithAnalytics(
					this.props.api,
					editorAnalyticsAPI,
					isTableScalingEnabled,
					tableWithFixedColumnWidthsOption,
					shouldUseIncreasedScalingPercent,
					isCommentEditor,
				)(INPUT_METHOD.CONTEXT_MENU, selectionRect.right)(state, dispatch, editorView);
				this.toggleOpen();
				break;
			case 'insert_row':
				insertRowWithAnalytics(editorAnalyticsAPI)(INPUT_METHOD.CONTEXT_MENU, {
					index: selectionRect.bottom,
					moveCursorToInsertedRow: true,
				})(state, dispatch);
				this.toggleOpen();
				break;
			case 'delete_column':
				deleteColumnsWithAnalytics(
					editorAnalyticsAPI,
					this.props.api,
					isTableScalingEnabled,
					tableWithFixedColumnWidthsOption,
					shouldUseIncreasedScalingPercent,
					isCommentEditor,
				)(INPUT_METHOD.CONTEXT_MENU, selectionRect)(state, dispatch, editorView);
				this.toggleOpen();
				break;
			case 'delete_row':
				const {
					pluginConfig: { isHeaderRowRequired },
				} = getPluginState(state);

				deleteRowsWithAnalytics(editorAnalyticsAPI)(
					INPUT_METHOD.CONTEXT_MENU,
					selectionRect,
					!!isHeaderRowRequired,
				)(state, dispatch);
				this.toggleOpen();
				break;
			case 'background': {
				// This is called twice.
				// 1st time when user chooses the background color item.
				// 2nd when color has been chosen from color palette.
				// here we are handling the 1st call relying on the isSubmenuOpen state value
				if (isCellMenuOpenByKeyboard && !this.state.isSubmenuOpen) {
					this.setState({ isSubmenuOpen: true });
				}
				break;
			}
		}
	};

	private toggleOpen = () => {
		const {
			isOpen,
			editorView: { state, dispatch },
		} = this.props;
		toggleContextualMenu()(state, dispatch);
		if (!isOpen) {
			this.setState({
				isSubmenuOpen: false,
			});
		}
	};

	private handleOpenChange = (payload?: {
		event: PointerEvent | KeyboardEvent;
		isOpen: boolean;
	}) => {
		const {
			editorView: { state, dispatch, dom },
			isCellMenuOpenByKeyboard,
		} = this.props;

		if (payload) {
			const { event } = payload;
			if (event && event instanceof KeyboardEvent) {
				if (!this.state.isSubmenuOpen) {
					if (arrowsList.has(event.key)) {
						// preventing default behavior for avoiding cursor jump to next/previous table column
						// when left/right arrow pressed.
						event.preventDefault();
					}

					toggleContextualMenu()(state, dispatch);
					this.setState({ isSubmenuOpen: false });
					setFocusToCellMenu(false)(state, dispatch);
					dom.focus();
				}
			} else {
				// mouse click outside
				toggleContextualMenu()(state, dispatch);
				this.setState({ isSubmenuOpen: false });
				if (isCellMenuOpenByKeyboard) {
					setFocusToCellMenu(false)(state, dispatch);
				}
			}
		}
	};

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private handleItemMouseEnter = ({ item }: { item: any }) => {
		const {
			editorView: { state, dispatch },
			selectionRect,
		} = this.props;

		if (item.value.name === 'background') {
			if (!this.state.isSubmenuOpen) {
				this.setState({ isSubmenuOpen: true });
			}
		}

		if (item.value.name === 'delete_column') {
			hoverColumns(getSelectedColumnIndexes(selectionRect), true)(state, dispatch);
		}

		if (item.value.name === 'delete_row') {
			hoverRows(getSelectedRowIndexes(selectionRect), true)(state, dispatch);
		}

		if (
			['sort_column_asc', 'sort_column_desc'].indexOf(item.value.name) > -1 &&
			getMergedCellsPositions(state.tr).length !== 0
		) {
			hoverMergedCells()(state, dispatch);
		}
	};

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private handleItemMouseLeave = ({ item }: { item: any }) => {
		const { state, dispatch } = this.props.editorView;
		if (item.value.name === 'background') {
			this.closeSubmenu();
		}
		if (
			['sort_column_asc', 'sort_column_desc', 'delete_column', 'delete_row'].indexOf(
				item.value.name,
			) > -1
		) {
			clearHoverSelection()(state, dispatch);
		}
	};

	private closeSubmenu = () => {
		if (this.state.isSubmenuOpen) {
			this.setState({ isSubmenuOpen: false });
		}
	};

	private setColor = (color: string) => {
		const { editorView, editorAnalyticsAPI } = this.props;
		const { state, dispatch } = editorView;
		setColorWithAnalytics(editorAnalyticsAPI)(INPUT_METHOD.CONTEXT_MENU, color)(state, dispatch);
		this.toggleOpen();
	};
}

export default injectIntl(ContextualMenu);
