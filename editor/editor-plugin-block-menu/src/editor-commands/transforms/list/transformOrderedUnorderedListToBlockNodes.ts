import type { TransformContext } from '@atlaskit/editor-common/transforms';
import { Fragment, Slice } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { findChildrenByType } from '@atlaskit/editor-prosemirror/utils';

export const transformOrderedUnorderedListToBlockNodes = (
	context: TransformContext,
): Transaction | null => {
	const { tr, targetNodeType, targetAttrs, sourceNode, sourcePos } = context;
	const { selection } = tr;
	const schema = selection.$from.doc.type.schema;
	// find all paragraph nodes inside the list node
	const paragraphs = findChildrenByType(sourceNode, schema.nodes.paragraph);
	const paragraphNodes = paragraphs.map((paragraph) => paragraph.node);
	let targetNodes = paragraphNodes;

	// Convert paragraphs to headings if target is heading
	if (targetNodeType === schema.nodes.heading && targetAttrs) {
		const targetHeadingLevel = targetAttrs.level;
		targetNodes = paragraphNodes.map((paragraphNode) =>
			schema.nodes.heading.createChecked({ level: targetHeadingLevel }, paragraphNode.content),
		);
	}

	// Convert paragraphs to code block if target is code block
	if (targetNodeType === schema.nodes.codeBlock) {
		// convert the paragraphNodes to one code block
		const listItemsResult = findChildrenByType(sourceNode, schema.nodes.listItem);
		const listItems = listItemsResult.map((item) => item.node);
		const listItemFragments = listItems.map((listItem) => listItem.content);
		const codeBlockContent = listItemFragments
			.map((fragment) => fragment.textBetween(0, fragment.size, '\n'))
			.join('\n');
		targetNodes = [schema.nodes.codeBlock.createChecked({}, schema.text(codeBlockContent))];
	}

	const fragment = Fragment.fromArray(targetNodes);
	const slice = new Slice(fragment, 0, 0);
	const rangeStart = sourcePos !== null ? sourcePos : selection.from;
	tr.replaceRange(rangeStart, rangeStart + sourceNode.nodeSize, slice);

	return tr;
};
