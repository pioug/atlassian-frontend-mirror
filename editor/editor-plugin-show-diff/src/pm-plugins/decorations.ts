import type { Change } from 'prosemirror-changeset';
import type { IntlShape } from 'react-intl-next';

import { convertToInlineCss } from '@atlaskit/editor-common/lazy-node-view';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { Decoration } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import {
	createDeletedStyleWrapperWithoutOpacity,
	handleBlockNodeView,
} from './deletedBlocksHandler';
import { handleDeletedRows } from './deletedRowsHandler';
import { findSafeInsertPos } from './findSafeInsertPos';
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
			return undefined;
		case 'extension':
		case 'embedCard':
		case 'listItem':
			return convertToInlineCss({
				'--diff-decoration-marker-color':
					colourScheme === 'traditional'
						? token('color.border.accent.green')
						: token('color.border.accent.purple'),
			});
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

export const getDeletedContentStyleUnbounded = (colourScheme?: 'standard' | 'traditional'): string =>
	colourScheme === 'traditional'
		? deletedTraditionalContentStyleUnbounded
		: deletedContentStyleUnbounded;

export const getDeletedContentStyle = (colourScheme?: 'standard' | 'traditional'): string =>
	colourScheme === 'traditional' ? deletedTraditionalContentStyle : deletedContentStyle;

const getNodeClass = (name: string) => {
	switch (name) {
		case 'extension':
			return 'show-diff-changed-decoration-node';
		default:
			return undefined;
	}
};

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
			class: getNodeClass(change.name),
		},
		{},
	);

interface DeletedContentDecorationProps {
	change: Pick<Change, 'fromA' | 'toA' | 'fromB' | 'deleted'>;
	colourScheme?: 'standard' | 'traditional';
	doc: PMNode;
	intl: IntlShape;
	newDoc: PMNode;
	nodeViewSerializer: NodeViewSerializer;
}

export const createDeletedContentDecoration = ({
	change,
	doc,
	nodeViewSerializer,
	colourScheme,
	newDoc,
	intl,
}: DeletedContentDecorationProps) => {
	const slice = doc.slice(change.fromA, change.toA);

	if (slice.content.content.length === 0) {
		return;
	}

	const isTableCellContent = slice.content.content.some(() =>
		slice.content.content.some((siblingNode) =>
			['tableHeader', 'tableCell'].includes(siblingNode.type.name),
		),
	);

	const isTableRowContent = slice.content.content.some(() =>
		slice.content.content.some((siblingNode) => ['tableRow'].includes(siblingNode.type.name)),
	);

	if (isTableCellContent) {
		return;
	}
	if (isTableRowContent) {
		if (!fg('platform_editor_ai_aifc_patch_ga')) {
			return;
		}

		const { decorations } = handleDeletedRows(
			[change],
			doc,
			newDoc,
			nodeViewSerializer,
			colourScheme,
		);
		return decorations;
	}

	const serializer = nodeViewSerializer;

	// For non-table content, use the existing span wrapper approach
	const dom = document.createElement('span');

	/*
	 * The thinking is we separate out the fragment we got from doc.slice
	 * and if it's the first or last content, we go in however many the sliced Open
	 * or sliced End depth is and match only the entire node.
	 */

	slice.content.forEach((node) => {
		// Create a wrapper for each node with strikethrough
		const createWrapperWithStrikethrough = () => {
			const wrapper = document.createElement('span');
			const baseStyle = convertToInlineCss({
				position: 'relative',
				width: 'fit-content',
			});
			wrapper.setAttribute('style', `${baseStyle}${getDeletedContentStyle(colourScheme)}`);

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
							const wrapper = createWrapperWithStrikethrough();
							wrapper.append(serializedChild);
							dom.append(wrapper);
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
				// Handle all block nodes with unified function
				handleBlockNodeView(dom, nodeView, targetNode, colourScheme, intl);
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
				const wrapper = createDeletedStyleWrapperWithoutOpacity(colourScheme);
				wrapper.append(fallbackNode);
				dom.append(wrapper);
			}
		}
	});

	dom.setAttribute('data-testid', 'show-diff-deleted-decoration');

	// Widget decoration used for deletions as the content is not in the document
	// and we want to display the deleted content with a style.
	const safeInsertPos = findSafeInsertPos(newDoc, change.fromB, slice);
	return [Decoration.widget(safeInsertPos, dom)];
};
