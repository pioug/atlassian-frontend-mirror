import {
	akEditorTableCellOnStickyHeaderZIndex,
	akEditorUnitZIndex,
	akRichMediaResizeZIndex,
} from '@atlaskit/editor-shared-styles';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import {
	aboveNativeStickyHeaderZIndex,
	belowNativeStickyHeaderZIndex,
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
export const getTableZIndexes = (): TableZIndexes => {
	if (isExperimentEnabled('platform_editor_sticky_headers_zindex')) {
		return {
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
		};
	}

	return {
		header: nativeStickyHeaderZIndex,
		aboveHeader: aboveNativeStickyHeaderZIndex,
		belowHeader: belowNativeStickyHeaderZIndex,
		headerButton: akEditorTableCellOnStickyHeaderZIndex,
		mask: stickyRowZIndex,
		resizeHandle: resizeHandlerZIndex,
		dangerOverlay: tableDangerOverlayZIndex,
		mediaResizeHandle: akRichMediaResizeZIndex,
	};
};
