import React, { Component } from 'react';

import classnames from 'classnames';

import { isSSR } from '@atlaskit/editor-common/core-utils';
import { Selection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { isRowSelected } from '@atlaskit/editor-tables/utils';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { clearHoverSelection } from '../../../pm-plugins/commands';
import { getRowHeights } from '../../../pm-plugins/utils/row-controls';
import { TableCssClassName as ClassName } from '../../../types';
import { tableBorderColor } from '../../consts';

interface Props {
	editorView: EditorView;
	hasHeaderRow?: boolean;
	hoveredRows?: number[];
	hoverRows: (rows: number[], danger?: boolean) => void;
	isDragAndDropEnabled?: boolean;
	isInDanger?: boolean;
	isResizing?: boolean;
	selectRow: (row: number, expand: boolean) => void;
	stickyTop?: number;
	tableActive?: boolean;
	tableRef: HTMLTableElement;
	updateCellHoverLocation: (rowIndex: number) => void;
}

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components, @typescript-eslint/no-explicit-any
export default class NumberColumn extends Component<Props, any> {
	render() {
		const { tableRef, hasHeaderRow, isDragAndDropEnabled, tableActive, updateCellHoverLocation } =
			this.props;
		const rowHeights = getRowHeights(tableRef);

		if (isSSR() && expValEquals('platform_editor_tables_scaling_css', 'isEnabled', true)) {
			return (
				<div
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className={ClassName.NUMBERED_COLUMN}
					style={{
						// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
						marginTop:
							hasHeaderRow && this.props.stickyTop !== undefined ? rowHeights[0] : undefined,
						borderLeft:
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
							isDragAndDropEnabled && tableActive ? `1px solid ${tableBorderColor}` : undefined,
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
						visibility: 'hidden', // Ensure the column is not visible during SSR
					}}
					contentEditable={false}
				/>
			);
		}

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
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
					...(expValEquals('platform_editor_tables_scaling_css', 'isEnabled', true)
						? { visibility: 'visible' }
						: {}),
				}}
				contentEditable={false}
			>
				{rowHeights.map((rowHeight, index) =>
					isDragAndDropEnabled ? (
						// eslint-disable-next-line jsx-a11y/no-static-element-interactions
						<div
							// Ignored via go/ees005
							// eslint-disable-next-line react/no-array-index-key
							key={`wrapper-${index}`}
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
							className={this.getClassNames(index, true)}
							data-index={index}
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							style={this.getCellStyles(index, rowHeight)}
							// eslint-disable-next-line jsx-a11y/mouse-events-have-key-events, @atlassian/a11y/mouse-events-have-key-events
							onMouseOver={() => updateCellHoverLocation(index)}
						>
							{hasHeaderRow ? (index > 0 ? index : null) : index + 1}
						</div>
					) : (
						// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions, @atlassian/a11y/interactive-element-not-keyboard-focusable
						<div
							// Ignored via go/ees005
							// eslint-disable-next-line react/no-array-index-key
							key={`wrapper-${index}`}
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
							className={this.getClassNames(index)}
							data-index={index}
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							style={this.getCellStyles(index, rowHeight)}
							onClick={(event) => this.selectRow(index, event)}
							// eslint-disable-next-line jsx-a11y/mouse-events-have-key-events, @atlassian/a11y/mouse-events-have-key-events
							onMouseOver={() => this.hoverRows(index)}
							// eslint-disable-next-line jsx-a11y/mouse-events-have-key-events, @atlassian/a11y/mouse-events-have-key-events
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
			const topOffset = 0;

			return {
				height: rowHeight,
				top: `${topOffset}px`,
			};
		}
		return {
			height: rowHeight,
		};
	};

	private getClassNames = (index: number, isButtonDisabled = false) => {
		const { hoveredRows, editorView, isInDanger, isResizing, tableActive } = this.props;

		const isActive =
			isRowSelected(index)(editorView.state.selection) ||
			((hoveredRows || []).indexOf(index) !== -1 && !isResizing);

		return classnames(ClassName.NUMBERED_COLUMN_BUTTON, {
			[ClassName.NUMBERED_COLUMN_BUTTON_DISABLED]: isButtonDisabled,
			[ClassName.HOVERED_CELL_IN_DANGER]: tableActive && isActive && isInDanger,
			[ClassName.HOVERED_CELL_ACTIVE]: tableActive && isActive,
		});
	};
}
