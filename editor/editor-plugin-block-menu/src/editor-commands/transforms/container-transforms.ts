import type { TransformContext } from '@atlaskit/editor-common/transforms';
import type { Mark, Node as PMNode, NodeType, Schema } from '@atlaskit/editor-prosemirror/model';
import { Fragment, Slice } from '@atlaskit/editor-prosemirror/model';
import { findChildrenByType } from '@atlaskit/editor-prosemirror/utils';

import { getInlineNodeTextContent } from './inline-node-transforms';
import type { TransformFunction } from './types';
import {
	isBlockNodeType,
	isListNodeType,
	isContainerNodeType,
	isBlockNodeForExtraction,
	convertNodeToInlineContent,
	getContentSupportChecker,
	convertCodeBlockContentToParagraphs,
	filterMarksForTargetNodeType,
	getMarksWithBreakout,
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
	let marks: readonly Mark[] = [];
	if (sourceNode.type === schema.nodes.codeBlock) {
		const paragraphNodes = convertCodeBlockContentToParagraphs(sourceNode, schema);
		transformedContent = Fragment.fromArray(paragraphNodes);
		marks = getMarksWithBreakout(sourceNode, targetNodeType);
	}

	if (targetNodeType === schema.nodes.blockquote) {
		transformedContent = convertInvalidNodeToValidNodeType(
			transformedContent,
			schema.nodes.heading,
			schema.nodes.paragraph,
			true,
		);
	}

	// Preserve marks that are allowed in the target node type
	// e.g. blocks (heading/ paragraph) with alignment need to remove alignment
	// as panel/ blockQuote/ expands does not support alignment
	if (sourceNode.type === schema.nodes.paragraph || sourceNode.type === schema.nodes.heading) {
		transformedContent = filterMarksForTargetNodeType(transformedContent, targetNodeType);
	}

	const newNode = targetNodeType.createAndFill(targetAttrs, transformedContent, marks);

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
		// special case container to codeblock
		if (targetNodeType.name === 'codeBlock') {
			return transformBetweenContainerTypes({
				tr,
				sourceNode,
				sourcePos,
				targetNodeType,
				targetAttrs,
			});
		}
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
		sourceChildren = convertCodeBlockContentToParagraphs(sourceNode, schema);
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
		const marks = getMarksWithBreakout(sourceNode, targetNodeType);
		transformedContent = [codeBlock.createChecked({}, schema.text(codeBlockContent), marks)];
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

	// Special handling for codeBlock target
	if (targetNodeType.name === 'codeBlock') {
		const contentSplits = splitContentForCodeBlock(
			sourceNode,
			targetNodeType,
			targetAttrs,
			tr.doc.type.schema,
		);

		if (contentSplits.length === 0) {
			const { schema } = tr.doc.type;
			const marks = getMarksWithBreakout(sourceNode, targetNodeType);
			const codeBlock = schema.nodes.codeBlock.create(targetAttrs, null, marks);
			return tr.replaceWith(sourcePos, sourcePos + sourceNode.nodeSize, codeBlock);
		}

		return applySplitsToTransaction(tr, sourcePos, sourceNode.nodeSize, contentSplits);
	}

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

	return applySplitsToTransaction(tr, sourcePos, sourceNode.nodeSize, contentSplits);
};

/**
 * Apply content splits to transaction - shared utility for replacing and inserting splits
 */
const applySplitsToTransaction = (
	tr: TransformContext['tr'],
	sourcePos: number,
	sourceNodeSize: number,
	contentSplits: PMNode[],
) => {
	let insertPos = sourcePos;
	contentSplits.forEach((splitNode: PMNode, index: number) => {
		if (index === 0) {
			// Replace the original node with the first split
			tr.replaceWith(sourcePos, sourcePos + sourceNodeSize, splitNode);
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
 * Split content for codeBlock transformation, creating codeBlocks for text content
 * and preserving unsupported blocks (like tables) separately
 */
const splitContentForCodeBlock = (
	sourceNode: PMNode,
	targetNodeType: NodeType,
	targetAttrs: Record<string, unknown> | undefined,
	schema: Schema,
): PMNode[] => {
	const splits: PMNode[] = [];
	const children = sourceNode.content.content;
	let currentTextContent: string[] = [];
	const invalidContent: PMNode[] = [];
	// Handle expand title - add as first text if source is expand with title
	if (sourceNode.type.name === 'expand' && sourceNode.attrs?.title) {
		currentTextContent.push(sourceNode.attrs.title);
	}

	const flushCurrentCodeBlock = () => {
		if (currentTextContent.length > 0) {
			const codeText = currentTextContent.join('\n');
			const marks = getMarksWithBreakout(sourceNode, targetNodeType);
			const codeBlockNode = targetNodeType.create(targetAttrs, schema.text(codeText), marks);
			splits.push(codeBlockNode);
			currentTextContent = [];
		}
	};

	const isCodeBlockCompatible = (node: PMNode): boolean => {
		// Only text blocks (paragraph, heading) can be converted to codeBlock text
		return node.isTextblock || node.type.name === 'codeBlock';
	};

	children.forEach((childNode) => {
		if (isCodeBlockCompatible(childNode)) {
			// Extract text content from compatible nodes
			if (childNode.type.name === 'codeBlock') {
				// If it's already a codeBlock, extract its text
				currentTextContent.push(childNode.textContent);
			} else if (childNode.isTextblock) {
				// Extract text from text blocks (paragraphs, headings, etc.)
				const text = getInlineNodeTextContent(Fragment.from(childNode)).inlineTextContent;
				if (text.trim()) {
					currentTextContent.push(text);
				}
			}
		} else if (isBlockNodeForExtraction(childNode)) {
			// Unsupported block node (table, etc.) - flush current codeBlock, add block, continue
			flushCurrentCodeBlock();
			splits.push(childNode);
		} else if (isListNodeType(childNode.type)) {
			const isTaskList = childNode.type.name === 'taskList';
			const listItemType = isTaskList
				? childNode.type.schema.nodes.taskItem
				: childNode.type.schema.nodes.listItem;

			const listItems = findChildrenByType(childNode, listItemType);
			listItems.forEach((listItem) => {
				const content = isTaskList ? Fragment.from(listItem.node) : listItem.node.content;

				const inlineContent = getInlineNodeTextContent(content);

				if (inlineContent.inlineTextContent.trim()) {
					currentTextContent.push(inlineContent.inlineTextContent);
				}
				if (inlineContent.invalidContent.length > 0) {
					invalidContent.push(...inlineContent.invalidContent);
				}
			});
		} else {
			// Other unsupported content - try to extract text if possible
			const text = childNode.textContent;
			if (text && text.trim()) {
				currentTextContent.push(text);
			}
		}
	});

	// Flush any remaining text content as a codeBlock
	flushCurrentCodeBlock();

	return [...splits, ...invalidContent];
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
			const marks = getMarksWithBreakout(sourceNode, targetNodeType);
			const containerNode = targetNodeType.create(
				targetAttrs,
				Fragment.fromArray(currentContainerContent),
				marks,
			);
			splits.push(containerNode);
			currentContainerContent = [];
		}
	};

	children.forEach((childNode) => {
		if (isContentSupported(childNode)) {
			// Supported content - add to current container
			currentContainerContent.push(childNode);
		} else if (childNode.type.name === targetNodeType.name) {
			// Same type of container merge contents
			childNode.content.forEach((child) => {
				currentContainerContent.push(child);
			});
		} else if (childNode.isBlock) {
			// Unsupported block node - flush current container, add block, continue
			flushCurrentContainer();
			splits.push(childNode);
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
