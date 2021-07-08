import { css } from 'styled-components';

import { tableMarginTop, tableSharedStyle } from '@atlaskit/editor-common';
import { fontSize } from '@atlaskit/theme/constants';
import { N40A, B300, N300, N20A, N0, R500 } from '@atlaskit/theme/colors';
import {
  SelectionStyle,
  getSelectionStyles,
  akEditorSmallZIndex,
  akEditorTableNumberColumnWidth,
  akEditorStickyHeaderZIndex,
  akEditorTableToolbarSize,
  akEditorUnitZIndex,
  akEditorSelectedNodeClassName,
  relativeFontSizeToBase16,
} from '@atlaskit/editor-shared-styles';

import { scrollbarStyles } from '../../../ui/styles';
import { TableCssClassName as ClassName } from '../types';

import {
  tableCellBackgroundColor,
  tableToolbarColor,
  tableBorderColor,
  tableCellSelectedColor,
  tableToolbarSelectedColor,
  tableBorderSelectedColor,
  tableCellDeleteColor,
  tableBorderDeleteColor,
  tableToolbarDeleteColor,
  tableBorderRadiusSize,
  tablePadding,
  tableScrollbarOffset,
  resizeHandlerAreaWidth,
  resizeLineWidth,
  tableToolbarSize,
  tableInsertColumnButtonSize,
  tableControlsSpacing,
  tableTextColor,
  stickyRowZIndex,
  columnControlsDecorationHeight,
  stickyRowOffsetTop,
  stickyHeaderBorderBottomWidth,
} from './consts';

import {
  HeaderButton,
  HeaderButtonHover,
  HeaderButtonDanger,
  insertColumnButtonWrapper,
  insertRowButtonWrapper,
  columnControlsLineMarker,
  DeleteButton,
  OverflowShadow,
  columnControlsDecoration,
  hoveredDeleteButton,
  hoveredCell,
  hoveredWarningCell,
  resizeHandle,
  InsertMarker,
} from './ui-styles.css';

const rangeSelectionStyles = `
.${ClassName.NODEVIEW_WRAPPER}.${akEditorSelectedNodeClassName} table tbody tr {
  th,td {
    ${getSelectionStyles([SelectionStyle.Blanket, SelectionStyle.Border])}
  }
}
`;

const sentinelStyles = `.${ClassName.TABLE_CONTAINER} {
  > .${ClassName.TABLE_STICKY_SENTINEL_TOP}, > .${
  ClassName.TABLE_STICKY_SENTINEL_BOTTOM
} {
    position: absolute;
    width: 100%;
    height: 0px;
  }
  > .${ClassName.TABLE_STICKY_SENTINEL_TOP} {
    top: ${columnControlsDecorationHeight}px;
  }
  > .${ClassName.TABLE_STICKY_SENTINEL_BOTTOM} {
      bottom: ${
        tableScrollbarOffset + stickyRowOffsetTop + tablePadding * 2 + 23
      }px;
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

export const tableStyles = css`
  .${ClassName.LAYOUT_BUTTON} button {
    background: ${N20A};
    color: ${N300};
    cursor: none;
  }

  .${ClassName.LAYOUT_BUTTON}:not(.${ClassName.IS_RESIZING}) button:hover {
    background: ${B300};
    color: white !important;
    cursor: pointer;
  }

  .ProseMirror {
    ${tableSharedStyle};
    ${columnControlsLineMarker};
    ${hoveredDeleteButton};
    ${hoveredCell};
    ${hoveredWarningCell};
    ${resizeHandle};
    ${rangeSelectionStyles};

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
      }
    }

    .${ClassName.CONTROLS_FLOATING_BUTTON_COLUMN} {
      ${insertColumnButtonWrapper}
    }

    .${ClassName.CONTROLS_FLOATING_BUTTON_ROW} {
      ${insertRowButtonWrapper}
    }

    /* Delete button*/
    ${DeleteButton}
    /* Ends Delete button*/

    /* sticky styles */
    .${ClassName.TABLE_STICKY} .${ClassName.NUMBERED_COLUMN} .${ClassName.NUMBERED_COLUMN_BUTTON}:first-child {
      margin-top: ${stickyRowOffsetTop + 2}px;
      width: ${akEditorTableNumberColumnWidth}px;

      position: fixed !important;
      z-index: ${akEditorStickyHeaderZIndex} !important;

      box-shadow: 0px -${stickyRowOffsetTop}px white;
      border-right: 0 none;
      /* top set by NumberColumn component */
    }

    .${ClassName.TABLE_STICKY} .${ClassName.CORNER_CONTROLS}.sticky {
      position: fixed !important;
      /* needs to be above row controls */
      z-index: ${akEditorSmallZIndex} !important;
      background: white;

      width: ${tableToolbarSize}px;
      height: ${tableToolbarSize}px;
    }

    .${ClassName.CORNER_CONTROLS}.sticky .${ClassName.CONTROLS_CORNER_BUTTON} {
      border-bottom: 0px none;
      border-right: 0px none;

      height: ${tableToolbarSize}px;
      width: ${tableToolbarSize}px;
    }

    .${ClassName.TABLE_STICKY} .${ClassName.COLUMN_CONTROLS_DECORATIONS} {
      z-index: 0;
    }

    .${ClassName.TABLE_STICKY}
      .${ClassName.ROW_CONTROLS}
      .${ClassName.ROW_CONTROLS_BUTTON_WRAP}.sticky {
      position: fixed !important;
      z-index: ${akEditorStickyHeaderZIndex} !important;
      display: flex;
      border-left: ${tableToolbarSize}px solid white;
      margin-left: -${tableToolbarSize}px;
    }

    .${ClassName.TABLE_STICKY} col:first-of-type {
      /* moving rows out of a table layout does weird things in Chrome */
      border-right: 1px solid green;
    }

    tr.sticky {
      padding-top: ${stickyRowOffsetTop}px;
      position: fixed;
      display: grid;

      /* to keep it above cell selection */
      z-index: ${stickyRowZIndex};

      overflow-y: visible;
      overflow-x: hidden;

      grid-auto-flow: column;

      /* background for where controls apply */
      background: white;
      box-sizing: content-box;

      margin-top: 2px;

      box-shadow: 0 6px 4px -4px ${N40A};
      margin-left: -1px;
    }

    .${ClassName.TABLE_STICKY} .${ClassName.TABLE_STICKY_SHADOW} {
      left: unset;
      position: fixed;
      z-index: ${stickyRowZIndex + 1};
    }

    .${ClassName.WITH_CONTROLS}.${ClassName.TABLE_STICKY}
      .${ClassName.TABLE_STICKY_SHADOW} {
      padding-bottom: ${tableToolbarSize}px;
    }

    tr.sticky th {
      border-bottom: ${stickyHeaderBorderBottomWidth}px solid
        ${tableBorderColor};
      margin-right: -1px;
    }

    .${ClassName.TABLE_STICKY} tr.sticky > th:last-child {
      border-right-width: 1px;
    }

    /* add left edge for first cell */
    .${ClassName.TABLE_STICKY} tr.sticky > th:first-child {
      margin-left: 0px;
    }

    /* add a little bit so the scroll lines up with the table */
    .${ClassName.TABLE_STICKY} tr.sticky::after {
      content: ' ';
      width: 1px;
    }

    /* To fix jumpiness caused in Chrome Browsers for sticky headers */
    .${ClassName.TABLE_STICKY} .sticky + tr {
      min-height: 0px;
    }

    /* move resize line a little in sticky bar */
    .${ClassName.TABLE_CONTAINER}.${ClassName.TABLE_STICKY} {
      tr.sticky
        td.${ClassName.WITH_RESIZE_LINE},
        tr.sticky
        th.${ClassName.WITH_RESIZE_LINE} {
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

    tr.sticky
      .${ClassName.HOVERED_CELL},
      tr.sticky
      .${ClassName.SELECTED_CELL} {
      z-index: 1;
    }

    .${ClassName.WITH_CONTROLS} tr.sticky {
      padding-top: ${tableControlsSpacing}px;
    }

    .${ClassName.WITH_CONTROLS}.${ClassName.TABLE_STICKY}
      .${ClassName.NUMBERED_COLUMN}
      .${ClassName.NUMBERED_COLUMN_BUTTON}:first-child {
      margin-top: ${tableControlsSpacing + 2}px;
    }

    .${ClassName.CORNER_CONTROLS}.sticky {
      border-top: ${tableControlsSpacing - tableToolbarSize + 2}px solid white;
    }

    ${(props) =>
      props.featureFlags?.stickyHeadersOptimization ? sentinelStyles : ''}

    ${OverflowShadow}
    .${ClassName.TABLE_STICKY} .${ClassName.TABLE_STICKY_SHADOW} {
      height: 0; // stop overflow flash & set correct height in update-overflow-shadows.ts
    }
    .less-padding {
      padding: 0 ${tablePadding}px;

      .${ClassName.ROW_CONTROLS_WRAPPER} {
        padding: 0 ${tablePadding}px;
      }

      &.${ClassName.TABLE_CONTAINER}[data-number-column='true'] {
        padding-left: ${akEditorTableNumberColumnWidth + tablePadding - 1}px;
      }

      .${ClassName.TABLE_LEFT_SHADOW} {
        left: 6px;
      }

      .${ClassName.TABLE_RIGHT_SHADOW} {
        left: calc(100% - 6px);
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

    /* Breakout only works on top level */
    > * .${ClassName.NODEVIEW_WRAPPER} .${ClassName.TABLE_CONTAINER} {
      margin-left: unset !important;
      width: 100% !important;
    }

    ${columnControlsDecoration};

    /* Corner controls */
    .${ClassName.CORNER_CONTROLS} {
      width: ${tableToolbarSize + 1}px;
      height: ${tableToolbarSize + 1}px;
      display: none;

      .${ClassName.CORNER_CONTROLS_INSERT_ROW_MARKER} {
        position: relative;

        ${InsertMarker(`
          left: -11px;
          top: 9px;
        `)};
      }

      .${ClassName.CORNER_CONTROLS_INSERT_COLUMN_MARKER} {
        position: relative;

        ${InsertMarker(`
          right: -1px;
          top: -12px;
        `)};
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
      background: ${tableToolbarColor};
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
        width: ${akEditorTableToolbarSize + akEditorTableNumberColumnWidth}px;
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

      ${InsertMarker(`
        bottom: -1px;
        left: -11px;
      `)};

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

      ${HeaderButton(`
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
        .${ClassName.CONTROLS_BUTTON_OVERLAY}:first-child {
          top: 0;
        }
      `)}
    }
    :not(.${ClassName.IS_RESIZING}) .${ClassName.ROW_CONTROLS} {
      ${HeaderButtonHover()}
      ${HeaderButtonDanger()}
    }

    /* Numbered column */
    .${ClassName.NUMBERED_COLUMN} {
      position: relative;
      float: right;
      margin-left: ${akEditorTableToolbarSize - 1}px;
      top: ${akEditorTableToolbarSize}px;
      width: ${akEditorTableNumberColumnWidth + 1}px;
      box-sizing: border-box;
    }
    .${ClassName.NUMBERED_COLUMN_BUTTON} {
      border: 1px solid ${tableBorderColor};
      box-sizing: border-box;
      margin-top: -1px;
      padding-bottom: 2px;
      padding: 10px 2px;
      text-align: center;
      font-size: ${relativeFontSizeToBase16(fontSize())};
      background-color: ${tableToolbarColor};
      color: ${tableTextColor};
      border-color: ${tableBorderColor};

      :first-child {
        margin-top: 0;
      }
      :last-child {
        border-bottom: 1px solid ${tableBorderColor};
      }
    }
    .${ClassName.WITH_CONTROLS} {
      .${ClassName.CORNER_CONTROLS}, .${ClassName.ROW_CONTROLS} {
        display: block;
      }
      .${ClassName.NUMBERED_COLUMN} {
        padding-left: 1px;
        .${ClassName.NUMBERED_COLUMN_BUTTON} {
          border-left: 0 none;
        }

        .${ClassName.NUMBERED_COLUMN_BUTTON}.active {
          border-bottom: 1px solid ${tableBorderSelectedColor};
          border-color: ${tableBorderSelectedColor};
          background-color: ${tableToolbarSelectedColor};
          position: relative;
          z-index: ${akEditorUnitZIndex};
          color: ${N0};
        }
      }
    }
    :not(.${ClassName.IS_RESIZING}) .${ClassName.WITH_CONTROLS} {
      .${ClassName.NUMBERED_COLUMN_BUTTON} {
        cursor: pointer;
      }
      .${ClassName.NUMBERED_COLUMN_BUTTON}:hover {
        border-bottom: 1px solid ${tableBorderSelectedColor};
        border-color: ${tableBorderSelectedColor};
        background-color: ${tableToolbarSelectedColor};
        position: relative;
        z-index: ${akEditorUnitZIndex};
        color: ${N0};
      }
      .${ClassName.NUMBERED_COLUMN_BUTTON}.${ClassName.HOVERED_CELL_IN_DANGER} {
        background-color: ${tableToolbarDeleteColor};
        border: 1px solid ${tableBorderDeleteColor};
        border-left: 0;
        color: ${R500};
        position: relative;
        z-index: ${akEditorUnitZIndex};
      }
    }

    /* Table */
    .${ClassName.TABLE_NODE_WRAPPER} > table {
      table-layout: fixed;

      .${ClassName.COLUMN_CONTROLS_DECORATIONS} + * {
        margin-top: 0;
      }

      .${ClassName.SELECTED_CELL}, .${ClassName.HOVERED_CELL_IN_DANGER} {
        position: relative;
      }
      /* Give selected cells a blue overlay */
      .${ClassName.SELECTED_CELL}::after,
        .${ClassName.HOVERED_CELL_IN_DANGER}::after {
        z-index: ${akEditorSmallZIndex};
        position: absolute;
        content: '';
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        opacity: 0.3;
        pointer-events: none;
      }
      .${ClassName.SELECTED_CELL} {
        border: 1px solid ${tableBorderSelectedColor};
      }
      .${ClassName.SELECTED_CELL}::after {
        background: ${tableCellSelectedColor};
      }
      th.${ClassName.HOVERED_CELL_IN_DANGER}::after,
        td.${ClassName.HOVERED_CELL_IN_DANGER}::after {
        background: ${tableCellDeleteColor};
      }
    }
    .${ClassName.ROW_CONTROLS_WRAPPER} {
      position: absolute;
      top: ${tableMarginTop - 1}px;
    }
    .${ClassName.ROW_CONTROLS_WRAPPER}.${ClassName.TABLE_LEFT_SHADOW} {
      z-index: ${akEditorUnitZIndex};
    }
    .${ClassName.ROW_CONTROLS_WRAPPER} {
      left: -${tableToolbarSize}px;
    }
    .${ClassName.TABLE_NODE_WRAPPER} {
      /* 
      compensating for half of the insert column button
      that is aligned to the right edge initially on hover of the top right column control when table overflown,
      its center should be aligned with the edge
       */
      padding-right: ${tableInsertColumnButtonSize / 2}px;
      margin-right: -${tableInsertColumnButtonSize / 2}px;
      padding-top: ${tableInsertColumnButtonSize / 2}px;
      margin-top: -${tableInsertColumnButtonSize / 2}px;
      padding-bottom: ${tableScrollbarOffset}px;
      margin-bottom: -${tableScrollbarOffset}px;
      /* fixes gap cursor height */
      overflow: auto;
      position: relative;
    }
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
`;

export const tableFullPageEditorStyles = css`
  .ProseMirror .${ClassName.TABLE_NODE_WRAPPER} > table {
    margin-left: 0;
    margin-right: 0;
    width: 100%;
  }
`;

export const tableCommentEditorStyles = css`
  .ProseMirror .${ClassName.TABLE_NODE_WRAPPER} > table {
    margin-left: 0;
    margin-right: 0;
    ${scrollbarStyles};
  }
`;
