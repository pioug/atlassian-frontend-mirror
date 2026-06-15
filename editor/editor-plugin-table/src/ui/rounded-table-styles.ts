/* eslint-disable @atlaskit/design-system/no-css-tagged-template-expression */

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, type SerializedStyles } from '@emotion/react';

import { tableMarginTop } from '@atlaskit/editor-common/styles';
import {
	akEditorSmallZIndex,
	akEditorTableNumberColumnWidth,
	akEditorUnitZIndex,
} from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';

import { TableCssClassName as ClassName } from '../types';

import {
	nativeStickyHeaderZIndex,
	tableBorderColor,
	tableBorderDeleteColor,
	tableBorderSelectedColor,
} from './consts';

const roundedTableCellCornerStyles = (): SerializedStyles => css`
	.${ClassName.TABLE_NODE_WRAPPER} > table {
		/* Round table corner cells (including merged cells that span to the edge)
		   and their interaction overlays. The data-reaches-* attributes are set by the
		   TableCell node view based on each cell's position + rowspan/colspan. */
		> tbody > tr > td[data-reaches-top][data-reaches-left],
		> tbody > tr > th[data-reaches-top][data-reaches-left] {
			border-top-left-radius: ${token('radius.xlarge')};

			&::after,
			&.${ClassName.HOVERED_CELL_IN_DANGER}::after,
				&.${ClassName.HOVERED_NO_HIGHLIGHT}.${ClassName.HOVERED_CELL_IN_DANGER}::after {
				border-top-left-radius: ${token('radius.xlarge')};
			}
		}

		> tbody > tr > td[data-reaches-top][data-reaches-right],
		> tbody > tr > th[data-reaches-top][data-reaches-right] {
			border-top-right-radius: ${token('radius.xlarge')};

			&::after,
			&.${ClassName.HOVERED_CELL_IN_DANGER}::after,
				&.${ClassName.HOVERED_NO_HIGHLIGHT}.${ClassName.HOVERED_CELL_IN_DANGER}::after {
				border-top-right-radius: ${token('radius.xlarge')};
			}
		}

		> tbody > tr > td[data-reaches-bottom][data-reaches-left],
		> tbody > tr > th[data-reaches-bottom][data-reaches-left] {
			border-bottom-left-radius: ${token('radius.xlarge')};

			&::after,
			&.${ClassName.HOVERED_CELL_IN_DANGER}::after,
				&.${ClassName.HOVERED_NO_HIGHLIGHT}.${ClassName.HOVERED_CELL_IN_DANGER}::after {
				border-bottom-left-radius: ${token('radius.xlarge')};
			}
		}

		> tbody > tr > td[data-reaches-bottom][data-reaches-right],
		> tbody > tr > th[data-reaches-bottom][data-reaches-right] {
			border-bottom-right-radius: ${token('radius.xlarge')};

			&::after,
			&.${ClassName.HOVERED_CELL_IN_DANGER}::after,
				&.${ClassName.HOVERED_NO_HIGHLIGHT}.${ClassName.HOVERED_CELL_IN_DANGER}::after {
				border-bottom-right-radius: ${token('radius.xlarge')};
			}
		}
	}
`;

const roundedTableInteractionOverlayStyles = (): SerializedStyles => css`
	.${ClassName.TABLE_NODE_WRAPPER} > table {
		/* Active-cell highlight base properties (replaces activeCellHighlightStyles).
		   width/height: auto overrides the base cell ::after which uses width: 100%; height: 100%,
		   so that left/right/top/bottom determine the size instead. */
		td.${ClassName.TABLE_CELL}.${ClassName.ACTIVE_CURSOR_CELL}::after,
			th.${ClassName.TABLE_HEADER_CELL}.${ClassName.ACTIVE_CURSOR_CELL}::after {
			border: 1px solid ${token('color.border.selected')};
			box-shadow: ${token('elevation.shadow.raised')};
			content: '';
			position: absolute;
			top: -1px;
			left: -1px;
			right: -1px;
			bottom: -1px;
			width: auto;
			height: auto;
			z-index: ${akEditorSmallZIndex};
			pointer-events: none;
		}

		/* Normalize selected/hover/danger overlays to the same box model as active-cell.
		   width/height: auto overrides the base cell ::after which uses width: 100%; height: 100%. */
		td.${ClassName.HOVERED_CELL}::after,
			td.${ClassName.SELECTED_CELL}::after,
			th.${ClassName.TABLE_HEADER_CELL}.${ClassName.SELECTED_CELL}::after,
			th.${ClassName.TABLE_HEADER_CELL}.${ClassName.HOVERED_CELL}::after,
			th.${ClassName.TABLE_HEADER_CELL}.${ClassName.HOVERED_CELL_IN_DANGER}::after,
			td.${ClassName.TABLE_CELL}.${ClassName.HOVERED_CELL_IN_DANGER}::after {
			left: -1px;
			right: -1px;
			top: -1px;
			bottom: -1px;
			width: auto;
			height: auto;
		}

		/* Preserve interaction border colours on table edges without changing the shared -1px overlay inset. */
		> tbody
			> tr
			> td:is(
				.${ClassName.SELECTED_CELL},
				.${ClassName.HOVERED_CELL},
				.${ClassName.ACTIVE_CURSOR_CELL}
			),
			> tbody
			> tr
			> th:is(
				.${ClassName.SELECTED_CELL},
				.${ClassName.HOVERED_CELL},
				.${ClassName.ACTIVE_CURSOR_CELL}
			) {
			&[data-reaches-top] {
				border-top-color: transparent;

				&::after {
					top: -1px;
					bottom: -1px;
					border-top-color: ${tableBorderSelectedColor};
				}
			}

			&[data-reaches-left] {
				border-left-color: transparent;

				&::after {
					border-left-color: ${tableBorderSelectedColor};
				}
			}

			&[data-reaches-right] {
				border-right-color: transparent;

				&::after {
					border-right-color: ${tableBorderSelectedColor};
				}
			}

			&[data-reaches-bottom] {
				border-bottom-color: transparent;

				&::after {
					border-bottom-color: ${tableBorderSelectedColor};
				}
			}
		}

		> tbody
			> tr
			> td.${ClassName.HOVERED_CELL_IN_DANGER},
		> tbody
			> tr
			> th.${ClassName.HOVERED_CELL_IN_DANGER} {
			&[data-reaches-top] {
				border-top-color: transparent;

				&::after {
					top: -1px;
					bottom: -1px;
					border-top-color: ${tableBorderDeleteColor};
				}
			}

			&[data-reaches-left] {
				border-left-color: transparent;

				&::after {
					border-left-color: ${tableBorderDeleteColor};
				}
			}

			&[data-reaches-right] {
				border-right-color: transparent;

				&::after {
					border-right-color: ${tableBorderDeleteColor};
				}
			}

			&[data-reaches-bottom] {
				border-bottom-color: transparent;

				&::after {
					border-bottom-color: ${tableBorderDeleteColor};
				}
			}
		}
	}
`;

const roundedTableNumberedColumnStyles = (): SerializedStyles => css`
	/* Numbered columns are separate, so they need their own rounded edge owner. */
	.${ClassName.TABLE_CONTAINER}[data-number-column='true'] {
		/* Override the inline/container left border and replace it with one rounded pseudo-border. */
		> .${ClassName.ROW_CONTROLS_WRAPPER}
			.${ClassName.NUMBERED_COLUMN},
			> .${ClassName.DRAG_ROW_CONTROLS_WRAPPER}
			.${ClassName.NUMBERED_COLUMN} {
			position: relative;
			border-left: 0;

			&::before {
				content: '';
				position: absolute;
				top: 0;
				left: 0;
				bottom: 0;
				width: 100%;
				border-left: 1px solid ${tableBorderColor};
				border-top-left-radius: ${token('radius.xlarge')};
				border-bottom-left-radius: ${token('radius.xlarge')};
				pointer-events: none;
				z-index: ${akEditorUnitZIndex};
			}
		}

		/* Prevent individual number buttons from drawing a straight left border. */
		> .${ClassName.ROW_CONTROLS_WRAPPER}
			.${ClassName.NUMBERED_COLUMN_BUTTON},
			> .${ClassName.DRAG_ROW_CONTROLS_WRAPPER}
			.${ClassName.NUMBERED_COLUMN_BUTTON} {
			border-left-color: transparent;
		}

		> .${ClassName.ROW_CONTROLS_WRAPPER}
			.${ClassName.NUMBERED_COLUMN_BUTTON}.${ClassName.HOVERED_CELL_IN_DANGER},
			> .${ClassName.DRAG_ROW_CONTROLS_WRAPPER}
			.${ClassName.NUMBERED_COLUMN_BUTTON}.${ClassName.HOVERED_CELL_IN_DANGER},
			> .${ClassName.ROW_CONTROLS_WRAPPER}
			.${ClassName.NUMBERED_COLUMN_BUTTON}.${ClassName.HOVERED_CELL_ACTIVE},
			> .${ClassName.DRAG_ROW_CONTROLS_WRAPPER}
			.${ClassName.NUMBERED_COLUMN_BUTTON}.${ClassName.HOVERED_CELL_ACTIVE},
			> .${ClassName.ROW_CONTROLS_WRAPPER}
			.${ClassName.NUMBERED_COLUMN_BUTTON}.active,
			> .${ClassName.DRAG_ROW_CONTROLS_WRAPPER}
			.${ClassName.NUMBERED_COLUMN_BUTTON}.active {
			border-left-color: transparent;
		}

		/* When numbered column is present, the visual left edge belongs to the number column widget.
		   Zero out any left-side border-radius on the cell and its overlays/pseudo-borders —
		   but leave right-side radii untouched so right-edge cells still round correctly.
		   ::before is intentionally excluded here because on the sticky header it carries the
		   numbered-column mask which needs to round its own top-left corner (see overrides
		   below and in roundedTableStickyHeaderStyles). */
		> .${ClassName.TABLE_NODE_WRAPPER} > table > tbody > tr > th[data-reaches-top][data-reaches-left],
		> .${ClassName.TABLE_NODE_WRAPPER}
			> table
			> tbody
			> tr
			> td[data-reaches-top][data-reaches-left] {
			border-top-left-radius: 0;

			&::after {
				border-top-left-radius: 0;
			}
		}

		> .${ClassName.TABLE_NODE_WRAPPER}
			> table
			> tbody
			> tr
			> th[data-reaches-bottom][data-reaches-left],
		> .${ClassName.TABLE_NODE_WRAPPER}
			> table
			> tbody
			> tr
			> td[data-reaches-bottom][data-reaches-left] {
			border-bottom-left-radius: 0;

			&::after,
			&::before {
				border-bottom-left-radius: 0;
			}
		}

		/* Preserve rounded numbered-column corners across normal, active, and danger states. */
		.${ClassName.NUMBERED_COLUMN_BUTTON}:first-of-type,
		.${ClassName.NUMBERED_COLUMN_BUTTON}.${ClassName.HOVERED_CELL_IN_DANGER}:first-of-type,
			.${ClassName.NUMBERED_COLUMN_BUTTON}.${ClassName.HOVERED_CELL_ACTIVE}:first-of-type,
			.${ClassName.NUMBERED_COLUMN_BUTTON}.active:first-of-type {
			border-top-left-radius: ${token('radius.xlarge')};
		}

		.${ClassName.NUMBERED_COLUMN_BUTTON}:last-of-type,
		.${ClassName.NUMBERED_COLUMN_BUTTON}.${ClassName.HOVERED_CELL_IN_DANGER}:last-of-type,
			.${ClassName.NUMBERED_COLUMN_BUTTON}.${ClassName.HOVERED_CELL_ACTIVE}:last-of-type,
			.${ClassName.NUMBERED_COLUMN_BUTTON}.active:last-of-type {
			border-bottom-left-radius: ${token('radius.xlarge')};
		}

		.${ClassName.NUMBERED_COLUMN_BUTTON}.${ClassName.HOVERED_CELL_IN_DANGER}:first-of-type::after {
			border-top-left-radius: ${token('radius.xlarge')};
		}

		.${ClassName.NUMBERED_COLUMN_BUTTON}.${ClassName.HOVERED_CELL_IN_DANGER}:last-of-type::after {
			border-bottom-left-radius: ${token('radius.xlarge')};
		}

		/* Sticky numbered-column mask also needs the same top-left radius. */
		> .${ClassName.TABLE_NODE_WRAPPER_NO_OVERFLOW}
			tr
			th[data-reaches-top][data-reaches-left]::before {
			border-top-left-radius: ${token('radius.xlarge')};
		}
	}
`;

const roundedTableStickyHeaderCellCornerStyles = (): SerializedStyles => css`
	/* Sticky header rows have independent border/shadow/mask painting, so patch the sticky-only painters too. */
	.${ClassName.TABLE_NODE_WRAPPER} > table > tbody > tr.${ClassName.NATIVE_STICKY},
		.${ClassName.TABLE_NODE_WRAPPER} > table.${ClassName.TABLE_STICKY} > tbody > tr.sticky {
		> th[data-reaches-left],
		> td[data-reaches-left] {
			border-top-left-radius: ${token('radius.xlarge')};

			&::after,
			&::before {
				border-top-left-radius: ${token('radius.xlarge')};
			}
		}

		> td[data-reaches-right],
		> th[data-reaches-right] {
			border-top-right-radius: ${token('radius.xlarge')};

			&::after,
			&::before {
				border-top-right-radius: ${token('radius.xlarge')};
			}
		}
	}

	.${ClassName.TABLE_STICKY} .${ClassName.COLUMN_CONTROLS_DECORATIONS}::after {
		border-left-color: transparent;
	}
`;

const roundedTableStickyHeaderNumberColumnStyles = (): SerializedStyles => css`
	.${ClassName.TABLE_CONTAINER}[data-number-column='true'] .${ClassName.TABLE_NODE_WRAPPER_NO_OVERFLOW} tr th[data-reaches-top][data-reaches-left]::before,
	.${ClassName.TABLE_CONTAINER}[data-number-column='true'] .${ClassName.TABLE_NODE_WRAPPER_NO_OVERFLOW} tr.${ClassName.NATIVE_STICKY} th[data-reaches-left]::before,
	.${ClassName.TABLE_CONTAINER}[data-number-column='true'] .${ClassName.TABLE_NODE_WRAPPER_NO_OVERFLOW} .${ClassName.NATIVE_STICKY_ACTIVE} th[data-reaches-left]::before {
		border-top-left-radius: ${token('radius.xlarge')};
		border-bottom: none;
	}
`;

const roundedTableStickyHeaderCornerMaskStyles = (): SerializedStyles => css`
	/* Same z-index as the sticky row; DOM order keeps the row above this mask and the table border below it. */
	.${ClassName.TABLE_CORNER_MASK} {
		display: none;
		position: sticky;
		top: calc(${tableMarginTop}px - 1px);
		width: 12px;
		height: 12px;
		margin-bottom: -12px;
		background: ${token('elevation.surface')};
		pointer-events: none;
		z-index: ${nativeStickyHeaderZIndex};
	}

	.${ClassName.TABLE_CONTAINER}[data-number-column='true']
		.${ClassName.TABLE_CORNER_MASK}[data-corner='left'] {
		margin-left: -${akEditorTableNumberColumnWidth}px;
	}

	.${ClassName.TABLE_CORNER_MASK}[data-corner='right'] {
		left: calc(100% - 11px);
	}

	/*
		Scope the :has() selectors to a DIRECT child table so a nested table that
		has its own sticky row does not pull the OUTER wrapper's masks into the
		sticky / fallback layout. The masks belong to the wrapper of the table
		that owns the sticky row, never to an ancestor wrapper.
	*/
	.${ClassName.TABLE_NODE_WRAPPER}:has(> table > tbody > tr.${ClassName.NATIVE_STICKY})
		> .${ClassName.TABLE_CORNER_MASK},
	.${ClassName.TABLE_NODE_WRAPPER}:has(> table.${ClassName.TABLE_STICKY} > tbody > tr.sticky)
		> .${ClassName.TABLE_CORNER_MASK} {
		display: block;
	}

	/*
		When the table overflows horizontally, sticky headers fall back from native
		position: sticky to a fixed-position header row. Match that positioning so
		the corner masks continue to cover the rounded corners in the fallback path.

		The direct-child combinator inside :has() is critical: without it a nested
		table entering the legacy fallback would incorrectly trigger this rule on
		the OUTER wrapper, detaching the outer table's masks from its corners.
	*/
	.${ClassName.TABLE_NODE_WRAPPER}:has(> table.${ClassName.TABLE_STICKY} > tbody > tr.sticky)
		> .${ClassName.TABLE_CORNER_MASK} {
		position: fixed;
		top: 30px;
		z-index: 1;
	}
`;

const roundedTableStickyHeaderOverlayStyles = (): SerializedStyles => css`
	/*
		Paint the pinned sticky row's rounded top edge via each cell's ::after.
		top: -1px places it in the reserved transparent border slot, aligned with
		the row's inset-shadow bottom border. Longhand border-top-* lets
		interaction-state rules override only the colour.
	*/
	.${ClassName.TABLE_NODE_WRAPPER}
		> table
		> tbody
		> tr.${ClassName.NATIVE_STICKY}.${ClassName.NATIVE_STICKY_ACTIVE}
		> th.${ClassName.TABLE_HEADER_CELL}[data-reaches-top]::after,
	.${ClassName.TABLE_NODE_WRAPPER}
		> table
		> tbody
		> tr.${ClassName.NATIVE_STICKY}.${ClassName.NATIVE_STICKY_ACTIVE}
		> td.${ClassName.TABLE_CELL}[data-reaches-top]::after {
		content: '';
		position: absolute;
		left: -1px;
		right: -1px;
		top: -1px;
		bottom: -1px;
		width: auto;
		height: auto;
		pointer-events: none;
		border-top-width: 1px;
		border-top-style: solid;
		border-top-color: ${tableBorderColor};
	}

	/* Selection / hover / active-cursor colour for the painted top edge. */
	.${ClassName.TABLE_NODE_WRAPPER}
		> table
		> tbody
		> tr.${ClassName.NATIVE_STICKY}.${ClassName.NATIVE_STICKY_ACTIVE}
		> th.${ClassName.TABLE_HEADER_CELL}[data-reaches-top]:is(
			.${ClassName.SELECTED_CELL},
			.${ClassName.HOVERED_CELL},
			.${ClassName.ACTIVE_CURSOR_CELL}
		)::after,
	.${ClassName.TABLE_NODE_WRAPPER}
		> table
		> tbody
		> tr.${ClassName.NATIVE_STICKY}.${ClassName.NATIVE_STICKY_ACTIVE}
		> td.${ClassName.TABLE_CELL}[data-reaches-top]:is(
			.${ClassName.SELECTED_CELL},
			.${ClassName.HOVERED_CELL},
			.${ClassName.ACTIVE_CURSOR_CELL}
		)::after {
		border-top-color: ${tableBorderSelectedColor};
	}

	/* Danger colour for the painted top edge. */
	.${ClassName.TABLE_NODE_WRAPPER}
		> table
		> tbody
		> tr.${ClassName.NATIVE_STICKY}.${ClassName.NATIVE_STICKY_ACTIVE}
		> th.${ClassName.TABLE_HEADER_CELL}[data-reaches-top].${ClassName.HOVERED_CELL_IN_DANGER}::after,
	.${ClassName.TABLE_NODE_WRAPPER}
		> table
		> tbody
		> tr.${ClassName.NATIVE_STICKY}.${ClassName.NATIVE_STICKY_ACTIVE}
		> td.${ClassName.TABLE_CELL}[data-reaches-top].${ClassName.HOVERED_CELL_IN_DANGER}::after {
		border-top-color: ${tableBorderDeleteColor};
	}

	:where(.${ClassName.TABLE_NODE_WRAPPER} > table > tbody > tr.${ClassName.NATIVE_STICKY})
		> th.${ClassName.TABLE_HEADER_CELL}[data-reaches-left]::after {
		border-left-color: transparent;
	}
`;

const roundedTableStickyHeaderShadowStyles = (): SerializedStyles => css`
	/* Native sticky row */
	.${ClassName.TABLE_NODE_WRAPPER}
		> table
		> tbody
		> tr.${ClassName.NATIVE_STICKY},
	/* Legacy sticky row */
	.${ClassName.TABLE_NODE_WRAPPER}
		> table.${ClassName.TABLE_STICKY}
		> tbody
		> tr.sticky {
		box-shadow: inset 0 -1px ${tableBorderColor} !important;
	}

	/*
		Box-shadow below active sticky header.
	*/
	.${ClassName.TABLE_NODE_WRAPPER}
		> table
		> tbody
		> tr.${ClassName.NATIVE_STICKY}.${ClassName.NATIVE_STICKY_ACTIVE} {
		box-shadow:
			inset 0 -1px ${tableBorderColor},
			0 6px 4px -4px ${token('elevation.shadow.overflow.perimeter')} !important;
	}

	/*
		Sticky headers leave the table's rounded outer overlay behind, so make the
		reserved 1px top-border slot visible on the pinned row.
	*/
	.${ClassName.TABLE_NODE_WRAPPER}
		> table
		> tbody
		> tr.${ClassName.NATIVE_STICKY}.${ClassName.NATIVE_STICKY_ACTIVE}
		> th.${ClassName.TABLE_HEADER_CELL}[data-reaches-top],
	.${ClassName.TABLE_NODE_WRAPPER}
		> table
		> tbody
		> tr.${ClassName.NATIVE_STICKY}.${ClassName.NATIVE_STICKY_ACTIVE}
		> td.${ClassName.TABLE_CELL}[data-reaches-top],
	.${ClassName.TABLE_NODE_WRAPPER}
		> table.${ClassName.TABLE_STICKY}
		> tbody
		> tr.sticky
		> th.${ClassName.TABLE_HEADER_CELL}[data-reaches-top],
	.${ClassName.TABLE_NODE_WRAPPER}
		> table.${ClassName.TABLE_STICKY}
		> tbody
		> tr.sticky
		> td.${ClassName.TABLE_CELL}[data-reaches-top] {
		border-top-color: ${tableBorderColor};
	}

	/*
		Restore legacy sticky corner side borders after the row is pinned outside the
		table's outer overlay. (Pinned row top edge is painted by the cell ::after
		overlay in roundedTableStickyHeaderOverlayStyles.)
	*/
	.${ClassName.TABLE_NODE_WRAPPER}
		> table.${ClassName.TABLE_STICKY}
		> tbody
		> tr.sticky
		> th.${ClassName.TABLE_HEADER_CELL}[data-reaches-left],
	.${ClassName.TABLE_NODE_WRAPPER}
		> table.${ClassName.TABLE_STICKY}
		> tbody
		> tr.sticky
		> td.${ClassName.TABLE_CELL}[data-reaches-left] {
		border-left-color: ${tableBorderColor};
	}

	.${ClassName.TABLE_NODE_WRAPPER}
		> table.${ClassName.TABLE_STICKY}
		> tbody
		> tr.sticky
		> th.${ClassName.TABLE_HEADER_CELL}[data-reaches-right],
	.${ClassName.TABLE_NODE_WRAPPER}
		> table.${ClassName.TABLE_STICKY}
		> tbody
		> tr.sticky
		> td.${ClassName.TABLE_CELL}[data-reaches-right] {
		border-right: 1px solid ${tableBorderColor};
	}

	/*
		Paint the legacy sticky bottom edge on cells so it aligns under display: grid.
	*/
	.${ClassName.TABLE_NODE_WRAPPER}
		> table.${ClassName.TABLE_STICKY}
		> tbody
		> tr.sticky
		> th.${ClassName.TABLE_HEADER_CELL},
	.${ClassName.TABLE_NODE_WRAPPER}
		> table.${ClassName.TABLE_STICKY}
		> tbody
		> tr.sticky
		> td.${ClassName.TABLE_CELL} {
		border-bottom: 1px solid ${tableBorderColor};
	}

	.${ClassName.TABLE_CONTAINER}.${ClassName.WITH_CONTROLS}:has(tr.sticky)
		.${ClassName.NUMBERED_COLUMN}
		.${ClassName.NUMBERED_COLUMN_BUTTON}:first-of-type {
		box-shadow: none !important;
	}
`;

export const roundedTableOverrides = (): SerializedStyles => css`
	${roundedTableCellCornerStyles()}
	${roundedTableInteractionOverlayStyles()}
	${roundedTableNumberedColumnStyles()}
	${roundedTableStickyHeaderCellCornerStyles()}
	${roundedTableStickyHeaderNumberColumnStyles()}
	${roundedTableStickyHeaderCornerMaskStyles()}
	${roundedTableStickyHeaderOverlayStyles()}
	${roundedTableStickyHeaderShadowStyles()}
`;
