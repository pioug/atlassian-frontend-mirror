import type { Slice } from '@atlaskit/editor-prosemirror/model';

export const hasTableNode = (slice: Slice | undefined): boolean => {
	if (!slice) {
		return false;
	}
	let found = false;
	slice.content.descendants((node) => {
		if (node.type.name === 'table') {
			found = true;
			return false;
		}
		return true;
	});
	return found;
};
