import { getNearestContainingLayer } from './get-nearest-containing-layer';
import { getOpenLayersTakingEscape } from './get-open-layers-taking-escape';
import { openOrderTracker } from './open-order-tracker';
import { pageSurfaceEscapeAttribute } from './page-surface-escape-attribute';

/**
 * The stack position of an Escape owner. Higher is above.
 *
 * - A layer ranks by its open order. No open order means it opened before tracking started, so it
 *   ranks `0`, below every later layer.
 * - A page surface is not in the top layer, so it has no open order. It ranks just above its
 *   nearest containing layer, and below every layer that opened after that one. Outside every
 *   layer, it ranks below every layer.
 */
function getRank({
	element,
	layers,
	isLayer,
}: {
	element: HTMLElement;
	layers: HTMLElement[];
	isLayer: boolean;
}): number {
	if (isLayer) {
		return openOrderTracker.getOpenOrder({ element }) ?? 0;
	}
	const containingLayer = getNearestContainingLayer({ element, layers });
	if (!containingLayer) {
		return Number.NEGATIVE_INFINITY;
	}
	return (openOrderTracker.getOpenOrder({ element: containingLayer }) ?? 0) + 0.5;
}

/**
 * `true` when `candidate` is above `element`, as with native close watchers: the later open is
 * above.
 *
 * A descendant is always above its ancestors. This fixes the open order when React opens the child
 * first (child effects run first), or when the ancestor opens again.
 *
 * A page surface ranks just above its nearest containing layer (see `getRank`). This prevents a
 * cycle where an older manual popover waits for a newer one, the newer one waits for a page surface
 * inside it, and that surface waits for the older popover.
 */
function isCandidateAbove({
	element,
	isElementLayer,
	candidate,
	layers,
}: {
	element: HTMLElement;
	isElementLayer: boolean;
	candidate: HTMLElement;
	layers: HTMLElement[];
}): boolean {
	if (element === candidate || candidate.contains(element)) {
		return false;
	}
	if (element.contains(candidate)) {
		return true;
	}
	return (
		getRank({ element: candidate, layers, isLayer: layers.includes(candidate) }) >
		getRank({ element, layers, isLayer: isElementLayer })
	);
}

/**
 * `true` when an Escape owner is above `element` (see `isCandidateAbove`), so it takes the Escape
 * first. Pass `isLayer` for a `Dialog` or manual popover; otherwise `element` is a page surface.
 *
 * Candidates: every open layer that takes Escape and every marked page surface in the document,
 * wherever focus is, as with native close watchers. Two page surfaces outside every layer are not
 * ordered, so both close.
 */
export function hasEscapeOwnerAbove({
	element,
	isLayer = false,
}: {
	element: HTMLElement;
	isLayer?: boolean;
}): boolean {
	const { ownerDocument } = element;
	const layers = getOpenLayersTakingEscape({ within: ownerDocument });
	// The hook can attach before its popover opens. Compare it anyway.
	if (isLayer && !layers.includes(element)) {
		layers.push(element);
	}
	const surfaces = Array.from(
		ownerDocument.querySelectorAll<HTMLElement>(`[${pageSurfaceEscapeAttribute}]`),
	);
	return [...layers, ...surfaces].some((candidate) =>
		isCandidateAbove({ element, isElementLayer: isLayer, candidate, layers }),
	);
}
