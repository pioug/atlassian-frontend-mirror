import type { IntlShape } from 'react-intl';

import { convertToInlineCss } from '@atlaskit/editor-common/lazy-node-view';
import { trackChangesMessages } from '@atlaskit/editor-common/messages';
import { getBaseNodeTypeName } from '@atlaskit/editor-common/utils/node-type-utils';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { token } from '@atlaskit/tokens';

import type { DiffType, RevealOptions } from '../../../showDiffPluginType';
import { isExtendedEnabled } from '../../isExtendedEnabled';
import type { ColorScheme } from '../colorSchemes/types';
import { getAtomicInlineChangedAttrs } from '../createInlineChangedDecoration';
import { applyRevealToElement } from '../revealStyles';
import { isInlineAttrChangeNodeName } from './getAttrChangeRanges';
import { applyTableCellEdgeAttrs } from './tableCellEdgeAttrs';
import {
	getChangedContentStyle,
	getChangedNodeStyle,
	getDeletedContentStyle,
	getDeletedContentStyleUnbounded,
	getInsertedContentStyle,
	hasRestingDeletedRing,
	isMultiContainerBlockNode,
	isTextLikeBlockNode,
	resolveCellOverlayStyle,
	resolveDeletedNodeCSSVariables,
	resolveNestedInsertedNodeStyle,
	resolveRemovedLozengeStyle,
} from './wrapBlockNodeViewStyles';

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
	// Only schemes with a resting ring get the class.
	if (hasRestingDeletedRing(colorScheme) && !isActive) {
		nodeView.classList.add('show-diff-deleted-outline-new');
	}
};

type DeletedNodeMarkupArgs = {
	colorScheme?: ColorScheme;
	isActive?: boolean;
	nodeView: HTMLElement;
	targetNode: PMNode;
};

/**
 * Pre-refactor markup for a deleted media/embed/blockquote nodeview: one class per scheme, and no
 * custom properties — the colours come from the matching per-scheme selectors in editor-core.
 *
 * Delete this together with those selectors at experiment cleanup (EDITOR-8281).
 */
const applyDeletedNodeMarkupLegacy = ({
	nodeView,
	targetNode,
	colorScheme,
	isActive = false,
}: DeletedNodeMarkupArgs): void => {
	nodeView.classList.add(
		colorScheme === 'traditional' ? 'show-diff-deleted-node-traditional' : 'show-diff-deleted-node',
	);
	if (isActive) {
		nodeView.classList.add('show-diff-deleted-active');
	}
	maybeAddDeletedOutlineNewClass({ nodeView, targetNode, colorScheme, isActive });
};

/**
 * Registry-driven markup: one scheme-agnostic class, plus the scheme's colours as custom properties,
 * so editor-core needs one selector per visual role instead of one per scheme.
 *
 * `show-diff-deleted-node-vars` *replaces* the legacy classes rather than joining them. Both sets of
 * selectors live in editor-core for the life of the experiment, and they have equal specificity, so
 * a shared base class would leave the winner up to source order.
 *
 * The `-vars` suffix names what the class means — this node carries its scheme colours as
 * `--diff-delete-*` custom properties — rather than when it arrived, so it still reads correctly
 * once the legacy classes are gone.
 */
const applyDeletedNodeMarkupNext = ({
	nodeView,
	targetNode,
	colorScheme,
	isActive = false,
}: DeletedNodeMarkupArgs): void => {
	nodeView.classList.add('show-diff-deleted-node-vars');
	if (isActive) {
		nodeView.classList.add('show-diff-deleted-active');
	}
	maybeAddDeletedOutlineNewClass({ nodeView, targetNode, colorScheme, isActive });

	const currentStyle = nodeView.getAttribute('style') || '';
	const separator = currentStyle && !currentStyle.trimEnd().endsWith(';') ? ';' : '';
	nodeView.setAttribute(
		'style',
		`${currentStyle}${separator}${resolveDeletedNodeCSSVariables(colorScheme)}`,
	);
};

/** Single gate for the deleted-node classes and custom properties. */
const applyDeletedNodeMarkup = (args: DeletedNodeMarkupArgs): void =>
	isExperimentEnabled('platform_editor_show_diff_color_scheme_refactor')
		? applyDeletedNodeMarkupNext(args)
		: applyDeletedNodeMarkupLegacy(args);

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
	const isRoundedTable = isExperimentEnabled('platform_editor_table_diff_rounded_corners');

	const overlayStyle = resolveCellOverlayStyle({ colorScheme, isInserted, isRoundedTable });

	element.querySelectorAll('td, th').forEach((cell) => {
		const overlay = document.createElement('span');
		overlay.setAttribute('style', overlayStyle);
		cell.appendChild(overlay);
	});
};

/**
 * Creates a "Removed" lozenge to be displayed at the top right corner of deleted block nodes
 */
export const createRemovedLozenge = (
	intl: IntlShape,
	isActive: boolean = false,
	colorScheme?: ColorScheme,
	inCell = false,
): HTMLElement => {
	const container = document.createElement('span');

	const containerStyle = convertToInlineCss({
		position: 'absolute',
		top: token('space.075'),
		right: token('space.075'),
		// Rounded table-cell overlays use z-index 2 and are appended after the cell content.
		// Keep the lozenge above them so the overlay cannot tint or obscure it.
		zIndex: 3,
		pointerEvents: 'none',
		display: 'flex',
	});

	// Create vanilla HTML lozenge element with Atlaskit Lozenge styling (visual refresh)
	const lozengeElement = document.createElement('span');

	// A column label sits over an already-grey deleted cell, so use the red Removed treatment.
	const lozengeInnerStyle = resolveRemovedLozengeStyle(colorScheme, inCell || isActive);
	lozengeElement.setAttribute('style', lozengeInnerStyle);
	lozengeElement.textContent = intl.formatMessage(trackChangesMessages.removed).toUpperCase();

	if (inCell) {
		lozengeElement.setAttribute('style', `${lozengeInnerStyle};${containerStyle}`);
		lozengeElement.setAttribute('data-testid', 'show-diff-removed-lozenge');
		lozengeElement.contentEditable = 'false';
		return lozengeElement;
	}

	container.setAttribute('style', containerStyle);
	container.setAttribute('data-testid', 'show-diff-removed-lozenge');
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
	diffType,
	hideAddedDiffsUnderline = false,
}: {
	colorScheme?: ColorScheme;
	diffType?: DiffType;
	element: HTMLElement;
	hideAddedDiffsUnderline?: boolean;
	isActive: boolean;
	isInserted: boolean;
	targetNode: PMNode;
}): void => {
	const currentStyle = element.getAttribute('style') || '';
	const contentStyle = getChangedContentStyle(
		colorScheme,
		isActive,
		isInserted,
		diffType,
		hideAddedDiffsUnderline,
	);
	const targetNodeName = expValEquals('platform_editor_nest_table_in_panel', 'isEnabled', true)
		? getBaseNodeTypeName(targetNode.type)
		: targetNode.type.name;
	const nodeSpecificStyle =
		getChangedNodeStyle(
			targetNodeName,
			colorScheme,
			isInserted,
			isActive,
			diffType,
			hideAddedDiffsUnderline,
		) || '';

	element.setAttribute('style', `${currentStyle}${contentStyle}${nodeSpecificStyle}`);
};

const applyMultiContainerLikeStyles = ({
	element,
	targetNode,
	colorScheme,
	isActive,
	isInserted,
	diffType,
	hideAddedDiffsUnderline = false,
}: {
	colorScheme?: ColorScheme;
	diffType?: DiffType;
	element: HTMLElement;
	hideAddedDiffsUnderline?: boolean;
	isActive: boolean;
	isInserted: boolean;
	targetNode: PMNode;
}): void => {
	const currentStyle = element.getAttribute('style') || '';
	const targetNodeName = expValEquals('platform_editor_nest_table_in_panel', 'isEnabled', true)
		? getBaseNodeTypeName(targetNode.type)
		: targetNode.type.name;
	const nodeSpecificStyle =
		getChangedNodeStyle(
			targetNodeName,
			colorScheme,
			isInserted,
			isActive,
			diffType,
			hideAddedDiffsUnderline,
		) || '';

	if (targetNode.type.name === 'decisionList') {
		const nestedInsertedNodeStyle = resolveNestedInsertedNodeStyle(colorScheme);
		element.querySelectorAll('li').forEach((listItem) => {
			const currentListItemStyle = listItem.getAttribute('style') || '';
			listItem.setAttribute(
				'style',
				fg('platform_editor_ai_show_diff_patch_1')
					? combineStyles(currentListItemStyle, nestedInsertedNodeStyle)
					: `${currentListItemStyle}${nestedInsertedNodeStyle}`,
			);
		});
	} else if (targetNode.type.name === 'layoutSection') {
		const nestedInsertedNodeStyle = resolveNestedInsertedNodeStyle(colorScheme);
		element.querySelectorAll('[data-layout-column="true"]').forEach((section) => {
			const currentSectionStyle = section.getAttribute('style') || '';
			section.setAttribute(
				'style',
				fg('platform_editor_ai_show_diff_patch_1')
					? combineStyles(currentSectionStyle, nestedInsertedNodeStyle)
					: `${currentSectionStyle}${nestedInsertedNodeStyle}`,
			);
		});
	} else if (targetNode.type.name === 'taskList') {
		const nestedInsertedNodeStyle = resolveNestedInsertedNodeStyle(colorScheme);
		element.querySelectorAll('li').forEach((listItem) => {
			const currentListItemStyle = listItem.getAttribute('style') || '';
			listItem.setAttribute('style', `${currentListItemStyle}${nestedInsertedNodeStyle}`);
		});
	}

	element.setAttribute(
		'style',
		fg('platform_editor_ai_show_diff_patch_1')
			? combineStyles(currentStyle, nodeSpecificStyle)
			: `${currentStyle};${nodeSpecificStyle}`,
	);
};

const combineStyles = (currentStyle: string, appendedStyle: string): string => {
	const separator =
		currentStyle && appendedStyle && !currentStyle.trimEnd().endsWith(';') ? '; ' : '';
	return `${currentStyle}${separator}${appendedStyle}`;
};

const appendStyleToElement = (element: HTMLElement, style: string): void => {
	const currentStyle = element.getAttribute('style') || '';
	element.setAttribute('style', combineStyles(currentStyle, style));
};

const wrapAtomicInlineNode = ({
	element,
	className,
	style,
}: {
	className: string;
	element: HTMLElement;
	style: string;
}): void => {
	const wrapper = document.createElement('span');
	wrapper.className = className;
	wrapper.setAttribute('style', style);
	element.replaceWith(wrapper);
	wrapper.append(element);
};

const applyInlineLeafNodeStyles = ({
	element,
	targetNode,
	contentStyle,
	colorScheme,
}: {
	colorScheme?: ColorScheme;
	contentStyle: string;
	element: HTMLElement;
	targetNode: PMNode;
}): void => {
	// NodeViewSerializer appends one DOM node per direct ProseMirror child, preserving order.
	const childDomNodes = [...element.childNodes];

	targetNode.content.forEach((childNode, _offset, index) => {
		if (childNode.isText || !childNode.isLeaf) {
			return;
		}

		const childElement = childDomNodes[index];
		if (!(childElement instanceof HTMLElement)) {
			return;
		}

		if (!isInlineAttrChangeNodeName(childNode.type.name)) {
			appendStyleToElement(childElement, contentStyle);
			return;
		}

		const { className, styleSuffix } = getAtomicInlineChangedAttrs(
			childNode.type.name,
			colorScheme,
		);
		// Inline decorations use an outer span so node-specific descendant selectors match.
		wrapAtomicInlineNode({
			element: childElement,
			className,
			style: combineStyles(contentStyle, styleSuffix),
		});
	});
};

/**
 * Editor CSS makes `blockquote` `inline-block` for its block formatting context. Inside a widget
 * that collapses the indicator bar: the container is an inline `span`, so its anchor rect comes from
 * font metrics, not from an inline-level child. `flow-root` keeps the formatting context but is
 * block-level — unlike `block`, which lets the child paragraph's top margin collapse out.
 */
const quoteBlockLevelStyle = convertToInlineCss({
	display: 'flow-root',
});

const applyTextLikeBlockNodeStyles = ({
	element,
	targetNode,
	colorScheme,
	isActive,
	isInserted,
	diffType,
	hideAddedDiffsUnderline = false,
	highlightInlineLeafNodes = false,
}: {
	colorScheme?: ColorScheme;
	diffType?: DiffType;
	element: HTMLElement;
	hideAddedDiffsUnderline?: boolean;
	highlightInlineLeafNodes?: boolean;
	isActive: boolean;
	isInserted: boolean;
	targetNode: PMNode;
}): void => {
	const currentStyle = element.getAttribute('style') || '';
	const nodeSpecificStyle =
		getChangedNodeStyle(
			targetNode.type.name,
			colorScheme,
			isInserted,
			isActive,
			diffType,
			hideAddedDiffsUnderline,
		) || '';
	if (nodeSpecificStyle) {
		element.setAttribute('style', `${currentStyle}${nodeSpecificStyle}`);
	}
	const contentStyle = getChangedContentStyle(
		colorScheme,
		isActive,
		isInserted,
		diffType,
		hideAddedDiffsUnderline,
	);

	const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
	const textNodesToWrap: Text[] = [];
	let currentNode = walker.nextNode();

	while (currentNode) {
		if (
			currentNode instanceof Text &&
			currentNode.textContent !== '' &&
			currentNode.parentElement
		) {
			textNodesToWrap.push(currentNode);
		}
		currentNode = walker.nextNode();
	}

	textNodesToWrap.forEach((textNode) => {
		const contentWrapper = document.createElement('span');
		contentWrapper.setAttribute('style', contentStyle);
		textNode.replaceWith(contentWrapper);
		contentWrapper.append(textNode);
	});

	if (highlightInlineLeafNodes && targetNode.type.inlineContent) {
		applyInlineLeafNodeStyles({ element, targetNode, contentStyle, colorScheme });
	}
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
	diffType,
	hideAddedDiffsUnderline = false,
}: {
	colorScheme?: ColorScheme;
	diffType?: DiffType;
	hideAddedDiffsUnderline?: boolean;
	isActive: boolean;
	isInserted: boolean;
	nodeView: Node;
	targetNode: PMNode;
}): HTMLElement => {
	const contentWrapper = document.createElement('div');
	const targetNodeName = expValEquals('platform_editor_nest_table_in_panel', 'isEnabled', true)
		? getBaseNodeTypeName(targetNode.type)
		: targetNode.type.name;
	const nodeStyle = getChangedNodeStyle(
		targetNodeName,
		colorScheme,
		isInserted,
		isActive,
		diffType,
		hideAddedDiffsUnderline,
	);

	// When the extended experiment is enabled and the content is inserted,
	// block widget nodes that already have dedicated node-level styling (e.g. boxShadow outline)
	// should not also get the inline content style (borderBottom underline) on their container.
	const shouldSkipContentStyle =
		isExtendedEnabled(diffType) && isInserted && nodeStyle !== undefined;

	const contentStyle = shouldSkipContentStyle
		? ''
		: getChangedContentStyle(colorScheme, isActive, isInserted, diffType, hideAddedDiffsUnderline);

	contentWrapper.setAttribute('style', `${contentStyle}${nodeStyle || ''}`);
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
		applyDeletedNodeMarkup({ nodeView, targetNode, colorScheme, isActive });
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
		applyDeletedNodeMarkup({ nodeView, targetNode, colorScheme, isActive });
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
	diffType,
	hideAddedDiffsUnderline = false,
}: {
	colorScheme?: ColorScheme;
	diffType?: DiffType;
	dom: HTMLElement;
	hideAddedDiffsUnderline?: boolean;
	intl: IntlShape;
	isActive?: boolean;
	isInserted: boolean;
	nodeView: Node;
	targetNode: PMNode;
}): void => {
	const blockWrapper = createBlockNodeWrapper();
	const targetNodeName = expValEquals('platform_editor_nest_table_in_panel', 'isEnabled', true)
		? getBaseNodeTypeName(targetNode.type)
		: targetNode.type.name;

	if (shouldShowRemovedLozenge(targetNodeName) && (!isExtendedEnabled(diffType) || !isInserted)) {
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
		diffType,
		hideAddedDiffsUnderline,
	});
	blockWrapper.append(contentWrapper);

	if (nodeView instanceof HTMLElement && shouldAddShowDiffDeletedNodeClass(targetNode.type.name)) {
		applyDeletedNodeMarkup({ nodeView, targetNode, colorScheme, isActive });
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
	diffType,
	hideAddedDiffsUnderline = false,
	highlightInlineLeafNodes = false,
}: {
	colorScheme?: ColorScheme;
	diffType?: DiffType;
	dom: HTMLElement;
	hideAddedDiffsUnderline?: boolean;
	highlightInlineLeafNodes?: boolean;
	intl: IntlShape;
	isActive?: boolean;
	isInserted: boolean;
	nodeView: Node;
	targetNode: PMNode;
}): void => {
	if (isExtendedEnabled(diffType)) {
		if (nodeView instanceof HTMLElement) {
			if (isInserted && isMultiContainerBlockNode(targetNode.type.name)) {
				applyMultiContainerLikeStyles({
					element: nodeView,
					targetNode,
					colorScheme,
					isActive,
					isInserted,
					diffType,
					hideAddedDiffsUnderline,
				});
				dom.append(nodeView);
				return;
			}

			if (isTextLikeBlockNode(targetNode.type.name)) {
				applyTextLikeBlockNodeStyles({
					element: nodeView,
					targetNode,
					colorScheme,
					isActive,
					isInserted,
					diffType,
					hideAddedDiffsUnderline,
					highlightInlineLeafNodes,
				});
				if (targetNode.type.name === 'blockquote' && fg('platform_editor_ai_show_diff_patch_1')) {
					appendStyleToElement(nodeView, quoteBlockLevelStyle);
				}
				dom.append(nodeView);
				return;
			}

			if (targetNode.type.name === 'table') {
				if (
					expValEquals('platform_editor_table_q4_loveability', 'isEnabled', true) &&
					isExperimentEnabled('platform_editor_table_diff_rounded_corners')
				) {
					applyTableCellEdgeAttrs({ element: nodeView, tableNode: targetNode });
				}

				applyCellOverlayStyles({ element: nodeView, colorScheme, isInserted });
				dom.append(nodeView);
				return;
			}
		}
		wrapBlockNode({
			dom,
			nodeView,
			targetNode,
			colorScheme,
			intl,
			isActive,
			isInserted,
			diffType,
			hideAddedDiffsUnderline,
		});
		return;
	} else {
		if (shouldApplyStylesDirectly(targetNode.type.name) && nodeView instanceof HTMLElement) {
			// Apply deleted styles directly to preserve natural block-level margins
			applyStylesToElement({
				element: nodeView,
				targetNode,
				colorScheme,
				isActive,
				isInserted,
				diffType,
			});
			dom.append(nodeView);
		} else {
			wrapBlockNode({
				dom,
				nodeView,
				targetNode,
				colorScheme,
				intl,
				isActive,
				isInserted,
				diffType,
			});
		}
	}
};

/**
 * Injects a styled inner wrapper span around the children of a block node element.
 * CSS backgrounds don't work when applied to a wrapper around a paragraph, so
 * the wrapper needs to be injected inside the node around the child content.
 */
export const injectInnerWrapper = ({
	node,
	colorScheme,
	isActive,
	isInserted,
	diffType,
	reveal,
}: {
	colorScheme?: ColorScheme;
	diffType?: DiffType;
	isActive?: boolean;
	isInserted?: boolean;
	node: HTMLElement;
	reveal?: RevealOptions;
}): HTMLElement => {
	const wrapper = document.createElement('span');
	const revealStyle = applyRevealToElement({
		colorScheme,
		element: wrapper,
		isActive: isActive ?? false,
		isInserted: isInserted ?? false,
		reveal,
	});
	wrapper.setAttribute(
		'style',
		(isInserted
			? getInsertedContentStyle(colorScheme, isActive)
			: getDeletedContentStyle(colorScheme, isActive, diffType, Boolean(revealStyle))) +
			revealStyle,
	);

	[...node.childNodes].forEach((child) => {
		const removedChild = node.removeChild(child);
		wrapper.append(removedChild);
	});

	node.appendChild(wrapper);
	return node;
};

/**
 * Creates a styled span wrapper for inline content within a change decoration.
 */
export const createContentWrapper = (
	colorScheme?: ColorScheme,
	isActive: boolean = false,
	isInserted: boolean = false,
	diffType?: DiffType,
	reveal?: RevealOptions,
): HTMLElement => {
	const wrapper = document.createElement('span');
	const baseStyle = convertToInlineCss({
		position: 'relative',
		width: 'fit-content',
	});
	// Empty unless the reveal is running, in which case the static highlight below is withheld so
	// the animation can wipe it in instead.
	const revealStyle = applyRevealToElement({
		colorScheme,
		element: wrapper,
		isActive,
		isInserted,
		reveal,
	});
	const deletedStyle = getDeletedContentStyle(
		colorScheme,
		isActive,
		diffType,
		Boolean(revealStyle),
	);
	if (isExtendedEnabled(diffType)) {
		if (isInserted) {
			wrapper.setAttribute(
				'style',
				`${baseStyle}${getInsertedContentStyle(colorScheme, isActive)}${revealStyle}`,
			);
		} else {
			wrapper.setAttribute('style', `${baseStyle}${deletedStyle}${revealStyle}`);
			const strikethrough = document.createElement('span');
			strikethrough.setAttribute('style', getDeletedContentStyleUnbounded(colorScheme, isActive));
			wrapper.append(strikethrough);
		}
	} else {
		wrapper.setAttribute('style', `${baseStyle}${deletedStyle}${revealStyle}`);
		const strikethrough = document.createElement('span');
		strikethrough.setAttribute('style', getDeletedContentStyleUnbounded(colorScheme, isActive));
		wrapper.append(strikethrough);
	}
	return wrapper;
};
