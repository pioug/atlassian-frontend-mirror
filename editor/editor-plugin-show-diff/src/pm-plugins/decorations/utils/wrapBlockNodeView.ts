import type { IntlShape } from 'react-intl-next';

import { convertToInlineCss } from '@atlaskit/editor-common/lazy-node-view';
import { trackChangesMessages } from '@atlaskit/editor-common/messages';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { token } from '@atlaskit/tokens';

import type { ColorScheme } from '../../../showDiffPluginType';
import {
	deletedBlockOutline,
	deletedBlockOutlineRounded,
	deletedContentStyle,
	deletedContentStyleActive,
	deletedContentStyleNew,
	deletedContentStyleNewActive,
	deletedStyleQuoteNodeWithLozenge,
} from '../colorSchemes/standard';
import {
	deletedTraditionalBlockOutline,
	deletedTraditionalBlockOutlineRounded,
	deletedTraditionalContentStyle,
	deletedTraditionalStyleQuoteNode,
} from '../colorSchemes/traditional';

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

const getDeletedContentStyle = (colorScheme?: ColorScheme, isActive: boolean = false): string => {
	if (colorScheme === 'traditional') {
		return deletedTraditionalContentStyle;
	}
	if (isActive) {
		return expValEquals('platform_editor_enghealth_a11y_jan_fixes', 'isEnabled', true)
			? deletedContentStyleNewActive
			: deletedContentStyleActive;
	}
	return expValEquals('platform_editor_enghealth_a11y_jan_fixes', 'isEnabled', true)
		? deletedContentStyleNew
		: deletedContentStyle;
};

const getDeletedStyleNode = (nodeName: string, colorScheme?: ColorScheme) => {
	const isTraditional = colorScheme === 'traditional';

	switch (nodeName) {
		case 'blockquote':
			return isTraditional ? deletedTraditionalStyleQuoteNode : deletedStyleQuoteNodeWithLozenge;
		case 'expand':
		case 'decisionList':
			return isTraditional ? deletedTraditionalBlockOutline : deletedBlockOutline;
		case 'panel':
		case 'codeBlock':
			return isTraditional ? deletedTraditionalBlockOutlineRounded : deletedBlockOutlineRounded;
		default:
			return undefined;
	}
};

const shouldShowRemovedLozenge = (nodeName: string): boolean => {
	switch (nodeName) {
		case 'expand':
		case 'codeBlock':
		case 'mediaSingle':
		case 'panel':
		case 'decisionList':
			return true;
		case 'embedCard':
		case 'blockquote':
			return true;
		default:
			return false;
	}
};

const shouldAddShowDiffDeletedNodeClass = (nodeName: string): boolean => {
	switch (nodeName) {
		case 'mediaSingle':
		case 'embedCard':
			return true;
		case 'blockquote':
			return true;
		default:
			return false;
	}
};

/**
 * Checks if a node should apply deleted styles directly without wrapper
 * to preserve natural block-level margins
 */
const shouldApplyStylesDirectly = (nodeName: string): boolean => {
	return nodeName === 'heading';
};

/**
 * Creates a "Removed" lozenge to be displayed at the top right corner of deleted block nodes
 */
const createRemovedLozenge = (intl: IntlShape): HTMLElement => {
	const container = document.createElement('span');

	const containerStyle = convertToInlineCss({
		position: 'absolute',
		top: token('space.075'),
		right: token('space.075'),
		zIndex: 2,
		pointerEvents: 'none',
		display: 'flex',
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
const createBlockNodeWrapper = () => {
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
 * Applies styles directly to an HTML element by merging with existing styles
 */
const applyStylesToElement = ({
	element,
	targetNode,
	colorScheme,
}: {
	colorScheme?: ColorScheme;
	element: HTMLElement;
	targetNode: PMNode;
}): void => {
	const currentStyle = element.getAttribute('style') || '';
	const deletedContentStyle = getDeletedContentStyle(colorScheme);
	const nodeSpecificStyle = getDeletedStyleNode(targetNode.type.name, colorScheme) || '';

	element.setAttribute('style', `${currentStyle}${deletedContentStyle}${nodeSpecificStyle}`);
};

/**
 * Creates a content wrapper with deleted styles for a block node
 */
const createBlockNodeContentWrapper = ({
	nodeView,
	targetNode,
	colorScheme,
}: {
	colorScheme?: ColorScheme;
	nodeView: Node;
	targetNode: PMNode;
}): HTMLElement => {
	const contentWrapper = document.createElement('div');
	const nodeStyle = getDeletedStyleNode(targetNode.type.name, colorScheme);
	contentWrapper.setAttribute('style', `${getDeletedContentStyle(colorScheme)}${nodeStyle || ''}`);
	contentWrapper.append(nodeView);
	return contentWrapper;
};

/**
 * Handles embedCard node rendering with lozenge attached to the rich-media-item container.
 * Since embedCard content loads asynchronously, we use a MutationObserver
 * to wait for the rich-media-item to appear before attaching the lozenge.
 * @returns true if embedCard was handled
 */
const handleEmbedCardWithLozenge = ({
	dom,
	nodeView,
	targetNode,
	lozenge,
	colorScheme,
}: {
	colorScheme?: ColorScheme;
	dom: HTMLElement;
	lozenge: HTMLElement;
	nodeView: Node;
	targetNode: PMNode;
}): boolean => {
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
			colorScheme === 'traditional'
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
const handleMediaSingleWithLozenge = ({
	dom,
	nodeView,
	targetNode,
	lozenge,
	colorScheme,
}: {
	colorScheme?: ColorScheme;
	dom: HTMLElement;
	lozenge: HTMLElement;
	nodeView: Node;
	targetNode: PMNode;
}): boolean => {
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
			colorScheme === 'traditional'
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
const wrapBlockNode = ({
	dom,
	nodeView,
	targetNode,
	colorScheme,
	intl,
}: {
	colorScheme?: ColorScheme;
	dom: HTMLElement;
	intl: IntlShape;
	nodeView: Node;
	targetNode: PMNode;
}): void => {
	const blockWrapper = createBlockNodeWrapper();

	if (shouldShowRemovedLozenge(targetNode.type.name)) {
		const lozenge = createRemovedLozenge(intl);

		if (handleEmbedCardWithLozenge({ dom, nodeView, targetNode, lozenge, colorScheme })) {
			return;
		}

		if (handleMediaSingleWithLozenge({ dom, nodeView, targetNode, lozenge, colorScheme })) {
			return;
		}

		blockWrapper.append(lozenge);
	}

	const contentWrapper = createBlockNodeContentWrapper({ nodeView, targetNode, colorScheme });
	blockWrapper.append(contentWrapper);

	if (nodeView instanceof HTMLElement && shouldAddShowDiffDeletedNodeClass(targetNode.type.name)) {
		const showDiffDeletedNodeClass =
			colorScheme === 'traditional'
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
export const wrapBlockNodeView = ({
	dom,
	nodeView,
	targetNode,
	colorScheme,
	intl,
}: {
	colorScheme?: ColorScheme;
	dom: HTMLElement;
	intl: IntlShape;
	nodeView: Node;
	targetNode: PMNode;
}): void => {
	if (shouldApplyStylesDirectly(targetNode.type.name) && nodeView instanceof HTMLElement) {
		// Apply deleted styles directly to preserve natural block-level margins
		applyStylesToElement({ element: nodeView, targetNode, colorScheme });
		dom.append(nodeView);
	} else {
		// Use wrapper approach for other block nodes
		wrapBlockNode({ dom, nodeView, targetNode, colorScheme, intl });
	}
};
