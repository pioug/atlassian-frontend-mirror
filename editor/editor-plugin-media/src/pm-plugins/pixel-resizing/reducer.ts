type mediaPixelResizingState = {
	isPixelEditorOpen: boolean;
};

type OpenPixelEditor = {
	type: 'openPixelEditor';
};

type ClosePixelEditor = {
	type: 'closePixelEditor';
};

type MediaPixelResizingAction = OpenPixelEditor | ClosePixelEditor;

export default (
	state: mediaPixelResizingState,
	action: MediaPixelResizingAction,
): mediaPixelResizingState => {
	switch (action.type) {
		case 'openPixelEditor': {
			return {
				...state,
				isPixelEditorOpen: true,
			};
		}
		case 'closePixelEditor': {
			return {
				...state,
				isPixelEditorOpen: false,
			};
		}
		default:
			return state;
	}
};
