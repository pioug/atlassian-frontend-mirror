import {
	akEditorTableCellOnStickyHeaderZIndex,
	akEditorUnitZIndex,
} from '@atlaskit/editor-shared-styles';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import {
	aboveNativeStickyHeaderZIndex,
	belowNativeStickyHeaderZIndex,
	nativeStickyHeaderZIndex,
	resizeHandlerZIndex,
	stickyRowZIndex,
} from './consts';

type TableZIndexes = {
	aboveHeader: number;
	belowHeader: number;
	dangerOverlay: number;
	header: number;
	headerButton: number;
	mask: number;
	resizeHandle: number;
};

// Keep table content below its sticky masks and header, and the entire table chrome
// below block controls (100) and Object Sidebar controls (300).
export const getTableZIndexes = (): TableZIndexes => {
	if (isExperimentEnabled('platform_editor_sticky_headers_zindex')) {
		const headerZIndex = 90;
		const tableLayerGap = 10;

		return {
			header: headerZIndex,
			aboveHeader: headerZIndex + akEditorUnitZIndex,
			belowHeader: headerZIndex - akEditorUnitZIndex,
			headerButton: headerZIndex + akEditorUnitZIndex * 2,
			mask: headerZIndex - akEditorUnitZIndex * 2,
			resizeHandle: headerZIndex - tableLayerGap,
			dangerOverlay: headerZIndex - tableLayerGap * 2,
		};
	}

	return {
		header: nativeStickyHeaderZIndex,
		aboveHeader: aboveNativeStickyHeaderZIndex,
		belowHeader: belowNativeStickyHeaderZIndex,
		headerButton: akEditorTableCellOnStickyHeaderZIndex,
		mask: stickyRowZIndex,
		resizeHandle: resizeHandlerZIndex,
		dangerOverlay: 100,
	};
};
