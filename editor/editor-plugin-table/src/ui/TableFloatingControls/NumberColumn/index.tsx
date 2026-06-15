import React, { Component } from 'react';

import classnames from 'classnames';

import { isSSR } from '@atlaskit/editor-common/core-utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { isRowSelected } from '@atlaskit/editor-tables/utils';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

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
	render(): React.JSX.Element {
		const { tableRef, hasHeaderRow, isDragAndDropEnabled, tableActive, updateCellHoverLocation } =
			this.props;
		const rowHeights = getRowHeights(tableRef);

		const getMarginTop = () => {
			if (!hasHeaderRow || this.props.stickyTop === undefined) {
				return undefined;
			}

			// with platform_editor_table_q4_loveability enabled, table controls have margin-top of 1px applied. Offset this here.
			return rowHeights[0] + 1;
		};

		if (isSSR()) {
			return (
				<div
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className={ClassName.NUMBERED_COLUMN}
					style={{
						// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
						marginTop: expValEquals('platform_editor_table_q4_loveability', 'isEnabled', true) ? getMarginTop() : hasHeaderRow && this.props.stickyTop !== undefined ? rowHeights[0] : undefined,
						borderLeft:
							isDragAndDropEnabled &&
								tableActive &&
								!expValEquals('platform_editor_table_q4_loveability', 'isEnabled', true)
								? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
								`1px solid ${tableBorderColor}`
								: undefined,
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
					marginTop: expValEquals('platform_editor_table_q4_loveability', 'isEnabled', true) ? getMarginTop() : hasHeaderRow && this.props.stickyTop !== undefined ? rowHeights[0] : undefined,
					borderLeft:
						isDragAndDropEnabled &&
							tableActive &&
							!expValEquals('platform_editor_table_q4_loveability', 'isEnabled', true)
							? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
							`1px solid ${tableBorderColor}`
							: undefined,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
					visibility: 'visible',
				}}
				contentEditable={false}
			>
				{rowHeights.map((rowHeight, index) => (
					<div
						// Ignored via go/ees005
						// eslint-disable-next-line react/no-array-index-key
						key={`wrapper-${index}`}
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
						className={this.getClassNames(index, true)}
						data-index={index}
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						style={this.getCellStyles(index, rowHeight)}
						onFocus={
							expValEquals('platform_editor_table_a11y_eslint_fix', 'isEnabled', true)
								? () => updateCellHoverLocation(index)
								: undefined
						}
						onMouseOver={() => updateCellHoverLocation(index)}
					>
						{hasHeaderRow ? (index > 0 ? index : null) : index + 1}
					</div>
				))}
			</div>
		);
	}

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
