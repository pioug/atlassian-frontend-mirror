import type { Node as PMNode, NodeType, Schema } from '@atlaskit/editor-prosemirror/model';
import { Fragment, Slice } from '@atlaskit/editor-prosemirror/model';

import type { TransformContext, TransformFunction } from './types';
import {
	isBlockNodeType,
	isListNodeType,
	isContainerNodeType,
	isBlockNodeForExtraction,
	convertNodeToInlineContent,
	getContentSupportChecker,
} from './utils';

const convertInvalidNodeToValidNodeType = (
	sourceContent: Fragment,
	sourceNodeType: NodeType,
	validNodeType: NodeType,
	withMarks?: boolean,
) => {
	const validTransformedContent: PMNode[] = [];
	// Headings are not valid inside headings so convert heading nodes to paragraphs
	sourceContent.forEach((node) => {
		if (sourceNodeType === node.type) {
			validTransformedContent.push(
				validNodeType.createChecked(node.attrs, node.content, withMarks ? node.marks : undefined),
			);
		} else {
			validTransformedContent.push(node);
		}
	});
	return Fragment.from(validTransformedContent);
};

/**
 * Transform selection to container type
 */
export const transformToContainer = ({
	tr,
	sourceNode,
	targetNodeType,
	targetAttrs,
}: TransformContext) => {
	const selection = tr.selection;
	const schema = tr.doc.type.schema;
	const content = selection.content().content;
	let transformedContent = content;

	if (sourceNode.type === schema.nodes.codeBlock) {
		transformedContent = convertInvalidNodeToValidNodeType(
			transformedContent,
			schema.nodes.codeBlock,
			schema.nodes.paragraph,
		);
	}

	if (targetNodeType === schema.nodes.blockquote) {
		transformedContent = convertInvalidNodeToValidNodeType(
			transformedContent,
			schema.nodes.heading,
			schema.nodes.paragraph,
			true,
		);
	}

	const newNode = targetNodeType.createAndFill(targetAttrs, transformedContent);

	if (!newNode) {
		return null;
	}

	tr.replaceRangeWith(selection.from, selection.to, newNode);

	return tr;
};

/**
 * Transform container nodes (panel, expand, blockquote)
 */
export const transformContainerNode: TransformFunction = ({
	tr,
	sourceNode,
	sourcePos,
	targetNodeType,
	targetAttrs,
}: TransformContext) => {
	if (sourcePos === null) {
		return null;
	}

	// Transform container to block type - unwrap and convert content
	if (isBlockNodeType(targetNodeType)) {
		return unwrapAndConvertToBlockType({ tr, sourceNode, sourcePos, targetNodeType, targetAttrs });
	}

	// Transform container to list type
	if (isListNodeType(targetNodeType)) {
		return unwrapAndConvertToList({ tr, sourceNode, sourcePos, targetNodeType, targetAttrs });
	}

	// Transform between container types
	if (isContainerNodeType(targetNodeType)) {
		return transformBetweenContainerTypes({
			tr,
			sourceNode,
			sourcePos,
			targetNodeType,
			targetAttrs,
		});
	}

	return null;
};

/**
 * Unwrap container node and convert content to block type
 */
export const unwrapAndConvertToBlockType = (context: TransformContext) => {
	const { tr, targetNodeType, targetAttrs, sourceNode, sourcePos } = context;
	const { selection } = tr;
	const schema = selection.$from.doc.type.schema;
	const { paragraph, heading, codeBlock, expand } = schema.nodes;
	const rangeStart = sourcePos !== null ? sourcePos : selection.from;
	let sourceChildren: PMNode[] = [...sourceNode.children];
	let transformedContent: PMNode[] = [];

	// If the container is expand, we need to extract the title and convert it to a paragraph
	// and add it to the beginning of the content
	if (sourceNode.type === expand) {
		const title = sourceNode.attrs?.title;
		if (title) {
			const titleContent = schema.text(title);
			sourceChildren.unshift(paragraph.createChecked({}, titleContent));
		}
	}

	// if the container is a code block, convert text content to multiple paragraphs
	if (sourceNode.type === codeBlock) {
		const codeText = sourceNode.textContent;
		const lines = codeText.split('\n');
		const paragraphNodes = lines.map((line) =>
			paragraph.create(null, line ? schema.text(line) : null),
		);
		sourceChildren = paragraphNodes;
	}

	// if target node is a paragraph, just do unwrap
	if (targetNodeType === paragraph) {
		transformedContent = sourceChildren;
	}

	// if target node is a headings, do unwrap and convert to heading
	if (targetNodeType === heading && targetAttrs) {
		const targetHeadingLevel = targetAttrs.level;
		sourceChildren.forEach((node, index) => {
			if (node.isTextblock) {
				const headingNode = heading.create({ level: targetHeadingLevel }, node.content);
				sourceChildren[index] = headingNode;
			}
		});
		transformedContent = sourceChildren;
	}

	// if target node is code block, do unwrap and convert to code block
	if (targetNodeType === codeBlock) {
		const codeBlockContent = sourceChildren
			.map((node) => node.content.textBetween(0, node.content.size, '\n'))
			.join('\n');
		transformedContent = [codeBlock.createChecked({}, schema.text(codeBlockContent))];
	}

	const slice = new Slice(Fragment.fromArray(transformedContent), 0, 0);
	tr.replaceRange(rangeStart, rangeStart + sourceNode.nodeSize, slice);
	return tr;
};

/**
 * Unwrap container node and convert content to list
 */
export const unwrapAndConvertToList = ({
	tr,
	sourceNode,
	sourcePos,
	targetNodeType,
	targetAttrs,
}: TransformContext) => {
	const { schema } = tr.doc.type;
	const { listItem, paragraph, taskList, taskItem, heading } = schema.nodes;

	const isTargetTaskList = targetNodeType === taskList;
	const createListItemFromInline = (content: PMNode | Fragment) => {
		return isTargetTaskList
			? taskItem.create(null, content)
			: listItem.create(null, paragraph.create(null, content));
	};

	const getInlineContent = (textblock: PMNode): PMNode[] => {
		const inlineContent: PMNode[] = [];
		textblock.forEach((inline) => {
			inlineContent.push(inline);
		});
		return inlineContent;
	};

	const resultContent: PMNode[] = [];
	let currentListItems: PMNode[] = [];

	const targetListItemType = isTargetTaskList ? taskItem : listItem;
	// Expand's title should become the first item of the list
	if (sourceNode.type.name === 'expand') {
		const title = sourceNode.attrs?.title;
		if (title) {
			const titleContent = schema.text(title);
			currentListItems.push(createListItemFromInline(titleContent));
		}
	}

	const createListAndAddToContent = () => {
		if (currentListItems.length) {
			const currentList = targetNodeType.create(
				targetAttrs || null,
				Fragment.from(currentListItems),
			);
			currentListItems = [];
			resultContent.push(currentList);
		}
	};

	if (sourceNode.type.name === 'codeBlock') {
		const codeText = sourceNode.textContent;
		if (codeText) {
			const lines = codeText.split('\n');
			// Remove empty lines
			const nonEmptyLines = lines.filter((line) => line.trim().length > 0);

			nonEmptyLines.forEach((line) => {
				const lineText = schema.text(line);
				currentListItems.push(createListItemFromInline(lineText));
			});
		}
	} else {
		sourceNode.forEach((child) => {
			if (targetListItemType.validContent(Fragment.from(child))) {
				currentListItems.push(targetListItemType.create(null, child));
			} else if (heading === child.type || (isTargetTaskList && paragraph === child.type)) {
				const inline = Fragment.from(getInlineContent(child));
				currentListItems.push(createListItemFromInline(inline));
			} else {
				// Create list and add list first
				createListAndAddToContent();
				// Then add content that can't be converted into listItem
				resultContent.push(child);
			}
		});
	}

	if (!resultContent.length && !currentListItems.length) {
		return null;
	}

	createListAndAddToContent();

	return tr.replaceWith(sourcePos, sourcePos + sourceNode.nodeSize, Fragment.from(resultContent));
};

export const transformBetweenContainerTypes = (context: TransformContext) => {
	const { tr, sourceNode, sourcePos, targetNodeType, targetAttrs } = context;

	// Get content validation for target container type
	const isContentSupported = getContentSupportChecker(targetNodeType);

	// Process content and collect splits
	const contentSplits = splitContentAroundUnsupportedBlocks(
		sourceNode,
		isContentSupported,
		targetNodeType,
		targetAttrs,
		tr.doc.type.schema,
	);

	// Replace the original node with the first split
	let insertPos = sourcePos;
	contentSplits.forEach((splitNode: PMNode, index: number) => {
		if (index === 0) {
			// Replace the original node with the first split
			tr.replaceWith(sourcePos, sourcePos + sourceNode.nodeSize, splitNode);
			insertPos = sourcePos + splitNode.nodeSize;
		} else {
			// Insert additional splits after
			tr.insert(insertPos, splitNode);
			insertPos += splitNode.nodeSize;
		}
	});

	return tr;
};

/**
 * Split content around unsupported block nodes, creating separate containers
 * for content before and after each unsupported block
 */
const splitContentAroundUnsupportedBlocks = (
	sourceNode: PMNode,
	isContentSupported: (node: PMNode) => boolean,
	targetNodeType: NodeType,
	targetAttrs: Record<string, unknown> | undefined,
	schema: Schema,
): PMNode[] => {
	const splits: PMNode[] = [];
	const children = sourceNode.content.content;
	let currentContainerContent: PMNode[] = [];

	// Handle expand title - add as first paragraph if source is expand with title
	if (sourceNode.type.name === 'expand' && sourceNode.attrs?.title) {
		const titleParagraph = schema.nodes.paragraph.create({}, schema.text(sourceNode.attrs.title));
		currentContainerContent.push(titleParagraph);
	}

	const flushCurrentContainer = () => {
		if (currentContainerContent.length > 0) {
			const containerNode = targetNodeType.create(
				targetAttrs,
				Fragment.fromArray(currentContainerContent),
			);
			splits.push(containerNode);
			currentContainerContent = [];
		}
	};

	children.forEach((childNode) => {
		if (isContentSupported(childNode)) {
			// Supported content - add to current container
			currentContainerContent.push(childNode);
		} else if (isBlockNodeForExtraction(childNode)) {
			// Unsupported block node - flush current container, add block, continue
			flushCurrentContainer();
			splits.push(childNode);
		} else if (childNode.type.name === targetNodeType.name) {
			// Same type of container merge contents
			childNode.content.forEach((child) => {
				currentContainerContent.push(child);
			});
		} else {
			// Unsupported inline content - convert to paragraph and add to container
			const inlineContent = convertNodeToInlineContent(childNode, schema);
			if (inlineContent.length > 0) {
				const paragraph = schema.nodes.paragraph.create({}, Fragment.fromArray(inlineContent));
				currentContainerContent.push(paragraph);
			}
		}
	});

	// Flush any remaining container content
	flushCurrentContainer();

	return splits;
};
