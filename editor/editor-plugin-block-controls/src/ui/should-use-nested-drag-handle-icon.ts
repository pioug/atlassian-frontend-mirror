// Nested layout columns use the full block handle; other non-top-level nodes use the nested icon.
export const shouldUseNestedDragHandleIcon = (
	isTopLevelNode: boolean,
	isLayoutColumn: boolean,
): boolean => {
	if (isTopLevelNode) {
		return false;
	}

	if (isLayoutColumn) {
		return false;
	}

	return true;
};
