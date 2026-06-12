import { type KeyboardEvent, type MouseEvent } from 'react';

/**
 * Returns true for genuine middle-clicks (button === 1).
 * Filters out Windows right-clicks, which fire onAuxClick with button === 2
 * in addition to onContextMenu, to prevent double-counting.
 */
export const isAuxClick = (e: { button: number }): boolean => {
	return e.button === 1;
};

/**
 * Extracts `href` and `target` from the anchor element that is the event's `currentTarget`.
 *
 * Smart Link click handlers are attached to multiple card renderers (InlineCard, BlockCard,
 * EmbedCard, FlexibleCard). When the handler needs to manually open a link — for example,
 * when native anchor navigation has been prevented — it uses this helper to read the
 * anchor's resolved URL and intended target from the event rather than re-deriving them.
 *
 * Returns `{ href: undefined, target: '_self' }` when `currentTarget` is not an anchor
 * element (e.g. a button or wrapper div), so callers can safely fall back to a default target.
 *
 * @param event - A React mouse or keyboard event whose `currentTarget` may be an anchor.
 * @returns The resolved absolute `href` and `target` attribute of the anchor, or safe
 *   defaults if `currentTarget` is not an anchor.
 */
export const getAnchorAttributesFromEvent = (
	event: MouseEvent | KeyboardEvent,
): { href?: string; target: string } => {
	const currentTarget = event.currentTarget;

	if (!(currentTarget instanceof HTMLAnchorElement)) {
		return { href: undefined, target: '_self' };
	}

	return {
		href: currentTarget.href,
		target: currentTarget.target || '_self',
	};
};

export const updateAnchorHref = (event: MouseEvent | KeyboardEvent, href: string): void => {
	if (!(event.currentTarget instanceof HTMLAnchorElement)) {
		return;
	}

	event.currentTarget.href = href;
};
