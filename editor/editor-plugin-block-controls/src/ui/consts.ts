import { akEditorUnitZIndex, akRichMediaResizeZIndex } from '@atlaskit/editor-shared-styles';

export const DRAG_HANDLE_HEIGHT = 24;
export const DRAG_HANDLE_WIDTH = 12;
export const DRAG_HANDLE_BORDER_RADIUS = 4;
export const DRAG_HANDLE_ZINDEX = akRichMediaResizeZIndex + akEditorUnitZIndex; //place above legacy resizer

const nodeTypeExcludeList = ['embedCard', 'mediaSingle', 'table'];

export const dragHandleGap = (nodeType: string) => {
	if (nodeTypeExcludeList.includes(nodeType)) {
		return 12;
	}

	return 8;
};
