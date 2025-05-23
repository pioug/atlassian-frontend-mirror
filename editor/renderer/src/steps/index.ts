import { fg } from '@atlaskit/platform-feature-flags';
import type { Schema } from '@atlaskit/editor-prosemirror/model';
import { AddMarkStep } from '@atlaskit/editor-prosemirror/transform';

function getStartPos(element: HTMLElement) {
	return parseInt(element.dataset.rendererStartPos || '-1', 10);
}

const getNodeType = (element: HTMLElement) => element.dataset.nodeType;

function isPositionPointer(element: HTMLElement) {
	return getStartPos(element) > -1;
}

function findParent(element: ChildNode | Node): HTMLElement | null {
	const { parentElement } = element;
	if (!parentElement || isRoot(parentElement)) {
		return null;
	}

	if (isPositionPointer(parentElement)) {
		return parentElement;
	}

	return findParent(parentElement);
}

function findMediaParent(element: ChildNode | Node): HTMLElement | null {
	const { parentElement } = element;
	if (!parentElement || isRoot(parentElement)) {
		return null;
	}

	if (parentElement.dataset.nodeType === 'mediaSingle') {
		return parentElement;
	}

	return findMediaParent(parentElement);
}

function findParentBeforePointer(element: HTMLElement): HTMLElement | null {
	const { parentElement } = element;
	if (isRoot(parentElement) || !parentElement) {
		return null;
	}

	if (isPositionPointer(parentElement)) {
		return element;
	}

	return findParentBeforePointer(parentElement);
}

function isElementNode(node: ChildNode | Node): node is HTMLElement {
	return node.nodeType === Node.ELEMENT_NODE;
}

function isTextNode(node: ChildNode | Node): node is Text {
	return node.nodeType === Node.TEXT_NODE;
}

function isHighlightTextNode(node: Node | null) {
	// Ignored via go/ees005
	// eslint-disable-next-line @atlaskit/editor/no-as-casting
	return !!(node as HTMLElement)?.dataset?.highlighted;
}

function isNodeInlineMark(node: ChildNode | Node) {
	return isElementNode(node) && Boolean(node.dataset.rendererMark);
}

function isElementInlineMark(element: HTMLElement | null): element is HTMLElement {
	return !!element && Boolean(element.dataset.rendererMark);
}

function isNodeInlineTextMark(node: ChildNode | Node | HTMLElement | null) {
	if (node === null) {
		return false;
	}

	const isInlineMark = isElementNode(node) && Boolean(node.dataset.rendererMark);

	if (!isInlineMark) {
		return false;
	}

	/**
	 * This checks if the element has any descendents with the data-inline-card
	 * attribute set to 'true'. If it does, we should not consider it as an
	 * inline text mark.
	 **/

	if (hasInlineNodeDescendant(node)) {
		return false;
	}

	return true;
}

/**
 * This checks all the descendents of a node and returns true if it reaches
 * a descendant with the data-inline-card attribute set to 'true'.
 */
function hasInlineNodeDescendant(node: Node): boolean {
	if (isElementNode(node)) {
		if (fg('editor_inline_comments_on_inline_nodes')) {
			if (node.dataset.annotationInlineNode === 'true') {
				return true;
			}
		} else {
			if (node.dataset.inlineCard === 'true') {
				return true;
			}
		}

		return Array.from(node.childNodes).some(hasInlineNodeDescendant);
	}

	return false;
}

function resolveNodePos(node: Node) {
	let resolvedPos = 0;
	let prev = node.previousSibling;
	while (prev) {
		if (fg('platform_editor_annotation_position_comment_nodes')) {
			if (prev.nodeType === Node.COMMENT_NODE) {
				// Comment nodes should not result in the position being
				// incremented, so we skip them.
				prev = prev.previousSibling;
				continue;
			}
		}
		if (prev && (isTextNode(prev) || isHighlightTextNode(prev))) {
			resolvedPos += (prev.textContent || '').length;
		} else if (prev) {
			if (fg('editor_inline_comments_on_inline_nodes')) {
				if (isNodeInlineTextMark(prev) && prev.textContent) {
					resolvedPos += prev.textContent.length;
				} else {
					resolvedPos += 1;
				}
			} else {
				if (isNodeInlineMark(prev) && prev.textContent) {
					resolvedPos += prev.textContent.length;
				} else {
					resolvedPos += 1;
				}
			}
		}

		prev = prev.previousSibling;
	}

	return resolvedPos;
}

export function isRoot(element: HTMLElement | null) {
	return !!element && element.classList.contains('ak-renderer-document');
}

export function resolvePos(node: Node | null, offset: number, findEnd = false) {
	// If the passed node doesn't exist, we should abort
	if (!node) {
		return false;
	}

	if (fg('editor_inline_comments_on_inline_nodes')) {
		const startPosAncestor = node.parentElement?.closest('[data-renderer-start-pos');
		const potentialParent = fg('editor_inline_comments_on_inline_nodes')
			? 'data-annotation-mark'
			: 'data-inline-card';
		if (startPosAncestor?.hasAttribute(potentialParent)) {
			if (findEnd) {
				return parseInt(startPosAncestor?.getAttribute('data-renderer-start-pos') || '-1', 10) + 1;
			} else {
				return parseInt(startPosAncestor?.getAttribute('data-renderer-start-pos') || '-1', 10);
			}
		}
	}

	/**
	 * If anchor node is an element (e.g. after a triple click) the anchorOffset
	 * is the number of child nodes preceding the anchor.
	 * https://developer.mozilla.org/en-US/docs/Web/API/Selection/anchorOffset
	 *
	 * For end pos we calculate the number of characters by stepping through
	 * each of the node's children.
	 */
	if (node instanceof HTMLElement && isPositionPointer(node)) {
		if (findEnd) {
			let count = getStartPos(node);
			const children = node.childNodes;
			for (let i = 0; i < offset; i++) {
				count += children[i]?.textContent?.length || 1;
			}
			return count;
		}
		return getStartPos(node) + offset;
	}

	const parent: HTMLElement | null = findParent(node);

	// Similar to above, if we cant find a parent position pointer
	// we should not proceed.
	if (!parent) {
		return false;
	}

	let resolvedPos = getStartPos(parent);
	let current: Node | null = node;
	if (current.parentElement && current.parentElement !== parent) {
		// Find the parent element that is a direct child of the position pointer
		// the outer most element from our text position.
		const preParentPointer = findParentBeforePointer(current.parentElement);
		// If our range is inside an inline node
		// We need to move our pointers to parent element
		// since we don't want to count text inside inline nodes at all
		if (fg('editor_inline_comments_on_inline_nodes')) {
			if (!(isNodeInlineTextMark(preParentPointer) || isHighlightTextNode(preParentPointer))) {
				current = current.parentElement;
				offset = 0;
			}
		} else {
			if (!(isElementInlineMark(preParentPointer) || isHighlightTextNode(preParentPointer))) {
				current = current.parentElement;
				offset = 0;
			}
		}

		resolvedPos += resolveNodePos(current);
		while (current && current.parentElement !== parent) {
			current = current.parentNode;
			if (current) {
				const nodePos = resolveNodePos(current);
				resolvedPos += nodePos;
			}
		}
	} else {
		resolvedPos += resolveNodePos(current);
	}

	return resolvedPos + offset;
}

interface AnnotationStepOptions {
	schema: Schema;
	annotationId: string;
	annotationType: 'inlineComment';
}

export function getPosFromRange(range: Range): { from: number; to: number } | false {
	const { startContainer, startOffset, endContainer, endOffset } = range;

	const possibleMediaOrMediaSingleElement = findParent(startContainer);

	// Video hover targets return media single, not media, thus, the extra check in condition.
	const isMediaOrMediaSingle =
		possibleMediaOrMediaSingleElement &&
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		/media|mediaSingle/.test(getNodeType(possibleMediaOrMediaSingleElement) || '');
	if (isMediaOrMediaSingle) {
		let pos;
		const mediaSingleElement =
			getNodeType(possibleMediaOrMediaSingleElement) === 'mediaSingle'
				? possibleMediaOrMediaSingleElement
				: findMediaParent(possibleMediaOrMediaSingleElement);
		if (mediaSingleElement) {
			pos = getStartPos(mediaSingleElement);
		}

		if (pos !== undefined) {
			return { from: pos, to: pos };
		}
	}

	const from = resolvePos(startContainer, startOffset);
	const findEnd = true;
	const to = resolvePos(endContainer, endOffset, findEnd);

	if (from === false || to === false) {
		return false;
	}

	return { from, to };
}

export function createAnnotationStep(from: number, to: number, opts: AnnotationStepOptions) {
	return new AddMarkStep(
		Math.min(from, to),
		Math.max(from, to),
		opts.schema.marks.annotation.create({
			id: opts.annotationId,
			annotationType: opts.annotationType,
		}),
	);
}
