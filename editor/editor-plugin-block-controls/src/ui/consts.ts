import { akEditorUnitZIndex, akRichMediaResizeZIndex } from '@atlaskit/editor-shared-styles';

export const DRAG_HANDLE_HEIGHT = 24;
export const DRAG_HANDLE_WIDTH = 12;
export const DRAG_HANDLE_BORDER_RADIUS = 4;
export const DRAG_HANDLE_ZINDEX = akRichMediaResizeZIndex + akEditorUnitZIndex; //place above legacy resizer

export const DRAG_HANDLE_DIVIDER_TOP_ADJUSTMENT = 4 + 2; // 4px for the divider vertical padding and 2px for the divider height

const nodeTypeExcludeList = ['embedCard', 'mediaSingle', 'table'];

export const dragHandleGap = (nodeType: string) => {
	if (nodeTypeExcludeList.includes(nodeType)) {
		return 12;
	}

	return 8;
};

export const topPositionAdjustment = (nodeType: string) => {
	switch (nodeType) {
		case 'rule':
			return -DRAG_HANDLE_DIVIDER_TOP_ADJUSTMENT;
		case 'table':
			return DRAG_HANDLE_HEIGHT;
		default:
			return 0;
	}
};
