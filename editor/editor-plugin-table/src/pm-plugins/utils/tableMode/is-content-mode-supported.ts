type ContentModePluginOptions = {
	allowColumnResizing: boolean;
	allowTableResizing: boolean;
	isFullPageEditor: boolean;
};

export const isContentModeSupported = ({
	allowColumnResizing,
	allowTableResizing,
	isFullPageEditor,
}: ContentModePluginOptions): boolean => {
	return allowColumnResizing && allowTableResizing && isFullPageEditor;
};
