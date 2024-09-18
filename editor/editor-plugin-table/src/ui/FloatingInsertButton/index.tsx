import React from 'react';

import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

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

import { insertColumnWithAnalytics, insertRowWithAnalytics } from '../../commands-with-analytics';
import { TableCssClassName as ClassName } from '../../types';
import type { PluginInjectionAPI } from '../../types';
import { checkIfNumberColumnEnabled } from '../../utils';

import getPopupOptions from './getPopupOptions';
import InsertButton, { DragAndDropInsertButton } from './InsertButton';

export interface Props {
	editorView: EditorView;
	getEditorContainerWidth: GetEditorContainerWidth;
	tableRef?: HTMLElement;
	tableNode?: PmNode;
	insertColumnButtonIndex?: number;
	insertRowButtonIndex?: number;
	isHeaderColumnEnabled?: boolean;
	isHeaderRowEnabled?: boolean;
	isDragAndDropEnabled?: boolean;
	isTableScalingEnabled?: boolean;
	mountPoint?: HTMLElement;
	boundariesElement?: HTMLElement;
	scrollableElement?: HTMLElement;
	hasStickyHeaders?: boolean;
	api: PluginInjectionAPI | undefined | null;
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
	editorAnalyticsAPI?: EditorAnalyticsAPI;
	getEditorFeatureFlags?: GetEditorFeatureFlags;
	isChromelessEditor?: boolean;
	isCommentEditor?: boolean;
}

export class FloatingInsertButton extends React.Component<Props & WrappedComponentProps, any> {
	static displayName = 'FloatingInsertButton';

	constructor(props: Props & WrappedComponentProps) {
		super(props);
		this.insertColumn = this.insertColumn.bind(this);
		this.insertRow = this.insertRow.bind(this);
	}

	render() {
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
			isDragAndDropEnabled,
			dispatchAnalyticsEvent,
			isChromelessEditor,
		} = this.props;

		// TODO: temporarily disable insert button for first column and row https://atlassian.slack.com/archives/C05U8HRQM50/p1698363744682219?thread_ts=1698209039.104909&cid=C05U8HRQM50
		if (isDragAndDropEnabled && (insertColumnButtonIndex === 0 || insertRowButtonIndex === 0)) {
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
		// when the header row|colum is enabled, this feature will be change on the future
		if (
			(type === 'column' && isHeaderColumnEnabled && insertColumnButtonIndex === 0) ||
			(type === 'row' && isHeaderRowEnabled && insertRowButtonIndex === 0)
		) {
			return null;
		}

		const {
			state: { tr },
		} = editorView;
		if (
			tr.selection instanceof CellSelection &&
			((tr.selection as CellSelection).isColSelection() ||
				(tr.selection as CellSelection).isRowSelection())
		) {
			return null;
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

		const index: number = type === 'column' ? insertColumnButtonIndex! : insertRowButtonIndex!;

		const hasNumberedColumns = checkIfNumberColumnEnabled(editorView.state.selection);

		// ED-19336: Fixed the 'add column button' not visible issue when sticky header is enabled
		// By setting the Popup z-index higher than the sticky header z-index ( common-styles.ts tr.sticky)
		// Only when inserting a column, otherwise set to undefined
		// Need to set z-index in the Popup, set z-index in the <InsertButton /> will not work
		const zIndex: number | undefined =
			type === 'column' ? akEditorTableCellOnStickyHeaderZIndex : undefined;

		return (
			<Popup
				target={targetCellRef}
				mountTo={tableContainerWrapper || mountPoint}
				boundariesElement={tableContainerWrapper || boundariesElement}
				scrollableElement={tableWrapper!}
				forcePlacement={true}
				allowOutOfBounds
				{...getPopupOptions(
					type,
					index,
					hasNumberedColumns,
					!!isDragAndDropEnabled,
					tableContainerWrapper,
				)}
				zIndex={zIndex}
			>
				{isDragAndDropEnabled ? (
					<DragAndDropInsertButton
						type={type}
						tableRef={tableRef}
						onMouseDown={type === 'column' ? this.insertColumn : this.insertRow}
						hasStickyHeaders={this.props.hasStickyHeaders || false}
						isChromelessEditor={isChromelessEditor}
					/>
				) : (
					<InsertButton
						type={type}
						tableRef={tableRef}
						onMouseDown={type === 'column' ? this.insertColumn : this.insertRow}
						hasStickyHeaders={this.props.hasStickyHeaders || false}
					/>
				)}
			</Popup>
		);
	}

	private getCellPosition(type: 'column' | 'row', tableNode: PmNode): number | null {
		const { insertColumnButtonIndex, insertRowButtonIndex } = this.props;
		const tableMap = TableMap.get(tableNode!);

		if (type === 'column') {
			const columnIndex = insertColumnButtonIndex === 0 ? 0 : insertColumnButtonIndex! - 1;

			if (columnIndex > tableMap.width - 1) {
				return null;
			}

			return tableMap.positionAt(0, columnIndex!, tableNode!);
		} else {
			const rowIndex = insertRowButtonIndex === 0 ? 0 : insertRowButtonIndex! - 1;

			if (rowIndex > tableMap.height - 1) {
				return null;
			}

			return tableMap.positionAt(rowIndex!, 0, tableNode!);
		}
	}

	private insertRow(event: React.SyntheticEvent) {
		const { editorView, insertRowButtonIndex, editorAnalyticsAPI, getEditorFeatureFlags } =
			this.props;

		if (typeof insertRowButtonIndex !== 'undefined') {
			event.preventDefault();

			const { state, dispatch } = editorView;
			const featureFlags = !!getEditorFeatureFlags && getEditorFeatureFlags();

			insertRowWithAnalytics(
				editorAnalyticsAPI,
				featureFlags && featureFlags.tableDuplicateCellColouring,
			)(INPUT_METHOD.BUTTON, {
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

			const { tableDuplicateCellColouring = false, tableWithFixedColumnWidthsOption = false } =
				getEditorFeatureFlags ? getEditorFeatureFlags() : {};

			const shouldUseIncreasedScalingPercent =
				isTableScalingEnabled && (tableWithFixedColumnWidthsOption || isCommentEditor);

			const { state, dispatch } = editorView;
			insertColumnWithAnalytics(
				this.props.api,
				editorAnalyticsAPI,
				isTableScalingEnabled,
				tableDuplicateCellColouring,
				tableWithFixedColumnWidthsOption,
				shouldUseIncreasedScalingPercent,
				isCommentEditor,
			)(INPUT_METHOD.BUTTON, insertColumnButtonIndex)(state, dispatch, editorView);
		}
	}
}

export default injectIntl(FloatingInsertButton);
