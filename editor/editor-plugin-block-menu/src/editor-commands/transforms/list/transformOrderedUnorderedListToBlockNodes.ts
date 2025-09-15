import type { TransformContext } from '@atlaskit/editor-common/transforms';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { Fragment, Slice } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { findChildrenByType } from '@atlaskit/editor-prosemirror/utils';

import { getInlineNodeTextContent } from '../inline-node-transforms';
import { getContentSupportChecker, isListNode } from '../utils';

export const transformOrderedUnorderedListToBlockNodes = (
	context: TransformContext,
): Transaction | null => {
	const { tr, targetNodeType, targetAttrs, sourceNode, sourcePos } = context;
	const { selection } = tr;
	const schema = selection.$from.doc.type.schema;
	const targetNodes: Array<PMNode> = [];
	// find all list items inside the list node
	const listItems = findChildrenByType(sourceNode, schema.nodes.listItem);
	let textContent: string[] = [];

	const flushTextContent = () => {
		if (targetNodeType !== schema.nodes.codeBlock) {
			return;
		}
		if (textContent.length > 0) {
			const inlineText = textContent.join('\n');
			targetNodes.push(
				schema.nodes.codeBlock.createChecked(
					{},
					inlineText !== '' ? schema.text(inlineText) : null,
				),
			);
			textContent = [];
		}
	};

	listItems.forEach((listItem) => {
		// Convert paragraphs to headings if target is heading
		const content = listItem.node.content.content;

		content.forEach((node) => {
			const isValid = getContentSupportChecker(targetNodeType)(node);
			if (isListNode(node)) {
				// Skip nested lists as it will return listItems that we will deal with separately
				return;
			}

			// Deal with the case where targetNode and node are both codeBlocks, then append text content
			if (targetNodeType === schema.nodes.codeBlock && node.type === schema.nodes.codeBlock) {
				const inlineContent = node.textContent;
				textContent = [...textContent, inlineContent];
				return;
			}

			// If the node is not valid for the target container,
			// flush any existing text content if target is codeBlock
			// and extract the node without any conversion
			if (!isValid && !node.isTextblock) {
				flushTextContent();
				targetNodes.push(node);
				return;
			}

			// If the target is codeBlock, accumulate text content
			if (targetNodeType === schema.nodes.codeBlock) {
				const inlineContent = getInlineNodeTextContent(Fragment.from(node)).inlineTextContent;
				textContent = [...textContent, inlineContent];
				return;
			}

			// Convert codeblocks to block nodes
			if (node.type === schema.nodes.codeBlock) {
				const textContent = node.textContent.split('\n');
				const attributes =
					targetNodeType === schema.nodes.heading ? { level: targetAttrs?.level ?? 1 } : null;
				textContent.forEach((textLine) => {
					targetNodes.push(
						targetNodeType.createChecked(attributes, textLine ? schema.text(textLine) : null),
					);
				});
				return;
			}

			if (targetNodeType === schema.nodes.heading && targetAttrs) {
				const targetHeadingLevel = targetAttrs.level;
				targetNodes.push(
					schema.nodes.heading.createChecked({ level: targetHeadingLevel }, node.content),
				);
				return;
			}
			targetNodes.push(node);
		});
	});

	flushTextContent();
	const fragment = Fragment.fromArray(targetNodes);
	const slice = new Slice(fragment, 0, 0);
	const rangeStart = sourcePos !== null ? sourcePos : selection.from;
	tr.replaceRange(rangeStart, rangeStart + sourceNode.nodeSize, slice);

	return tr;
};
