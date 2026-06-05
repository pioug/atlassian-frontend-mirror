import type { NodeType } from '@atlaskit/editor-prosemirror/model';

export const isTaskList = (nodeType: NodeType): boolean => {
	return nodeType.name === 'taskList';
};
