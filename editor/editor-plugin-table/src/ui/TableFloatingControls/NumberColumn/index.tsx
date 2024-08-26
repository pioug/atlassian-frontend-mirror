import React, { Component } from 'react';

import classnames from 'classnames';

import { Selection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { isRowSelected } from '@atlaskit/editor-tables/utils';

import { clearHoverSelection } from '../../../commands';
import { TableCssClassName as ClassName } from '../../../types';
import { getRowHeights } from '../../../utils';
import { tableBorderColor } from '../../consts';

interface Props {
	editorView: EditorView;
	tableRef: HTMLTableElement;
	tableActive?: boolean;
	hoverRows: (rows: number[], danger?: boolean) => void;
	hoveredRows?: number[];
	selectRow: (row: number, expand: boolean) => void;
	updateCellHoverLocation: (rowIndex: number) => void;
	hasHeaderRow?: boolean;
	isInDanger?: boolean;
	isResizing?: boolean;
	stickyTop?: number;
	isDragAndDropEnabled?: boolean;
}

export default class NumberColumn extends Component<Props, any> {
	render() {
		const { tableRef, hasHeaderRow, isDragAndDropEnabled, tableActive, updateCellHoverLocation } =
			this.props;
		const rowHeights = getRowHeights(tableRef);

		return (
			<div
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className={ClassName.NUMBERED_COLUMN}
				style={{
					// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
					marginTop: hasHeaderRow && this.props.stickyTop !== undefined ? rowHeights[0] : undefined,
					borderLeft:
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
						isDragAndDropEnabled && tableActive ? `1px solid ${tableBorderColor}` : undefined,
				}}
				contentEditable={false}
			>
				{rowHeights.map((rowHeight, index) =>
					isDragAndDropEnabled ? (
						<div
							key={`wrapper-${index}`}
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
							className={this.getClassNames(index, true)}
							data-index={index}
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							style={this.getCellStyles(index, rowHeight)}
							onMouseOver={() => updateCellHoverLocation(index)}
						>
							{hasHeaderRow ? (index > 0 ? index : null) : index + 1}
						</div>
					) : (
						<div
							key={`wrapper-${index}`}
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
							className={this.getClassNames(index)}
							data-index={index}
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							style={this.getCellStyles(index, rowHeight)}
							onClick={(event) => this.selectRow(index, event)}
							onMouseOver={() => this.hoverRows(index)}
							onMouseOut={this.clearHoverSelection}
						>
							{hasHeaderRow ? (index > 0 ? index : null) : index + 1}
						</div>
					),
				)}
			</div>
		);
	}

	private hoverRows = (index: number) => {
		return this.props.tableActive ? this.props.hoverRows([index]) : null;
	};
	private selectRow = (index: number, event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		const { tableActive, editorView, selectRow } = this.props;
		// If selection is outside the table then first reset the selection inside table
		if (!tableActive && event.target && event.target instanceof Node) {
			const { doc, selection, tr } = editorView.state;
			const pos = editorView.posAtDOM(event.target, 1);
			const $pos = doc.resolve(pos);
			const newPos =
				selection.head > pos
					? // Selection is after table
						// nodeSize - 3 will move the position inside last table cell
						Selection.near(doc.resolve(pos + ($pos.parent.nodeSize - 3)), -1)
					: // Selection is before table
						Selection.near($pos);
			editorView.dispatch(tr.setSelection(newPos));
		}
		selectRow(index, event.shiftKey);
	};

	private clearHoverSelection = () => {
		const { tableActive, editorView } = this.props;
		if (tableActive) {
			const { state, dispatch } = editorView;
			clearHoverSelection()(state, dispatch);
		}
	};

	private getCellStyles = (index: number, rowHeight: number) => {
		const { stickyTop, hasHeaderRow } = this.props;
		if (stickyTop && hasHeaderRow && index === 0) {
			return {
				height: rowHeight,
				top: `${stickyTop}px`,
			};
		}
		return {
			height: rowHeight,
		};
	};

	private getClassNames = (index: number, isButtonDisabled = false) => {
		const { hoveredRows, editorView, isInDanger, isResizing } = this.props;
		const isActive =
			isRowSelected(index)(editorView.state.selection) ||
			((hoveredRows || []).indexOf(index) !== -1 && !isResizing);

		return classnames(ClassName.NUMBERED_COLUMN_BUTTON, {
			[ClassName.NUMBERED_COLUMN_BUTTON_DISABLED]: isButtonDisabled,
			[ClassName.HOVERED_CELL_IN_DANGER]: isActive && isInDanger,
			[ClassName.HOVERED_CELL_ACTIVE]: isActive,
		});
	};
}
