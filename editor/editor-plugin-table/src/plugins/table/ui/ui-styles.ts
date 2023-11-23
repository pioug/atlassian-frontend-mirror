import { css } from '@emotion/react';

import {
  tableCellBorderWidth,
  tableMarginTop,
  tableMarginTopWithControl,
} from '@atlaskit/editor-common/styles';
import {
  akEditorShadowZIndex,
  akEditorTableNumberColumnWidth,
  akEditorUnitZIndex,
} from '@atlaskit/editor-shared-styles';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { B300, N0, N300, N40A, N60A, Y200, Y50 } from '@atlaskit/theme/colors';
import { borderRadius } from '@atlaskit/theme/constants';
import type { ThemeProps } from '@atlaskit/theme/types';
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
  tableCellDisabledColor,
  tableCellHoverDeleteIconBackground,
  tableCellHoverDeleteIconColor,
  tableCellSelectedDeleteIconBackground,
  tableCellSelectedDeleteIconColor,
  tableDeleteButtonSize,
  tableHeaderCellBackgroundColor,
  tableInsertColumnButtonSize,
  tableOverflowShadowWidth,
  tableOverflowShadowWidthWide,
  tableToolbarDeleteColor,
  tableToolbarSelectedColor,
  tableToolbarSize,
} from './consts';

const InsertLine = (props: ThemeProps, cssString?: string) => css`
  .${ClassName.CONTROLS_INSERT_LINE} {
    background: ${tableBorderSelectedColor(props)};
    display: none;
    position: absolute;
    z-index: ${akEditorUnitZIndex};
    ${cssString}
  }
`;

const Marker = (props: ThemeProps) => css`
  background-color: ${tableBorderColor(props)};
  position: absolute;
  height: ${lineMarkerSize}px;
  width: ${lineMarkerSize}px;
  border-radius: 50%;
  pointer-events: none;
`;

export const InsertMarker = (props: ThemeProps, cssString?: string) => css`
  .${ClassName.CONTROLS_INSERT_MARKER} {
    ${Marker(props)};
    ${cssString}
  }
`;

const Button = (cssString?: string) => css`
  border-radius: ${borderRadius()}px;
  border-width: 0px;
  display: inline-flex;
  max-width: 100%;
  text-align: center;
  margin: 0px;
  padding: 0px;
  text-decoration: none;
  transition: background 0.1s ease-out 0s,
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

export const HeaderButton = (props: ThemeProps, cssString?: string) => css`
  .${ClassName.CONTROLS_BUTTON} {
    background: ${tableHeaderCellBackgroundColor(props)};
    border: 1px solid ${tableBorderColor(props)};
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
    background-color: ${tableToolbarSelectedColor(props)};
    border-color: ${tableBorderSelectedColor(props)};
  }
`;

export const HeaderButtonHover = (props: ThemeProps) => css`
  .${ClassName.CONTROLS_BUTTON}:hover {
    color: ${token('color.icon.inverse', N0)};
    background-color: ${tableToolbarSelectedColor(props)};
    border-color: ${tableBorderSelectedColor(props)};
    cursor: pointer;
  }
`;

export const HeaderButtonDanger = (props: ThemeProps) => css`
  .${ClassName.HOVERED_CELL_IN_DANGER} .${ClassName.CONTROLS_BUTTON} {
    background-color: ${tableToolbarDeleteColor(props)};
    border-color: ${tableBorderDeleteColor(props)};
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
  .${ClassName.CONTROLS_INSERT_BUTTON_INNER},
    .${ClassName.CONTROLS_INSERT_BUTTON} {
    height: ${tableInsertColumnButtonSize}px;
    width: ${tableInsertColumnButtonSize}px;
  }
  .${ClassName.CONTROLS_INSERT_BUTTON} {
    ${Button(`
      background: ${token('elevation.surface.overlay', 'white')};
      box-shadow: ${token(
        'elevation.shadow.overlay',
        `0 4px 8px -2px ${N60A}, 0 0 1px ${N60A}`,
      )};
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

export const dragInsertButtonWrapper = (props: ThemeProps) => css`
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

  .${ClassName.DRAG_CONTROLS_INSERT_BUTTON} {
    ${Button(`
    background: ${token('elevation.surface.overlay', 'white')};
    color: ${token('color.icon', N300)};
    border: 1px solid ${token(
      'color.background.accent.gray.subtler',
      '#C1C7D0',
    )};
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

export const dragCornerControlButton = (props: ThemeProps) => css`
  .${ClassName.DRAG_CORNER_BUTTON} {
    width: 24px;
    height: 24px;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    position: absolute;
    top: ${token('space.negative.250', '-20px')};
    left: ${token('space.negative.100', '-8px')};
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
      top: ${token('space.075', '6px')};
      left: ${token('space.075', '6px')};
    }

    &:hover {
      cursor: pointer;

      .${ClassName.DRAG_CORNER_BUTTON_INNER} {
        width: 10px;
        height: 10px;
        border-width: 2px;
        border-radius: 4px;
        top: ${token('space.075', '6px')};
        left: ${token('space.075', '6px')};
      }
    }
  }

  .${ClassName.DRAG_CORNER_BUTTON_INNER} {
    border: 1px solid ${token('color.border.inverse', '#FFF')};
    background-color: ${token(
      'color.background.accent.gray.subtler',
      '#DCDFE4',
    )};
    border-radius: 2px;
    width: 5px;
    height: 5px;
    position: relative;
  }
`;

export const insertColumnButtonWrapper = (props: ThemeProps) => css`
  ${InsertButton()}
  ${InsertButtonHover()}
  ${InsertLine(
    props,
    `
    width: 2px;
    left: 9px;
  `,
  )}
`;

export const insertRowButtonWrapper = (props: ThemeProps) => css`
  ${InsertButton()}
  ${InsertButtonHover()}
  ${InsertLine(
    props,
    `
    height: 2px;
    top: -11px;
    left: ${tableInsertColumnButtonSize - 1}px;
  `,
  )}
`;

export const columnControlsLineMarker = () => css`
  .${ClassName.TABLE_CONTAINER}.${ClassName.WITH_CONTROLS}
    table
    tr:first-of-type
    td,
  .${ClassName.TABLE_CONTAINER}.${ClassName.WITH_CONTROLS}
    table
    tr:first-of-type
    th {
    position: relative;
  }
`;

export const DeleteButton = (props: ThemeProps) => css`
  .${ClassName.CONTROLS_DELETE_BUTTON_WRAP},
    .${ClassName.CONTROLS_DELETE_BUTTON} {
    height: ${tableDeleteButtonSize}px;
    width: ${tableDeleteButtonSize}px;
  }
  .${ClassName.CONTROLS_DELETE_BUTTON_WRAP} {
    .${ClassName.CONTROLS_DELETE_BUTTON} {
      ${Button(`
        background: ${tableCellSelectedDeleteIconBackground(props)};
        color: ${tableCellSelectedDeleteIconColor(props)};
      `)}
    }
  }

  .${ClassName.CONTROLS_DELETE_BUTTON}:hover {
    background: ${tableCellHoverDeleteIconBackground(props)};
    color: ${tableCellHoverDeleteIconColor(props)};
    cursor: pointer;
  }
`;

export const OverflowShadow = (props: ThemeProps) => css`
  .${ClassName.TABLE_RIGHT_SHADOW}, .${ClassName.TABLE_LEFT_SHADOW} {
    display: block;
    height: calc(100% - ${tableMarginTop}px);
    position: absolute;
    pointer-events: none;
    top: ${tableMarginTop}px;
    z-index: ${akEditorShadowZIndex};
    width: ${getBooleanFF(
      'platform.editor.table.increase-shadow-visibility_lh89r',
    )
      ? tableOverflowShadowWidthWide
      : tableOverflowShadowWidth}px;
  }
  .${ClassName.TABLE_LEFT_SHADOW} {
    background: linear-gradient(
        to left,
        transparent 0,
        ${token('elevation.shadow.overflow.spread', N40A)}
          ${getBooleanFF(
            'platform.editor.table.increase-shadow-visibility_lh89r',
          )
            ? 140
            : 100}%
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
        ${token('elevation.shadow.overflow.spread', N40A)}
          ${getBooleanFF(
            'platform.editor.table.increase-shadow-visibility_lh89r',
          )
            ? 140
            : 100}%
      ),
      linear-gradient(
        to left,
        ${token('elevation.shadow.overflow.perimeter', 'transparent')} 0px,
        transparent 1px
      );
    left: ${getBooleanFF('platform.editor.custom-table-width')
      ? `calc(100% - ${
          getBooleanFF('platform.editor.table.increase-shadow-visibility_lh89r')
            ? tableOverflowShadowWidthWide
            : tableOverflowShadowWidth
        }px)`
      : `calc(100% - ${
          getBooleanFF('platform.editor.table.increase-shadow-visibility_lh89r')
            ? tableOverflowShadowWidthWide - 10
            : -2
        }px)`};
  }
  .${ClassName.WITH_CONTROLS} {
    ${overflowShadowWidhoutDnD()}
    .${ClassName.TABLE_LEFT_SHADOW} {
      border-left: 1px solid ${tableBorderColor(props)};
    }
  }
`;

const overflowShadowWidhoutDnD = () => {
  if (!getBooleanFF('platform.editor.table.drag-and-drop')) {
    return css`
      .${ClassName.TABLE_RIGHT_SHADOW}, .${ClassName.TABLE_LEFT_SHADOW} {
        height: calc(100% - ${tableMarginTopWithControl}px);
        top: ${tableMarginTopWithControl}px;
      }
    `;
  }
};

const columnHeaderButton = (props: ThemeProps, cssString?: string) => {
  if (getBooleanFF('platform.editor.table.column-controls-styles-updated')) {
    return css`
      background: ${tableHeaderCellBackgroundColor(props)};
      display: block;
      box-sizing: border-box;
      padding: 0;

      :focus {
        outline: none;
      }

      ${cssString}
    `;
  } else {
    return css`
      background: ${tableHeaderCellBackgroundColor(props)};
      border: 1px solid ${tableBorderColor(props)};
      display: block;
      box-sizing: border-box;
      padding: 0;

      :focus {
        outline: none;
      }

      ${cssString}
    `;
  }
};

const columnHeaderButtonSelected = (props: ThemeProps) => css`
  color: ${token('color.text.inverse', N0)};
  background-color: ${tableToolbarSelectedColor(props)};
  border-color: ${tableBorderSelectedColor(props)};
  z-index: ${columnControlsSelectedZIndex};
`;

const getFloatingDotOverrides = (props: ThemeProps) => {
  return getBooleanFF('platform.editor.custom-table-width')
    ? css`
        tr
          th:last-child
          .${ClassName.COLUMN_CONTROLS_DECORATIONS}::before,
          tr
          td:last-child
          .${ClassName.COLUMN_CONTROLS_DECORATIONS}::before {
          content: '';
          background-color: ${tableBorderColor(props)};
          position: absolute;
          height: ${lineMarkerSize}px;
          width: ${lineMarkerSize}px;
          border-radius: 50%;
          pointer-events: none;
          top: ${token('space.025', '2px')};
          right: 0px;
        }
      `
    : '';
};

export const floatingColumnControls = (props: ThemeProps) => {
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

export const rowControlsWrapperDotStyle = (props: ThemeProps) => {
  if (getBooleanFF('platform.editor.table.drag-and-drop')) {
    return css`
      div.${ClassName.WITH_CONTROLS}>.${ClassName.ROW_CONTROLS_WRAPPER}::after {
        display: none;
      }
    `;
  } else {
    return css`
      div.${ClassName.WITH_CONTROLS}>.${ClassName.ROW_CONTROLS_WRAPPER}::after {
        content: ' ';
        background-color: ${tableBorderColor(props)};
        position: absolute;
        height: ${lineMarkerSize}px;
        width: ${lineMarkerSize}px;
        border-radius: 50%;
        pointer-events: none;
        top: -${tableToolbarSize + tableCellBorderWidth}px;
        right: -1px;
      }
    `;
  }
};

export const columnControlsDecoration = (props: ThemeProps) => {
  if (getBooleanFF('platform.editor.table.column-controls-styles-updated')) {
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
          background-color: ${tableBorderColor(props)};
          position: absolute;
          height: ${lineMarkerSize}px;
          width: ${lineMarkerSize}px;
          border-radius: 50%;
          pointer-events: none;
          top: 2px;
          right: -1px;
        }

        &::after {
          content: ' ';

          ${columnHeaderButton(
            props,
            `
        border-right: ${tableCellBorderWidth}px solid ${tableBorderColor(
              props,
            )};
        border-top: ${tableCellBorderWidth}px solid ${tableBorderColor(props)};
        border-bottom: ${tableCellBorderWidth}px solid ${tableBorderColor(
              props,
            )};
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
      ${getFloatingDotOverrides(props)}

      .${ClassName.WITH_CONTROLS} .${ClassName.COLUMN_CONTROLS_DECORATIONS} {
        display: block;
      }

      table tr:first-of-type th.${ClassName.TABLE_HEADER_CELL} {
        &.${ClassName.COLUMN_SELECTED}, &.${ClassName.HOVERED_TABLE} {
          .${ClassName.COLUMN_CONTROLS_DECORATIONS}::after {
            ${columnHeaderButtonSelected(props)};
          }

          &.${ClassName.HOVERED_CELL_IN_DANGER}
            .${ClassName.COLUMN_CONTROLS_DECORATIONS}::after {
            background-color: ${tableToolbarDeleteColor(props)};
            border-color: ${tableBorderDeleteColor(props)};
            z-index: ${akEditorUnitZIndex * 100};
          }
        }
      }

      table tr:first-of-type th.${ClassName.TABLE_HEADER_CELL} {
        &.${ClassName.COLUMN_SELECTED}, &.${ClassName.HOVERED_COLUMN} {
          .${ClassName.COLUMN_CONTROLS_DECORATIONS}::after {
            ${columnHeaderButtonSelected(props)};
            border-left: ${tableCellBorderWidth}px solid
              ${tableBorderSelectedColor(props)};
            left: -${tableCellBorderWidth}px;
          }
        }
      }

      table tr:first-of-type th.${ClassName.TABLE_HEADER_CELL} {
        &.${ClassName.HOVERED_COLUMN} {
          .${ClassName.COLUMN_CONTROLS_DECORATIONS}::after {
            ${columnHeaderButtonSelected(props)};
          }

          &.${ClassName.HOVERED_CELL_IN_DANGER}
            .${ClassName.COLUMN_CONTROLS_DECORATIONS}::after {
            background-color: ${tableToolbarDeleteColor(props)};
            border-color: ${tableBorderDeleteColor(props)};
            border-left: ${tableCellBorderWidth}px solid
              ${tableBorderDeleteColor(props)};
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
          ${columnHeaderButtonSelected(props)};
        }
      }
    `;
  } else {
    return css`
      .${ClassName.COLUMN_CONTROLS_DECORATIONS} {
        display: none;
        cursor: pointer;
        position: absolute;
        width: calc(100% + ${tableCellBorderWidth * 2}px);
        left: -1px;
        top: -${columnControlsDecorationHeight + tableCellBorderWidth}px;
        height: ${columnControlsDecorationHeight}px;
        // floating dot for adding column button
        &::before {
          content: ' ';
          background-color: ${tableBorderColor(props)};
          position: absolute;
          height: ${lineMarkerSize}px;
          width: ${lineMarkerSize}px;
          border-radius: 50%;
          pointer-events: none;
          top: 2px;
          right: -1px;
        }

        &::after {
          content: ' ';

          ${columnHeaderButton(
            props,
            `
        border-right: ${tableCellBorderWidth}px solid ${tableBorderColor(
              props,
            )};
        border-bottom: none;
        height: ${tableToolbarSize}px;
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
      ${getFloatingDotOverrides(props)}

      .${ClassName.WITH_CONTROLS} .${ClassName.COLUMN_CONTROLS_DECORATIONS} {
        display: block;
      }

      table
        tr:first-of-type
        td.${ClassName.TABLE_CELL},
        table
        tr:first-of-type
        th.${ClassName.TABLE_HEADER_CELL} {
        &.${ClassName.COLUMN_SELECTED},
          &.${ClassName.HOVERED_COLUMN},
          &.${ClassName.HOVERED_TABLE} {
          .${ClassName.COLUMN_CONTROLS_DECORATIONS}::after {
            ${columnHeaderButtonSelected(props)};
          }

          &.${ClassName.HOVERED_CELL_IN_DANGER}
            .${ClassName.COLUMN_CONTROLS_DECORATIONS}::after {
            background-color: ${tableToolbarDeleteColor(props)};
            border: 1px solid ${tableBorderDeleteColor(props)};
            border-bottom: none;
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
          ${columnHeaderButtonSelected(props)};
        }
      }
    `;
  }
};

export const hoveredDeleteButton = (props: ThemeProps) => css`
  .${ClassName.TABLE_CONTAINER}.${ClassName.HOVERED_DELETE_BUTTON} {
    .${ClassName.SELECTED_CELL},
      .${ClassName.COLUMN_SELECTED},
      .${ClassName.HOVERED_CELL} {
      border: 1px solid ${tableBorderDeleteColor(props)};
    }
    .${ClassName.SELECTED_CELL}::after {
      background: ${tableCellDeleteColor(props)};
    }
  }
`;

export const disabledCell = (props: ThemeProps) => css`
  :not(.${ClassName.IS_RESIZING})
    .${ClassName.TABLE_CONTAINER}:not(.${ClassName.HOVERED_DELETE_BUTTON}) {
    .${ClassName.HOVERED_CELL}.${ClassName.HOVERED_DISABLED_CELL} {
      position: relative;
      border: 1px solid ${tableCellDisabledColor};
    }
    .${ClassName.HOVERED_CELL}.${ClassName.HOVERED_DISABLED_CELL}::after {
      border: 1px solid ${tableCellDisabledColor};
    }
  }
`;
export const hoveredCell = (props: ThemeProps) => css`
  :not(.${ClassName.IS_RESIZING})
    .${ClassName.TABLE_CONTAINER}:not(.${ClassName.HOVERED_DELETE_BUTTON}) {
    .${ClassName.HOVERED_CELL} {
      position: relative;
      border: 1px solid ${tableBorderSelectedColor(props)};
    }
  }
`;

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

// move the resize handle zone completely inside the table cell to avoid overflow
const getLastColumnResizerOverrides = () => {
  return getBooleanFF('platform.editor.custom-table-width')
    ? css`
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
      `
    : '';
};

const resizeHandleOverrides = (props: ThemeProps) => {
  if (getBooleanFF('platform.editor.table.drag-and-drop')) {
    return css`
      th.${ClassName.WITH_RESIZE_LINE}::before,
        td.${ClassName.WITH_RESIZE_LINE}::before {
        content: ' ';
        position: absolute;
        left: ${token('space.negative.025', '-2px')};
        top: -1px;
        width: ${resizeLineWidth}px;
        height: calc(100% + 2px);
        background-color: ${tableBorderSelectedColor(props)};
        z-index: ${columnControlsZIndex * 2};
      }

      th.${ClassName.WITH_RESIZE_LINE_LAST_COLUMN}::before,
        td.${ClassName.WITH_RESIZE_LINE_LAST_COLUMN}::before {
        content: ' ';
        position: absolute;
        right: -1px;
        top: -1px;
        width: ${resizeLineWidth}px;
        height: calc(100% + 2px);
        background-color: ${tableBorderSelectedColor(props)};
        z-index: ${columnControlsZIndex * 2};
      }
    `;
  }
  return css`
    td.${ClassName.WITH_RESIZE_LINE}::before {
      content: ' ';
      position: absolute;
      left: ${token('space.negative.025', '-2px')};
      top: -1px;
      width: ${resizeLineWidth}px;
      height: calc(100% + 2px);
      background-color: ${tableBorderSelectedColor(props)};
      z-index: ${columnControlsZIndex * 2};
    }

    th.${ClassName.WITH_RESIZE_LINE}::before {
      content: ' ';
      left: ${token('space.negative.025', '-2px')};
      position: absolute;
      width: ${resizeLineWidth}px;
      height: calc(100% + ${tableToolbarSize + tableCellBorderWidth}px);
      background-color: ${tableBorderSelectedColor(props)};
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
      background-color: ${tableBorderSelectedColor(props)};
      z-index: ${columnControlsZIndex * 2};
    }

    th.${ClassName.WITH_RESIZE_LINE_LAST_COLUMN}::before {
      content: ' ';
      right: -1px;
      position: absolute;
      width: ${resizeLineWidth}px;
      height: calc(100% + ${tableToolbarSize + tableCellBorderWidth}px);
      background-color: ${tableBorderSelectedColor(props)};
      z-index: ${columnControlsZIndex * 2};
      top: -${tableToolbarSize + tableCellBorderWidth}px;
    }
  `;
};

export const resizeHandle = (props: ThemeProps) => css`
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

    ${getLastColumnResizerOverrides()}

    ${resizeHandleOverrides(props)}

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
export const insertLine = (props: ThemeProps) => css`
  .${ClassName.TABLE_CONTAINER} {
    td.${ClassName.WITH_FIRST_COLUMN_INSERT_LINE}::before {
      content: ' ';
      position: absolute;
      left: -1px;
      top: -1px;
      width: ${insertLineWidth}px;
      height: calc(100% + ${tableCellBorderWidth * 2}px);
      background-color: ${tableBorderSelectedColor(props)};
      z-index: ${columnControlsZIndex * 2};
    }

    th.${ClassName.WITH_FIRST_COLUMN_INSERT_LINE}::before {
      content: ' ';
      left: -1px;
      position: absolute;
      width: ${insertLineWidth}px;
      height: calc(100% + ${tableCellBorderWidth * 2}px);
      background-color: ${tableBorderSelectedColor(props)};
      z-index: ${columnControlsZIndex * 2};
      top: -${tableCellBorderWidth}px;
    }

    td.${ClassName.WITH_COLUMN_INSERT_LINE}::before {
      content: ' ';
      position: absolute;
      left: ${token('space.negative.025', '-2px')};
      top: -1px;
      width: ${insertLineWidth}px;
      height: calc(100% + ${tableCellBorderWidth * 2}px);
      background-color: ${tableBorderSelectedColor(props)};
      z-index: ${columnControlsZIndex * 2};
    }

    th.${ClassName.WITH_COLUMN_INSERT_LINE}::before {
      content: ' ';
      left: ${token('space.negative.025', '-2px')};
      position: absolute;
      width: ${insertLineWidth}px;
      height: calc(100% + ${tableCellBorderWidth * 2}px);
      background-color: ${tableBorderSelectedColor(props)};
      z-index: ${columnControlsZIndex * 2};
      top: -${tableCellBorderWidth}px;
    }

    td.${ClassName.WITH_LAST_COLUMN_INSERT_LINE}::before {
      content: ' ';
      position: absolute;
      right: -1px;
      top: -1px;
      width: ${insertLineWidth}px;
      height: calc(100% + ${tableCellBorderWidth * 2}px);
      background-color: ${tableBorderSelectedColor(props)};
      z-index: ${columnControlsZIndex * 2};
    }

    th.${ClassName.WITH_LAST_COLUMN_INSERT_LINE}::before {
      content: ' ';
      right: -1px;
      position: absolute;
      width: ${insertLineWidth}px;
      height: calc(100% + ${tableCellBorderWidth * 2}px);
      background-color: ${tableBorderSelectedColor(props)};
      z-index: ${columnControlsZIndex * 2};
      top: -${tableCellBorderWidth}px;
    }

    td.${ClassName.WITH_ROW_INSERT_LINE}::before {
      content: ' ';
      position: absolute;
      left: ${token('space.negative.025', '-2px')};
      top: -1px;
      height: ${insertLineWidth}px;
      width: calc(100% + ${tableCellBorderWidth * 2}px);
      background-color: ${tableBorderSelectedColor(props)};
      z-index: ${columnControlsZIndex * 2};
    }

    th.${ClassName.WITH_ROW_INSERT_LINE}::before {
      content: ' ';
      left: ${token('space.negative.025', '-2px')};
      position: absolute;
      height: ${insertLineWidth}px;
      width: calc(100% + ${tableCellBorderWidth * 2}px);
      background-color: ${tableBorderSelectedColor(props)};
      z-index: ${columnControlsZIndex * 2};
      top: -1px;
    }

    td.${ClassName.WITH_LAST_ROW_INSERT_LINE}::before {
      content: ' ';
      position: absolute;
      left: ${token('space.negative.025', '-2px')};
      bottom: 0;
      height: ${insertLineWidth}px;
      width: calc(100% + 2px);
      background-color: ${tableBorderSelectedColor(props)};
      z-index: ${columnControlsZIndex * 2};
    }

    th.${ClassName.WITH_LAST_ROW_INSERT_LINE}::before {
      content: ' ';
      left: ${token('space.negative.025', '-2px')};
      bottom: 0;
      position: absolute;
      height: ${insertLineWidth}px;
      width: calc(100% + ${tableCellBorderWidth * 2}px);
      background-color: ${tableBorderSelectedColor(props)};
      z-index: ${columnControlsZIndex * 2};
    }
  }
`;
