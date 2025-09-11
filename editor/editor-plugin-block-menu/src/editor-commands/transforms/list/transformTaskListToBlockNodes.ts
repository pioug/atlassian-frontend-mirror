import type { TransformContext } from '@atlaskit/editor-common/transforms';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { Fragment, Slice } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { findChildrenByType } from '@atlaskit/editor-prosemirror/utils';

export const transformTaskListToBlockNodes = (context: TransformContext): Transaction | null => {
	const { tr, targetNodeType, targetAttrs, sourceNode, sourcePos } = context;
	const { selection } = tr;
	const schema = selection.$from.doc.type.schema;
	const taskItemsResult = findChildrenByType(sourceNode, schema.nodes.taskItem);
	const taskItems = taskItemsResult.map((item) => item.node);
	const taskItemFragments = taskItems.map((taskItem) => taskItem.content);
	let targetNodes: PMNode[] = [];

	// Convert fragments to headings if target is heading
	if (targetNodeType === schema.nodes.heading && targetAttrs) {
		// convert the fragments to headings
		const targetHeadingLevel = targetAttrs.level;
		targetNodes = taskItemFragments.map((fragment) =>
			schema.nodes.heading.createChecked({ level: targetHeadingLevel }, fragment.content),
		);
	}

	// Convert fragments to paragraphs if target is paragraphs
	if (targetNodeType === schema.nodes.paragraph) {
		// convert the fragments to paragraphs
		targetNodes = taskItemFragments.map((fragment) =>
			schema.nodes.paragraph.createChecked({}, fragment.content),
		);
	}

	// Convert fragments to code block if target is code block
	if (targetNodeType === schema.nodes.codeBlock) {
		// convert the fragments to one code block
		const codeBlockContent = taskItemFragments
			.map((fragment) => fragment.textBetween(0, fragment.size, '\n'))
			.join('\n');
		targetNodes = [schema.nodes.codeBlock.createChecked({}, schema.text(codeBlockContent))];
	}

	// Replace the task list node with the new content in the transaction
	const slice = new Slice(Fragment.fromArray(targetNodes), 0, 0);
	const rangeStart = sourcePos !== null ? sourcePos : selection.from;
	tr.replaceRange(rangeStart, rangeStart + sourceNode.nodeSize, slice);

	return tr;
};
