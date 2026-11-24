/**
 * `native_embeds_ssr_whiteboard_iframe`: native-embed iframes started from server HTML.
 *
 * The host page's SSR placeholder renders a real `<iframe>` so the embed starts loading while the
 * host page is still parsing, instead of after hydration + manifest load + Smart Link resolution.
 * This module is the shared contract between:
 * - the SSR placeholder (renders the iframe with these attributes and deterministic bridge IDs),
 * - the placeholder's client-side hydration render (parks the iframe before React removes it when
 *   the renderer swaps SSR handlers for manifest handlers), and
 * - the native-embed client component (adopts the parked iframe instead of creating a new one).
 *
 * Moving an iframe normally reloads it. `Element.prototype.moveBefore` (Chromium 133+) moves it
 * while keeping its browsing context, so parking/adoption only happens where it is supported;
 * elsewhere the SSR iframe is left for React to remove and the client creates its own (no gain,
 * but no breakage).
 *
 * Must stay free of bridge / experience-service imports: it is imported by SSR code.
 */

import { getDocument } from '@atlaskit/browser-apis';

/** Rollout gate shared by the platform and Confluence halves of the feature. */
export const NATIVE_EMBED_SSR_IFRAME_GATE = 'native_embeds_ssr_whiteboard_iframe';

/** Marks an SSR-started iframe. Value: the macro ID it belongs to. */
export const SSR_IFRAME_ATTR = 'data-native-embed-ssr-iframe';
/** Bridge host (parent) client ID the SSR iframe was started with. */
export const SSR_IFRAME_HOST_ID_ATTR = 'data-native-embed-ssr-host-id';
/** Bridge child client ID the SSR iframe was started with. */
export const SSR_IFRAME_CHILD_ID_ATTR = 'data-native-embed-ssr-child-id';
/** Marks the container that holds parked iframes. */
export const SSR_IFRAME_PARKING_ATTR = 'data-native-embed-ssr-parking';

/**
 * Deterministic child client ID for an SSR-started embed. Only needs to be unique among the
 * embeds of one host window; macro IDs are unique per page.
 */
export const getSsrEmbedChildClientId = (macroId: string): string => `native-embed-ssr-${macroId}`;

/**
 * Deterministic host client ID for a page that SSR-started embeds. Includes the content ID so a
 * nested embedded page (its own window and host) never shares an ID with its parent host.
 */
export const getSsrEmbedHostClientId = (contentId: string): string =>
	`native-embed-ssr-host-${contentId}`;

type MoveBeforeElement = Element & { moveBefore: (node: Node, child: Node | null) => void };

export const isMoveBeforeSupported = (): boolean =>
	typeof Element !== 'undefined' && 'moveBefore' in Element.prototype;

const moveInto = (parent: Element, node: Element): void => {
	(parent as MoveBeforeElement).moveBefore(node, null);
};

const escapeAttr = (value: string): string =>
	typeof CSS !== 'undefined' && typeof CSS.escape === 'function'
		? CSS.escape(value)
		: value.replace(/["\\]/g, '\\$&');

const parked = new Map<string, HTMLIFrameElement>();
let parkingLot: HTMLDivElement | null = null;

const getParkingLot = (doc: Document): HTMLDivElement => {
	if (!parkingLot || !parkingLot.isConnected) {
		parkingLot = doc.createElement('div');
		parkingLot.setAttribute(SSR_IFRAME_PARKING_ATTR, '');
		parkingLot.style.cssText =
			'position:absolute;top:0;left:0;width:0;height:0;overflow:visible;pointer-events:none;';
		doc.body.appendChild(parkingLot);
	}
	return parkingLot;
};

/** Finds the SSR iframe for a macro: parked, or still inside its SSR placeholder. */
export function findSsrIframe(macroId: string): HTMLIFrameElement | undefined {
	const parkedIframe = parked.get(macroId);
	if (parkedIframe?.isConnected) {
		return parkedIframe;
	}
	return (
		getDocument()?.querySelector<HTMLIFrameElement>(
			`iframe[${SSR_IFRAME_ATTR}="${escapeAttr(macroId)}"]`,
		) ?? undefined
	);
}

/**
 * Moves an SSR iframe out of its placeholder into an absolutely positioned slot at the same
 * document position and size, so it keeps loading (and stays visible) while React swaps the
 * placeholder for the native-embed component. Call before React removes the placeholder, e.g.
 * from a `useLayoutEffect` cleanup. Returns false when the iframe could not be parked.
 */
export function parkSsrIframe(macroId: string, iframe: HTMLIFrameElement): boolean {
	const doc = getDocument();
	if (!doc || !isMoveBeforeSupported() || !iframe.isConnected || parked.get(macroId) === iframe) {
		return false;
	}
	const rect = iframe.getBoundingClientRect();
	const slot = doc.createElement('div');
	slot.style.cssText = `position:absolute;top:${rect.top + window.scrollY}px;left:${
		rect.left + window.scrollX
	}px;width:${rect.width}px;height:${rect.height}px;`;
	getParkingLot(doc).appendChild(slot);
	try {
		moveInto(slot, iframe);
	} catch {
		slot.remove();
		return false;
	}
	parked.set(macroId, iframe);
	return true;
}

/**
 * Moves the SSR iframe for `macroId` into `container` without reloading it. Returns the iframe,
 * or undefined when there is none or it cannot be moved without a reload.
 */
export function adoptSsrIframe(macroId: string, container: Element): HTMLIFrameElement | undefined {
	if (!isMoveBeforeSupported()) {
		return undefined;
	}
	const iframe = findSsrIframe(macroId);
	if (!iframe) {
		return undefined;
	}
	const slot = parked.get(macroId) === iframe ? iframe.parentElement : null;
	try {
		moveInto(container, iframe);
	} catch {
		return undefined;
	}
	parked.delete(macroId);
	slot?.remove();
	return iframe;
}

/** Removes a parked iframe nobody adopted (e.g. the embed fell back to another UI). */
export function releaseSsrIframe(macroId: string): void {
	const iframe = parked.get(macroId);
	parked.delete(macroId);
	if (iframe) {
		const slot = iframe.parentElement;
		iframe.remove();
		slot?.remove();
	}
}

/** Bridge IDs an SSR iframe was started with, read from its attributes. */
export function getSsrIframeBridgeIds(
	iframe: HTMLIFrameElement,
): { childClientId: string; hostClientId: string } | undefined {
	const childClientId = iframe.getAttribute(SSR_IFRAME_CHILD_ID_ATTR);
	const hostClientId = iframe.getAttribute(SSR_IFRAME_HOST_ID_ATTR);
	return childClientId && hostClientId ? { childClientId, hostClientId } : undefined;
}

/** Host client ID used by the SSR iframes on this page, if any were rendered. */
export function findSsrHostClientId(): string | undefined {
	return (
		getDocument()
			?.querySelector(`iframe[${SSR_IFRAME_ATTR}][${SSR_IFRAME_HOST_ID_ATTR}]`)
			?.getAttribute(SSR_IFRAME_HOST_ID_ATTR) ?? undefined
	);
}

/** Test-only: forget parked iframes. */
export function resetSsrIframeRegistryForTests(): void {
	parked.clear();
	parkingLot?.remove();
	parkingLot = null;
}
