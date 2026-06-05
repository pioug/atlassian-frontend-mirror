import type { NodeType } from '@atlaskit/editor-prosemirror/model';

// List type utilities
export const isBulletOrOrderedList = (nodeType: NodeType): boolean => {
	return nodeType.name === 'bulletList' || nodeType.name === 'orderedList';
};
