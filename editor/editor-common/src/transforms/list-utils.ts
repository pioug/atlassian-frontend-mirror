import type { NodeType } from '@atlaskit/editor-prosemirror/model';

import { getSupportedListTypes } from './getSupportedListTypes';

export const getSupportedListTypesSet = (nodes: Record<string, NodeType>): Set<NodeType> => {
	return new Set(getSupportedListTypes(nodes));
};
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { isBulletOrOrderedList } from './isBulletOrOrderedList';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { isTaskList } from './isTaskList';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { getSupportedListTypes } from './getSupportedListTypes';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { convertBlockToInlineContent } from './convertBlockToInlineContent';
