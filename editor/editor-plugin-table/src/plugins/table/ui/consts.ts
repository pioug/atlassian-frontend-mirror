import {
  tableCellBorderWidth,
  tableMarginTop,
} from '@atlaskit/editor-common/styles';
import {
  akEditorTableBorder,
  akEditorTableBorderDark,
  akEditorTableToolbar,
  akEditorTableToolbarDark,
  akEditorTableToolbarSize,
  akEditorUnitZIndex,
  akRichMediaResizeZIndex,
} from '@atlaskit/editor-shared-styles';
import {
  B200,
  B300,
  DN30,
  DN400,
  N0,
  N20,
  N200,
  R400,
  R75,
} from '@atlaskit/theme/colors';
import { themed } from '@atlaskit/theme/components';
import { token } from '@atlaskit/tokens';

import { RESIZE_HANDLE_AREA_DECORATION_GAP } from '../types';

/**
 * Basic colors added to prevent content overflow in table cells.
 */

// TODO: https://product-fabric.atlassian.net/browse/DSP-4135
// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
export const tableCellBackgroundColor = themed({
  light: token('elevation.surface', N0),
  dark: token('elevation.surface', DN30),
});
export const tableHeaderCellBackgroundColor = themed({
  light: token('color.background.neutral', akEditorTableToolbar),
  dark: token('color.background.neutral', akEditorTableToolbarDark),
});
export const tableToolbarColor = themed({
  light: token('color.background.neutral.subtle', akEditorTableToolbar),
  dark: token('color.background.neutral.subtle', akEditorTableToolbarDark),
});
export const tableTextColor = themed({
  light: token('color.text.subtlest', N200),
  dark: token('color.text.subtlest', DN400),
});
export const tableBorderColor = themed({
  light: token('color.background.accent.gray.subtler', akEditorTableBorder),
  dark: token('color.background.accent.gray.subtler', akEditorTableBorderDark),
});
export const tableFloatingControlsColor = token(
  'color.background.neutral',
  N20,
);
// TODO: https://product-fabric.atlassian.net/browse/DSP-4461
export const tableCellSelectedColor = token(
  'color.blanket.selected',
  'rgba(179, 212, 255, 0.3)',
);
export const tableToolbarSelectedColor = token(
  'color.background.selected.bold',
  B200,
);
export const tableBorderSelectedColor = token('color.border.selected', B300);
export const tableCellDeleteColor = token(
  'color.blanket.danger',
  'rgba(255, 235, 230, 0.3)',
);
export const tableBorderDeleteColor = token('color.border.danger', R400);
export const tableToolbarDeleteColor = token(
  'color.background.danger.bold',
  R75,
);
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

export const TABLE_SNAP_GAP = 5;
export const TABLE_HIGHLIGHT_GAP = 10;
