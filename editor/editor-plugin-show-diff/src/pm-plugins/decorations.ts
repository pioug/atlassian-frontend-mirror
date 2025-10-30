import type { Change } from 'prosemirror-changeset';
import type { IntlShape } from 'react-intl-next';

import { convertToInlineCss } from '@atlaskit/editor-common/lazy-node-view';
import { trackChangesMessages } from '@atlaskit/editor-common/messages';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { Decoration } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

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
		case 'embedCard':
			return convertToInlineCss({
				'--diff-decoration-marker-color':
					colourScheme === 'traditional'
						? token('color.border.accent.green')
						: token('color.border.accent.purple'),
			});
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

const getDeletedStyleNode = (nodeName: string) => {
	switch (nodeName) {
		case 'blockquote':
			return deletedStyleQuoteNode;
		case 'expand':
		case 'decisionList':
			return deletedBlockOutline;
		case 'panel':
		case 'codeBlock':
			return deletedBlockOutlineRounded;
		default:
			return undefined;
	}
};

const shouldShowRemovedLozenge = (nodeName: string) => {
	switch (nodeName) {
		case 'expand':
		case 'codeBlock':
		case 'mediaSingle':
		case 'panel':
		case 'decisionList':
			return true;
		default:
			return false;
	}
};

const shouldFitContentWidth = (nodeName: string) => {
	switch (nodeName) {
		case 'mediaSingle':
		case 'embedCard':
		case 'blockCard':
			return true;
		default:
			return false;
	}
};

const shouldAddShowDiffDeletedNodeClass = (nodeName: string) => {
	switch (nodeName) {
		case 'mediaSingle':
		case 'embedCard':
			return true;
		default:
			return false;
	}
};

/**
 * Checks if a node should apply deleted styles directly without wrapper
 * to preserve natural block-level margins
 */
const shouldApplyDeletedStylesDirectly = (nodeName: string): boolean => {
	return nodeName === 'blockquote' || nodeName === 'heading';
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

const deletedStyleQuoteNode = convertToInlineCss({
	borderLeft: `2px solid ${token('color.border.accent.gray')}`,
});

const deletedBlockOutline = convertToInlineCss({
	boxShadow: `0 0 0 1px ${token('color.border.accent.gray')}`,
	borderRadius: token('radius.small'),
});

const deletedBlockOutlineRounded = convertToInlineCss({
	boxShadow: `0 0 0 1px ${token('color.border.accent.gray')}`,
	borderRadius: `calc(${token('radius.xsmall')} + 1px)`,
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
		},
		{},
	);

interface DeletedContentDecorationProps {
	change: Change;
	colourScheme?: 'standard' | 'traditional';
	doc: PMNode;
	intl: IntlShape;
	newDoc: PMNode;
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

const lozengeStyle = convertToInlineCss({
	display: 'inline-flex',
	boxSizing: 'border-box',
	position: 'static',
	blockSize: 'min-content',
	borderRadius: token('radius.small'),
	overflow: 'hidden',
	paddingInlineStart: token('space.050'),
	paddingInlineEnd: token('space.050'),
	backgroundColor: token('color.background.accent.gray.subtler'),
	font: token('font.body.small'),
	fontWeight: token('font.weight.bold'),
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
	color: token('color.text.warning.inverse'),
});

const getDeletedContentStyleUnbounded = (colourScheme?: 'standard' | 'traditional') =>
	colourScheme === 'traditional'
		? deletedTraditionalContentStyleUnbounded
		: deletedContentStyleUnbounded;

const getDeletedContentStyle = (colourScheme?: 'standard' | 'traditional') =>
	colourScheme === 'traditional' ? deletedTraditionalContentStyle : deletedContentStyle;

/**
 * Creates a "Removed" lozenge to be displayed at the top right corner of deleted block nodes
 */
const createRemovedLozenge = (intl: IntlShape, nodeName?: string): HTMLElement => {
	const container = document.createElement('span');

	let borderTopRightRadius: string | undefined;
	let borderTopLeftRadius: string | undefined;
	if (['expand', 'decisionList'].includes(nodeName || '')) {
		borderTopRightRadius = token('radius.small');
	} else if (['panel', 'codeBlock'].includes(nodeName || '')) {
		borderTopRightRadius = `calc(${token('radius.xsmall')} + 1px)`;
	} else if (nodeName === 'mediaSingle') {
		borderTopLeftRadius = token('radius.small');
	}

	const containerStyle = convertToInlineCss({
		position: 'absolute',
		top: nodeName === 'mediaSingle' ? token('space.300') : token('space.0'),
		right: nodeName === 'mediaSingle' ? undefined : token('space.0'),
		left: nodeName === 'mediaSingle' ? token('space.0') : undefined,
		zIndex: 2,
		pointerEvents: 'none',
		display: 'flex',
		overflow: 'hidden',
		borderTopRightRadius,
		borderTopLeftRadius,
	});

	container.setAttribute('style', containerStyle);
	container.setAttribute('data-testid', 'show-diff-removed-lozenge');

	// Create vanilla HTML lozenge element with Atlaskit Lozenge styling (visual refresh)
	const lozengeElement = document.createElement('span');

	lozengeElement.setAttribute('style', lozengeStyle);
	lozengeElement.textContent = intl.formatMessage(trackChangesMessages.removed).toUpperCase();

	container.appendChild(lozengeElement);

	return container;
};

/**
 * Wraps a block node in a container with relative positioning to support absolute positioned lozenge
 */
const createBlockNodeWrapper = (nodeName: string) => {
	const wrapper = document.createElement('div');

	const fitContent = shouldFitContentWidth(nodeName);
	const baseStyle = convertToInlineCss({
		position: 'relative',
		display: fitContent ? 'inline-block' : 'block',
		width: fitContent ? 'fit-content' : undefined,
		height: fitContent ? 'fit-content' : undefined,
		opacity: 1,
	});

	wrapper.setAttribute('style', baseStyle);

	return wrapper;
};

/**
 * Wraps content with deleted styling without opacity (for use when content is a direct child of dom)
 */
const createDeletedStyleWrapperWithoutOpacity = (colourScheme?: 'standard' | 'traditional') => {
	const wrapper = document.createElement('span');
	wrapper.setAttribute('style', getDeletedContentStyle(colourScheme));
	return wrapper;
};

/**
 * Applies deleted styles directly to an HTML element by merging with existing styles
 */
const applyDeletedStylesToElement = (
	element: HTMLElement,
	targetNode: PMNode,
	colourScheme: 'standard' | 'traditional' | undefined,
): void => {
	const currentStyle = element.getAttribute('style') || '';
	const deletedContentStyle = getDeletedContentStyle(colourScheme);
	const nodeSpecificStyle = getDeletedStyleNode(targetNode.type.name) || '';

	element.setAttribute('style', `${currentStyle}${deletedContentStyle}${nodeSpecificStyle}`);
};

/**
 * Appends a block node with wrapper, lozenge, and appropriate styling
 */
const appendBlockNodeWithWrapper = (
	dom: HTMLElement,
	nodeView: Node,
	targetNode: PMNode,
	colourScheme: 'standard' | 'traditional' | undefined,
	intl: IntlShape,
) => {
	const blockWrapper = createBlockNodeWrapper(targetNode.type.name);

	if (shouldShowRemovedLozenge(targetNode.type.name)) {
		const lozenge = createRemovedLozenge(intl, targetNode.type.name);
		blockWrapper.append(lozenge);
	}

	// Wrap the nodeView in a content wrapper that has the opacity style AND the box-shadow
	// This keeps the lozenge at full opacity while the content AND border are faded
	const contentWrapper = document.createElement('div');
	const nodeStyle = getDeletedStyleNode(targetNode.type.name);
	contentWrapper.setAttribute('style', `${getDeletedContentStyle(colourScheme)}${nodeStyle || ''}`);
	contentWrapper.append(nodeView);

	blockWrapper.append(contentWrapper);

	if (nodeView instanceof HTMLElement) {
		if (shouldAddShowDiffDeletedNodeClass(targetNode.type.name)) {
			nodeView.classList.add('show-diff-deleted-node');
		}
	}

	dom.append(blockWrapper);
};

/**
 * Handles all block node rendering with appropriate deleted styling.
 * For blockquote and heading nodes, applies styles directly to preserve natural margins.
 * For other block nodes, uses wrapper approach with optional lozenge.
 */
const handleBlockNodeView = (
	dom: HTMLElement,
	nodeView: Node,
	targetNode: PMNode,
	colourScheme: 'standard' | 'traditional' | undefined,
	intl: IntlShape,
): void => {
	if (shouldApplyDeletedStylesDirectly(targetNode.type.name) && nodeView instanceof HTMLElement) {
		// Apply deleted styles directly to preserve natural block-level margins
		applyDeletedStylesToElement(nodeView, targetNode, colourScheme);
		dom.append(nodeView);
	} else {
		// Use wrapper approach for other block nodes
		appendBlockNodeWithWrapper(dom, nodeView, targetNode, colourScheme, intl);
	}
};

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
	if (!fg('platform_editor_ai_aifc_patch_beta_2')) {
		dom.setAttribute('style', getDeletedContentStyle(colourScheme));
	}

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
							if (fg('platform_editor_ai_aifc_patch_beta_2')) {
								const wrapper = createWrapperWithStrikethrough();
								wrapper.append(serializedChild);
								dom.append(wrapper);
							} else {
								dom.append(serializedChild);
							}
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
			} else if (fg('platform_editor_ai_aifc_patch_beta_2')) {
				// Handle all block nodes with unified function
				handleBlockNodeView(dom, nodeView, targetNode, colourScheme, intl);
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
				if (fg('platform_editor_ai_aifc_patch_beta_2')) {
					const wrapper = createDeletedStyleWrapperWithoutOpacity(colourScheme);
					wrapper.append(fallbackNode);
					dom.append(wrapper);
				} else {
					dom.append(fallbackNode);
				}
			}
		}
	});

	dom.setAttribute('data-testid', 'show-diff-deleted-decoration');

	// Widget decoration used for deletions as the content is not in the document
	// and we want to display the deleted content with a style.
	const safeInsertPos = findSafeInsertPos(newDoc, change.fromB, slice);
	return Decoration.widget(safeInsertPos, dom);
};
