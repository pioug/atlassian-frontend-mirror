import type { IntlShape } from 'react-intl-next';

import { convertToInlineCss } from '@atlaskit/editor-common/lazy-node-view';
import { trackChangesMessages } from '@atlaskit/editor-common/messages';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { getDeletedContentStyle } from './decorations';

export const deletedStyleQuoteNode: string = convertToInlineCss({
	borderLeft: `2px solid ${token('color.border.accent.gray')}`,
});

export const deletedStyleQuoteNodeWithLozenge: string = convertToInlineCss({
	marginTop: token('space.150'),
	paddingTop: token('space.025'),
	paddingBottom: token('space.025'),
	paddingLeft: token('space.025'),
	boxShadow: `0 0 0 1px ${token('color.border.accent.gray')}`,
	borderRadius: token('radius.small'),
});

export const deletedTraditionalStyleQuoteNode: string = convertToInlineCss({
	marginTop: token('space.150'),
	paddingTop: token('space.025'),
	paddingBottom: token('space.025'),
	paddingLeft: token('space.025'),
	boxShadow: `0 0 0 1px ${token('color.border.accent.red')}`,
	borderRadius: token('radius.small'),
});

export const deletedBlockOutline: string = convertToInlineCss({
	boxShadow: `0 0 0 1px ${token('color.border.accent.gray')}`,
	borderRadius: token('radius.small'),
});

export const deletedTraditionalBlockOutline: string = convertToInlineCss({
	boxShadow: `0 0 0 1px ${token('color.border.accent.red')}`,
	borderRadius: token('radius.small'),
});

export const deletedBlockOutlineRounded: string = convertToInlineCss({
	boxShadow: `0 0 0 1px ${token('color.border.accent.gray')}`,
	borderRadius: `calc(${token('radius.xsmall')} + 1px)`,
});

export const deletedTraditionalBlockOutlineRounded: string = convertToInlineCss({
	boxShadow: `0 0 0 1px ${token('color.border.accent.red')}`,
	borderRadius: `calc(${token('radius.xsmall')} + 1px)`,
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

export const getDeletedStyleNode = (
	nodeName: string,
	colourScheme?: 'standard' | 'traditional',
) => {
	const isTraditional = colourScheme === 'traditional';

	switch (nodeName) {
		case 'blockquote':
			return fg('platform_editor_ai_aifc_patch_ga_blockers')
				? isTraditional
					? deletedTraditionalStyleQuoteNode
					: deletedStyleQuoteNodeWithLozenge
				: deletedStyleQuoteNode;
		case 'expand':
		case 'decisionList':
			return isTraditional && fg('platform_editor_ai_aifc_patch_ga_blockers')
				? deletedTraditionalBlockOutline
				: deletedBlockOutline;
		case 'panel':
		case 'codeBlock':
			return isTraditional && fg('platform_editor_ai_aifc_patch_ga_blockers')
				? deletedTraditionalBlockOutlineRounded
				: deletedBlockOutlineRounded;
		default:
			return undefined;
	}
};

export const shouldShowRemovedLozenge = (nodeName: string) => {
	switch (nodeName) {
		case 'expand':
		case 'codeBlock':
		case 'mediaSingle':
		case 'panel':
		case 'decisionList':
			return true;
		case 'embedCard':
		case 'blockquote':
			return fg('platform_editor_ai_aifc_patch_ga_blockers');
		default:
			return false;
	}
};

export const shouldAddShowDiffDeletedNodeClass = (nodeName: string) => {
	switch (nodeName) {
		case 'mediaSingle':
		case 'embedCard':
			return true;
		case 'blockquote':
			return fg('platform_editor_ai_aifc_patch_ga_blockers');
		default:
			return false;
	}
};

/**
 * Checks if a node should apply deleted styles directly without wrapper
 * to preserve natural block-level margins
 */
export const shouldApplyDeletedStylesDirectly = (nodeName: string): boolean => {
	return (
		nodeName === 'heading' ||
		(nodeName === 'blockquote' && !fg('platform_editor_ai_aifc_patch_ga_blockers'))
	);
};

/**
 * Creates a "Removed" lozenge to be displayed at the top right corner of deleted block nodes
 */
export const createRemovedLozenge = (intl: IntlShape, nodeName?: string): HTMLElement => {
	const container = document.createElement('span');

	let borderTopRightRadius: string | undefined;
	if (['expand', 'decisionList'].includes(nodeName || '')) {
		borderTopRightRadius = token('radius.small');
	} else if (['panel', 'codeBlock', 'mediaSingle'].includes(nodeName || '')) {
		borderTopRightRadius = `calc(${token('radius.xsmall')} + 1px)`;
	}

	const containerStyle = convertToInlineCss({
		position: 'absolute',
		top: fg('platform_editor_ai_aifc_patch_ga_blockers') ? token('space.075') : token('space.0'),
		right: fg('platform_editor_ai_aifc_patch_ga_blockers') ? token('space.075') : token('space.0'),
		zIndex: 2,
		pointerEvents: 'none',
		display: 'flex',
		...(!fg('platform_editor_ai_aifc_patch_ga_blockers')
			? { overflow: 'hidden', borderTopRightRadius }
			: {}),
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
export const createBlockNodeWrapper = () => {
	const wrapper = document.createElement('div');

	const baseStyle = convertToInlineCss({
		position: 'relative',
		display: 'block',
		opacity: 1,
	});

	wrapper.setAttribute('style', baseStyle);

	return wrapper;
};

/**
 * Wraps content with deleted styling without opacity (for use when content is a direct child of dom)
 */
export const createDeletedStyleWrapperWithoutOpacity = (
	colourScheme?: 'standard' | 'traditional',
) => {
	const wrapper = document.createElement('span');
	wrapper.setAttribute('style', getDeletedContentStyle(colourScheme));
	return wrapper;
};

/**
 * Applies deleted styles directly to an HTML element by merging with existing styles
 */
export const applyDeletedStylesToElement = (
	element: HTMLElement,
	targetNode: PMNode,
	colourScheme: 'standard' | 'traditional' | undefined,
): void => {
	const currentStyle = element.getAttribute('style') || '';
	const deletedContentStyle = getDeletedContentStyle(colourScheme);
	const nodeSpecificStyle = getDeletedStyleNode(targetNode.type.name, colourScheme) || '';

	element.setAttribute('style', `${currentStyle}${deletedContentStyle}${nodeSpecificStyle}`);
};

/**
 * Creates a content wrapper with deleted styles for a block node
 */
export const createBlockNodeContentWrapper = (
	nodeView: Node,
	targetNode: PMNode,
	colourScheme: 'standard' | 'traditional' | undefined,
): HTMLElement => {
	const contentWrapper = document.createElement('div');
	const nodeStyle = getDeletedStyleNode(targetNode.type.name, colourScheme);
	contentWrapper.setAttribute('style', `${getDeletedContentStyle(colourScheme)}${nodeStyle || ''}`);
	contentWrapper.append(nodeView);
	return contentWrapper;
};

/**
 * Handles embedCard node rendering with lozenge attached to the rich-media-item container.
 * Since embedCard content loads asynchronously, we use a MutationObserver
 * to wait for the rich-media-item to appear before attaching the lozenge.
 * @returns true if embedCard was handled
 */
export const handleEmbedCardWithLozenge = (
	dom: HTMLElement,
	nodeView: Node,
	targetNode: PMNode,
	lozenge: HTMLElement,
	colourScheme: 'standard' | 'traditional' | undefined,
): boolean => {
	if (targetNode.type.name !== 'embedCard' || !(nodeView instanceof HTMLElement)) {
		return false;
	}

	const richMediaItem = nodeView.querySelector('.rich-media-item');
	if (richMediaItem instanceof HTMLElement) {
		richMediaItem.appendChild(lozenge);
	} else {
		const observer = new MutationObserver((_, obs) => {
			const loadedRichMedia = nodeView.querySelector('.rich-media-item');
			if (loadedRichMedia instanceof HTMLElement) {
				loadedRichMedia.appendChild(lozenge);
				obs.disconnect();
			}
		});

		observer.observe(nodeView, { childList: true, subtree: true });
	}

	if (shouldAddShowDiffDeletedNodeClass(targetNode.type.name)) {
		const showDiffDeletedNodeClass =
			colourScheme === 'traditional'
				? 'show-diff-deleted-node-traditional'
				: 'show-diff-deleted-node';
		nodeView.classList.add(showDiffDeletedNodeClass);
	}

	dom.append(nodeView);
	return true;
};

/**
 * Handles special mediaSingle node rendering with lozenge on child media element
 * @returns true if mediaSingle was handled, false otherwise
 */
export const handleMediaSingleWithLozenge = (
	dom: HTMLElement,
	nodeView: Node,
	targetNode: PMNode,
	lozenge: HTMLElement,
	colourScheme: 'standard' | 'traditional' | undefined,
): boolean => {
	if (targetNode.type.name !== 'mediaSingle' || !(nodeView instanceof HTMLElement)) {
		return false;
	}

	const mediaNode = nodeView.querySelector('[data-prosemirror-node-name="media"]');

	if (!mediaNode || !(mediaNode instanceof HTMLElement)) {
		return false;
	}

	// Add relative positioning to media node to anchor lozenge
	const currentStyle = mediaNode.getAttribute('style') || '';
	const relativePositionStyle = convertToInlineCss({ position: 'relative' });
	mediaNode.setAttribute('style', `${currentStyle}${relativePositionStyle}`);
	mediaNode.append(lozenge);

	// Add deleted node class if needed
	if (shouldAddShowDiffDeletedNodeClass(targetNode.type.name)) {
		const showDiffDeletedNodeClass =
			colourScheme === 'traditional' && fg('platform_editor_ai_aifc_patch_ga_blockers')
				? 'show-diff-deleted-node-traditional'
				: 'show-diff-deleted-node';
		nodeView.classList.add(showDiffDeletedNodeClass);
	}

	dom.append(nodeView);
	return true;
};

/**
 * Appends a block node with wrapper, lozenge, and appropriate styling
 */
export const appendBlockNodeWithWrapper = (
	dom: HTMLElement,
	nodeView: Node,
	targetNode: PMNode,
	colourScheme: 'standard' | 'traditional' | undefined,
	intl: IntlShape,
): void => {
	const blockWrapper = createBlockNodeWrapper();

	if (shouldShowRemovedLozenge(targetNode.type.name)) {
		const lozenge = createRemovedLozenge(intl);

		if (
			handleEmbedCardWithLozenge(dom, nodeView, targetNode, lozenge, colourScheme) &&
			fg('platform_editor_ai_aifc_patch_ga_blockers')
		) {
			return;
		}

		if (handleMediaSingleWithLozenge(dom, nodeView, targetNode, lozenge, colourScheme)) {
			return;
		}

		blockWrapper.append(lozenge);
	}

	const contentWrapper = createBlockNodeContentWrapper(nodeView, targetNode, colourScheme);
	blockWrapper.append(contentWrapper);

	if (nodeView instanceof HTMLElement && shouldAddShowDiffDeletedNodeClass(targetNode.type.name)) {
		const showDiffDeletedNodeClass =
			colourScheme === 'traditional' && fg('platform_editor_ai_aifc_patch_ga_blockers')
				? 'show-diff-deleted-node-traditional'
				: 'show-diff-deleted-node';
		nodeView.classList.add(showDiffDeletedNodeClass);
	}

	dom.append(blockWrapper);
};

/**
 * Handles all block node rendering with appropriate deleted styling.
 * For heading nodes, applies styles directly to preserve natural margins.
 * For other block nodes, uses wrapper approach with optional lozenge.
 */
export const handleBlockNodeView = (
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
