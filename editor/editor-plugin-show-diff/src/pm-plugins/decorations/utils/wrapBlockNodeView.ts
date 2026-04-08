import type { IntlShape } from 'react-intl-next';

import { convertToInlineCss } from '@atlaskit/editor-common/lazy-node-view';
import { trackChangesMessages } from '@atlaskit/editor-common/messages';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { token } from '@atlaskit/tokens';

import type { ColorScheme } from '../../../showDiffPluginType';
import {
	deletedBlockOutline,
	deletedBlockOutlineActive,
	deletedBlockOutlineRounded,
	deletedBlockOutlineRoundedActive,
	deletedContentStyle,
	deletedContentStyleActive,
	deletedContentStyleNew,
	deletedStyleQuoteNodeWithLozenge,
	deletedStyleQuoteNodeWithLozengeActive,
	editingStyle,
	editingStyleActive,
	editingStyleNode,
	addedCellOverlayStyle,
	deletedCellOverlayStyle,
} from '../colorSchemes/standard';
import {
	deletedTraditionalBlockOutline,
	deletedTraditionalBlockOutlineActive,
	deletedTraditionalBlockOutlineNew,
	deletedTraditionalBlockOutlineRounded,
	deletedTraditionalBlockOutlineRoundedActive,
	deletedTraditionalBlockOutlineRoundedNew,
	getDeletedTraditionalInlineStyle,
	deletedTraditionalStyleQuoteNode,
	deletedTraditionalStyleQuoteNodeActive,
	traditionalInsertStyle,
	traditionalInsertStyleActive,
	traditionalStyleNode,
	traditionalStyleNodeActive,
	traditionalStyleNodeNew,
	traditionalAddedCellOverlayStyle,
	traditionalAddedCellOverlayStyleNew,
	deletedTraditionalCellOverlayStyle,
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

const lozengeStyleActiveStandard = convertToInlineCss({
	display: 'inline-flex',
	boxSizing: 'border-box',
	position: 'static',
	blockSize: 'min-content',
	borderRadius: token('radius.small'),
	overflow: 'hidden',
	paddingInlineStart: token('space.050'),
	paddingInlineEnd: token('space.050'),
	backgroundColor: token('color.background.accent.red.subtler.pressed'),
	font: token('font.body.small'),
	fontWeight: token('font.weight.bold'),
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
	color: token('color.text.warning.inverse'),
});

const lozengeStyleActiveTraditional = convertToInlineCss({
	display: 'inline-flex',
	boxSizing: 'border-box',
	position: 'static',
	blockSize: 'min-content',
	borderRadius: token('radius.small'),
	overflow: 'hidden',
	paddingInlineStart: token('space.050'),
	paddingInlineEnd: token('space.050'),
	backgroundColor: token('color.background.accent.red.subtler.pressed'),
	font: token('font.body.small'),
	fontWeight: token('font.weight.bold'),
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
	color: token('color.text.warning.inverse'),
});

const getChangedContentStyle = (
	colorScheme?: ColorScheme,
	isActive: boolean = false,
	isInserted: boolean = false,
): string => {
	if (expValEquals('platform_editor_diff_plugin_extended', 'isEnabled', true) && isInserted) {
		if (colorScheme === 'traditional') {
			return isActive ? traditionalInsertStyleActive : traditionalInsertStyle;
		}
		return isActive ? editingStyleActive : editingStyle;
	}
	if (colorScheme === 'traditional') {
		return getDeletedTraditionalInlineStyle(isActive);
	}
	if (isActive) {
		return deletedContentStyleActive;
	}
	return expValEquals('platform_editor_enghealth_a11y_jan_fixes', 'isEnabled', true)
		? deletedContentStyleNew
		: deletedContentStyle;
};

const getChangedNodeStyle = (
	nodeName: string,
	colorScheme?: ColorScheme,
	isInserted: boolean = false,
	isActive: boolean = false,
) => {
	const isTraditional = colorScheme === 'traditional';

	if (expValEquals('platform_editor_diff_plugin_extended', 'isEnabled', true) && isInserted) {
		if (shouldApplyStylesDirectly(nodeName)) {
			return undefined;
		}
		if (isTraditional) {
			if (fg('platform_editor_show_diff_scroll_navigation')) {
				return isActive ? traditionalStyleNodeActive : traditionalStyleNodeNew;
			}
			return isActive ? traditionalStyleNodeActive : traditionalStyleNode;
		}
		return editingStyleNode;
	}

	switch (nodeName) {
		case 'blockquote':
			if (isTraditional) {
				return isActive ? deletedTraditionalStyleQuoteNodeActive : deletedTraditionalStyleQuoteNode;
			}
			return isActive ? deletedStyleQuoteNodeWithLozengeActive : deletedStyleQuoteNodeWithLozenge;
		case 'expand':
		case 'decisionList':
			if (isTraditional) {
				return isActive
					? deletedTraditionalBlockOutlineActive
					: fg('platform_editor_show_diff_scroll_navigation')
						? deletedTraditionalBlockOutlineNew
						: deletedTraditionalBlockOutline;
			}
			return isActive ? deletedBlockOutlineActive : deletedBlockOutline;
		case 'panel':
		case 'codeBlock':
			if (isTraditional) {
				return isActive
					? deletedTraditionalBlockOutlineRoundedActive
					: fg('platform_editor_show_diff_scroll_navigation')
						? deletedTraditionalBlockOutlineRoundedNew
						: deletedTraditionalBlockOutlineRounded;
			}
			return isActive ? deletedBlockOutlineRoundedActive : deletedBlockOutlineRounded;
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
		case 'blockquote':
			return true;
		default:
			return false;
	}
};

/** Scroll-nav “new” ring (4px red subtlest) for media/embed; styled in editor-core smartCardStyles. */
const maybeAddDeletedOutlineNewClass = ({
	nodeView,
	targetNode,
	colorScheme,
	isActive = false,
}: {
	colorScheme?: ColorScheme;
	isActive?: boolean;
	nodeView: HTMLElement;
	targetNode: PMNode;
}) => {
	const name = targetNode.type.name;
	if (name !== 'mediaSingle' && name !== 'embedCard') {
		return;
	}
	if (
		colorScheme === 'traditional' &&
		!isActive &&
		fg('platform_editor_show_diff_scroll_navigation')
	) {
		nodeView.classList.add('show-diff-deleted-outline-new');
	}
};

/**
 * Checks if a node should apply deleted styles directly without wrapper
 * to preserve natural block-level margins
 */
const shouldApplyStylesDirectly = (nodeName: string): boolean => {
	return nodeName === 'heading';
};

const applyCellOverlayStyles = ({
	element,
	colorScheme,
	isInserted,
}: {
	colorScheme?: ColorScheme;
	element: HTMLElement;
	isInserted: boolean;
}) => {
	element.querySelectorAll('td, th').forEach((cell) => {
		const overlay = document.createElement('span');
		const overlayStyle =
			colorScheme === 'traditional'
				? isInserted
					? fg('platform_editor_show_diff_scroll_navigation')
						? traditionalAddedCellOverlayStyleNew
						: traditionalAddedCellOverlayStyle
					: deletedTraditionalCellOverlayStyle
				: isInserted
					? addedCellOverlayStyle
					: deletedCellOverlayStyle;
		overlay.setAttribute('style', overlayStyle);
		cell.appendChild(overlay);
	});
};

/**
 * Creates a "Removed" lozenge to be displayed at the top right corner of deleted block nodes
 */
const createRemovedLozenge = (
	intl: IntlShape,
	isActive: boolean = false,
	colorScheme?: ColorScheme,
): HTMLElement => {
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

	const lozengeInnerStyle =
		isActive && colorScheme === 'traditional'
			? lozengeStyleActiveTraditional
			: isActive
				? lozengeStyleActiveStandard
				: lozengeStyle;
	lozengeElement.setAttribute('style', lozengeInnerStyle);
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
	isActive,
	isInserted,
}: {
	colorScheme?: ColorScheme;
	element: HTMLElement;
	isActive: boolean;
	isInserted: boolean;
	targetNode: PMNode;
}): void => {
	const currentStyle = element.getAttribute('style') || '';
	const contentStyle = getChangedContentStyle(colorScheme, isActive, isInserted);
	const nodeSpecificStyle =
		getChangedNodeStyle(targetNode.type.name, colorScheme, isInserted, isActive) || '';

	element.setAttribute('style', `${currentStyle}${contentStyle}${nodeSpecificStyle}`);
};

/**
 * Creates a content wrapper with deleted styles for a block node
 */
const createBlockNodeContentWrapper = ({
	nodeView,
	targetNode,
	colorScheme,
	isActive,
	isInserted,
}: {
	colorScheme?: ColorScheme;
	isActive: boolean;
	isInserted: boolean;
	nodeView: Node;
	targetNode: PMNode;
}): HTMLElement => {
	const contentWrapper = document.createElement('div');
	const nodeStyle = getChangedNodeStyle(targetNode.type.name, colorScheme, isInserted, isActive);
	contentWrapper.setAttribute(
		'style',
		`${getChangedContentStyle(colorScheme, isActive, isInserted)}${nodeStyle || ''}`,
	);
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
	isActive = false,
}: {
	colorScheme?: ColorScheme;
	dom: HTMLElement;
	isActive?: boolean;
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
		if (isActive) {
			nodeView.classList.add('show-diff-deleted-active');
		}
		maybeAddDeletedOutlineNewClass({ nodeView, targetNode, colorScheme, isActive });
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
	isActive = false,
}: {
	colorScheme?: ColorScheme;
	dom: HTMLElement;
	isActive?: boolean;
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
		if (isActive) {
			nodeView.classList.add('show-diff-deleted-active');
		}
		maybeAddDeletedOutlineNewClass({ nodeView, targetNode, colorScheme, isActive });
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
	isActive = false,
	isInserted = false,
}: {
	colorScheme?: ColorScheme;
	dom: HTMLElement;
	intl: IntlShape;
	isActive?: boolean;
	isInserted: boolean;
	nodeView: Node;
	targetNode: PMNode;
}): void => {
	const blockWrapper = createBlockNodeWrapper();

	if (
		shouldShowRemovedLozenge(targetNode.type.name) &&
		(!expValEquals('platform_editor_diff_plugin_extended', 'isEnabled', true) || !isInserted)
	) {
		const lozenge = createRemovedLozenge(intl, isActive, colorScheme);

		if (handleEmbedCardWithLozenge({ dom, nodeView, targetNode, lozenge, colorScheme, isActive })) {
			return;
		}

		if (
			handleMediaSingleWithLozenge({ dom, nodeView, targetNode, lozenge, colorScheme, isActive })
		) {
			return;
		}

		blockWrapper.append(lozenge);
	}

	const contentWrapper = createBlockNodeContentWrapper({
		nodeView,
		targetNode,
		colorScheme,
		isActive,
		isInserted,
	});
	blockWrapper.append(contentWrapper);

	if (nodeView instanceof HTMLElement && shouldAddShowDiffDeletedNodeClass(targetNode.type.name)) {
		const showDiffDeletedNodeClass =
			colorScheme === 'traditional'
				? 'show-diff-deleted-node-traditional'
				: 'show-diff-deleted-node';
		nodeView.classList.add(showDiffDeletedNodeClass);
		if (isActive) {
			nodeView.classList.add('show-diff-deleted-active');
		}
		maybeAddDeletedOutlineNewClass({ nodeView, targetNode, colorScheme, isActive });
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
	isActive = false,
	isInserted = false,
}: {
	colorScheme?: ColorScheme;
	dom: HTMLElement;
	intl: IntlShape;
	isActive?: boolean;
	isInserted: boolean;
	nodeView: Node;
	targetNode: PMNode;
}): void => {
	if (shouldApplyStylesDirectly(targetNode.type.name) && nodeView instanceof HTMLElement) {
		// Apply deleted styles directly to preserve natural block-level margins
		applyStylesToElement({ element: nodeView, targetNode, colorScheme, isActive, isInserted });
		dom.append(nodeView);
	} else if (
		targetNode.type.name === 'table' &&
		nodeView instanceof HTMLElement &&
		expValEquals('platform_editor_diff_plugin_extended', 'isEnabled', true)
	) {
		applyCellOverlayStyles({ element: nodeView, colorScheme, isInserted });
		dom.append(nodeView);
	} else {
		// Use wrapper approach for other block nodes
		wrapBlockNode({ dom, nodeView, targetNode, colorScheme, intl, isActive, isInserted });
	}
};
