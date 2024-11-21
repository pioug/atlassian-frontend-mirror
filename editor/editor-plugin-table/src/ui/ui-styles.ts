/* eslint-disable @atlaskit/design-system/no-css-tagged-template-expression -- needs mahual remediation */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import {
	tableCellBorderWidth,
	tableMarginTop,
	tableMarginTopWithControl,
} from '@atlaskit/editor-common/styles';
import {
	akEditorShadowZIndex,
	akEditorTableBorder,
	akEditorTableNumberColumnWidth,
	akEditorUnitZIndex,
} from '@atlaskit/editor-shared-styles';
import { B300, N0, N300, N40A, N60A, Y200, Y50 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { TableCssClassName as ClassName } from '../types';

import {
	columnControlsDecorationHeight,
	columnControlsSelectedZIndex,
	columnControlsZIndex,
	dragTableInsertColumnButtonSize,
	insertLineWidth,
	lineMarkerSize,
	resizeHandlerAreaWidth,
	resizeHandlerZIndex,
	resizeLineWidth,
	tableBorderColor,
	tableBorderDeleteColor,
	tableBorderSelectedColor,
	tableCellDeleteColor,
	tableCellHoverDeleteIconBackground,
	tableCellHoverDeleteIconColor,
	tableCellSelectedDeleteIconBackground,
	tableCellSelectedDeleteIconColor,
	tableDeleteButtonSize,
	tableHeaderCellBackgroundColor,
	tableInsertColumnButtonSize,
	tableOverflowShadowWidthWide,
	tableToolbarDeleteColor,
	tableToolbarSelectedColor,
	tableToolbarSize,
} from './consts';

const InsertLine = (cssString?: string) => css`
	.${ClassName.CONTROLS_INSERT_LINE} {
		background: ${tableBorderSelectedColor};
		display: none;
		position: absolute;
		z-index: ${akEditorUnitZIndex};
		${cssString}
	}
`;

const Marker = () =>
	css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		backgroundColor: tableBorderColor,
		position: 'absolute',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		height: `${lineMarkerSize}px`,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		width: `${lineMarkerSize}px`,
		borderRadius: '50%',
		pointerEvents: 'none',
	});

export const InsertMarker = (cssString?: string) => css`
	.${ClassName.CONTROLS_INSERT_MARKER} {
		${Marker()};
		${cssString}
	}
`;

const Button = (cssString?: string) => css`
	border-radius: ${token('border.radius', '3px')};
	border-width: 0px;
	display: inline-flex;
	max-width: 100%;
	text-align: center;
	margin: 0px;
	padding: 0px;
	text-decoration: none;
	transition:
		background 0.1s ease-out 0s,
		box-shadow 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38) 0s;
	outline: none !important;
	cursor: none;

	> .${ClassName.CONTROLS_BUTTON_ICON} {
		display: inline-flex;
		max-height: 100%;
		max-width: 100%;
	}
	${cssString}
`;

// Explicit pixel values required here to ensure classic row controls align correctly
// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
export const HeaderButton = (cssString?: string) => css`
	.${ClassName.CONTROLS_BUTTON} {
		background: ${tableHeaderCellBackgroundColor};
		border: 1px solid ${tableBorderColor};
		display: block;
		box-sizing: border-box;
		padding: 0;

		:focus {
			outline: none;
		}
		${cssString}
	}

	.${ClassName.ROW_CONTROLS_BUTTON}::after {
		content: ' ';
		background-color: transparent;
		left: -15px;
		top: 0;
		position: absolute;
		width: 15px;
		height: 100%;
		z-index: 1;
	}

	.active .${ClassName.CONTROLS_BUTTON} {
		color: ${token('color.icon.inverse', N0)};
		background-color: ${tableToolbarSelectedColor};
		border-color: ${tableBorderSelectedColor};
	}
`;

export const HeaderButtonHover = () => css`
	.${ClassName.CONTROLS_BUTTON}:hover {
		color: ${token('color.icon.inverse', N0)};
		background-color: ${tableToolbarSelectedColor};
		border-color: ${tableBorderSelectedColor};
		cursor: pointer;
	}
`;

export const HeaderButtonDanger = () => css`
	.${ClassName.HOVERED_CELL_IN_DANGER} .${ClassName.CONTROLS_BUTTON} {
		background-color: ${tableToolbarDeleteColor};
		border-color: ${tableBorderDeleteColor};
		position: relative;
		z-index: ${akEditorUnitZIndex};
	}
`;

const InsertButton = () => css`
	.${ClassName.CONTROLS_INSERT_BUTTON_INNER} {
		position: absolute;
		z-index: ${akEditorUnitZIndex + 10};
		bottom: 0;
	}
	.${ClassName.CONTROLS_INSERT_BUTTON_INNER}, .${ClassName.CONTROLS_INSERT_BUTTON} {
		height: ${tableInsertColumnButtonSize}px;
		width: ${tableInsertColumnButtonSize}px;
	}
	.${ClassName.CONTROLS_INSERT_BUTTON} {
		${Button(`
      background: ${token('elevation.surface.overlay', 'white')};
      box-shadow: ${token('elevation.shadow.overlay', `0 4px 8px -2px ${N60A}, 0 0 1px ${N60A}`)};
      color: ${token('color.icon', N300)};
    `)}
	}
	.${ClassName.CONTROLS_INSERT_LINE} {
		display: none;
	}
	&:hover .${ClassName.CONTROLS_INSERT_LINE} {
		display: flex;
	}
`;

const InsertButtonHover = () => css`
	.${ClassName.CONTROLS_INSERT_BUTTON}:hover {
		background: ${token('color.background.brand.bold', B300)};
		color: ${token('color.icon.inverse', 'white')};
		cursor: pointer;
	}
`;

export const dragInsertButtonWrapper = () => css`
	.${ClassName.DRAG_CONTROLS_INSERT_BUTTON_INNER} {
		position: absolute;
		z-index: ${akEditorUnitZIndex + 10};
	}

	.${ClassName.DRAG_CONTROLS_INSERT_BUTTON_INNER_COLUMN} {
		bottom: -3px;
		left: 2px;
	}

	.${ClassName.DRAG_CONTROLS_INSERT_BUTTON_INNER_ROW} {
		left: -3px;
		bottom: -2px;
	}
	.${ClassName.DRAG_CONTROLS_INSERT_BUTTON_INNER_ROW_CHROMELESS} {
		left: 6px;
		bottom: -2px;
	}

	.${ClassName.DRAG_CONTROLS_INSERT_BUTTON} {
		${Button(`
    background: ${token('elevation.surface.overlay', 'white')};
    color: ${token('color.icon', N300)};
    border: 1px solid ${token('color.background.accent.gray.subtler', '#C1C7D0')};
    border-radius: 50%;
    height: ${dragTableInsertColumnButtonSize}px;
    width: ${dragTableInsertColumnButtonSize}px;
  `)}
	}

	.${ClassName.DRAG_CONTROLS_INSERT_BUTTON}:hover {
		background: ${token('color.background.brand.bold', B300)};
		border: 1px solid ${token('color.background.brand.bold', B300)};
		color: ${token('color.icon.inverse', 'white')};
		cursor: pointer;
	}
`;

// Explicit pixel values required here to ensure corner button aligns correctly
// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
export const dragCornerControlButton = () => css`
	.${ClassName.DRAG_CORNER_BUTTON} {
		width: 15px;
		height: 15px;
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		top: -17px;
		left: -5px;
		background-color: transparent;
		border: none;
		padding: 0;
		outline: none;
		z-index: ${akEditorUnitZIndex * 99};

		&.active .${ClassName.DRAG_CORNER_BUTTON_INNER} {
			background-color: ${token('color.border.selected', '#0C66E4')};
			width: 10px;
			height: 10px;
			border-width: 2px;
			border-radius: 4px;

			top: 3px;
			left: 2px;
		}

		&:hover {
			cursor: pointer;

			.${ClassName.DRAG_CORNER_BUTTON_INNER} {
				width: 10px;
				height: 10px;
				border-radius: 4px;
				top: 3px;
				left: 2px;
			}
		}
	}

	.${ClassName.DRAG_CORNER_BUTTON_INNER} {
		border: 1px solid ${token('color.border.inverse', '#FFF')};
		background-color: ${token('color.background.accent.gray.subtler', '#DCDFE4')};
		border-radius: 2px;
		width: 5px;
		height: 5px;
		position: relative;
	}
`;

export const insertColumnButtonWrapper = () =>
	css(
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		InsertButton(),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		InsertButtonHover(),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		InsertLine(
			`
    width: 2px;
    left: 9px;
  `,
		),
	);

export const insertRowButtonWrapper = () =>
	css(
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		InsertButton(),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		InsertButtonHover(),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		InsertLine(
			`
    height: 2px;
    top: -11px;
	${/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */ ''}
    left: ${tableInsertColumnButtonSize - 1}px;
  `,
		),
	);

export const columnControlsLineMarker = () => css`
	.${ClassName.TABLE_CONTAINER}.${ClassName.WITH_CONTROLS} table tr:first-of-type td,
	.${ClassName.TABLE_CONTAINER}.${ClassName.WITH_CONTROLS} table tr:first-of-type th {
		position: relative;
	}
`;

export const DeleteButton = () => css`
	.${ClassName.CONTROLS_DELETE_BUTTON_WRAP}, .${ClassName.CONTROLS_DELETE_BUTTON} {
		height: ${tableDeleteButtonSize}px;
		width: ${tableDeleteButtonSize}px;
	}
	.${ClassName.CONTROLS_DELETE_BUTTON_WRAP} {
		.${ClassName.CONTROLS_DELETE_BUTTON} {
			${Button(`
        background: ${tableCellSelectedDeleteIconBackground};
        color: ${tableCellSelectedDeleteIconColor};
      `)}
		}
	}

	.${ClassName.CONTROLS_DELETE_BUTTON}:hover {
		background: ${tableCellHoverDeleteIconBackground};
		color: ${tableCellHoverDeleteIconColor};
		cursor: pointer;
	}
`;

export const OverflowShadow = (isDragAndDropEnabled: boolean | undefined) => css`
	.${ClassName.TABLE_RIGHT_SHADOW}, .${ClassName.TABLE_LEFT_SHADOW} {
		display: block;
		height: calc(100% - ${tableMarginTop}px);
		position: absolute;
		pointer-events: none;
		top: ${tableMarginTop}px;
		z-index: ${akEditorShadowZIndex};
		width: ${tableOverflowShadowWidthWide}px;
	}
	.${ClassName.TABLE_LEFT_SHADOW} {
		background: linear-gradient(
				to left,
				transparent 0,
				${token('elevation.shadow.overflow.spread', N40A)} 140%
			),
			linear-gradient(
				to right,
				${token('elevation.shadow.overflow.perimeter', 'transparent')} 0px,
				transparent 1px
			);
		left: 0px;
	}
	.${ClassName.TABLE_CONTAINER}[data-number-column='true'] > :not(.${ClassName.TABLE_STICKY_SHADOW}).${ClassName.TABLE_LEFT_SHADOW} {
		left: ${akEditorTableNumberColumnWidth - 1}px;
	}
	.${ClassName.TABLE_RIGHT_SHADOW} {
		background: linear-gradient(
				to right,
				transparent 0,
				${token('elevation.shadow.overflow.spread', N40A)} 140%
			),
			linear-gradient(
				to left,
				${token('elevation.shadow.overflow.perimeter', 'transparent')} 0px,
				transparent 1px
			);
		left: calc(100% - ${tableOverflowShadowWidthWide}px);
	}
	.${ClassName.WITH_CONTROLS} {
		${overflowShadowWidhoutDnD(isDragAndDropEnabled)}
		.${ClassName.TABLE_LEFT_SHADOW} {
			border-left: 1px solid ${tableBorderColor};
		}
	}
`;

const overflowShadowWidhoutDnD = (isDragAndDropEnabled: boolean | undefined) => {
	if (!isDragAndDropEnabled) {
		return css`
			.${ClassName.TABLE_RIGHT_SHADOW}, .${ClassName.TABLE_LEFT_SHADOW} {
				height: calc(100% - ${tableMarginTopWithControl}px);
				top: ${tableMarginTopWithControl}px;
			}
		`;
	}
};

const columnHeaderButton = (cssString?: string) => {
	return css(
		{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			background: tableHeaderCellBackgroundColor,
			display: 'block',
			boxSizing: 'border-box',
			padding: 0,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
			':focus': {
				outline: 'none',
			},
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		cssString,
	);
};

const columnHeaderButtonSelected = () =>
	css({
		color: token('color.text.inverse', N0),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		backgroundColor: tableToolbarSelectedColor,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		borderColor: tableBorderSelectedColor,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		zIndex: columnControlsSelectedZIndex,
	});

const getFloatingDotOverrides = () => {
	return css`
		tr
			th:last-child
			.${ClassName.COLUMN_CONTROLS_DECORATIONS}::before,
			tr
			td:last-child
			.${ClassName.COLUMN_CONTROLS_DECORATIONS}::before {
			content: '';
			background-color: ${tableBorderColor};
			position: absolute;
			height: ${lineMarkerSize}px;
			width: ${lineMarkerSize}px;
			border-radius: 50%;
			pointer-events: none;
			top: ${token('space.025', '2px')};
			right: 0px;
		}
	`;
};

export const floatingColumnControls = () => {
	return css`
		.${ClassName.DRAG_COLUMN_DROP_TARGET_CONTROLS} {
			box-sizing: border-box;
			position: absolute;
			top: 0;

			.${ClassName.DRAG_COLUMN_CONTROLS_INNER} {
				display: flex;
				flex-direction: row;
			}
		}

		.${ClassName.DRAG_COLUMN_CONTROLS} {
			box-sizing: border-box;

			.${ClassName.DRAG_COLUMN_CONTROLS_INNER} {
				display: grid;
				justify-items: center;
			}
		}
	`;
};

export const rowControlsWrapperDotStyle = () => {
	return css`
		// override for DnD controls
		div.${ClassName.WITH_CONTROLS}>.${ClassName.DRAG_ROW_CONTROLS_WRAPPER}::after {
			display: none;
		}

		div.${ClassName.WITH_CONTROLS}>.${ClassName.ROW_CONTROLS_WRAPPER}::after {
			content: ' ';
			background-color: ${tableBorderColor};
			position: absolute;
			height: ${lineMarkerSize}px;
			width: ${lineMarkerSize}px;
			border-radius: 50%;
			pointer-events: none;
			top: -${tableToolbarSize + tableCellBorderWidth}px;
			right: -1px;
		}
	`;
};

export const columnControlsDecoration = () => {
	return css`
		.${ClassName.COLUMN_CONTROLS_DECORATIONS} {
			display: none;
			cursor: pointer;
			position: absolute;
			width: 100%;
			left: 0;
			top: -${columnControlsDecorationHeight + tableCellBorderWidth}px;
			height: ${columnControlsDecorationHeight}px;
			// floating dot for adding column button
			&::before {
				content: ' ';
				background-color: ${tableBorderColor};
				position: absolute;
				height: ${lineMarkerSize}px;
				width: ${lineMarkerSize}px;
				border-radius: 50%;
				pointer-events: none;
				top: 2px;
				right: ${token('space.negative.025', '-2px')};
			}

			&::after {
				content: ' ';

				${columnHeaderButton(
					`
        border-right: ${tableCellBorderWidth}px solid ${tableBorderColor};
        border-top: ${tableCellBorderWidth}px solid ${tableBorderColor};
        border-bottom: ${tableCellBorderWidth}px solid ${tableBorderColor};
        box-sizing: content-box;
        height: ${tableToolbarSize - 1}px;
        width: 100%;
        position: absolute;
        top: ${columnControlsDecorationHeight - tableToolbarSize}px;
        left: 0px;
        z-index: ${columnControlsZIndex};
      `,
				)}
			}
		}

		// floating dot for adding column button - overriding style on last column to avoid scroll
		${getFloatingDotOverrides()}

		.${ClassName.WITH_CONTROLS} .${ClassName.COLUMN_CONTROLS_DECORATIONS} {
			display: block;
		}

		table
			tr:first-of-type
			td.${ClassName.TABLE_CELL},table
			tr:first-of-type
			th.${ClassName.TABLE_HEADER_CELL} {
			&.${ClassName.COLUMN_SELECTED}, &.${ClassName.HOVERED_TABLE} {
				.${ClassName.COLUMN_CONTROLS_DECORATIONS}::after {
					${columnHeaderButtonSelected()};
				}

				&.${ClassName.HOVERED_CELL_IN_DANGER} .${ClassName.COLUMN_CONTROLS_DECORATIONS}::after {
					background-color: ${tableToolbarDeleteColor};
					border-color: ${tableBorderDeleteColor};
					z-index: ${akEditorUnitZIndex * 100};
				}
			}
		}

		table
			tr:first-of-type
			td.${ClassName.TABLE_CELL},table
			tr:first-of-type
			th.${ClassName.TABLE_HEADER_CELL} {
			&.${ClassName.COLUMN_SELECTED}, &.${ClassName.HOVERED_COLUMN} {
				.${ClassName.COLUMN_CONTROLS_DECORATIONS}::after {
					${columnHeaderButtonSelected()};
					border-left: ${tableCellBorderWidth}px solid ${tableBorderSelectedColor};
					left: -${tableCellBorderWidth}px;
				}
			}
		}

		table
			tr:first-of-type
			td.${ClassName.TABLE_CELL},
			table
			tr:first-of-type
			th.${ClassName.TABLE_HEADER_CELL} {
			&.${ClassName.HOVERED_COLUMN} {
				.${ClassName.COLUMN_CONTROLS_DECORATIONS}::after {
					${columnHeaderButtonSelected()};
				}

				&.${ClassName.HOVERED_CELL_IN_DANGER} .${ClassName.COLUMN_CONTROLS_DECORATIONS}::after {
					background-color: ${tableToolbarDeleteColor};
					border-color: ${tableBorderDeleteColor};
					border-left: ${tableCellBorderWidth}px solid ${tableBorderDeleteColor};
					left: -${tableCellBorderWidth}px;
					z-index: ${akEditorUnitZIndex * 100};
				}
			}
		}

		.${ClassName.TABLE_SELECTED}
			table
			tr:first-of-type
			td.${ClassName.TABLE_CELL},
			.${ClassName.TABLE_SELECTED}
			table
			tr:first-of-type
			th.${ClassName.TABLE_HEADER_CELL} {
			.${ClassName.COLUMN_CONTROLS_DECORATIONS}::after {
				${columnHeaderButtonSelected()};
			}
		}
	`;
};

export const hoveredDeleteButton = () => css`
	.${ClassName.TABLE_CONTAINER}.${ClassName.HOVERED_DELETE_BUTTON} {
		.${ClassName.SELECTED_CELL}, .${ClassName.COLUMN_SELECTED}, .${ClassName.HOVERED_CELL} {
			border: 1px solid ${tableBorderDeleteColor};
		}
		.${ClassName.SELECTED_CELL}::after {
			background: ${tableCellDeleteColor};
		}

		.${ClassName.TABLE_NODE_WRAPPER} > table {
			td.${ClassName.HOVERED_NO_HIGHLIGHT}::after {
				background: ${tableCellDeleteColor};
				border: 1px solid ${tableBorderDeleteColor};
			}
			th.${ClassName.HOVERED_NO_HIGHLIGHT} {
				background-color: unset;
			}
			th.${ClassName.HOVERED_NO_HIGHLIGHT}::after {
				background: ${tableCellDeleteColor};
				border: 1px solid ${tableBorderDeleteColor};
			}
		}
	}
`;

export const hoveredCell = () => css`
	:not(.${ClassName.IS_RESIZING})
		.${ClassName.TABLE_CONTAINER}:not(.${ClassName.HOVERED_DELETE_BUTTON}) {
		.${ClassName.HOVERED_CELL} {
			position: relative;
			border: 1px solid ${tableBorderSelectedColor};
		}
		.${ClassName.HOVERED_CELL}.${ClassName.HOVERED_NO_HIGHLIGHT} {
			position: relative;
			border: 1px solid ${tableBorderColor};
		}
	}
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const hoveredWarningCell = css`
	:not(.${ClassName.IS_RESIZING})
		.${ClassName.TABLE_CONTAINER}:not(.${ClassName.HOVERED_DELETE_BUTTON}) {
		td.${ClassName.HOVERED_CELL_WARNING} {
			background-color: ${token(
				'color.background.warning',
				Y50,
			)} !important; // We need to override the background-color added to the cell
			border: 1px solid ${token('color.border.warning', Y200)};
		}
	}
`;

// Explicit pixel values required here to ensure correct positioning and sizes of column resize handle
// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
const resizeLineStyles = () => {
	return css`
		th.${ClassName.WITH_DRAG_RESIZE_LINE}::before, td.${ClassName.WITH_DRAG_RESIZE_LINE}::before {
			content: ' ';
			position: absolute;
			left: ${token('space.negative.025', '-2px')};
			top: -1px;
			width: ${resizeLineWidth}px;
			height: calc(100% + 2px);
			background-color: ${tableBorderSelectedColor};
			z-index: ${columnControlsZIndex * 2};
		}

		th.${ClassName.WITH_DRAG_RESIZE_LINE_LAST_COLUMN}::before,
			td.${ClassName.WITH_DRAG_RESIZE_LINE_LAST_COLUMN}::before {
			content: ' ';
			position: absolute;
			right: -1px;
			top: -1px;
			width: ${resizeLineWidth}px;
			height: calc(100% + 2px);
			background-color: ${tableBorderSelectedColor};
			z-index: ${columnControlsZIndex * 2};
		}

		// Styles when drag and drop is disabled - will be removed
		td.${ClassName.WITH_RESIZE_LINE}::before {
			content: ' ';
			position: absolute;
			left: ${token('space.negative.025', '-2px')};
			top: -1px;
			width: ${resizeLineWidth}px;
			height: calc(100% + 2px);
			background-color: ${tableBorderSelectedColor};
			z-index: ${columnControlsZIndex * 2};
		}

		th.${ClassName.WITH_RESIZE_LINE}::before {
			content: ' ';
			left: ${token('space.negative.025', '-2px')};
			position: absolute;
			width: ${resizeLineWidth}px;
			height: calc(100% + ${tableToolbarSize + tableCellBorderWidth}px);
			background-color: ${tableBorderSelectedColor};
			z-index: ${columnControlsZIndex * 2};
			top: -${tableToolbarSize + tableCellBorderWidth}px;
		}

		td.${ClassName.WITH_RESIZE_LINE_LAST_COLUMN}::before {
			content: ' ';
			position: absolute;
			right: -1px;
			top: -1px;
			width: ${resizeLineWidth}px;
			height: calc(100% + 2px);
			background-color: ${tableBorderSelectedColor};
			z-index: ${columnControlsZIndex * 2};
		}

		th.${ClassName.WITH_RESIZE_LINE_LAST_COLUMN}::before {
			content: ' ';
			right: -1px;
			position: absolute;
			width: ${resizeLineWidth}px;
			height: calc(100% + ${tableToolbarSize + tableCellBorderWidth}px);
			background-color: ${tableBorderSelectedColor};
			z-index: ${columnControlsZIndex * 2};
			top: -${tableToolbarSize + tableCellBorderWidth}px;
		}
	`;
};

export const resizeHandle = () => css`
	.${ClassName.TABLE_CONTAINER} {
		.${ClassName.RESIZE_HANDLE_DECORATION} {
			background-color: transparent;
			position: absolute;
			width: ${resizeHandlerAreaWidth}px;
			height: 100%;
			top: 0;
			right: -${resizeHandlerAreaWidth / 2}px;
			cursor: col-resize;
			z-index: ${resizeHandlerZIndex};
		}

		tr
			th:last-child
			.${ClassName.RESIZE_HANDLE_DECORATION},
			tr
			td:last-child
			.${ClassName.RESIZE_HANDLE_DECORATION} {
			background-color: transparent;
			position: absolute;
			width: ${resizeHandlerAreaWidth / 2}px;
			height: 100%;
			top: 0;
			right: 0;
			cursor: col-resize;
			z-index: ${resizeHandlerZIndex};
		}

		${resizeLineStyles()}

		table
      tr:first-of-type
      th.${ClassName.WITH_DRAG_RESIZE_LINE}
      .${ClassName.RESIZE_HANDLE_DECORATION}::after,
      table
      tr:first-of-type
      td.${ClassName.WITH_DRAG_RESIZE_LINE}
      .${ClassName.RESIZE_HANDLE_DECORATION}::after,
	  // Styles when drag and drop is disabled - will be removed
		table
      tr:first-of-type
      th.${ClassName.WITH_RESIZE_LINE}
      .${ClassName.RESIZE_HANDLE_DECORATION}::after,
      table
      tr:first-of-type
      td.${ClassName.WITH_RESIZE_LINE}
      .${ClassName.RESIZE_HANDLE_DECORATION}::after {
			top: -${tableToolbarSize + tableCellBorderWidth}px;
			height: calc(100% + ${tableToolbarSize + tableCellBorderWidth}px);
		}
	}
`;

// Drag and Drop: drop target insert line
const tableCellColumnInsertLineStyles = css({
	content: "' '",
	position: 'absolute',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	height: `calc(100% + ${tableCellBorderWidth * 2}px)`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	width: `${insertLineWidth}px`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	zIndex: columnControlsZIndex * 2,
});

const tableCellRowInsertLineStyles = css({
	content: "' '",
	position: 'absolute',
	left: token('space.negative.025', '-2px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	height: `${insertLineWidth}px`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	width: `calc(100% + ${tableCellBorderWidth * 2}px)`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	zIndex: columnControlsZIndex * 2,
});

const insertLineActiveColor = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	backgroundColor: tableBorderSelectedColor,
});

const insertLineInactiveColor = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	backgroundColor: token('color.background.accent.gray.subtler', akEditorTableBorder),
});

// Explicit pixel values required here to ensure correct positioning of line that is show on row
// or column drag
// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
export const insertLine = () => css`
	.${ClassName.TABLE_CONTAINER} {
		td.${ClassName.WITH_FIRST_COLUMN_INSERT_LINE}::before {
			${tableCellColumnInsertLineStyles}
			left: -1px;
			top: -1px;
			${insertLineActiveColor}
		}

		td.${ClassName.WITH_FIRST_COLUMN_INSERT_LINE_INACTIVE}::before {
			${tableCellColumnInsertLineStyles}
			left: -1px;
			top: -1px;
			${insertLineInactiveColor}
		}

		th.${ClassName.WITH_FIRST_COLUMN_INSERT_LINE}::before {
			${tableCellColumnInsertLineStyles}
			left: -1px;
			top: -${tableCellBorderWidth}px;
			${insertLineActiveColor}
		}

		th.${ClassName.WITH_FIRST_COLUMN_INSERT_LINE_INACTIVE}::before {
			${tableCellColumnInsertLineStyles}
			left: -1px;
			top: -${tableCellBorderWidth}px;
			${insertLineInactiveColor}
		}

		td.${ClassName.WITH_COLUMN_INSERT_LINE}::before {
			${tableCellColumnInsertLineStyles}
			left: ${token('space.negative.025', '-2px')};
			top: -1px;
			${insertLineActiveColor}
		}

		td.${ClassName.WITH_COLUMN_INSERT_LINE_INACTIVE}::before {
			${tableCellColumnInsertLineStyles}
			left: ${token('space.negative.025', '-2px')};
			top: -1px;
			${insertLineInactiveColor}
		}

		th.${ClassName.WITH_COLUMN_INSERT_LINE}::before {
			${tableCellColumnInsertLineStyles}
			left: ${token('space.negative.025', '-2px')};
			top: -${tableCellBorderWidth}px;
			${insertLineActiveColor}
		}

		th.${ClassName.WITH_COLUMN_INSERT_LINE_INACTIVE}::before {
			${tableCellColumnInsertLineStyles}
			left: ${token('space.negative.025', '-2px')};
			top: -${tableCellBorderWidth}px;
			${insertLineInactiveColor}
		}

		td.${ClassName.WITH_LAST_COLUMN_INSERT_LINE}::before {
			${tableCellColumnInsertLineStyles}
			right: -1px;
			top: -1px;
			${insertLineActiveColor}
		}

		td.${ClassName.WITH_LAST_COLUMN_INSERT_LINE_INACTIVE}::before {
			${tableCellColumnInsertLineStyles}
			right: -1px;
			top: -1px;
			${insertLineInactiveColor}
		}

		th.${ClassName.WITH_LAST_COLUMN_INSERT_LINE}::before {
			${tableCellColumnInsertLineStyles}
			right: -1px;
			top: -${tableCellBorderWidth}px;
			${insertLineActiveColor}
		}

		th.${ClassName.WITH_LAST_COLUMN_INSERT_LINE_INACTIVE}::before {
			${tableCellColumnInsertLineStyles}
			right: -1px;
			top: -${tableCellBorderWidth}px;
			${insertLineInactiveColor}
		}

		td.${ClassName.WITH_ROW_INSERT_LINE}::before {
			${tableCellRowInsertLineStyles}
			top: -1px;
			${insertLineActiveColor}
		}

		td.${ClassName.WITH_ROW_INSERT_LINE_INACTIVE}::before {
			${tableCellRowInsertLineStyles}
			top: -1px;
			${insertLineInactiveColor}
		}

		th.${ClassName.WITH_ROW_INSERT_LINE}::before {
			${tableCellRowInsertLineStyles}
			top: -1px;
			${insertLineActiveColor}
		}

		th.${ClassName.WITH_ROW_INSERT_LINE_INACTIVE}::before {
			${tableCellRowInsertLineStyles}
			top: -1px;
			${insertLineInactiveColor}
		}

		td.${ClassName.WITH_LAST_ROW_INSERT_LINE}::before {
			${tableCellRowInsertLineStyles}
			bottom: 0;
			${insertLineActiveColor}
		}

		td.${ClassName.WITH_LAST_ROW_INSERT_LINE_INACTIVE}::before {
			${tableCellRowInsertLineStyles}
			bottom: 0;
			${insertLineInactiveColor}
		}

		th.${ClassName.WITH_LAST_ROW_INSERT_LINE}::before {
			${tableCellRowInsertLineStyles}
			bottom: 0;
			${insertLineActiveColor}
		}

		th.${ClassName.WITH_LAST_ROW_INSERT_LINE_INACTIVE}::before {
			${tableCellRowInsertLineStyles}
			bottom: 0;
			${insertLineInactiveColor}
		}
	}
`;
