/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

import { tableCellBorderWidth, tableMarginTop } from '@atlaskit/editor-common/styles';
import {
	akEditorTableBorder,
	akEditorTableBorderSelected,
	akEditorTableCellBlanketDeleted,
	akEditorTableCellBlanketSelected,
	akEditorTableHeaderCellBackground,
	akEditorTableToolbar,
	akEditorTableToolbarSize,
	akEditorUnitZIndex,
	akRichMediaResizeZIndex,
} from '@atlaskit/editor-shared-styles';
import { B200, N0, N20, N200, N20A, N300, R300, R400, R75 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { RESIZE_HANDLE_AREA_DECORATION_GAP } from '../types';

/**
 * Basic colors added to prevent content overflow in table cells.
 */

// TODO: DSP-4135 - Remove these tokens once the new elevation tokens are available
export const tableCellBackgroundColor = token('elevation.surface', N0);

export const tableHeaderCellBackgroundColor = token(
	'color.background.accent.gray.subtlest',
	akEditorTableHeaderCellBackground,
);

export const tableToolbarColor = token('color.background.neutral.subtle', akEditorTableToolbar);
export const tableTextColor = token('color.text.subtlest', N200);
export const tableBorderColor = token('color.background.accent.gray.subtler', akEditorTableBorder);
export const tableFloatingControlsColor = token('color.background.neutral', N20);

// TODO: DSP-4461 - Remove these tokens once the new elevation tokens are available
export const tableCellSelectedColor = token(
	'color.blanket.selected',
	akEditorTableCellBlanketSelected,
);
export const tableToolbarSelectedColor = token('color.background.selected.pressed', B200);
export const tableBorderSelectedColor = token('color.border.focused', akEditorTableBorderSelected);
export const tableCellSelectedDeleteIconColor = token('color.icon.subtle', N300);
export const tableCellSelectedDeleteIconBackground = token(
	'color.background.accent.gray.subtlest',
	N20A,
);
export const tableCellDeleteColor = token('color.blanket.danger', akEditorTableCellBlanketDeleted);

export const tableBorderDeleteColor = token('color.border.danger', R400);
export const tableToolbarDeleteColor = token('color.background.danger.pressed', R75);
export const tableCellHoverDeleteIconColor = token('color.icon.inverse', 'white');
export const tableCellHoverDeleteIconBackground = token('color.background.danger.bold', R300);
export const tableBorderRadiusSize = 3;
export const tablePadding = 8;
export const tableScrollbarOffset = 15;
export const tableMarginFullWidthMode = 2;
export const tableInsertColumnButtonSize = 20;
export const tableDeleteButtonSize = 16;
export const tableDeleteButtonOffset = 6;
export const tableToolbarSize = akEditorTableToolbarSize;
export const tableControlsSpacing = tableMarginTop + tablePadding - tableCellBorderWidth;
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
export const resizeHandlerZIndex = columnControlsZIndex + akRichMediaResizeZIndex;
export const contextualMenuTriggerSize = 16;
export const contextualMenuDropdownWidth = 180;
export const contextualMenuDropdownWidthDnD = 250;
export const stickyRowZIndex = resizeHandlerZIndex + 2;
export const stickyRowOffsetTop = 8;
export const stickyHeaderBorderBottomWidth = 1;
export const tableOverflowShadowWidth = 8;
export const tableOverflowShadowWidthWide = 32;
export const tablePopupMenuFitHeight = 188;

export const dropTargetsZIndex = 14;

export const TABLE_SNAP_GAP = 9;
export const TABLE_HIGHLIGHT_GAP = 10;
export const TABLE_HIGHLIGHT_TOLERANCE = 2;
export const STICKY_HEADER_TOGGLE_TOLERANCE_MS = 5;
// This adjustment value represents a pixel amount by which the container width needs to be adjusted when determining
// which guidelines are visible and most importantly CAN BE snapped too within the view. This value can be affected by
// table margins and padding. For example a guideline at 1800px and the view at 1860px wide, means the guidelines is visible
// BUT it cannot be snapped to during resize due to padding being applied to the resizer wrapper. This accommodates that difference.
export const TABLE_GUIDELINE_VISIBLE_ADJUSTMENT = -68;

export const TABLE_DRAG_MENU_SORT_GROUP_HEIGHT = 92;
export const TABLE_DRAG_MENU_PADDING_TOP = 4;
export const TABLE_DRAG_MENU_MENU_GROUP_BEFORE_HEIGHT = 6;

export const dragMenuDropdownWidth = 250;
export const dragTableInsertColumnButtonSize = 16;
export const dropTargetExtendedWidth = 150;
export const colorPalletteColumns = 7;

export const tableResizerWidth = 8;
