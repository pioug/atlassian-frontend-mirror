export const DRAG_HANDLE_HEIGHT = 24;
export const DRAG_HANDLE_WIDTH = 12;
export const DRAG_HANDLE_BORDER_RADIUS = 4;

const nodeTypeExcludeList = ['embedCard', 'mediaSingle', 'table'];

export const dragHandleGap = (nodeType: string) => {
	if (nodeTypeExcludeList.includes(nodeType)) {
		return 12;
	}

	return 8;
};
