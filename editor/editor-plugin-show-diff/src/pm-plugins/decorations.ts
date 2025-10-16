import type { Change } from 'prosemirror-changeset';

import { convertToInlineCss } from '@atlaskit/editor-common/lazy-node-view';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { Decoration } from '@atlaskit/editor-prosemirror/view';
import { token } from '@atlaskit/tokens';

import type { NodeViewSerializer } from './NodeViewSerializer';

const editingStyle = convertToInlineCss({
	background: token('color.background.accent.purple.subtlest'),
	textDecoration: 'underline',
	textDecorationStyle: 'dotted',
	textDecorationThickness: token('space.025'),
	textDecorationColor: token('color.border.accent.purple'),
});

const traditionalInsertStyle = convertToInlineCss({
	background: token('color.background.accent.green.subtlest'),
	textDecoration: 'underline',
	textDecorationStyle: 'solid',
	textDecorationThickness: token('space.025'),
	textDecorationColor: token('color.border.accent.green'),
});

/**
 * Inline decoration used for insertions as the content already exists in the document
 *
 * @param change Changeset "change" containing information about the change content + range
 * @returns Prosemirror inline decoration
 */
export const createInlineChangedDecoration = (
	change: { fromB: number; toB: number },
	colourScheme?: 'standard' | 'traditional',
) =>
	Decoration.inline(
		change.fromB,
		change.toB,
		{
			style: colourScheme === 'traditional' ? traditionalInsertStyle : editingStyle,
			'data-testid': 'show-diff-changed-decoration',
		},
		{},
	);

const getEditorStyleNode = (nodeName: string, colourScheme?: 'standard' | 'traditional') => {
	switch (nodeName) {
		case 'blockquote':
			return colourScheme === 'traditional' ? traditionalStyleQuoteNode : editingStyleQuoteNode;
		case 'mediaSingle':
		case 'mediaGroup':
		case 'embedCard':
		case 'table':
		case 'tableRow':
		case 'tableCell':
		case 'tableHeader':
			return undefined; // Handle table separately to avoid border issues
		case 'paragraph':
		case 'heading':
		case 'hardBreak':
			return undefined; // Paragraph and heading nodes do not need special styling
		case 'decisionList':
		case 'taskList':
		case 'taskItem':
		case 'bulletList':
		case 'orderedList':
		case 'listItem':
			return undefined; // Lists do not need special styling
		case 'layoutSection':
			return undefined; // Layout nodes do not need special styling
		case 'rule':
			return colourScheme === 'traditional' ? traditionalStyleRuleNode : editingStyleRuleNode;
		case 'blockCard':
			return colourScheme === 'traditional'
				? traditionalStyleCardBlockNode
				: editingStyleCardBlockNode;
		default:
			return colourScheme === 'traditional' ? traditionalStyleNode : editingStyleNode;
	}
};

const editingStyleQuoteNode = convertToInlineCss({
	borderLeft: `2px solid ${token('color.border.accent.purple')}`,
});

const traditionalStyleQuoteNode = convertToInlineCss({
	borderLeft: `2px solid ${token('color.border.accent.green')}`,
});

const editingStyleRuleNode = convertToInlineCss({
	backgroundColor: token('color.border.accent.purple'),
});

const traditionalStyleRuleNode = convertToInlineCss({
	backgroundColor: token('color.border.accent.green'),
});

const editingStyleNode = convertToInlineCss({
	boxShadow: `0 0 0 1px ${token('color.border.accent.purple')}`,
	borderRadius: token('radius.small'),
});

const traditionalStyleNode = convertToInlineCss({
	boxShadow: `0 0 0 1px ${token('color.border.accent.green')}`,
	borderRadius: token('radius.small'),
});

const editingStyleCardBlockNode = convertToInlineCss({
	boxShadow: `0 0 0 1px ${token('color.border.accent.purple')}`,
	borderRadius: token('radius.medium'),
});

const traditionalStyleCardBlockNode = convertToInlineCss({
	boxShadow: `0 0 0 1px ${token('color.border.accent.green')}`,
	borderRadius: token('radius.medium'),
});
/**
 * Inline decoration used for insertions as the content already exists in the document
 *
 * @param change Changeset "change" containing information about the change content + range
 * @returns Prosemirror inline decoration
 */
export const createBlockChangedDecoration = (
	change: { from: number; name: string; to: number },
	colourScheme?: 'standard' | 'traditional',
) =>
	Decoration.node(
		change.from,
		change.to,
		{
			style: getEditorStyleNode(change.name, colourScheme),
			'data-testid': 'show-diff-changed-decoration-node',
			class: `show-diff-changed-decoration-node-${colourScheme || 'standard'}`,
		},
		{},
	);

interface DeletedContentDecorationProps {
	change: Change;
	colourScheme?: 'standard' | 'traditional';
	doc: PMNode;
	nodeViewSerializer: NodeViewSerializer;
}

const deletedContentStyle = convertToInlineCss({
	color: token('color.text.accent.gray'),
	textDecoration: 'line-through',
	position: 'relative',
	opacity: 0.6,
});

const deletedContentStyleUnbounded = convertToInlineCss({
	position: 'absolute',
	top: '50%',
	width: '100%',
	display: 'inline-block',
	borderTop: `1px solid ${token('color.text.accent.gray')}`,
	pointerEvents: 'none',
	zIndex: 1,
});

const deletedTraditionalContentStyle = convertToInlineCss({
	textDecorationColor: token('color.border.accent.red'),
	textDecoration: 'line-through',
	position: 'relative',
	opacity: 1,
});

const deletedTraditionalContentStyleUnbounded = convertToInlineCss({
	position: 'absolute',
	top: '50%',
	width: '100%',
	display: 'inline-block',
	borderTop: `1px solid ${token('color.border.accent.red')}`,
	pointerEvents: 'none',
	zIndex: 1,
});

const getDeletedContentStyleUnbounded = (colourScheme?: 'standard' | 'traditional') =>
	colourScheme === 'traditional'
		? deletedTraditionalContentStyleUnbounded
		: deletedContentStyleUnbounded;

const getDeletedContentStyle = (colourScheme?: 'standard' | 'traditional') =>
	colourScheme === 'traditional' ? deletedTraditionalContentStyle : deletedContentStyle;

export const createDeletedContentDecoration = ({
	change,
	doc,
	nodeViewSerializer,
	colourScheme,
}: DeletedContentDecorationProps) => {
	const slice = doc.slice(change.fromA, change.toA);

	if (slice.content.content.length === 0) {
		return;
	}

	const isTableContent = slice.content.content.some(() =>
		slice.content.content.some((siblingNode) =>
			['tableHeader', 'tableCell', 'tableRow'].includes(siblingNode.type.name),
		),
	);

	if (isTableContent) {
		return;
	}

	const serializer = nodeViewSerializer;

	// For non-table content, use the existing span wrapper approach
	const dom = document.createElement('span');
	dom.setAttribute('style', getDeletedContentStyle(colourScheme));

	/*
	 * The thinking is we separate out the fragment we got from doc.slice
	 * and if it's the first or last content, we go in however many the sliced Open
	 * or sliced End depth is and match only the entire node.
	 */

	slice.content.forEach((node) => {
		// Create a wrapper for each node with strikethrough
		const createWrapperWithStrikethrough = () => {
			const wrapper = document.createElement('span');
			wrapper.style.position = 'relative';
			wrapper.style.width = 'fit-content';

			const strikethrough = document.createElement('span');
			strikethrough.setAttribute('style', getDeletedContentStyleUnbounded(colourScheme));
			wrapper.append(strikethrough);

			return wrapper;
		};

		// Helper function to handle multiple child nodes
		const handleMultipleChildNodes = (node: PMNode): boolean => {
			if (node.content.childCount > 1 && node.type.inlineContent) {
				node.content.forEach((childNode) => {
					const childNodeView = serializer.tryCreateNodeView(childNode);
					if (childNodeView) {
						const lineBreak = document.createElement('br');
						targetNode = node;
						dom.append(lineBreak);
						const wrapper = createWrapperWithStrikethrough();
						wrapper.append(childNodeView);
						dom.append(wrapper);
					} else {
						// Fallback to serializing the individual child node
						const serializedChild = serializer.serializeNode(childNode);
						if (serializedChild) {
							dom.append(serializedChild);
						}
					}
				});
				return true; // Indicates we handled multiple children
			}
			return false; // Indicates single child, continue with normal logic
		};

		// Determine which node to use and how to serialize
		const isFirst = slice.content.firstChild === node;
		const isLast = slice.content.lastChild === node;
		const hasInlineContent = node.content.childCount > 0 && node.type.inlineContent === true;

		let targetNode: PMNode;
		let fallbackSerialization: () => Node | null;

		if ((isFirst || (isLast && slice.content.childCount > 2)) && hasInlineContent) {
			if (handleMultipleChildNodes(node)) {
				return;
			}
			targetNode = node;
			fallbackSerialization = () => serializer.serializeFragment(node.content);
		} else if (isLast && slice.content.childCount === 2) {
			if (handleMultipleChildNodes(node)) {
				return;
			}
			targetNode = node;

			fallbackSerialization = () => {
				if (node.type.name === 'text') {
					return document.createTextNode(node.text || '');
				}

				if (node.type.name === 'paragraph') {
					const lineBreak = document.createElement('br');
					dom.append(lineBreak);
					return serializer.serializeFragment(node.content);
				}

				return serializer.serializeFragment(node.content);
			};
		} else {
			if (handleMultipleChildNodes(node)) {
				return;
			}
			targetNode = node;
			fallbackSerialization = () => serializer.serializeNode(node);
		}

		// Try to create node view, fallback to serialization
		const nodeView = serializer.tryCreateNodeView(targetNode);

		if (nodeView) {
			if (targetNode.isInline) {
				const wrapper = createWrapperWithStrikethrough();
				wrapper.append(nodeView);
				dom.append(wrapper);
			} else {
				dom.append(nodeView);
			}
		} else if (
			nodeViewSerializer
				.getFilteredNodeViewBlocklist(['paragraph', 'tableRow'])
				.has(targetNode.type.name)
		) {
			// Skip the case where the node is a paragraph or table row that way it can still be rendered and delete the entire table
			return;
		} else {
			const fallbackNode = fallbackSerialization();
			if (fallbackNode) {
				dom.append(fallbackNode);
			}
		}
	});

	dom.setAttribute('data-testid', 'show-diff-deleted-decoration');

	// Widget decoration used for deletions as the content is not in the document
	// and we want to display the deleted content with a style.
	return Decoration.widget(change.fromB, dom, {});
};
