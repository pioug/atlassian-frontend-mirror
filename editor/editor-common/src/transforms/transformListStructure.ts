import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';

import { isBulletOrOrderedList } from './isBulletOrOrderedList';
import { isTaskList } from './isTaskList';
import { transformListRecursively } from './list-transforms';
import type { TransformContext } from './list-types';
import { getSupportedListTypesSet } from './list-utils';

/**
 * Transform list structure between different list types
 */
export const transformListStructure = (context: TransformContext): Transaction => {
	const { tr, sourceNode, sourcePos, targetNodeType } = context;
	const nodes = tr.doc.type.schema.nodes;
	const unsupportedContent: PMNode[] = [];

	const onhandleUnsupportedContent = (content: PMNode) => {
		unsupportedContent.push(content);
	};

	try {
		const listNode = { node: sourceNode, pos: sourcePos };
		const { node: sourceList, pos: listPos } = listNode;
		// const { taskList, listItem, taskItem, paragraph } = nodes;

		const isSourceBulletOrOrdered = isBulletOrOrderedList(sourceList.type);
		const isTargetTask = isTaskList(targetNodeType);
		const isSourceTask = isTaskList(sourceList.type);
		const isTargetBulletOrOrdered = isBulletOrOrderedList(targetNodeType);

		const supportedListTypes = getSupportedListTypesSet(nodes);

		const newList = transformListRecursively(
			{
				isSourceBulletOrOrdered,
				isSourceTask,
				isTargetBulletOrOrdered,
				isTargetTask,
				listNode: sourceList,
				schema: tr.doc.type.schema,
				supportedListTypes,
				targetNodeType,
			},
			onhandleUnsupportedContent,
		);

		tr.replaceWith(listPos, listPos + sourceList.nodeSize, [newList, ...unsupportedContent]);
		return tr;
	} catch {
		return tr;
	}
};
