import {
  B100,
  B300,
  B75,
  N0,
  N20,
  R50,
  R300,
  R75,
  DN400,
  N200,
  DN30,
} from '@atlaskit/theme/colors';
import { tableCellBorderWidth, tableMarginTop } from '@atlaskit/editor-common';
import {
  akEditorTableBorder,
  akEditorTableBorderDark,
  akEditorTableToolbar,
  akEditorTableToolbarDark,
  akEditorTableToolbarSize,
  akEditorUnitZIndex,
  akRichMediaResizeZIndex,
} from '@atlaskit/editor-shared-styles';

import { RESIZE_HANDLE_AREA_DECORATION_GAP } from '../types';

import { themed } from '@atlaskit/theme/components';

/**
 * Basic colors added to prevent content overflow in table cells.
 */
export const tableCellBackgroundColor = themed({ light: N0, dark: DN30 });

export const tableToolbarColor = themed({
  light: akEditorTableToolbar,
  dark: akEditorTableToolbarDark,
});
export const tableTextColor = themed({ light: N200, dark: DN400 });
export const tableBorderColor = themed({
  light: akEditorTableBorder,
  dark: akEditorTableBorderDark,
});
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
export const stickyRowOffsetTop = 8;
export const stickyHeaderBorderBottomWidth = 1;
