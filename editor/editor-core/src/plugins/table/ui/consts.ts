import {
  B100,
  B300,
  B75,
  N20,
  N50,
  R50,
  R300,
  R75,
} from '@atlaskit/theme/colors';

import {
  akEditorTableToolbarSize,
  akEditorUnitZIndex,
  akRichMediaResizeZIndex,
  tableCellBorderWidth,
  tableMarginTop,
} from '@atlaskit/editor-common';

import { RESIZE_HANDLE_AREA_DECORATION_GAP } from '../types';

export const tableToolbarColor = N20;
export const tableBorderColor = N50;
export const tableFloatingControlsColor = N20;
export const tableCellSelectedColor = B75;
export const tableToolbarSelectedColor = B100;
export const tableBorderSelectedColor = B300;
export const tableCellDeleteColor = R50;
export const tableBorderDeleteColor = R300;
export const tableToolbarDeleteColor = R75;
export const tableBorderRadiusSize = 3;
export const tablePadding = 8;
export const tableScrollbarOffset = 15;
export const tableMarginFullWidthMode = 2;
export const tableInsertColumnButtonSize = 20;
export const tableDeleteButtonSize = 16;
export const tableDeleteButtonOffset = 6;
export const tableToolbarSize = akEditorTableToolbarSize;
export const tableControlsSpacing =
  tableMarginTop + tablePadding - tableCellBorderWidth;
export const tableInsertColumnButtonOffset = 3;
export const layoutButtonSize = 32;
export const lineMarkerOffsetFromColumnControls = 13;
export const lineMarkerSize = 4;
export const columnControlsDecorationHeight = 25;
export const columnControlsZIndex = akEditorUnitZIndex * 10;
export const columnControlsSelectedZIndex = columnControlsZIndex + 1;
export const columnResizeHandleZIndex = columnControlsSelectedZIndex + 1;
export const resizeHandlerAreaWidth = RESIZE_HANDLE_AREA_DECORATION_GAP / 3;
export const resizeLineWidth = 2;
export const resizeHandlerZIndex =
  columnControlsZIndex + akRichMediaResizeZIndex;
export const contextualMenuTriggerSize = 16;
export const contextualMenuDropdownWidth = 180;
export const stickyRowZIndex = resizeHandlerZIndex + 2;
export const colorsButtonPerLine = 7;
export const colorsButtonRows = 3;
export const colorButtonSizeWithPadding = 32;
