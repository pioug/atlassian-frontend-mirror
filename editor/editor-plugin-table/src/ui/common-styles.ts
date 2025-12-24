/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

/* eslint-disable @atlaskit/design-system/no-css-tagged-template-expression */

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { browser as browserLegacy, getBrowserInfo } from '@atlaskit/editor-common/browser';
import {
	ANCHOR_VARIABLE_NAME,
	tableMarginTop,
	tableSharedStyle,
} from '@atlaskit/editor-common/styles';
import { SORTABLE_COLUMN_ICON_CLASSNAME } from '@atlaskit/editor-common/table';
import type { FeatureFlags } from '@atlaskit/editor-common/types';
import {
	akEditorSelectedNodeClassName,
	akEditorSmallZIndex,
	akEditorStickyHeaderZIndex,
	akEditorTableCellOnStickyHeaderZIndex,
	akEditorTableNumberColumnWidth,
	akEditorTableToolbarSize,
	akEditorUnitZIndex,
	getSelectionStyles,
	MAX_BROWSER_SCROLLBAR_HEIGHT,
	SelectionStyle,
	relativeSizeToBaseFontSize,
	relativeFontSizeToBase16,
	akEditorSelectedBorderColor,
} from '@atlaskit/editor-shared-styles';
import { scrollbarStyles } from '@atlaskit/editor-shared-styles/scrollbar';
import { fg } from '@atlaskit/platform-feature-flags';
import { N0, N40A, R500 } from '@atlaskit/theme/colors';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { token } from '@atlaskit/tokens';

import { SORTING_ICON_CLASS_NAME } from '../pm-plugins/view-mode-sort/consts';
import { TableCssClassName as ClassName } from '../types';

import {
	aboveNativeStickyHeaderZIndex,
	belowNativeStickyHeaderZIndex,
	columnControlsDecorationHeight,
	dragRowControlsWidth,
	nativeStickyHeaderZIndex,
	resizeHandlerAreaWidth,
	resizeHandlerZIndex,
	resizeLineWidth,
	rowControlsZIndex,
	stickyHeaderBorderBottomWidth,
	stickyRowOffsetTop,
	stickyRowZIndex,
	tableBorderColor,
	tableBorderDeleteColor,
	tableBorderRadiusSize,
	tableBorderSelectedColor,
	tableCellBackgroundColor,
	tableCellDeleteColor,
	tableCellSelectedColor,
	tableColumnControlsHeight,
	tableControlsSpacing,
	tableHeaderCellBackgroundColor,
	tableHeaderCellSelectedColor,
	tableInsertColumnButtonSize,
	tableOverflowShadowWidth,
	tablePadding,
	tableScrollbarOffset,
	tableTextColor,
	tableToolbarDeleteColor,
	tableToolbarSelectedColor,
	tableToolbarSize,
} from './consts';
import {
	columnControlsDecoration,
	columnControlsLineMarker,
	DeleteButton,
	dragCornerControlButton,
	dragInsertButtonWrapper,
	floatingColumnControls,
	HeaderButton,
	HeaderButtonDanger,
	HeaderButtonHover,
	hoveredCell,
	hoveredDeleteButton,
	hoveredWarningCell,
	insertColumnButtonWrapper,
	insertLine,
	InsertMarker,
	insertRowButtonWrapper,
	OverflowShadow,
	resizeHandle,
	rowControlsWrapperDotStyle,
} from './ui-styles';

const cornerControlHeight = tableToolbarSize + 1;

/*
  compensating for half of the insert column button
  that is aligned to the right edge initially on hover of the top right column control when table overflown,
  its center should be aligned with the edge
*/
export const insertColumnButtonOffset = tableInsertColumnButtonSize / 2;
export const tableRowHeight = 44;

const rangeSelectionStyles = `
.${ClassName.NODEVIEW_WRAPPER}.${akEditorSelectedNodeClassName} table tbody tr {
  th,td {
    ${getSelectionStyles([SelectionStyle.Blanket, SelectionStyle.Border])}

    // The non-break space /00a0 in :after selector caused a table scroll issue when pressing Cmd+A to select table
    // This line is to override the content of :after selector from the shared getSelectionStyles
    &::after {
      content: '';
    }
  }
}
`;

const rangeSelectionStylesForFakeBorders = `
.${ClassName.NODEVIEW_WRAPPER}.${akEditorSelectedNodeClassName} .pm-table-left-border,
.${ClassName.NODEVIEW_WRAPPER}.${akEditorSelectedNodeClassName} .pm-table-right-border {
	  background: ${akEditorSelectedBorderColor};
}
`;

const sentinelStyles = `.${ClassName.TABLE_CONTAINER} {
  > .${ClassName.TABLE_STICKY_SENTINEL_TOP}, > .${ClassName.TABLE_STICKY_SENTINEL_BOTTOM} {
    position: absolute;
    width: 100%;
    height: 1px;
    margin-top: -1px;
    // need this to avoid sentinel being focused via keyboard
    // this still allows it to be detected by intersection observer
    visibility: hidden;
  }
  > .${ClassName.TABLE_STICKY_SENTINEL_TOP} {
    top: ${columnControlsDecorationHeight}px;
  }
  > .${ClassName.TABLE_STICKY_SENTINEL_BOTTOM} {
      bottom: ${tableScrollbarOffset + stickyRowOffsetTop + tablePadding * 2 + 23}px;
  }
  &.${ClassName.WITH_CONTROLS} {
    > .${ClassName.TABLE_STICKY_SENTINEL_TOP} {
      top: 0px;
    }
    > .${ClassName.TABLE_STICKY_SENTINEL_BOTTOM} {
      margin-bottom: ${columnControlsDecorationHeight}px;
    }
  }
}`;

const stickyScrollbarSentinelStyles = `.${ClassName.TABLE_CONTAINER} {
 > .${ClassName.TABLE_STICKY_SCROLLBAR_SENTINEL_BOTTOM},
 > .${ClassName.TABLE_STICKY_SCROLLBAR_SENTINEL_TOP} {
    position: absolute;
    width: 100%;
    height: 1px;
    margin-top: -1px;
    // need this to avoid sentinel being focused via keyboard
    // this still allows it to be detected by intersection observer
    visibility: hidden;
  }
  > .${ClassName.TABLE_STICKY_SCROLLBAR_SENTINEL_TOP} {
    top: ${columnControlsDecorationHeight + tableRowHeight * 3}px;
  }
  > .${ClassName.TABLE_STICKY_SCROLLBAR_SENTINEL_BOTTOM} {
    bottom: ${MAX_BROWSER_SCROLLBAR_HEIGHT}px;
  }
}`;

const stickyScrollbarContainerStyles = `.${ClassName.TABLE_CONTAINER} {
  > .${ClassName.TABLE_STICKY_SCROLLBAR_CONTAINER} {
    width: 100%;
    display: none;
    overflow-x: auto;
    position: sticky;
    bottom: 0;
    z-index: 1;
  }
}`;

const stickyScrollbarStyles = `${stickyScrollbarContainerStyles} ${stickyScrollbarSentinelStyles}`;

const shadowSentinelStyles = `
  .${ClassName.TABLE_SHADOW_SENTINEL_LEFT},
  .${ClassName.TABLE_SHADOW_SENTINEL_RIGHT} {
    position: absolute;
    top: 0;
    height: 100%;
    width: 1px;
    visibility: hidden;
  }
  .${ClassName.TABLE_SHADOW_SENTINEL_LEFT} {
    left: 0;
  }
  .${ClassName.TABLE_SHADOW_SENTINEL_RIGHT} {
    right: 0;
  }
`;

const breakoutWidthStyling = () => {
	return css`
		> *:not([data-mark-type='fragment'])
			.${ClassName.NODEVIEW_WRAPPER}
			.${ClassName.TABLE_CONTAINER} {
			margin-left: unset !important;
			width: 100% !important;
		}

		> [data-mark-type='fragment'] * .${ClassName.NODEVIEW_WRAPPER} .${ClassName.TABLE_CONTAINER} {
			margin-left: unset !important;
			width: 100% !important;
		}
	`;
};

const viewModeSortStyles = () => {
	return css`
		/* new styles */
		th {
			.${SORTING_ICON_CLASS_NAME} {
				+ p {
					margin-top: 0 !important;
				}
			}

			> .${SORTING_ICON_CLASS_NAME} {
				&:has(.is-active) {
					.${SORTABLE_COLUMN_ICON_CLASSNAME} {
						opacity: 1;
					}
				}
			}

			> .${SORTING_ICON_CLASS_NAME} {
				.${SORTABLE_COLUMN_ICON_CLASSNAME} {
					opacity: 0;
					&:focus {
						opacity: 1;
					}
				}
			}

			&:hover:not(:has(.${ClassName.TABLE_CONTAINER}:hover)) {
				> .${SORTING_ICON_CLASS_NAME} {
					.${SORTABLE_COLUMN_ICON_CLASSNAME} {
						opacity: 1;
					}
				}
			}
		}
	`;
};

const tableBorderStyles = () => {
	return `border-color: ${tableBorderDeleteColor}`;
};

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
const tableStickyHeaderColumnControlsDecorationsStyle = () => {
	return css`
		.${ClassName.TABLE_STICKY} .${ClassName.COLUMN_CONTROLS_DECORATIONS} {
			z-index: 0;
			left: -1px;
		}

		.${ClassName.TABLE_STICKY} .${ClassName.COLUMN_CONTROLS_DECORATIONS}::after {
			border-left: 1px solid ${tableBorderColor};
		}

		.${ClassName.TABLE_STICKY} tr:first-of-type th.${ClassName.TABLE_HEADER_CELL} {
			&.${ClassName.COLUMN_SELECTED}, &.${ClassName.HOVERED_COLUMN} {
				.${ClassName.COLUMN_CONTROLS_DECORATIONS}::after {
					left: 0;
				}
			}
		}
	`;
};

const tableStickyHeaderFirefoxFixStyle = () => {
	const browser = expValEquals('platform_editor_hydratable_ui', 'isEnabled', true)
		? getBrowserInfo()
		: browserLegacy;
	/*
	This is MAGIC!
	This fixes a bug which occurs in firefox when the first row becomes sticky.
	see https://product-fabric.atlassian.net/browse/ED-19177
  */
	if (browser.gecko) {
		return css`
			.${ClassName.TABLE_STICKY} > tbody::before {
				content: '';
			}
		`;
	}
};

const baseTableStylesWithoutSharedStyle = (props: {
	featureFlags?: FeatureFlags;
	isDragAndDropEnabled?: boolean;
}) => css`
	${columnControlsLineMarker()};
	${hoveredDeleteButton()};
	${hoveredCell()};
	${hoveredWarningCell};
	${insertLine()};
	${resizeHandle()};
	${rangeSelectionStyles};
	${fg('platform_editor_table_numbered_table_border') && rangeSelectionStylesForFakeBorders};
	${viewModeSortStyles()};
	${expValEquals(
	'platform_editor_table_sticky_header_improvements',
	'cohort',
	'test_with_overflow',
) && tableAnchorStyles};

	.${ClassName.LAST_ITEM_IN_CELL} {
		margin-bottom: 0;
	}

	.${ClassName.TABLE_NODE_WRAPPER} {
		td.${ClassName.TABLE_CELL}, th.${ClassName.TABLE_HEADER_CELL} {
			position: relative;
			overflow: visible;
		}

		td.${ClassName.TABLE_CELL} {
			background-color: ${tableCellBackgroundColor};
			&::after {
				height: 100%;
				content: '';
				border-left: 1px solid ${tableBorderColor};
				border-bottom: 1px solid ${tableBorderColor};
				position: absolute;
				right: 0px;
				top: 0px;
				bottom: 0;
				width: 100%;
				display: inline-block;
				pointer-events: none;
			}
		}
	}

	.${ClassName.CONTROLS_FLOATING_BUTTON_COLUMN} {
		${insertColumnButtonWrapper()}
	}

	.${ClassName.CONTROLS_FLOATING_BUTTON_ROW} {
		${insertRowButtonWrapper()}
	}

	${dragInsertButtonWrapper()}

	${dragCornerControlButton()}

	/* Delete button */
	${DeleteButton()}
	/* Ends Delete button */

	/* sticky styles */
	${fg('platform_editor_nested_tables_sticky_header_bug')
		? `
		.${ClassName.TABLE_STICKY} > .${props.isDragAndDropEnabled ? ClassName.DRAG_ROW_CONTROLS_WRAPPER : ClassName.ROW_CONTROLS_WRAPPER} .${ClassName.NUMBERED_COLUMN} .${ClassName.NUMBERED_COLUMN_BUTTON}:first-of-type {
			margin-top: ${fg('platform_editor_number_column_sticky_header_bug')
			? stickyRowOffsetTop
			: stickyRowOffsetTop + 2
		}px;
			width: ${akEditorTableNumberColumnWidth}px;

			position: fixed !important;
			z-index: ${akEditorStickyHeaderZIndex} !important;
			box-shadow: 0px -${stickyRowOffsetTop}px ${token('elevation.surface', 'white')};
			border-right: 0 none;
			/* top set by NumberColumn component */
		}
		`
		: `
    	.${ClassName.TABLE_STICKY} .${ClassName.NUMBERED_COLUMN} .${ClassName.NUMBERED_COLUMN_BUTTON}:first-of-type {
			margin-top: ${fg('platform_editor_number_column_sticky_header_bug')
			? stickyRowOffsetTop
			: stickyRowOffsetTop + 2
		}px;
			width: ${akEditorTableNumberColumnWidth}px;

			position: fixed !important;
			z-index: ${akEditorStickyHeaderZIndex} !important;
			box-shadow: 0px -${stickyRowOffsetTop}px ${token('elevation.surface', 'white')};
			border-right: 0 none;
			/* top set by NumberColumn component */
		}
		`}

	.${ClassName.TABLE_STICKY} .${ClassName.CORNER_CONTROLS}.sticky {
		position: fixed !important;
		/* needs to be above row controls */
		z-index: ${akEditorSmallZIndex} !important;
		background: ${token('elevation.surface', 'white')};

		width: ${tableToolbarSize}px;
		height: ${tableToolbarSize}px;
	}

	.${ClassName.CORNER_CONTROLS}.sticky .${ClassName.CONTROLS_CORNER_BUTTON} {
		border-bottom: 0px none;
		border-right: 0px none;

		height: ${tableToolbarSize}px;
		width: ${tableToolbarSize}px;
	}

	${tableStickyHeaderColumnControlsDecorationsStyle()}

	${tableStickyHeaderFirefoxFixStyle()}

    .${ClassName.TABLE_STICKY}
      .${ClassName.ROW_CONTROLS}
      .${ClassName.ROW_CONTROLS_BUTTON_WRAP}.sticky {
		position: fixed !important;
		z-index: ${akEditorStickyHeaderZIndex} !important;
		display: flex;
		border-left: ${tableToolbarSize}px solid ${token('elevation.surface', 'white')};
		margin-left: -${tableToolbarSize}px;
	}

	.${ClassName.TABLE_STICKY} col:first-of-type {
		/* moving rows out of a table layout does weird things in Chrome */
		border-right: 1px solid ${token('elevation.surface', 'green')};
	}

	tr.sticky {
		padding-top: ${stickyRowOffsetTop}px;
		position: fixed;
		display: grid;

		/* to keep it above cell selection but below date and other nodes popups that are inside sticky header */
		z-index: ${akEditorTableCellOnStickyHeaderZIndex - 5};

		overflow-y: visible;
		overflow-x: hidden;

		grid-auto-flow: column;

		/* background for where controls apply */
		background: ${token('elevation.surface', 'white')};
		box-sizing: content-box;
		box-shadow: 0 6px 4px -4px ${token('elevation.shadow.overflow.perimeter', N40A)};

		margin-left: -1px;

		&.no-pointer-events {
			pointer-events: none;
		}
	}

	.${ClassName.TABLE_STICKY} .${ClassName.TABLE_STICKY_SHADOW} {
		left: unset;
		position: fixed;
		/* needs to be above sticky header row and below date and other nodes popups that are inside sticky header */
		z-index: ${akEditorTableCellOnStickyHeaderZIndex};
	}

	.${ClassName.WITH_CONTROLS}.${ClassName.TABLE_STICKY} .${ClassName.TABLE_STICKY_SHADOW} {
		padding-bottom: ${tableToolbarSize}px;
	}

	.tableView-content-wrap:has(.tableView-content-wrap):has(
			.${ClassName.NESTED_TABLE_WITH_CONTROLS}
		) {
		padding-left: unset;
	}

	.tableView-content-wrap:has(.${ClassName.NESTED_TABLE_WITH_CONTROLS}) {
		padding-left: 15px;
	}

	tr.sticky th {
		border-bottom: ${stickyHeaderBorderBottomWidth}px solid ${tableBorderColor};
		margin-right: -1px;
	}

	.${ClassName.TABLE_STICKY} tr.sticky > th:last-child {
		border-right-width: 1px;
	}

	/* add left edge for first cell */
	.${ClassName.TABLE_STICKY} tr.sticky > th:first-of-type {
		margin-left: 0px;
	}

	/* add a little bit so the scroll lines up with the table */
	.${ClassName.TABLE_STICKY} tr.sticky::after {
		content: ' ';
		width: ${insertColumnButtonOffset + 1}px;
	}

	/* To fix jumpiness caused in Chrome Browsers for sticky headers */
	.${ClassName.TABLE_STICKY} .sticky + tr {
		min-height: 0px;
	}

	/* move resize line a little in sticky bar */
	.${ClassName.TABLE_CONTAINER}.${ClassName.TABLE_STICKY} {
		tr.sticky td.${ClassName.WITH_RESIZE_LINE}, tr.sticky th.${ClassName.WITH_RESIZE_LINE} {
			.${ClassName.RESIZE_HANDLE_DECORATION}::after {
				right: ${(resizeHandlerAreaWidth - resizeLineWidth) / 2 + 1}px;
			}
		}

		/* when selected put it back to normal -- :not selector would be nicer */
		tr.sticky
			td.${ClassName.WITH_RESIZE_LINE}.${ClassName.SELECTED_CELL},
			tr.sticky
			th.${ClassName.WITH_RESIZE_LINE}.${ClassName.SELECTED_CELL} {
			.${ClassName.RESIZE_HANDLE_DECORATION}::after {
				right: ${(resizeHandlerAreaWidth - resizeLineWidth) / 2}px;
			}
		}
	}

	tr.sticky .${ClassName.HOVERED_CELL}, tr.sticky .${ClassName.SELECTED_CELL} {
		z-index: 1;
	}

	tr.${ClassName.NATIVE_STICKY} {
		position: sticky;
		top: ${tableMarginTop}px;
		z-index: calc(${akEditorTableCellOnStickyHeaderZIndex} - 5);
		box-shadow:
			inset -1px 1px ${tableBorderColor},
			inset 1px -1px ${tableBorderColor};

		&.${ClassName.NATIVE_STICKY_ACTIVE} {
			box-shadow:
				inset -1px 1px ${tableBorderColor},
				inset 1px -1px ${tableBorderColor},
				0 6px 4px -4px ${token('elevation.shadow.overflow.perimeter')};
		}

		${fg('platform_editor_table_sticky_header_patch_1')
		? `th.${ClassName.TABLE_HEADER_CELL}::after {
				height: 100%;
				content: '';
				border-left: 1px solid ${tableBorderColor};
				border-bottom: 1px solid ${tableBorderColor};
				position: absolute;
				right: 0px;
				top: 0px;
				bottom: 0;
				width: 100%;
				display: inline-block;
				pointer-events: none;
			}`
		: ``}
	}

	/** Adds mask above sticky header to prevent table content from bleeding through on scroll */
	.${ClassName.TABLE_NODE_WRAPPER}:has(tr.${ClassName.NATIVE_STICKY})::before {
		content: ' ';
		display: block;
		top: 0;
		box-sizing: border-box;
		width: 100%;
		height: 0;
		margin-bottom: -${tableMarginTop}px;
		position: sticky;
		border-top: ${tableMarginTop}px solid ${token('elevation.surface')};
		z-index: ${stickyRowZIndex};
	}

	/** When cleaning up, merge this with the mask style above */
	${fg('platform_editor_table_sticky_header_patch_2')
		? `
		.${ClassName.TABLE_NODE_WRAPPER}:has(tr.${ClassName.NATIVE_STICKY})::before {
			border-top: ${tableMarginTop}px solid transparent;
		}

		.${ClassName.TABLE_NODE_WRAPPER}:has(tr.${ClassName.NATIVE_STICKY_ACTIVE})::before {
			border-top: ${tableMarginTop}px solid ${token('elevation.surface')};
		}`
		: fg('platform_editor_table_sticky_header_patch_1')
			? `
			.${ClassName.TABLE_NODE_WRAPPER}:has(tr.${ClassName.NATIVE_STICKY})::before {
				margin-top: 1px;
			}`
			: ``}

	/** Corrects position of drag row controls when sticky header top mask is present */
	.${ClassName.TABLE_CONTAINER}:has(.${ClassName.TABLE_NODE_WRAPPER_NO_OVERFLOW})
		> .${ClassName.DRAG_ROW_CONTROLS_WRAPPER}
		> div
		> .${ClassName.DRAG_ROW_CONTROLS} {
		top: ${tableColumnControlsHeight}px;
		z-index: ${aboveNativeStickyHeaderZIndex};
	}




	.${ClassName.TABLE_CONTAINER}[data-table-header-is-stuck='true']:has(.${ClassName.TABLE_NODE_WRAPPER_NO_OVERFLOW})
		> .${ClassName.DRAG_ROW_CONTROLS_WRAPPER}
		> div
		> .${ClassName.DRAG_ROW_CONTROLS} {
		z-index: ${belowNativeStickyHeaderZIndex};
	}

	/** Corrects position of numbered column when sticky header top mask is present */
	.${ClassName.TABLE_CONTAINER}:has(.${ClassName.TABLE_NODE_WRAPPER_NO_OVERFLOW} ${fg('platform_editor_table_sticky_header_patch_4') ? `tr.${ClassName.NATIVE_STICKY}` : ''})
		> .${ClassName.DRAG_ROW_CONTROLS_WRAPPER}
		> div
		> .${ClassName.NUMBERED_COLUMN} {
		top: ${tableColumnControlsHeight}px;
	}

	/** Expands the mask to encompass the numbered column */
	.pm-table-wrapper:has([data-number-column='true'] tr.${ClassName.NATIVE_STICKY})::before {
		margin-left: -${akEditorTableNumberColumnWidth}px;
		width: calc(100% + ${akEditorTableNumberColumnWidth}px);
	}

	/** Hides the header row drag handle when the position:sticky table header is 'stuck'
	 *
	 * 1. We check that the header is 'stuck'.
	 * - The table container has attribute data-table-header-is-stuck='true' when sticky positioned header is 'stuck'
	 *
	 * 2. We check that the header row drag handle is in the first row or the first row is selected
	 * - The header row drag handle has the data-row-index='0' attribute (i.e. hovered), OR
	 * - The header row drag handle has the data-selected-row-index='0' attribute
	 * 		AND does not have the data-handle-appearance='default' attribute (i.e. selected)
	*/
	.${ClassName.TABLE_CONTAINER}.${ClassName.WITH_CONTROLS}[data-table-header-is-stuck='true']
	.${ClassName.DRAG_ROW_FLOATING_DRAG_HANDLE}:is([data-row-index='0'], [data-selected-row-index='0']:not([data-handle-appearance='default'])) {
		visibility: hidden;
	}

	.${ClassName.WITH_CONTROLS} tr.${ClassName.NATIVE_STICKY} {
		top: ${tableMarginTop}px;
	}

	.${ClassName.WITH_CONTROLS} tr.sticky {
		padding-top: ${tableControlsSpacing}px;
	}

	${fg('platform_editor_nested_tables_sticky_header_bug')
		? `
		.${ClassName.WITH_CONTROLS}.${ClassName.TABLE_STICKY} > .${ClassName.DRAG_ROW_CONTROLS_WRAPPER}
			.${ClassName.NUMBERED_COLUMN}
			.${ClassName.NUMBERED_COLUMN_BUTTON}:first-of-type {
			margin-top: ${fg('platform_editor_number_column_sticky_header_bug')
			? tableControlsSpacing
			: tableControlsSpacing + 2
		}px;
		}
		`
		: `
		.${ClassName.WITH_CONTROLS}.${ClassName.TABLE_STICKY}
			.${ClassName.NUMBERED_COLUMN}
			.${ClassName.NUMBERED_COLUMN_BUTTON}:first-of-type {
			margin-top: ${fg('platform_editor_number_column_sticky_header_bug')
			? tableControlsSpacing
			: tableControlsSpacing + 2
		}px;
		}
		`}

	.${ClassName.CORNER_CONTROLS}.sticky {
		border-top: ${fg('platform_editor_number_column_sticky_header_bug')
		? tableControlsSpacing - tableToolbarSize
		: tableControlsSpacing - tableToolbarSize + 2}px
			solid ${token('elevation.surface', 'white')};
	}

	${sentinelStyles}
	${OverflowShadow(props.featureFlags?.tableDragAndDrop)}
    ${stickyScrollbarStyles}

    .${ClassName.TABLE_STICKY} .${ClassName.TABLE_STICKY_SHADOW} {
		height: 0; /* stop overflow flash & set correct height in update-overflow-shadows.ts */
	}

	.less-padding {
		padding: 0 ${tablePadding}px;

		.${ClassName.DRAG_ROW_CONTROLS_WRAPPER}, .${ClassName.ROW_CONTROLS_WRAPPER} {
			padding: 0 ${tablePadding}px;

			/* https://product-fabric.atlassian.net/browse/ED-16386
			Fixes issue where the extra padding that is added here throws off the position
			of the rows control dot */
			&::after {
				right: 6px !important;
			}
		}

		.${ClassName.DRAG_ROW_CONTROLS_WRAPPER}.${ClassName.TABLE_CHROMELESS} {
			left: -4px;
		}

		.${ClassName.DRAG_COLUMN_CONTROLS_WRAPPER} {
			padding: 0 ${tablePadding}px;
		}

		.${ClassName.DRAG_COLUMN_CONTROLS_WRAPPER}.${ClassName.TABLE_CHROMELESS} {
			left: -8px;
		}

		&.${ClassName.TABLE_CONTAINER}[data-number-column='true'] {
			padding-left: ${akEditorTableNumberColumnWidth + tablePadding - 1}px;
		}
		.${ClassName.TABLE_LEFT_SHADOW}, .${ClassName.TABLE_RIGHT_SHADOW} {
			width: ${tableOverflowShadowWidth}px;
		}

		.${ClassName.TABLE_LEFT_SHADOW} {
			left: 6px;
		}
		.${ClassName.TABLE_LEFT_SHADOW}.${ClassName.TABLE_CHROMELESS} {
			left: 8px;
		}

		.${ClassName.TABLE_RIGHT_SHADOW} {
			left: calc(100% - 6px);
		}
		.${ClassName.TABLE_RIGHT_SHADOW}.${ClassName.TABLE_CHROMELESS} {
			left: calc(100% - 16px);
		}
	}

	> .${ClassName.NODEVIEW_WRAPPER} {
		/**
       * Prevent margins collapsing, aids with placing the gap-cursor correctly
       * @see https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Box_Model/Mastering_margin_collapsing
       *
       * TODO: Enable this, many tests will fail!
       * border-top: 1px solid transparent;
       */
	}

	/* Breakout only works on top level unless wrapped in fragment mark */
	${breakoutWidthStyling()}

	${columnControlsDecoration()};
	${rowControlsWrapperDotStyle()};

	/* Corner controls */
	.${ClassName.CORNER_CONTROLS} {
		width: ${tableToolbarSize + 1}px;
		height: ${cornerControlHeight}px;
		display: none;

		.${ClassName.CORNER_CONTROLS_INSERT_ROW_MARKER} {
			position: relative;

			${InsertMarker(
			`
          left: -11px;
          top: 9px;
        `,
		)};
		}
	}

	.${ClassName.CORNER_CONTROLS}.sticky {
		.${ClassName.CORNER_CONTROLS_INSERT_ROW_MARKER} {
			/* sticky row insert dot overlaps other row insert and messes things up */
			display: none !important;
		}
	}

	.${ClassName.CONTROLS_CORNER_BUTTON} {
		position: absolute;
		top: 0;
		width: ${tableToolbarSize + 1}px;
		height: ${tableToolbarSize + 1}px;
		border: 1px solid ${tableBorderColor};
		border-radius: 0;
		border-top-left-radius: ${tableBorderRadiusSize}px;
		background: ${tableHeaderCellBackgroundColor};
		box-sizing: border-box;
		padding: 0;
		:focus {
			outline: none;
		}
	}
	.active .${ClassName.CONTROLS_CORNER_BUTTON} {
		border-color: ${tableBorderSelectedColor};
		background: ${tableToolbarSelectedColor};
	}

	.${ClassName.TABLE_CONTAINER}[data-number-column='true'] {
		.${ClassName.CORNER_CONTROLS}, .${ClassName.CONTROLS_CORNER_BUTTON} {
			width: ${akEditorTableToolbarSize + akEditorTableNumberColumnWidth + 1}px;
		}
		.${ClassName.ROW_CONTROLS} .${ClassName.CONTROLS_BUTTON} {
			border-right-width: 0;
		}
	}

	:not(.${ClassName.IS_RESIZING}) .${ClassName.CONTROLS_CORNER_BUTTON}:hover {
		border-color: ${tableBorderSelectedColor};
		background: ${tableToolbarSelectedColor};
		cursor: pointer;
	}

	:not(.${ClassName.IS_RESIZING})
		.${ClassName.CONTROLS_CORNER_BUTTON}.${ClassName.HOVERED_CELL_IN_DANGER} {
		border-color: ${tableBorderDeleteColor};
		background: ${tableToolbarDeleteColor};
	}

	/* Row controls */
	.${ClassName.ROW_CONTROLS} {
		width: ${tableToolbarSize}px;
		box-sizing: border-box;
		display: none;
		position: relative;

		${InsertMarker(
			`
        bottom: -1px;
        left: -11px;
      `,
		)};

		.${ClassName.ROW_CONTROLS_INNER} {
			display: flex;
			flex-direction: column;
		}
		.${ClassName.ROW_CONTROLS_BUTTON_WRAP}:last-child > button {
			border-bottom-left-radius: ${tableBorderRadiusSize}px;
		}
		.${ClassName.ROW_CONTROLS_BUTTON_WRAP} {
			position: relative;
			margin-top: -1px;
		}
		.${ClassName.ROW_CONTROLS_BUTTON_WRAP}:hover,
			.${ClassName.ROW_CONTROLS_BUTTON_WRAP}.active,
			.${ClassName.CONTROLS_BUTTON}:hover {
			z-index: ${akEditorUnitZIndex};
		}

		${HeaderButton(
			`
        border-bottom: 1px solid ${tableBorderColor};
        border-right: 0px;
        border-radius: 0;
        height: 100%;
        width: ${tableToolbarSize}px;

        .${ClassName.CONTROLS_BUTTON_OVERLAY} {
          position: absolute;
          width: 30px;
          height: 50%;
          right: 0;
          bottom: 0;
        }
        .${ClassName.CONTROLS_BUTTON_OVERLAY}:first-of-type {
          top: 0;
        }
      `,
		)}
	}

	.${ClassName.DRAG_ROW_CONTROLS} {
		display: grid;
		align-items: center;
		position: absolute;
		z-index: ${rowControlsZIndex + 4};

		.${ClassName.DRAG_ROW_FLOATING_INSERT_DOT_WRAPPER} {
			position: absolute;
			align-self: end;
			height: 100%;
			width: 18px;
		}

		.${ClassName.DRAG_ROW_FLOATING_INSERT_DOT} {
			position: absolute;
			bottom: -3px;
			left: 2px;
			background-color: ${token('color.background.accent.gray.subtler', '#C1C7D0')};
			height: 4px;
			width: 4px;
			border-radius: 50%;
			pointer-events: none;
		}
	}

	.${ClassName.DRAG_COLUMN_CONTROLS} {
		.${ClassName.DRAG_COLUMN_CONTROLS_INNER} {
			height: ${tableColumnControlsHeight}px;
			position: absolute;
			top: ${token('space.negative.150', '-12px')};
			z-index: ${resizeHandlerZIndex};
		}

		.${ClassName.DRAG_COLUMN_FLOATING_INSERT_DOT_WRAPPER} {
			position: absolute;
			height: ${tableColumnControlsHeight}px;
			width: 100%;
		}

		.${ClassName.DRAG_COLUMN_FLOATING_INSERT_DOT} {
			background-color: ${token('color.background.accent.gray.subtler', '#C1C7D0')};
			height: 4px;
			width: 4px;
			border-radius: 50%;
			position: absolute;
			right: -2px;
		}
	}

	.${ClassName.DRAG_HANDLE_BUTTON_CLICKABLE_ZONE} {
		background: none;
		border: none;
		outline: none;
		position: absolute;
		margin: 0;
		padding: 0;
		display: flex;
		align-items: center;
		cursor: pointer;

		:focus {
			outline: none;
		}
	}

	.${ClassName.DRAG_HANDLE_BUTTON_CONTAINER} {
		cursor: grab;
		pointer-events: auto;

		line-height: 0;
		padding: 0;
		border-radius: 6px;
		width: max-content;
		border: 2px solid ${token('elevation.surface', N0)};

		display: flex;
		justify-content: center;
		align-items: center;
		background: transparent;
		outline: none;

		&.placeholder {
			background-color: transparent;
			border: 2px solid transparent;
		}

		&.${ClassName.DRAG_HANDLE_DISABLED} {
			cursor: pointer;
			& svg {
				& > rect.${ClassName.DRAG_HANDLE_MINIMISED} {
					fill: ${token('color.background.accent.gray.subtler', '#DCDFE4')};
				}
				& > rect {
					fill: ${token('color.background.accent.gray.subtlest', '#F4F5F7')};
				}
				& > g > rect {
					fill: ${token('color.icon.disabled', '#BFDBF847')};
				}
			}
		}

		&:not(.${ClassName.DRAG_HANDLE_DISABLED}) {
			& svg {
				rect {
					fill: ${token('color.background.accent.gray.subtler', '#DCDFE4')};
				}
				g {
					fill: ${token('color.icon.subtle', '#626f86')};
				}
			}

			&:hover {
				svg {
					rect {
						fill: ${token('color.background.accent.blue.subtle', '#579DFF')};
					}
					g {
						fill: ${token('color.icon.inverse', '#FFF')};
					}
				}
			}

			&:active {
				cursor: grabbing;
			}

			&.selected {
				:focus {
					outline: 2px solid ${token('color.border.focused', '#2684FF')};
					outline-offset: 1px;
				}

				&:active {
					outline: none;
				}

				svg {
					rect {
						fill: ${token('color.background.accent.blue.subtle', '#579dff')};
					}
					g {
						fill: ${token('color.icon.inverse', '#fff')};
					}
				}
			}

			&.danger {
				svg {
					rect {
						fill: ${token('color.background.accent.red.subtler.pressed', '#F87462')};
					}
					g {
						fill: ${token('color.border.inverse', '#FFF')};
					}
				}
			}
		}
	}

	${floatingColumnControls()}

	:not(.${ClassName.IS_RESIZING}) .${ClassName.ROW_CONTROLS} {
		${HeaderButtonHover()}
		${HeaderButtonDanger()}
	}

	/* Numbered column */
	.${ClassName.NUMBERED_COLUMN} {
		position: relative;
		float: right;
		margin-left: ${akEditorTableToolbarSize}px;
		top: ${props.isDragAndDropEnabled || editorExperiment('support_table_in_comment_jira', true)
		? 0
		: akEditorTableToolbarSize}px;
		width: ${akEditorTableNumberColumnWidth + 1}px;
		box-sizing: border-box;
	}

	.${ClassName.NUMBERED_COLUMN_BUTTON} {
		border: 1px solid ${tableBorderColor};
		box-sizing: border-box;
		margin-top: -1px;
		padding-bottom: 2px;
		padding: ${expValEquals('confluence_compact_text_format', 'isEnabled', true) ||
		(expValEquals('cc_editor_ai_content_mode', 'variant', 'test') &&
			fg('platform_editor_content_mode_button_mvp'))
		? relativeSizeToBaseFontSize(10)
		: `10px`}
			2px;
		text-align: center;
		font-size: ${expValEquals('confluence_compact_text_format', 'isEnabled', true) ||
		(expValEquals('cc_editor_ai_content_mode', 'variant', 'test') &&
			fg('platform_editor_content_mode_button_mvp'))
		? relativeSizeToBaseFontSize(14)
		: relativeFontSizeToBase16(14)};
		background-color: ${tableHeaderCellBackgroundColor};
		color: ${tableTextColor};
		border-color: ${tableBorderColor};

		:first-child:not(style),
		style:first-child + * {
			margin-top: 0;
		}
		:last-child {
			border-bottom: 1px solid ${tableBorderColor};
		}
	}

	/* add a background above the first numbered column cell when sticky header is engaged
	which hides the table when scrolling */
	${fg('platform_editor_nested_tables_sticky_header_bug')
		? `
		.${ClassName.TABLE_STICKY} > .${props.isDragAndDropEnabled ? ClassName.DRAG_ROW_CONTROLS_WRAPPER : ClassName.ROW_CONTROLS_WRAPPER} {
				.${ClassName.NUMBERED_COLUMN_BUTTON_DISABLED}:first-of-type::after {
				content: '';
				display: block;
				height: 33px;
				width: 100%;
				background-color: ${token('elevation.surface', 'white')};
				position: absolute;

				/* the extra pixel is accounting for borders */
				top: -34px;
				left: -1px;
			}
		}
		`
		: `
		.${ClassName.TABLE_STICKY} {
			.${ClassName.NUMBERED_COLUMN_BUTTON_DISABLED}:first-of-type::after {
				content: '';
				display: block;
				height: 33px;
				width: 100%;
				background-color: ${token('elevation.surface', 'white')};
				position: absolute;

				/* the extra pixel is accounting for borders */
				top: -34px;
				left: -1px;
			}
		}
		`}

	.${ClassName.WITH_CONTROLS} {
		.${ClassName.CORNER_CONTROLS}, .${ClassName.ROW_CONTROLS} {
			display: block;
		}
		.${ClassName.NUMBERED_COLUMN} {
			padding-left: 0px;

			.${ClassName.NUMBERED_COLUMN_BUTTON} {
				border-left: 0 none;
			}

			.${ClassName.NUMBERED_COLUMN_BUTTON}.active {
				border-bottom: 1px solid ${tableBorderSelectedColor};
				border-color: ${tableBorderSelectedColor};
				background-color: ${tableToolbarSelectedColor};
				position: relative;
				z-index: ${akEditorUnitZIndex};
				color: ${token('color.text.selected', N0)};
			}
		}

		/* nested tables should be ignored when we apply border-left: 0 to the parent table */
		.${ClassName.TABLE_CONTAINER} {
			.${ClassName.NUMBERED_COLUMN_BUTTON} {
				border-left: 1px solid ${tableBorderColor};
			}
		}
	}
	:not(.${ClassName.IS_RESIZING}) .${ClassName.WITH_CONTROLS} {
		.${ClassName.NUMBERED_COLUMN_BUTTON}:not(.${ClassName.NUMBERED_COLUMN_BUTTON_DISABLED}) {
			cursor: pointer;
		}
		.${ClassName.NUMBERED_COLUMN_BUTTON}:not(.${ClassName.NUMBERED_COLUMN_BUTTON_DISABLED}):hover {
			border-bottom: 1px solid ${tableBorderSelectedColor};
			border-color: ${tableBorderSelectedColor};
			background-color: ${tableToolbarSelectedColor};
			position: relative;
			z-index: ${akEditorUnitZIndex};
			color: ${token('color.text.selected', N0)};
		}
		.${ClassName.NUMBERED_COLUMN_BUTTON}.${ClassName.HOVERED_CELL_IN_DANGER} {
			background-color: ${tableToolbarDeleteColor};
			border: 1px solid ${tableBorderDeleteColor};
			border-left: 0;
			color: ${token('color.text.danger', R500)};
			position: relative;
			z-index: ${akEditorUnitZIndex};
		}
	}

	${expValEqualsNoExposure('platform_editor_block_menu', 'isEnabled', true)
		? `.tableView-content-wrap.danger {
		:not(.${ClassName.IS_RESIZING}) .${ClassName.WITH_CONTROLS} {
			.${ClassName.NUMBERED_COLUMN_BUTTON} {
				background-color: ${tableToolbarDeleteColor};
				border: 1px solid ${tableBorderDeleteColor};
				border-left: 0;
				color: ${token('color.text.danger', R500)};
				position: relative;
				z-index: ${akEditorUnitZIndex};
			}
		}
	}`
		: ''}

	/* Table */
	.${ClassName.TABLE_NODE_WRAPPER} > table {
		table-layout: fixed;
		white-space: normal;
		border-top: none;
		/* 1px border width offset added here to prevent unwanted overflow and scolling - ED-16212 */
		margin-right: -1px;
		/* Allows better positioning for the shadow sentinels - ED-16668 */
		position: relative;

		> tbody > tr {
			white-space: pre-wrap;
		}

		.${ClassName.COLUMN_CONTROLS_DECORATIONS} + * {
			margin-top: 0;
		}

		/*
       * Headings have a top margin by default, but we don't want this on the
       * first heading within table header cells.
       *
       * This specifically sets margin-top for the first heading within a header
       * cell when center/right aligned.
       */
		th.${ClassName.TABLE_HEADER_CELL} > .fabric-editor-block-mark {
			> h1:first-of-type,
			> h2:first-of-type,
			> h3:first-of-type,
			> h4:first-of-type,
			> h5:first-of-type,
			> h6:first-of-type {
				margin-top: 0;
			}
		}

		.${ClassName.SELECTED_CELL}, .${ClassName.HOVERED_CELL_IN_DANGER} {
			position: relative;
		}
		/* Give selected cells a blue overlay */
		.${ClassName.SELECTED_CELL}::after, .${ClassName.HOVERED_CELL_IN_DANGER}::after {
			z-index: ${akEditorSmallZIndex};
			position: absolute;
			content: '';
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			width: 100%;
			pointer-events: none;
		}
		.${ClassName.SELECTED_CELL} {
			border: 1px solid ${tableBorderSelectedColor};
		}
		.${ClassName.SELECTED_CELL}::after {
			background: ${tableCellSelectedColor};
			z-index: ${akEditorSmallZIndex};
		}
		th.${ClassName.HOVERED_CELL_IN_DANGER}::after, td.${ClassName.HOVERED_CELL_IN_DANGER}::after {
			background: ${tableCellDeleteColor};
			z-index: ${akEditorUnitZIndex * 100};
		}
		td.${ClassName.HOVERED_CELL},
			td.${ClassName.SELECTED_CELL},
			th.${ClassName.TABLE_HEADER_CELL}.${ClassName.SELECTED_CELL},
			th.${ClassName.TABLE_HEADER_CELL}.${ClassName.HOVERED_CELL} {
			&::after {
				height: 100%;
				width: 100%;
				border: 1px solid ${tableBorderSelectedColor};
				content: '';
				position: absolute;
				left: -1px;
				top: -1px;
				bottom: 0;
				z-index: ${akEditorSmallZIndex};
				display: inline-block;
				pointer-events: none;
			}
			&.${ClassName.HOVERED_CELL_IN_DANGER}::after {
				${tableBorderStyles()};
				z-index: ${akEditorUnitZIndex * 100};
			}

			&.${ClassName.HOVERED_NO_HIGHLIGHT}.${ClassName.HOVERED_CELL_IN_DANGER}::after {
				${tableBorderStyles()};
				z-index: ${akEditorUnitZIndex * 100};
			}
		}
	}

	/* override for DnD controls */
	.${ClassName.DRAG_ROW_CONTROLS_WRAPPER} {
		position: absolute;
		margin-top: ${tableMarginTop}px;
		left: -${tableToolbarSize + 1}px;
	}

	.${ClassName.ROW_CONTROLS_WRAPPER} {
		position: absolute;
		/* this is to fix the misalignment of the numbered column in live page view mode */
		${props.isDragAndDropEnabled
		? `
			margin-top: ${tableMarginTop}px;
			top: 0;
			left: -${tableToolbarSize + 1}px;
		`
		: `
			/* top of corner control is table margin top - corner control height + 1 pixel of table border. */
			top: ${tableMarginTop - cornerControlHeight + 1}px;
			margin-top: 0;
			left: -${tableToolbarSize}px;
		`}
	}

	.${ClassName.DRAG_ROW_CONTROLS_WRAPPER}.${ClassName.TABLE_LEFT_SHADOW},
		.${ClassName.ROW_CONTROLS_WRAPPER}.${ClassName.TABLE_LEFT_SHADOW} {
		z-index: ${akEditorUnitZIndex};
	}

	.${ClassName.DRAG_COLUMN_CONTROLS_WRAPPER} {
		position: absolute;
		top: ${tableMarginTop}px;
	}

	${fg('platform_editor_table_sticky_header_patch_1')
		? `
	.${ClassName.TABLE_NODE_WRAPPER_NO_OVERFLOW} > .${ClassName.DRAG_COLUMN_CONTROLS_WRAPPER} {
		/* +2px is to overlap the table border on the sides */
		width: calc(anchor-size(width) + 2px);
		height: ${tableMarginTop}px;
		background: ${token('elevation.surface')};
		top: unset;
		position: fixed;
		position-area: top center;
		position-visibility: anchors-visible;
		z-index: ${nativeStickyHeaderZIndex + 1};
	}`
		: `.${ClassName.TABLE_NODE_WRAPPER_NO_OVERFLOW} > .${ClassName.DRAG_COLUMN_CONTROLS_WRAPPER} {
		/* +2px is to overlap the table border on the sides */
		width: calc(anchor-size(width) + 2px);
		height: ${tableMarginTop}px;
		background: ${token('elevation.surface')};
		position: fixed;
		position-area: top center;
		position-visibility: anchors-visible;
		z-index: ${nativeStickyHeaderZIndex + 1};
	}`}

	/** Mask for content to the left of the column controls */

	.${ClassName.TABLE_CONTAINER}[data-number-column="true"] .${ClassName.TABLE_NODE_WRAPPER_NO_OVERFLOW} > .${ClassName.DRAG_COLUMN_CONTROLS_WRAPPER}::before {
		content: '';
		position: relative;
		display: inline-block;
		margin-left: -${akEditorTableNumberColumnWidth + dragRowControlsWidth}px;
		width: ${akEditorTableNumberColumnWidth + dragRowControlsWidth}px;
		height: ${tableMarginTop}px;
		background: ${token('elevation.surface')};
		z-index: ${nativeStickyHeaderZIndex - 1};
	}

	/** Mask for numbered column content to the left of the header row */
	.${ClassName.TABLE_CONTAINER}[data-number-column="true"] .${ClassName.TABLE_NODE_WRAPPER_NO_OVERFLOW} tr:first-of-type th:first-of-type::before {
		content: '';
		position: absolute;
		display: inline-block;
		box-sizing: border-box;
		left: 0;
		width: ${akEditorTableNumberColumnWidth - 1}px;
		height: 100%;
		margin-left: -${akEditorTableNumberColumnWidth}px;
		margin-top: -${stickyRowOffsetTop}px;
		outline: 1px solid ${tableBorderColor};
		border-left: 1px solid ${tableBorderColor};
		background: ${token('color.background.accent.gray.subtlest')};
		${fg('platform_editor_table_sticky_header_patch_1')
		? `border-top: 1px solid ${tableBorderColor};`
		: ``}
	}

	${fg('platform_editor_table_sticky_header_patch_7') ?
		`.ak-editor-selected-node .${ClassName.TABLE_CONTAINER}[data-number-column="true"]:not(.${ClassName.TABLE_SELECTED}) .${ClassName.TABLE_NODE_WRAPPER_NO_OVERFLOW} tr:first-of-type th:first-of-type {
			&::before {
				margin-top: 0;
			}
			&::after {
				width: 100%;
				border-left: 1px solid ${tableBorderSelectedColor};
				background: ${tableCellSelectedColor};
			}
	}` : ''}

	.${ClassName.TABLE_CONTAINER}[data-number-column="true"].${ClassName.TABLE_SELECTED} .${ClassName.TABLE_NODE_WRAPPER_NO_OVERFLOW} tr:first-of-type th.${ClassName.SELECTED_CELL}:not(.${ClassName.HOVERED_CELL_IN_DANGER}):first-of-type::before, .${ClassName.TABLE_CONTAINER}[data-number-column="true"] .${ClassName.TABLE_NODE_WRAPPER_NO_OVERFLOW} tr:first-of-type th.${ClassName.SELECTED_CELL}:not(.${ClassName.HOVERED_CELL_IN_DANGER}, .${ClassName.COLUMN_SELECTED}):first-of-type::before {
		outline: none;
		border-left-color: ${tableBorderSelectedColor};
		${fg('platform_editor_table_sticky_header_patch_1')
		? `border-top-color: ${tableBorderSelectedColor};`
		: ``}
		background: ${tableHeaderCellSelectedColor};
	}

	${fg('platform_editor_table_sticky_header_patch_1')
		? `.${ClassName.TABLE_CONTAINER}[data-number-column="true"] .${ClassName.TABLE_NODE_WRAPPER_NO_OVERFLOW} tr:first-of-type th.${ClassName.HOVERED_CELL_IN_DANGER}:first-of-type::before, .${ClassName.TABLE_CONTAINER}[data-number-column="true"] .${ClassName.TABLE_NODE_WRAPPER_NO_OVERFLOW} tr:first-of-type th.${ClassName.HOVERED_CELL_IN_DANGER}:not(.${ClassName.COLUMN_SELECTED}):first-of-type::before {
			outline: none;
			border-left: unset;
			border-top: unset;
			background: ${tableCellDeleteColor};
		}
		.${ClassName.TABLE_CONTAINER}[data-number-column="true"].${ClassName.TABLE_SELECTED}.${ClassName.HOVERED_DELETE_BUTTON} .${ClassName.TABLE_NODE_WRAPPER_NO_OVERFLOW} tr:first-of-type th:first-of-type::before, .${ClassName.TABLE_CONTAINER}[data-number-column="true"].${ClassName.HOVERED_DELETE_BUTTON} .${ClassName.TABLE_NODE_WRAPPER_NO_OVERFLOW} tr:first-of-type th.${ClassName.SELECTED_CELL}:not(.${ClassName.COLUMN_SELECTED}):first-of-type::before {
		outline: none;
		border-left-color: ${tableBorderDeleteColor};
		border-top-color: ${tableBorderDeleteColor};
		background: ${tableCellDeleteColor};
		}`
		: `	.${ClassName.TABLE_CONTAINER}[data-number-column="true"] .${ClassName.TABLE_NODE_WRAPPER_NO_OVERFLOW} tr:first-of-type th.${ClassName.HOVERED_CELL_IN_DANGER}:not(.${ClassName.COLUMN_SELECTED}):first-of-type::before {
				outline: none;
				background: ${tableCellDeleteColor};
			}
			.${ClassName.TABLE_CONTAINER}[data-number-column="true"].${ClassName.HOVERED_DELETE_BUTTON} .${ClassName.TABLE_NODE_WRAPPER_NO_OVERFLOW} tr:first-of-type th.${ClassName.SELECTED_CELL}:not(.${ClassName.COLUMN_SELECTED}):first-of-type::before {
				outline: none;
				border-left-color: ${tableBorderDeleteColor};
				background: ${tableCellDeleteColor};
		}`}

	.${ClassName.TABLE_CONTAINER}[data-number-column="true"] .${ClassName.TABLE_NODE_WRAPPER_NO_OVERFLOW} .${ClassName.NATIVE_STICKY_ACTIVE} th:first-of-type::before {
		box-shadow: 0 6px 4px -4px ${token('elevation.shadow.overflow.perimeter')};
	}

	.${ClassName.TABLE_NODE_WRAPPER_NO_OVERFLOW}
		.${ClassName.DRAG_COLUMN_CONTROLS_INNER}:not(.${ClassName.NESTED_TABLE_WITH_CONTROLS} *) {
		/* !important to override the inline style in the inner controls component */
		margin-top: ${tableMarginTop}px !important;
	}

	.${ClassName.TABLE_STICKY} .${ClassName.DRAG_COLUMN_CONTROLS_WRAPPER} {
		position: fixed;
		/* higher zIndex than sticky header which is akEditorTableCellOnStickyHeaderZIndex - 5 */
		z-index: ${akEditorTableCellOnStickyHeaderZIndex - 4};
	}

	${expValEquals('platform_editor_table_sticky_header_improvements', 'cohort', 'test_with_overflow') && fg('platform_editor_table_sticky_header_patch_6') ?
		`.${ClassName.TABLE_CONTAINER}.${ClassName.WITH_CONTROLS}:has(tr.sticky) .${ClassName.NUMBERED_COLUMN} .${ClassName.NUMBERED_COLUMN_BUTTON}:first-of-type {
			box-shadow: 0 -5px 0 1px ${tableBorderColor};
		}` : ``
	}

	/* nested tables */
	.${ClassName.TABLE_CONTAINER} {
		.${ClassName.TABLE_STICKY} .${ClassName.DRAG_COLUMN_CONTROLS_WRAPPER} {
			position: absolute;
			z-index: ${akEditorUnitZIndex};
		}
	}

	.${ClassName.TABLE_NODE_WRAPPER} {
		padding-bottom: 0px;
		/* fixes gap cursor height */
		overflow: auto;
		overflow-y: hidden;
		position: relative;
	}

	.${ClassName.TABLE_NODE_WRAPPER}.${ClassName.TABLE_NODE_WRAPPER_NO_OVERFLOW} {
		overflow: visible;
	}
`;

// re-exporting these styles to use in Gemini test when table node view is rendered outside of PM
export const baseTableStyles = (props: {
	featureFlags?: FeatureFlags;
	isDragAndDropEnabled?: boolean;
}) => css`
	${tableSharedStyle()};
	${baseTableStylesWithoutSharedStyle(props)};
`;

// TODO: DSP-4139 - Remove this when we have a better solution for the table toolbar
export const tableStyles = (props: {
	featureFlags?: FeatureFlags;
	isDragAndDropEnabled?: boolean;
}) => css`
	.ProseMirror {
		${expValEquals('platform_editor_ssr_renderer', 'isEnabled', true)
		? baseTableStylesWithoutSharedStyle(props)
		: baseTableStyles(props)};
	}

	.ProseMirror.${ClassName.IS_RESIZING} {
		.${ClassName.TABLE_NODE_WRAPPER} {
			overflow-x: auto;
			${scrollbarStyles};
		}
	}

	.ProseMirror.${ClassName.RESIZE_CURSOR} {
		cursor: col-resize;
	}

	${shadowSentinelStyles}
`;

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const tableFullPageEditorStyles = css`
	.ProseMirror .${ClassName.TABLE_NODE_WRAPPER} > table {
		margin-left: 0;
		/* 1px border width offset added here to prevent unwanted overflow and scolling - ED-16212 */
		margin-right: -1px;
		width: 100%;
	}
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const tableCommentEditorStyles = css`
	.ProseMirror .${ClassName.TABLE_NODE_WRAPPER} > table {
		margin-left: 0;
		margin-right: 0;
		${scrollbarStyles};
	}
`;

const tableAnchorStyles = css`
	.pm-table-with-controls .pm-table-wrapper-no-overflow [data-prosemirror-node-name='tableHeader'] {
		anchor-name: var(${ANCHOR_VARIABLE_NAME}, attr(data-node-anchor type(<custom-ident>)));
	}

	.pm-table-with-controls .pm-table-wrapper-no-overflow [data-prosemirror-node-name='tableRow'] {
		anchor-name: var(${ANCHOR_VARIABLE_NAME}, attr(data-node-anchor type(<custom-ident>)));
	}
`;
