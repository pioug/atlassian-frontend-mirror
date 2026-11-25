import {
	akEditorTableCellOnStickyHeaderZIndex,
	akEditorUnitZIndex,
	akRichMediaResizeZIndex,
} from '@atlaskit/editor-shared-styles/constants';

import {
	loweredNativeStickyHeaderZIndex,
	nativeStickyHeaderZIndex,
	resizeHandlerZIndex,
	stickyRowZIndex,
	tableContentZIndexOffset,
	tableDangerOverlayZIndex,
} from './consts';

type TableZIndexes = {
	aboveHeader: number;
	belowHeader: number;
	dangerOverlay: number;
	header: number;
	headerButton: number;
	mask: number;
	mediaResizeHandle: number;
	resizeHandle: number;
};

// Keep table content below its sticky masks and header, and the entire table chrome
// below block controls (100) and Object Sidebar controls (300).
export const getTableZIndexes = (): TableZIndexes => ({
	header: loweredNativeStickyHeaderZIndex,
	aboveHeader: loweredNativeStickyHeaderZIndex + akEditorUnitZIndex,
	belowHeader: loweredNativeStickyHeaderZIndex - akEditorUnitZIndex,
	headerButton:
		loweredNativeStickyHeaderZIndex +
		(akEditorTableCellOnStickyHeaderZIndex - nativeStickyHeaderZIndex),
	mask: stickyRowZIndex - tableContentZIndexOffset,
	resizeHandle: resizeHandlerZIndex - tableContentZIndexOffset,
	dangerOverlay: tableDangerOverlayZIndex - tableContentZIndexOffset,
	mediaResizeHandle: akRichMediaResizeZIndex - tableContentZIndexOffset,
});
