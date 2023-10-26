import {
  tableCellBorderWidth,
  tableMarginTop,
} from '@atlaskit/editor-common/styles';
import {
  akEditorTableBorder,
  akEditorTableBorderDark,
  akEditorTableBorderSelected,
  akEditorTableCellBlanketDeleted,
  akEditorTableCellBlanketSelected,
  akEditorTableHeaderCellBackground,
  akEditorTableHeaderCellBackgroundDark,
  akEditorTableToolbar,
  akEditorTableToolbarDark,
  akEditorTableToolbarSize,
  akEditorUnitZIndex,
  akRichMediaResizeZIndex,
} from '@atlaskit/editor-shared-styles';
import {
  B200,
  DN30,
  DN400,
  N0,
  N20,
  N200,
  N20A,
  N300,
  R300,
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
  light: token(
    'color.background.accent.gray.subtlest',
    akEditorTableHeaderCellBackground,
  ),
  dark: token(
    'color.background.accent.gray.subtlest',
    akEditorTableHeaderCellBackgroundDark,
  ),
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
export const tableCellSelectedColor = themed({
  light: token('color.blanket.selected', akEditorTableCellBlanketSelected),
  dark: token('color.blanket.selected', akEditorTableCellBlanketSelected),
});
export const tableToolbarSelectedColor = themed({
  light: token('color.background.selected.pressed', B200),
  dark: token('color.background.selected.pressed', B200),
});
export const tableBorderSelectedColor = themed({
  light: token('color.border.focused', akEditorTableBorderSelected),
  dark: token('color.border.focused', akEditorTableBorderSelected),
});
export const tableCellSelectedDeleteIconColor = themed({
  light: token('color.icon.subtle', N300),
  dark: token('color.icon.subtle', N300),
});
export const tableCellSelectedDeleteIconBackground = themed({
  light: token('color.background.accent.gray.subtlest', N20A),
  dark: token('color.background.accent.gray.subtlest', N20A),
});
export const tableCellDeleteColor = themed({
  light: token('color.blanket.danger', akEditorTableCellBlanketDeleted),
  dark: token('color.blanket.danger', akEditorTableCellBlanketDeleted),
});
export const tableBorderDeleteColor = themed({
  light: token('color.border.danger', R400),
  dark: token('color.border.danger', R400),
});
export const tableToolbarDeleteColor = themed({
  light: token('color.background.danger.pressed', R75),
  dark: token('color.background.danger.pressed', R75),
});
export const tableCellHoverDeleteIconColor = themed({
  light: token('color.icon.inverse', 'white'),
  dark: token('color.icon.inverse', 'white'),
});
export const tableCellHoverDeleteIconBackground = themed({
  light: token('color.background.danger.bold', R300),
  dark: token('color.background.danger.bold', R300),
});
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
export const rowControlsZIndex = akEditorUnitZIndex * 10;
export const columnResizeHandleZIndex = columnControlsSelectedZIndex + 1;
export const insertLineWidth = 3;
export const resizeHandlerAreaWidth = RESIZE_HANDLE_AREA_DECORATION_GAP / 3;
export const resizeLineWidth = 2;
export const resizeHandlerZIndex =
  columnControlsZIndex + akRichMediaResizeZIndex;
export const contextualMenuTriggerSize = 16;
export const contextualMenuDropdownWidth = 180;
export const stickyRowZIndex = resizeHandlerZIndex + 2;
export const stickyRowOffsetTop = 8;
export const stickyHeaderBorderBottomWidth = 1;
export const tableOverflowShadowWidth = 8;
export const tableOverflowShadowWidthWide = 32;

export const TABLE_SNAP_GAP = 9;
export const TABLE_HIGHLIGHT_GAP = 10;
export const TABLE_HIGHLIGHT_TOLERANCE = 2;
export const STICKY_HEADER_TOGGLE_TOLERANCE_MS = 5;

export const dragMenuDropdownWidth = 240;
