/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

import { tableCellBorderWidth, tableMarginTop } from '@atlaskit/editor-common/styles';
import {
	akEditorTableCellOnStickyHeaderZIndex,
	akEditorTableToolbarSize,
	akEditorUnitZIndex,
	akRichMediaResizeZIndex,
} from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';

import { RESIZE_HANDLE_AREA_DECORATION_GAP } from '../types';

/**
 * Basic colors added to prevent content overflow in table cells.
 */

// TODO: DSP-4135 - Remove these tokens once the new elevation tokens are available
export const tableCellBackgroundColor: 'var(--ds-surface)' = token('elevation.surface');

export const tableHeaderCellBackgroundColor: 'var(--ds-background-accent-gray-subtlest)' = token(
	'color.background.accent.gray.subtlest',
);

export const tableToolbarColor: 'var(--ds-background-neutral-subtle)' = token(
	'color.background.neutral.subtle',
);
export const tableTextColor: 'var(--ds-text-subtlest)' = token('color.text.subtlest');
export const tableBorderColor: 'var(--ds-background-accent-gray-subtler)' = token(
	'color.background.accent.gray.subtler',
);
export const tableFloatingControlsColor: 'var(--ds-background-neutral)' = token(
	'color.background.neutral',
);

// TODO: DSP-4461 - Remove these tokens once the new elevation tokens are available
export const tableCellSelectedColor: 'var(--ds-blanket-selected)' = token('color.blanket.selected');
export const tableHeaderCellSelectedColor: 'var(--ds-background-selected-pressed)' = token(
	'color.background.selected.pressed',
);
export const tableToolbarSelectedColor: 'var(--ds-background-selected-pressed)' = token(
	'color.background.selected.pressed',
);
export const tableBorderSelectedColor: 'var(--ds-border-focused)' = token('color.border.focused');
export const tableCellSelectedDeleteIconColor: 'var(--ds-icon-subtle)' = token('color.icon.subtle');
export const tableCellSelectedDeleteIconBackground: 'var(--ds-background-accent-gray-subtlest)' =
	token('color.background.accent.gray.subtlest');
export const tableCellDeleteColor: 'var(--ds-blanket-danger)' = token('color.blanket.danger');

export const tableBorderDeleteColor: 'var(--ds-border-danger)' = token('color.border.danger');
export const tableToolbarDeleteColor: 'var(--ds-background-danger-pressed)' = token(
	'color.background.danger.pressed',
);
export const tableCellHoverDeleteIconColor: 'var(--ds-icon-inverse)' = token('color.icon.inverse');
export const tableCellHoverDeleteIconBackground: 'var(--ds-background-danger-bold)' = token(
	'color.background.danger.bold',
);
export const tableBorderRadiusSize = 3;
export const tablePadding = 8;
export const tableScrollbarOffset = 15;
export const tableMarginFullWidthMode = 2;
export const tableInsertColumnButtonSize = 20;
export const tableDeleteButtonSize = 16;
export const tableDeleteButtonOffset = 6;
export const tableToolbarSize: 11 = akEditorTableToolbarSize;
export const tableControlsSpacing: number = tableMarginTop + tablePadding - tableCellBorderWidth;
export const tableInsertColumnButtonOffset = 3;
export const layoutButtonSize = 32;
export const lineMarkerOffsetFromColumnControls = 13;
export const lineMarkerSize = 4;
export const columnControlsDecorationHeight = 25;
export const columnControlsZIndex: number = akEditorUnitZIndex * 10;
export const columnControlsSelectedZIndex: number = columnControlsZIndex + 1;
export const rowControlsZIndex: number = akEditorUnitZIndex * 10;
export const columnResizeHandleZIndex: number = columnControlsSelectedZIndex + 1;
export const insertLineWidth = 3;
export const resizeHandlerAreaWidth: number = RESIZE_HANDLE_AREA_DECORATION_GAP / 3;
export const resizeLineWidth = 2;
export const resizeHandlerZIndex: number = columnControlsZIndex + akRichMediaResizeZIndex;
export const contextualMenuTriggerSize = 16;
export const contextualMenuDropdownWidthDnD = 250;
export const stickyRowZIndex: number = resizeHandlerZIndex + 2;
export const stickyRowOffsetTop = 8;
export const stickyHeaderBorderBottomWidth = 1;
export const tableOverflowShadowWidth = 8;
export const tableOverflowShadowWidthWide = 32;
export const tablePopupMenuFitHeight = 188;
export const tableColumnControlsHeight = 24;
export const nativeStickyHeaderZIndex: number = akEditorTableCellOnStickyHeaderZIndex - 5;
export const aboveNativeStickyHeaderZIndex: number = nativeStickyHeaderZIndex + 1;
export const belowNativeStickyHeaderZIndex: number = nativeStickyHeaderZIndex - 1;

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
export const dragRowControlsWidth = 14;
export const colorPalletteColumns = 7;

export const tableResizerWidth = 8;
