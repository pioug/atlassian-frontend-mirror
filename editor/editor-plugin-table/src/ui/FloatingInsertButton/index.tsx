import React from 'react';

import type { WithIntlProps, WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

import type {
	AnalyticsEventPayload,
	DispatchAnalyticsEvent,
	EditorAnalyticsAPI,
} from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	ACTION_SUBJECT,
	CONTENT_COMPONENT,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import type { GetEditorContainerWidth, GetEditorFeatureFlags } from '@atlaskit/editor-common/types';
import { Popup } from '@atlaskit/editor-common/ui';
import { closestElement } from '@atlaskit/editor-common/utils';
import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import { findDomRefAtPos } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { akEditorTableCellOnStickyHeaderZIndex } from '@atlaskit/editor-shared-styles';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import { TableMap } from '@atlaskit/editor-tables/table-map';
import { findTable } from '@atlaskit/editor-tables/utils';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import {
	insertColumnWithAnalytics,
	insertRowWithAnalytics,
} from '../../pm-plugins/commands/commands-with-analytics';
import { checkIfNumberColumnEnabled } from '../../pm-plugins/utils/nodes';
import {
	isColumnSelectionWithMergedFirstRow,
	isRowSelectionWithMergedFirstColumn,
} from '../../pm-plugins/utils/selection';
import { TableCssClassName as ClassName } from '../../types';
import type { PluginInjectionAPI } from '../../types';

import getPopupOptions from './getPopupOptions';
import { DragAndDropInsertButton } from './InsertButton';

export interface Props {
	api: PluginInjectionAPI | undefined | null;
	boundariesElement?: HTMLElement;
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
	editorAnalyticsAPI?: EditorAnalyticsAPI;
	editorView: EditorView;
	getEditorContainerWidth: GetEditorContainerWidth;
	getEditorFeatureFlags?: GetEditorFeatureFlags;
	hasStickyHeaders?: boolean;
	insertColumnButtonIndex?: number;
	insertRowButtonIndex?: number;
	isChromelessEditor?: boolean;
	isCommentEditor?: boolean;
	isHeaderColumnEnabled?: boolean;
	isHeaderRowEnabled?: boolean;
	isTableScalingEnabled?: boolean;
	mountPoint?: HTMLElement;
	scrollableElement?: HTMLElement;
	tableNode?: PmNode;
	tableRef?: HTMLElement;
}

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components, @typescript-eslint/no-explicit-any
export class FloatingInsertButton extends React.Component<Props & WrappedComponentProps, any> {
	static displayName = 'FloatingInsertButton';

	constructor(props: Props & WrappedComponentProps) {
		super(props);
		this.insertColumn = this.insertColumn.bind(this);
		this.insertRow = this.insertRow.bind(this);
	}

	render(): React.JSX.Element | null {
		const {
			tableNode,
			editorView,
			insertColumnButtonIndex,
			insertRowButtonIndex,
			tableRef,
			mountPoint,
			boundariesElement,
			isHeaderColumnEnabled,
			isHeaderRowEnabled,
			dispatchAnalyticsEvent,
			isChromelessEditor,
		} = this.props;

		// EDITOR-6790 - when platform_editor_table_col_insert is enabled, allow the first column
		// (index 0) insert button so a column can be inserted to the left of the first column.
		const isFirstColumnInsertEnabled = expValEquals(
			'platform_editor_table_col_insert',
			'isEnabled',
			true,
		);

		// ED-26961 - disable insert button for first row, and keep first-column behavior
		// disabled until platform_editor_table_col_insert is enabled.
		if (
			(insertColumnButtonIndex === 0 && !isFirstColumnInsertEnabled) ||
			insertRowButtonIndex === 0
		) {
			return null;
		}

		const type =
			typeof insertColumnButtonIndex !== 'undefined'
				? 'column'
				: typeof insertRowButtonIndex !== 'undefined'
					? 'row'
					: null;

		if (!tableNode || !tableRef || !type) {
			return null;
		}

		// We can’t display the insert button for row|colum index 0
		// when the header row|colum is enabled, this feature will be change on the future.
		// EDITOR-6790 - when platform_editor_table_col_insert is enabled, still allow the first
		// column (index 0) insert button even when the header column is enabled.
		if (
			(type === 'column' &&
				isHeaderColumnEnabled &&
				insertColumnButtonIndex === 0 &&
				!isFirstColumnInsertEnabled) ||
			(type === 'row' && isHeaderRowEnabled && insertRowButtonIndex === 0)
		) {
			return null;
		}

		const {
			state: { tr },
		} = editorView;
		if (expValEquals('platform_editor_table_menu_updates', 'isEnabled', true)) {
			if (
				tr.selection instanceof CellSelection &&
				(tr.selection.isColSelection() ||
					tr.selection.isRowSelection() ||
					isColumnSelectionWithMergedFirstRow(tr.selection) ||
					isRowSelectionWithMergedFirstColumn(tr.selection))
			) {
				return null;
			}
		} else {
			if (
				tr.selection instanceof CellSelection &&
				((tr.selection as CellSelection).isColSelection() ||
					(tr.selection as CellSelection).isRowSelection())
			) {
				return null;
			}
		}
		const tablePos = findTable(tr.selection);
		if (!tablePos) {
			return null;
		}

		// the tableNode props is not always latest (when you type some text in a cell, it's not updated yet)
		// we need to get the latest one by calling findTable(tr.selection)
		const cellPosition = this.getCellPosition(type, tablePos?.node);
		if (!cellPosition) {
			return null;
		}

		const domAtPos = editorView.domAtPos.bind(editorView);
		const pos = cellPosition + tablePos.start + 1;

		let target: Node | undefined;
		try {
			target = findDomRefAtPos(pos, domAtPos);
		} catch (error) {
			// eslint-disable-next-line no-console
			console.warn(error);
			if (dispatchAnalyticsEvent) {
				const payload: AnalyticsEventPayload = {
					action: ACTION.ERRORED,
					actionSubject: ACTION_SUBJECT.CONTENT_COMPONENT,
					eventType: EVENT_TYPE.OPERATIONAL,
					attributes: {
						component: CONTENT_COMPONENT.FLOATING_INSERT_BUTTON,
						selection: editorView.state.selection.toJSON(),
						position: pos,
						docSize: editorView.state.doc.nodeSize,
						// Ignored via go/ees005
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						error: (error as any)?.toString(),
					},
				};
				dispatchAnalyticsEvent(payload);
			}
		}

		if (!target || !(target instanceof HTMLElement)) {
			return null;
		}

		const targetCellRef =
			type === 'row' ? closestElement(target, 'tr') : closestElement(target, 'td, th');

		if (!targetCellRef) {
			return null;
		}

		const tableContainerWrapper = closestElement(targetCellRef, `.${ClassName.TABLE_CONTAINER}`);
		const tableWrapper = closestElement(targetCellRef, `.${ClassName.TABLE_NODE_WRAPPER}`);

		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const index: number = type === 'column' ? insertColumnButtonIndex! : insertRowButtonIndex!;

		const hasNumberedColumns = checkIfNumberColumnEnabled(editorView.state.selection);

		// If row 0 has a colspan, anchor to a lower row for the real column boundary (X),
		// then move back up to the table top (Y):
		//   row 0: [   colspan=2   ]
		//   row 1: [ col 1 ][ col 2 ]  ← anchor here for X
		//          ↑ button should render at row 0/table top
		let verticalOffsetCorrection = 0;
		if (
			type === 'column' &&
			expValEquals('platform_editor_table_menu_updates', 'isEnabled', true)
		) {
			verticalOffsetCorrection = Math.max(
				0,
				targetCellRef.getBoundingClientRect().top - tableRef.getBoundingClientRect().top,
			);
		}
		// Fixed the 'add column button' not visible issue when sticky header is enabled
		// By setting the Popup z-index higher than the sticky header z-index ( common-styles.ts tr.sticky)
		// Only when inserting a column, otherwise set to undefined
		// Need to set z-index in the Popup, set z-index in the <DragAndDropInsertButton /> will not work
		const zIndex: number | undefined =
			expValEquals(
				'platform_editor_table_sticky_header_improvements',
				'cohort',
				'test_with_overflow',
			) || type === 'column'
				? akEditorTableCellOnStickyHeaderZIndex
				: undefined;

		return (
			<Popup
				target={targetCellRef}
				mountTo={tableContainerWrapper || mountPoint}
				boundariesElement={tableContainerWrapper || boundariesElement}
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				scrollableElement={tableWrapper!}
				forcePlacement={true}
				allowOutOfBounds
				// Ignored via go/ees005
				// eslint-disable-next-line react/jsx-props-no-spreading
				{...getPopupOptions(
					type,
					index,
					hasNumberedColumns,
					tableContainerWrapper,
					verticalOffsetCorrection,
				)}
				zIndex={zIndex}
			>
				<DragAndDropInsertButton
					type={type}
					tableRef={tableRef}
					onMouseDown={type === 'column' ? this.insertColumn : this.insertRow}
					hasStickyHeaders={this.props.hasStickyHeaders || false}
					isChromelessEditor={isChromelessEditor}
				/>
			</Popup>
		);
	}

	// Finds a row where `columnIndex` has real left/right cell boundaries.
	private findRowWithUnmergedColumn(tableMap: TableMap, columnIndex: number): number | null {
		for (let row = 0; row < tableMap.height; row++) {
			const pos = tableMap.map[row * tableMap.width + columnIndex];
			const rect = tableMap.findCell(pos);
			if (rect.left === columnIndex && rect.right === columnIndex + 1) {
				return row;
			}
		}
		return null;
	}

	private getCellPosition(type: 'column' | 'row', tableNode: PmNode): number | null {
		const { insertColumnButtonIndex, insertRowButtonIndex } = this.props;
		const tableMap = TableMap.get(tableNode);

		if (type === 'column') {
			// This condition is to make typescript happy.
			// Previously insertColumnButtonIndex - 1 would produce NaN and return null anyway.
			if (insertColumnButtonIndex === undefined) {
				return null;
			}

			const columnIndex = insertColumnButtonIndex === 0 ? 0 : insertColumnButtonIndex - 1;

			if (columnIndex > tableMap.width - 1) {
				return null;
			}

			if (expValEquals('platform_editor_table_menu_updates', 'isEnabled', true)) {
				const rowWithRealColumn = this.findRowWithUnmergedColumn(tableMap, columnIndex);
				return rowWithRealColumn === null
					? null
					: tableMap.positionAt(rowWithRealColumn, columnIndex, tableNode);
			}

			return tableMap.positionAt(0, columnIndex, tableNode);
		} else {
			// This condition is to make typescript happy.
			// Previously insertRowButtonIndex - 1 would produce NaN and return null anyway.
			if (insertRowButtonIndex === undefined) {
				return null;
			}

			const rowIndex = insertRowButtonIndex === 0 ? 0 : insertRowButtonIndex - 1;

			if (rowIndex > tableMap.height - 1) {
				return null;
			}

			return tableMap.positionAt(rowIndex, 0, tableNode);
		}
	}

	private insertRow(event: React.SyntheticEvent) {
		const { editorView, insertRowButtonIndex, editorAnalyticsAPI } = this.props;

		if (typeof insertRowButtonIndex !== 'undefined') {
			event.preventDefault();

			const { state, dispatch } = editorView;

			insertRowWithAnalytics(editorAnalyticsAPI)(INPUT_METHOD.BUTTON, {
				index: insertRowButtonIndex,
				moveCursorToInsertedRow: true,
			})(state, dispatch);
		}
	}

	private insertColumn(event: React.SyntheticEvent) {
		const {
			editorView,
			insertColumnButtonIndex,
			editorAnalyticsAPI,
			getEditorFeatureFlags,
			isTableScalingEnabled,
			isCommentEditor,
		} = this.props;

		if (typeof insertColumnButtonIndex !== 'undefined') {
			event.preventDefault();

			const { tableWithFixedColumnWidthsOption = false } = getEditorFeatureFlags
				? getEditorFeatureFlags()
				: {};

			const shouldUseIncreasedScalingPercent =
				isTableScalingEnabled && (tableWithFixedColumnWidthsOption || isCommentEditor);

			const { state, dispatch } = editorView;
			insertColumnWithAnalytics(
				this.props.api,
				editorAnalyticsAPI,
				isTableScalingEnabled,
				tableWithFixedColumnWidthsOption,
				shouldUseIncreasedScalingPercent,
				isCommentEditor,
			)(INPUT_METHOD.BUTTON, insertColumnButtonIndex)(state, dispatch, editorView);
		}
	}
}

// eslint-disable-next-line @typescript-eslint/ban-types
const _default_1: React.FC<WithIntlProps<Props & WrappedComponentProps>> & {
	WrappedComponent: React.ComponentType<Props & WrappedComponentProps>;
} = injectIntl(FloatingInsertButton);
export default _default_1;
